import { addDays, format } from "date-fns";
import { getOne, query, run } from "../sqlite";
import { Block, BlockTemplate, Plan, PlanTemplate, ScheduledWorkout, WorkoutTemplate } from "../types";
import { nowIso, uuidv4 } from "../util";

export async function createPlanFromTemplate(opts: {
  userId: string;
  planTemplateId: string;
  startDate: string; // YYYY-MM-DD
  name?: string;
}): Promise<Plan> {
  const tpl = await getOne<PlanTemplate>(
    "SELECT * FROM plan_template_local WHERE id=?",
    [opts.planTemplateId]
  );
  if (!tpl) throw new Error("Plan template not found");
  const ts = nowIso();
  const id = uuidv4();

  // compute end date
  const weeks = parseInt(tpl.length.replace("w", ""), 10);
  const endDate = format(addDays(new Date(opts.startDate), weeks * 7 - 1), "yyyy-MM-dd");

  await run(
    `INSERT INTO plan_local (id, userId, planTemplateId, name, startDate, endDate, status, meta, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
    [
      id, opts.userId, tpl.id, opts.name ?? tpl.name,
      opts.startDate, endDate,
      tpl.meta ? JSON.stringify(tpl.meta) : null,
      ts, ts
    ]
  );

  // expand to scheduled_workout + block from workout_template + block_template
  const wts = await query<WorkoutTemplate>(
    "SELECT * FROM workout_template_local WHERE planTemplateId=? ORDER BY dayIndex ASC",
    [tpl.id]
  );

  for (const wt of wts) {
    const date = format(addDays(new Date(opts.startDate), wt.dayIndex), "yyyy-MM-dd");
    const swId = uuidv4();
    await run(
      `INSERT INTO scheduled_workout_local
       (id, planId, workoutTemplateId, date, startTime, status, title, estTimeSec, tags, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NULL, 'planned', ?, ?, ?, ?, ?)`,
      [
        swId, id, wt.id, date,
        wt.title, wt.estTimeSec,
        wt.tags ? JSON.stringify(wt.tags) : null,
        ts, ts
      ]
    );

    const bts = await query<BlockTemplate>(
      "SELECT * FROM block_template_local WHERE workoutTemplateId=? ORDER BY orderIdx ASC",
      [wt.id]
    );

    for (const bt of bts) {
      const bId = uuidv4();
      await run(
        `INSERT INTO block_local
         (id, scheduledWorkoutId, orderIdx, kind, reps, distancePerRep_m, stroke, targetPacePer100Sec, targetRestSec, note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bId, swId, bt.orderIdx, bt.kind, bt.reps, bt.distancePerRep_m, bt.stroke,
          bt.targetPacePer100Sec ?? null, bt.targetRestSec ?? null, bt.note ?? null
        ]
      );
    }
  }

  const plan = await getOne<Plan>("SELECT * FROM plan_local WHERE id=?", [id]);
  if (!plan) throw new Error("Failed to create plan");
  return plan;
}

export async function getActivePlan(userId: string) {
  return await getOne<Plan>(
    "SELECT * FROM plan_local WHERE userId=? AND status='active' ORDER BY createdAt DESC LIMIT 1",
    [userId]
  );
}

export async function getWorkoutsByDate(date: string): Promise<(ScheduledWorkout & { blocks: Block[] })[]> {
  const sw = await query<ScheduledWorkout>(
    "SELECT * FROM scheduled_workout_local WHERE date=? ORDER BY createdAt ASC",
    [date]
  );
  const out: (ScheduledWorkout & { blocks: Block[] })[] = [];
  for (const s of sw) {
    const blocks = await query<Block>(
      "SELECT * FROM block_local WHERE scheduledWorkoutId=? ORDER BY orderIdx ASC",
      [s.id]
    );
    out.push({ ...s, blocks });
  }
  return out;
}

export async function markWorkoutStatus(id: string, status: "planned"|"done"|"skipped"|"canceled") {
  const ts = nowIso();
  await run("UPDATE scheduled_workout_local SET status=?, updatedAt=? WHERE id=?", [status, ts, id]);
}
