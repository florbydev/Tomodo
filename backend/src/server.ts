import fastify, { FastifyInstance } from "fastify";
import mercurius from "mercurius";

import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

import { schema } from "./schema";
import type { Database } from "./db/types";

// --------------------
// Build Fastify server
// --------------------
export function buildServer(): {
  server: FastifyInstance;
  db: Kysely<Database>;
  pgPool: Pool;
} {
  const server = fastify();

  // --------------------
  // PostgreSQL (psql) pool
  // --------------------
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optional explicit config:
    // host: process.env.PGHOST,
    // port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    // user: process.env.PGUSER,
    // password: process.env.PGPASSWORD,
    // database: process.env.PGDATABASE,
    // ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
  });

  // --------------------
  // Kysely (typed with Database)
  // --------------------
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: pgPool,
    }),
  });

  // Make db available outside GraphQL if needed
  server.decorate("db", db);

  // --------------------
  // GraphQL (Mercurius)
  // --------------------
  server.register(mercurius, {
    schema,
    graphiql: true,
    context: async () => ({
      db,
    }),
  });

  // --------------------
  // REST routes
  // --------------------
  server.get("/ping", async () => "pong\n");

  server.get("/", async (_req, reply) => {
    const query = "{ add(x: 2, y: 2) }";
    return reply.graphql(query);
  });

  // --------------------
  // Graceful shutdown
  // --------------------
  server.addHook("onClose", async () => {
    await db.destroy();
    await pgPool.end();
  });

  return { server, db, pgPool };
}

// --------------------
// Fastify type augmentation
// --------------------
declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<Database>;
  }
}
