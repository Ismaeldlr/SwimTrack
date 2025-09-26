import { openDatabaseSync } from "expo-sqlite";

export type Row = Record<string, any>;
export type Rows = Row[];

// Single shared DB handle (new API)
export const db = openDatabaseSync("swimtrack.db");

// Run a statement that doesn't return rows (INSERT/UPDATE/DDL)
export async function run(sql: string, params: any[] = []): Promise<void> {
  await db.runAsync(sql, params);
}

// Query rows (SELECT *)
export async function query<T extends Row = Row>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const rows = await db.getAllAsync<T>(sql, params);
  return rows;
}

// Query a single row (or null)
export async function getOne<T extends Row = Row>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const row = await db.getFirstAsync<T>(sql, params);
  return row ?? null;
}
