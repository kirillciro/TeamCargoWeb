import { Pool } from "pg";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync("/Users/user/Desktop/MyApps/team-cargo-web/backend/.env", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const res = await pool.query(
  "SELECT id, email, first_name, is_verified, created_at FROM users ORDER BY created_at DESC LIMIT 5",
);
console.log("Rows:", JSON.stringify(res.rows));

// Delete recent unverified only if requested
if (false && res.rows.length > 0) {
  await pool.query("DELETE FROM users WHERE email = $1", [
    "ciro.me@icloud.com",
  ]);
  console.log("Deleted.");
}

await pool.end();
