import { getOne, query, run } from "../sqlite";
import { Block, Run, StepResult } from "../types";
import { nowIso, uuidv4 } from "../util";

export async function startRun(scheduledWorkoutId: string): Promise<Run> {
  const id = uuidv4();
  const ts = nowIso();
  await run(
    `INSERT INTO run_local (id, scheduledWorkoutId, startedAt, endedAt, totalElapsedSec, totalPausedSec, status, rpe, note)
     VALUES (?, ?, ?, NULL, 0, 0, 'partial', NULL, NULL)`,
    [id, scheduledWorkoutId, ts]
  );
  const runRow = await getOne<Run>("SELECT * FROM run_local WHERE id=?", [id]);
  if (!runRow) throw new Error("Failed to start run");
  return runRow;
}

export async function recordStep(params: {
  runId: string;
  blockId: string;
  repIndex: number;
  actualSwimSec?: number | null;
  actualRestSec?: number | null;
  missed?: boolean;
  note?: string | null;
}) {
  const id = uuidv4();
  await run(
    `INSERT INTO step_result_local
     (id, runId, blockId, repIndex, actualSwimSec, actualRestSec, missed, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      params.runId,
      params.blockId,
      params.repIndex,
      params.actualSwimSec ?? null,
      params.actualRestSec ?? null,
      params.missed ? 1 : 0,
      params.note ?? null,
    ]
  );
}

export async function pauseAdjust(runId: string, addPausedSec: number) {
  await run(
    `UPDATE run_local SET totalPausedSec = totalPausedSec + ? WHERE id=?`,
    [addPausedSec, runId]
  );
}

export async function finishRun(runId: string, status: "completed" | "stopped" | "partial", rpe?: number | null, note?: string | null) {
  const ts = nowIso();
  // compute elapsed as (ended - started) on UI; store here if you prefer exact UI duration
  // For simplicity we keep totalElapsedSec as-is; your UI should update it before calling finish
  await run(
    `UPDATE run_local SET endedAt=?, status=?, rpe=?, note=? WHERE id=?`,
    [ts, status, rpe ?? null, note ?? null, runId]
  );
}

export async function getRunWithSteps(runId: string): Promise<{ run: Run; steps: StepResult[]; blocks: Block[] }> {
  const runRow = await getOne<Run>("SELECT * FROM run_local WHERE id=?", [runId]);
  if (!runRow) throw new Error("Run not found");
  const steps = await query<StepResult>("SELECT * FROM step_result_local WHERE runId=? ORDER BY repIndex ASC", [runId]);
  const blocks = await query<Block>(
    `SELECT b.* FROM block_local b
     JOIN run_local r ON r.scheduledWorkoutId = b.scheduledWorkoutId
     WHERE r.id=? ORDER BY b.orderIdx ASC`,
    [runId]
  );
  return { run: runRow, steps, blocks };
}
