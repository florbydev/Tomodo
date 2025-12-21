import { Database } from "./types"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

const isProd = process.env.NODE_ENV === "production";

console.log("HOST", process.env.DB_HOST);

export const pool = new Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  max: isProd ? 20 : 5,
  idleTimeoutMillis: isProd ? 30_000 : 10_000,
  connectionTimeoutMillis: 10_000,
  ssl: isProd
    ? { rejectUnauthorized: false } // common for managed DBs
    : false,
});

const dialect = new PostgresDialect({
  pool: pool,
});

export const db = new Kysely<Database>({
  dialect,
});
