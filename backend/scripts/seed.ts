import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { Database } from "../src/db/types";
import { randomUUID } from "crypto";

async function seed() {
  const DATABASE_URL =
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@db:5432/app";

  console.log("🌱 Seeding tasks…");

  const pgPool = new Pool({ connectionString: DATABASE_URL });

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool: pgPool }),
  });

  const now = new Date();

  try {
    await db
      .insertInto("tasks")
      .values([
        {
          id: randomUUID(),
          projectId: randomUUID(),
          description: "Initial project setup",
          estimatedCount: 5,
          currentCount: 1,
          isChecked: false,
          completed: false,
          createdAt: now,
          updatedAt: now,
          completedAt: null,
        },
        {
          id: randomUUID(),
          projectId: randomUUID(),
          description: "Implement GraphQL schema",
          estimatedCount: 8,
          currentCount: 8,
          isChecked: true,
          completed: true,
          createdAt: now,
          updatedAt: now,
          completedAt: now,
        },
      ])
      // Prevent duplicates if seed is re-run
      .onConflict((oc) => oc.column("id").doNothing())
      .execute();

    console.log("✅ Task seed completed");
  } catch (err) {
    console.error("❌ Task seed failed:", err);
    process.exitCode = 1;
  } finally {
    await db.destroy();
    await pgPool.end();
  }
}

// no top-level await
seed().catch((err) => {
  console.error("❌ Unhandled seed error:", err);
  process.exit(1);
});
