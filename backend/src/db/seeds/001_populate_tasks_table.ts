import { sql } from "kysely";
import { db, pool } from "../database";

export async function seed() {
  try {
    await db
      .insertInto("tasks")
      .values([
        {
          id: "8b7d0c7a-3b33-4e2e-8c68-0c4c50f5d8a1",
          projectId: "3a2e4a6b-5a7d-4b8c-9f1a-2b3c4d5e6f70",
          description: "Initial project setup",
          estimatedCount: 5,
          currentCount: 1,
          isChecked: false,
          completed: false,
          createdAt: sql`now()`,
          updatedAt: sql`now()`,
          completedAt: null,
        },
        {
          id: "f2d8c0e1-92d1-4d2b-a3a2-6a3d6c1f2b11",
          projectId: "c9f4a2b1-0b62-4a5d-9e7a-1c2d3e4f5a6b",
          description: "Implement GraphQL schema",
          estimatedCount: 8,
          currentCount: 8,
          isChecked: true,
          completed: true,
          createdAt: sql`now()`,
          updatedAt: sql`now()`,
          completedAt: sql`now()`,
        },
      ])
      .onConflict((oc) => oc.column("id").doNothing())
      .execute();

    console.log("Task seed completed");
  } catch (err) {
    console.error("Task seed failed:", err);
    process.exitCode = 1;
  } finally {
    await db.destroy();
    await pool.end();
  }
}
