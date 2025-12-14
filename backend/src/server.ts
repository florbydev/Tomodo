import fastify, { FastifyInstance } from "fastify";
import mercurius from "mercurius";

import { Pool } from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";

import { schema } from "./schema";
import type { Database } from "./db/types";

export function buildServer(): {
  server: FastifyInstance;
  db: Kysely<Database>;
  pgPool: Pool;
} {
  const server = fastify({ logger: true });

  const DATABASE_URL =
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@db:5432/app";

  server.log.info({ DATABASE_URL }, "Database connection string");

  const pgPool = new Pool({
    connectionString: DATABASE_URL,
  });

  // Helpful: log unexpected pool errors
  pgPool.on("error", (err) => {
    server.log.error({ err }, "Unexpected PostgreSQL pool error");
  });

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool: pgPool }),
  });

  server.decorate("db", db);

  // --- DB health route (real query) ---
  server.get("/health/db", async (_req, reply) => {
    try {
      // Kysely-safe "SELECT 1"
      const result = await sql<{ ok: number }>`select 1 as ok`.execute(db);

      return {
        db: "ok",
        ok: result.rows?.[0]?.ok ?? 1,
      };
    } catch (err) {
      server.log.error({ err }, "DB health check failed");
      return reply.code(500).send({
        db: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  // --- GraphQL (Mercurius – GraphQL adapter for Fastify) ---
  server.register(mercurius, {
    schema,
    graphiql: true,
    context: async () => ({ db }),
  });

  // --- REST routes ---
  server.get("/ping", async () => "pong\n");

  server.get("/", async (_req, reply) => {
    const query = "{ add(x: 2, y: 2) }";
    return reply.graphql(query);
  });

  // --- Startup DB connectivity check ---
  // This ensures you find out immediately if it can't connect.
  server.addHook("onReady", async () => {
    try {
      await pgPool.query("select 1");
      server.log.info("✅ Connected to PostgreSQL");
    } catch (err) {
      server.log.error({ err }, "❌ Failed to connect to PostgreSQL");
      // Fail fast so Docker restarts and you notice quickly
      throw err;
    }
  });

  // --- Graceful shutdown ---
  server.addHook("onClose", async () => {
    await db.destroy();
    await pgPool.end();
  });

  return { server, db, pgPool };
}

declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<Database>;
  }
}
