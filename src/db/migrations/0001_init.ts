// Export the SQL as a string
const SQL = `
-- meta
CREATE TABLE IF NOT EXISTS _schema (version INTEGER NOT NULL);
INSERT INTO _schema(version)
  SELECT 1 WHERE NOT EXISTS(SELECT 1 FROM _schema);

-- user
CREATE TABLE IF NOT EXISTS user_local (
  id TEXT PRIMARY KEY,
  displayName TEXT NOT NULL,
  email TEXT,
  poolType TEXT NOT NULL,                -- SCY|SCM|LCM|OpenWater
  prefs TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- plan templates cache
CREATE TABLE IF NOT EXISTS plan_template_local (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  goal TEXT NOT NULL,                     -- endurance|threshold|speed|technique|mixed
  length TEXT NOT NULL,                   -- 1w|2w|4w|8w
  meta TEXT,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workout_template_local (
  id TEXT PRIMARY KEY,
  planTemplateId TEXT NOT NULL,
  dayIndex INTEGER NOT NULL,
  title TEXT NOT NULL,
  estTimeSec INTEGER NOT NULL,
  tags TEXT,
  FOREIGN KEY (planTemplateId) REFERENCES plan_template_local(id)
);

CREATE TABLE IF NOT EXISTS block_template_local (
  id TEXT PRIMARY KEY,
  workoutTemplateId TEXT NOT NULL,
  orderIdx INTEGER NOT NULL,
  kind TEXT NOT NULL,                     -- warmup|drill|pull|kick|main|cooldown
  reps INTEGER NOT NULL,
  distancePerRep_m INTEGER NOT NULL,
  stroke TEXT NOT NULL,                   -- FR|BK|BR|FL|IM|mix
  targetPacePer100Sec INTEGER,
  targetRestSec INTEGER,
  note TEXT,
  FOREIGN KEY (workoutTemplateId) REFERENCES workout_template_local(id)
);

-- plan & calendar
CREATE TABLE IF NOT EXISTS plan_local (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  planTemplateId TEXT,
  name TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  status TEXT NOT NULL,                   -- active|completed|archived
  meta TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user_local(id)
);

CREATE TABLE IF NOT EXISTS scheduled_workout_local (
  id TEXT PRIMARY KEY,
  planId TEXT NOT NULL,
  workoutTemplateId TEXT,
  date TEXT NOT NULL,                     -- YYYY-MM-DD
  startTime TEXT,                         -- HH:mm
  status TEXT NOT NULL,                   -- planned|done|skipped|canceled
  title TEXT NOT NULL,
  estTimeSec INTEGER NOT NULL,
  tags TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (planId) REFERENCES plan_local(id)
);
CREATE INDEX IF NOT EXISTS idx_swl_plan_date ON scheduled_workout_local(planId, date);

CREATE TABLE IF NOT EXISTS block_local (
  id TEXT PRIMARY KEY,
  scheduledWorkoutId TEXT NOT NULL,
  orderIdx INTEGER NOT NULL,
  kind TEXT NOT NULL,
  reps INTEGER NOT NULL,
  distancePerRep_m INTEGER NOT NULL,
  stroke TEXT NOT NULL,
  targetPacePer100Sec INTEGER,
  targetRestSec INTEGER,
  note TEXT,
  FOREIGN KEY (scheduledWorkoutId) REFERENCES scheduled_workout_local(id)
);
CREATE INDEX IF NOT EXISTS idx_block_swl ON block_local(scheduledWorkoutId);

-- training runs
CREATE TABLE IF NOT EXISTS run_local (
  id TEXT PRIMARY KEY,
  scheduledWorkoutId TEXT NOT NULL,
  startedAt TEXT NOT NULL,
  endedAt TEXT,
  totalElapsedSec INTEGER NOT NULL,
  totalPausedSec INTEGER NOT NULL,
  status TEXT NOT NULL,                   -- completed|stopped|partial
  rpe INTEGER,
  note TEXT,
  FOREIGN KEY (scheduledWorkoutId) REFERENCES scheduled_workout_local(id)
);

CREATE TABLE IF NOT EXISTS step_result_local (
  id TEXT PRIMARY KEY,
  runId TEXT NOT NULL,
  blockId TEXT NOT NULL,
  repIndex INTEGER NOT NULL,
  actualSwimSec INTEGER,
  actualRestSec INTEGER,
  missed INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  FOREIGN KEY (runId) REFERENCES run_local(id),
  FOREIGN KEY (blockId) REFERENCES block_local(id)
);
CREATE INDEX IF NOT EXISTS idx_step_run ON step_result_local(runId);

-- weekly metrics cache
CREATE TABLE IF NOT EXISTS metric_week_local (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  weekKey TEXT NOT NULL,
  distance_m INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  avgRpe INTEGER,
  load INTEGER,
  computedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user_local(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_metric_week ON metric_week_local(userId, weekKey);

-- settings
CREATE TABLE IF NOT EXISTS settings_local (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- sync outbox
CREATE TABLE IF NOT EXISTS sync_queue_local (
  id TEXT PRIMARY KEY,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  op TEXT NOT NULL,                       -- upsert|delete
  payload TEXT NOT NULL,                  -- JSON
  queuedAt TEXT NOT NULL,
  retries INTEGER NOT NULL DEFAULT 0
);
`;

export default SQL;
