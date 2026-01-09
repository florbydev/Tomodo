import { Kysely, sql } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("tasks")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("project_id", "uuid", (col) =>
      // nullable (inbox tasks)
      col.references("projects.id").onDelete("set null")
    )
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("notes", "text")
    .addColumn("target_sessions", "integer", (col) =>
      col.notNull().defaultTo(1)
    )
    .addColumn("completed_sessions", "integer", (col) =>
      col.notNull().defaultTo(0)
    )
    .addColumn("is_completed", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("completed_at", "timestamptz")
    .addColumn("sort_order", "integer")
    .addColumn("is_archived", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createIndex("tasks_user_id_idx")
    .on("tasks")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("tasks_project_id_idx")
    .on("tasks")
    .column("project_id")
    .execute();

  await db.schema
    .createIndex("tasks_user_project_sort_idx")
    .on("tasks")
    .columns(["user_id", "project_id", "sort_order"])
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropIndex("tasks_user_project_sort_idx").execute();
  await db.schema.dropIndex("tasks_project_id_idx").execute();
  await db.schema.dropIndex("tasks_user_id_idx").execute();
  await db.schema.dropTable("tasks").execute();
}
