import { Kysely, sql } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("display_name", "varchar")
    .addColumn("avatar_url", "varchar")
    .addColumn("timezone", "varchar", (col) => col.notNull().defaultTo("UTC"))
    .addColumn("default_focus_minutes", "integer", (col) =>
      col.notNull().defaultTo(25)
    )
    .addColumn("default_break_minutes", "integer", (col) =>
      col.notNull().defaultTo(5)
    )
    .addColumn("default_long_break_minutes", "integer", (col) =>
      col.notNull().defaultTo(15)
    )
    .addColumn("long_break_every", "integer", (col) =>
      col.notNull().defaultTo(4)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createIndex("users_email_idx")
    .on("users")
    .column("email")
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropIndex("users_email_idx").execute();
  await db.schema.dropTable("users").execute();
}
