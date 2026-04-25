import "dotenv/config";
import { Pool } from "pg";

const isRemote =
  process.env.DATABASE_URL?.includes("supabase") ||
  process.env.DATABASE_URL?.includes("amazonaws") ||
  process.env.DATABASE_SSL === "true";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});
