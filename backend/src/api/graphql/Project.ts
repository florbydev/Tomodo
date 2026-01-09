import { extendType, inputObjectType, nonNull, objectType, idArg } from "nexus";

// ---- Type ----
export const Project = objectType({
  name: "Project",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("user_id");

    t.nonNull.string("name");
    t.string("icon");
    t.string("color");
    t.nonNull.boolean("is_archived");

    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });
  },
});

// ---- Input ----
export const CreateProjectInput = inputObjectType({
  name: "CreateProjectInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("icon");
    t.string("color");
  },
});

// ---- Queries ----

export const ProjectQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("projects", {
      type: "Project",
      async resolve(_root, _args, ctx) {
        return ctx.db
          .selectFrom("projects")
          .selectAll()
          .where("user_id", "=", ctx.userId)
          .where("is_archived", "=", false)
          .orderBy("created_at", "asc")
          .execute();
      },
    });
  },
});

// ---- Mutation ----
export const ProjectMutation = extendType({
  type: "Mutation",
  definition(t) {
    // create new project label
    t.nonNull.field("createProject", {
      type: "Project",
      args: {
        input: nonNull("CreateProjectInput"),
      },
      async resolve(_root, args, ctx) {
        const now = new Date();

        const insert = await ctx.db
          .insertInto("projects")
          .values({
            user_id: ctx.userId,
            name: args.input.name,
            icon: args.input.icon ?? null,
            color: args.input.color ?? null,
            is_archived: false,
            created_at: now,
            updated_at: now,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return insert;
      },
    });
  },
});
