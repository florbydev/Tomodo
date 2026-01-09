// api/schema.ts
import { makeSchema } from "nexus";
import path, { join } from "path";
import * as types from "./api/graphql";
import { DateTimeResolver } from "graphql-scalars";

export const schema = makeSchema({
  types: [DateTimeResolver, types],
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"), // 2
    schema: join(__dirname, "..", "schema.graphql"), // 3
  },
  contextType: {
    module: path.resolve(__dirname, "api/context.ts"),
    export: "GraphQLContext",
  },
});
