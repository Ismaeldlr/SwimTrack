import { migrate } from "./migrations/index";
export * from "./sqlite";
export * from "./types";
export * from "./util";

export async function initDb() {
  await migrate();
}
