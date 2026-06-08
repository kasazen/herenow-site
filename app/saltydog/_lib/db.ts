import postgres, { Sql } from "postgres";

// Postgres on Vercel serverless. The Supabase direct connection is IPv6 only,
// which Vercel cannot reach; the connection pooler (port 6543, transaction
// mode) is the supported path. DATABASE_URL here MUST be the pooler URL.
let _sql: Sql | null = null;

export function sql(): Sql {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set on the web project");
  _sql = postgres(url, {
    ssl: "require",
    max: 1,
    idle_timeout: 20,
    prepare: false, // transaction-mode pooler does not support prepared statements
  });
  return _sql;
}
