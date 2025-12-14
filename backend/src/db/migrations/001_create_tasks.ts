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
    .addColumn("isChecked", "boolean", (col) => col.defaultTo(false))
    .addColumn("completed", "boolean", (col) => col.defaultTo(false))
    .addColumn(
      "createdAt",
      "timestamptz",
      (col) => col.notNull().defaultTo(sql`now()`)
      // or: defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("completed_at", "timestamptz")
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("tasks").execute();
}
