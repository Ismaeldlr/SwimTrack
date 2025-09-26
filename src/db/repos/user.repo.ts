import { getOne, run } from "../sqlite";
import { User } from "../types";
import { nowIso, uuidv4 } from "../util";

export async function getUser(): Promise<User | null> {
  return await getOne<User>("SELECT * FROM user_local LIMIT 1");
}

export async function upsertUser(partial: Partial<User> & { displayName: string; poolType: User["poolType"] }) {
  const existing = await getUser();
  const ts = nowIso();

  if (existing) {
    await run(
      `UPDATE user_local
       SET displayName=?, email=?, poolType=?, prefs=?, updatedAt=?
       WHERE id=?`,
      [
        partial.displayName ?? existing.displayName,
        partial.email ?? existing.email ?? null,
        partial.poolType ?? existing.poolType,
        partial.prefs ? JSON.stringify(partial.prefs) : existing.prefs ?? null,
        ts,
        existing.id,
      ]
    );
    return await getUser();
  } else {
    const id = uuidv4();
    await run(
      `INSERT INTO user_local (id, displayName, email, poolType, prefs, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        partial.displayName,
        partial.email ?? null,
        partial.poolType,
        partial.prefs ? JSON.stringify(partial.prefs) : null,
        ts,
        ts,
      ]
    );
    return await getUser();
  }
}
