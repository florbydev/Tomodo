import fastify, { FastifyInstance } from "fastify";
import mercurius from "mercurius";

import { Pool } from "pg";
import { Kysely, sql } from "kysely";

import { schema } from "./schema";
import type { Database } from "./db/types";
import { db, pool } from "./db/database";

export function buildServer(): {
  server: FastifyInstance;
  db: Kysely<Database>;
  pool: Pool;
} {
  const server = fastify({ logger: true });

  server.decorate("db", db);

  server.get("/health/db", async (_req, reply) => {
    try {
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

  server.get("/health", async (_req, reply) => {
    return reply.code(200).send({ status: "ok" });
  });

  server.register(mercurius, {
    schema,
    graphiql: true,
    context: async () => ({ db }),
  });

  server.get("/ping", async () => "pongpong\n");

  server.addHook("onReady", async () => {
    try {
      await pool.query("select 1");
      server.log.info("✅ Connected to PostgreSQL");
    } catch (err) {
      server.log.error({ err }, "❌ Failed to connect to PostgreSQL");
      throw err;
    }
  });

  server.addHook("onClose", async () => {
    await db.destroy();
    await pool.end();
  });

  return { server, db, pool };
}
