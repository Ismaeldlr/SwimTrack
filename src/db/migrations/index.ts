import { db, query, run } from "../sqlite";
import MIG_0001 from "./0001_init";

async function currentVersion(): Promise<number> {
  try {
    const row = await query("SELECT version FROM _schema LIMIT 1");
    return row[0]?.version ?? 0;
  } catch {
    return 0; // table doesn't exist yet
  }
}

const MIGRATIONS: { v: number; sql: string }[] = [{ v: 1, sql: MIG_0001 }];

export async function migrate() {
  const v = await currentVersion();
  for (const m of MIGRATIONS) {
    if (m.v > v) {
      await db.execAsync(m.sql);              // ✅ run multi-statement SQL
      // Ensure version is up to date even if the SQL didn't touch _schema
      await run("UPDATE _schema SET version = ?", [m.v]).catch(() => {});
    }
  }
}
