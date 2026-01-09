import { Kysely, sql } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("projects")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("icon", "varchar")
    .addColumn("color", "varchar")
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
    .createIndex("projects_user_id_idx")
    .on("projects")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropIndex("projects_user_id_idx").execute();
  await db.schema.dropTable("projects").execute();
}
