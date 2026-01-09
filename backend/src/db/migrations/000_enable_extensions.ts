import { Kysely, sql } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  // Enables gen_random_uuid()
  await sql`create extension if not exists pgcrypto`.execute(db);
}

export async function down(db: Kysely<Database>) {
  // Usually safe to keep extensions; dropping can break other things.
  await sql`drop extension if exists pgcrypto`.execute(db);
}
