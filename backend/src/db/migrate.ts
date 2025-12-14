import path from "path";
import { promises as fs } from "fs"; // <-- important

import { Pool } from "pg";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import type { Database } from "./types";

async function migrate() {
  console.log("Running Migration");

  const DATABASE_URL =
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@db:5432/app";

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: DATABASE_URL }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs, // <-- fs.promises matches required types
      path,
      migrationFolder: path.join(process.cwd(), "src/db/migrations"),
      // If your migrations are under backend/migrations and you run from /app:
      // migrationFolder: path.join(process.cwd(), "migrations"),
      // If you run from backend/src, use:
      // migrationFolder: path.join(__dirname, "../../migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((r) => {
    if (r.status === "Success") console.log(`✅ ${r.migrationName}`);
    if (r.status === "Error") console.error(`❌ ${r.migrationName}`);
  });

  if (error) {
    console.error("❌ Migration error:", error);
    process.exitCode = 1;
  }

  await db.destroy();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
