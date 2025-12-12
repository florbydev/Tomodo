import type { Kysely } from "kysely";
import type { Database } from "../db/types";

export interface GraphQLContext {
  db: Kysely<Database>;
}
