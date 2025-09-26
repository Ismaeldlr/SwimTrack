export type ID = string; // UUID v4

export type PoolType = "SCY" | "SCM" | "LCM" | "OpenWater";
export type Goal = "endurance" | "threshold" | "speed" | "technique" | "mixed";
export type PlanLength = "1w" | "2w" | "4w" | "8w";
export type SWStatus = "planned" | "done" | "skipped" | "canceled";
export type RunStatus = "completed" | "stopped" | "partial";
export type BlockKind = "warmup" | "drill" | "pull" | "kick" | "main" | "cooldown";
export type Stroke = "FR" | "BK" | "BR" | "FL" | "IM" | "mix";

export interface User {
  id: ID;
  displayName: string;
  email?: string | null;
  poolType: PoolType;
  prefs?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: ID;
  userId: ID;
  planTemplateId?: ID | null;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  status: "active" | "completed" | "archived";
  meta?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledWorkout {
  id: ID;
  planId: ID;
  workoutTemplateId?: ID | null;
  date: string;       // YYYY-MM-DD
  startTime?: string | null; // HH:mm
  status: SWStatus;
  title: string;
  estTimeSec: number;
  tags?: string[];    // JSON
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: ID;
  scheduledWorkoutId: ID;
  orderIdx: number;
  kind: BlockKind;
  reps: number;
  distancePerRep_m: number;
  stroke: Stroke;
  targetPacePer100Sec?: number | null;
  targetRestSec?: number | null;
  note?: string | null;
}

export interface Run {
  id: ID;
  scheduledWorkoutId: ID;
  startedAt: string;
  endedAt?: string | null;
  totalElapsedSec: number;
  totalPausedSec: number;
  status: RunStatus;
  rpe?: number | null;
  note?: string | null;
}

export interface StepResult {
  id: ID;
  runId: ID;
  blockId: ID;
  repIndex: number;
  actualSwimSec?: number | null;
  actualRestSec?: number | null;
  missed: 0 | 1;
  note?: string | null;
}

export interface PlanTemplate {
  id: ID;
  name: string;
  goal: Goal;
  length: PlanLength;
  meta?: any;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: ID;
  planTemplateId: ID;
  dayIndex: number;
  title: string;
  estTimeSec: number;
  tags?: string[];
}

export interface BlockTemplate {
  id: ID;
  workoutTemplateId: ID;
  orderIdx: number;
  kind: BlockKind;
  reps: number;
  distancePerRep_m: number;
  stroke: Stroke;
  targetPacePer100Sec?: number | null;
  targetRestSec?: number | null;
  note?: string | null;
}
