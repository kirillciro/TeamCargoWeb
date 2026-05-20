/**
 * PostgreSQL-backed Baileys auth state.
 * Replaces useMultiFileAuthState (files) so session survives Railway restarts.
 * Each Baileys key/value pair is stored as one row in whatsapp_session.
 */
import {
  initAuthCreds,
  BufferJSON,
  proto,
  type AuthenticationCreds,
  type AuthenticationState,
  type SignalDataTypeMap,
} from "@whiskeysockets/baileys";
import { pool } from "./db.js";

// ── DB helpers ────────────────────────────────────────────────────────────

async function readData(key: string): Promise<unknown> {
  const res = await pool.query(
    "SELECT value FROM whatsapp_session WHERE key = $1",
    [key],
  );
  if (!res.rows.length) return null;
  return JSON.parse(JSON.stringify(res.rows[0].value), BufferJSON.reviver);
}

async function writeData(key: string, data: unknown): Promise<void> {
  const value = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
  await pool.query(
    `INSERT INTO whatsapp_session (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, value],
  );
}

async function removeData(key: string): Promise<void> {
  await pool.query("DELETE FROM whatsapp_session WHERE key = $1", [key]);
}

// ── Auth state factory ────────────────────────────────────────────────────

export async function usePgAuthState(): Promise<{
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
}> {
  const creds: AuthenticationCreds =
    ((await readData("creds")) as AuthenticationCreds) ?? initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [id: string]: SignalDataTypeMap[typeof type] } = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              // app-state-sync-key values must be deserialized via proto
              if (type === "app-state-sync-key" && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(
                  value as object,
                );
              }
              data[id] = value as SignalDataTypeMap[typeof type];
            }),
          );
          return data;
        },
        set: async (data) => {
          const tasks: Promise<void>[] = [];
          for (const category in data) {
            const categoryData = data[category as keyof typeof data] as Record<
              string,
              unknown
            >;
            for (const id in categoryData) {
              const value = categoryData[id];
              const key = `${category}-${id}`;
              tasks.push(
                value == null ? removeData(key) : writeData(key, value),
              );
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => writeData("creds", creds),
  };
}
