import { Kysely, sql } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("session_info")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("session_type", "varchar", (col) => col.notNull()) // "focus" | "break" | "long_break"
    .addColumn("planned_duration_seconds", "integer", (col) => col.notNull())
    .addColumn("actual_duration_seconds", "integer")
    .addColumn(
      "status",
      "varchar",
      (col) => col.notNull().defaultTo("completed") // "running" | "paused" | "completed" | "canceled"
    )
    .addColumn("started_at", "timestamptz", (col) => col.notNull())
    .addColumn("ended_at", "timestamptz")
    .addColumn("cycle_index", "integer")
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createIndex("session_info_user_id_idx")
    .on("session_info")
    .column("user_id")
    .execute();

  await db.schema
    .createIndex("session_info_user_started_at_idx")
    .on("session_info")
    .columns(["user_id", "started_at"])
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropIndex("session_info_user_started_at_idx").execute();
  await db.schema.dropIndex("session_info_user_id_idx").execute();
  await db.schema.dropTable("session_info").execute();
}
