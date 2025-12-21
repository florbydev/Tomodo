import path from "node:path";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import { db, pool } from "./database";
import type { Database } from "./types";

type SeedFn = (db: Database) => Promise<void>;
type SeedModule = { seed?: SeedFn; default?: { seed?: SeedFn } | SeedFn };

function assertNotProduction() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seeding disabled in production");
  }
}

function isSeedFile(filename: string) {
  return /^\d+_.*\.(js|ts)$/.test(filename);
}

function sortByNumericPrefix(a: string, b: string) {
  const aNum = Number(a.match(/^(\d+)_/)?.[1] ?? Number.POSITIVE_INFINITY);
  const bNum = Number(b.match(/^(\d+)_/)?.[1] ?? Number.POSITIVE_INFINITY);
  return aNum - bNum || a.localeCompare(b);
}

function getSeedFn(mod: SeedModule, file: string): SeedFn {
  const candidate =
    mod.seed ??
    (typeof mod.default === "function" ? mod.default : mod.default?.seed);

  if (typeof candidate !== "function") {
    throw new Error(
      `Seed file ${file} must export a seed function (named export "seed" or default export).`
    );
  }

  return candidate;
}

async function run() {
  assertNotProduction();

  const seedsDir = path.join(__dirname, "seeds");
  const files = (await readdir(seedsDir))
    .filter(isSeedFile)
    .sort(sortByNumericPrefix);

  if (files.length === 0) {
    console.log("No seed files found");
    return;
  }

  try {
    await db.transaction().execute(async (trx) => {
      for (const file of files) {
        const fullPath = path.join(seedsDir, file);

        let mod: SeedModule;
        try {
          mod = (await import(pathToFileURL(fullPath).href)) as SeedModule;
        } catch (err) {
          throw new Error(
            `Failed to import seed file ${file}: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }

        const seed = getSeedFn(mod, file);

        console.log(`Running seed: ${file}`);
        await seed(trx as any);
      }
    });

    console.log("All seeds complete");
    console.log("Closing DB connections");
  } catch (err) {
    console.error("Seed failed", err);
    process.exit(1);
  } finally {
    await pool.end();
    await db.destroy();
  }
}

run();
