import { Kysely, sql } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("tasks")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("projectId", "uuid", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("estimatedCount", "integer")
    .addColumn("currentCount", "integer")
    .addColumn("isChecked", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("completed", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("completedAt", "timestamptz")
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("tasks").execute();
}
