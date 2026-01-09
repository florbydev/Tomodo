import { Kysely, sql } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("session_tasks")
    .addColumn("session_id", "uuid", (col) =>
      col.notNull().references("session_info.id").onDelete("cascade")
    )
    .addColumn("task_id", "uuid", (col) =>
      col.notNull().references("tasks.id").onDelete("cascade")
    )
    .addColumn("sort_order", "integer")
    .addColumn("seconds_spent", "integer")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addPrimaryKeyConstraint("session_tasks_pkey", ["session_id", "task_id"])
    .execute();

  await db.schema
    .createIndex("session_tasks_task_id_idx")
    .on("session_tasks")
    .column("task_id")
    .execute();

  await db.schema
    .createIndex("session_tasks_session_id_idx")
    .on("session_tasks")
    .column("session_id")
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropIndex("session_tasks_session_id_idx").execute();
  await db.schema.dropIndex("session_tasks_task_id_idx").execute();
  await db.schema.dropTable("session_tasks").execute();
}
