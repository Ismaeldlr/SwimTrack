import uuid from "react-native-uuid";

export const nowIso = () => new Date().toISOString();

export function uuidv4(): string {
  return String(uuid.v4());
}
