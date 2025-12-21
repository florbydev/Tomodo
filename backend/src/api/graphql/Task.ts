import { DateTimeResolver } from "graphql-scalars";
import {
  asNexusMethod,
  booleanArg,
  idArg,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { randomUUID } from "node:crypto";

export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const TaskType = objectType({
  name: "Task",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("projectId");
    t.nonNull.string("description");
    t.int("estimatedCount");
    t.int("currentCount");
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
    t.field("completedAt", { type: "DateTime" });
    t.boolean("isChecked");
    t.boolean("completed");
  },
});

export const TaskQuery = queryField((t) => {
  t.field("activeTask", {
    type: list("Task"),
    async resolve(_parent, _args, ctx) {
      return ctx.db
        .selectFrom("tasks")
        .select([
          "id",
          "description",
          "estimatedCount",
          "currentCount",
          "createdAt",
          "updatedAt",
          "isChecked",
          "completed",
          "completedAt",
          "projectId",
        ])
        .where("completed", "=", false)
        .execute();
    },
  });
});

const taskSelect = [
  "id",
  "description",
  "estimatedCount",
  "currentCount",
  "createdAt",
  "updatedAt",
  "isChecked",
  "completed",
  "completedAt",
  "projectId",
] as const;

export const TaskMutation = mutationField((t) => {
  t.field("createTask", {
    type: nonNull("Task"),
    args: {
      projectId: nonNull(idArg()),
      description: nonNull(stringArg()),
      estimatedCount: intArg(),
      currentCount: intArg(),
    },
    async resolve(_parent, args, ctx) {
      const now = new Date();

      const created = await ctx.db
        .insertInto("tasks")
        .values({
          id: randomUUID(),
          projectId: args.projectId,
          description: args.description,
          estimatedCount: args.estimatedCount ?? null,
          currentCount: args.currentCount ?? 0,
          isChecked: false,
          completed: false,
          completedAt: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning(taskSelect)
        .executeTakeFirst();

      if (!created) throw new Error("Failed to create task");
      return created;
    },
  });

  t.field("setTaskIsChecked", {
    type: nonNull("Task"),
    args: {
      id: nonNull(idArg()),
      isChecked: nonNull(booleanArg()),
    },
    async resolve(_parent, args, ctx) {
      const updated = await ctx.db
        .updateTable("tasks")
        .set({
          isChecked: args.isChecked,
          updatedAt: new Date(),
        })
        .where("id", "=", args.id)
        .returning(taskSelect)
        .executeTakeFirst();

      if (!updated) throw new Error("Task not found");
      return updated;
    },
  });

  t.field("setTaskCompleted", {
    type: nonNull("Task"),
    args: {
      id: nonNull(idArg()),
      completed: nonNull(booleanArg()),
    },
    async resolve(_parent, args, ctx) {
      const now = new Date();

      const updated = await ctx.db
        .updateTable("tasks")
        .set({
          completed: args.completed,
          completedAt: args.completed ? now : null,
          updatedAt: now,
        })
        .where("id", "=", args.id)
        .returning(taskSelect)
        .executeTakeFirst();

      if (!updated) throw new Error("Task not found");
      return updated;
    },
  });

  t.field("setTaskCurrentCount", {
    type: nonNull("Task"),
    args: {
      id: nonNull(idArg()),
      currentCount: nonNull(intArg()),
    },
    async resolve(_parent, args, ctx) {
      if (args.currentCount < 0) {
        throw new Error("currentCount cannot be negative");
      }

      const updated = await ctx.db
        .updateTable("tasks")
        .set({
          currentCount: args.currentCount,
          updatedAt: new Date(),
        })
        .where("id", "=", args.id)
        .returning(taskSelect)
        .executeTakeFirst();

      if (!updated) throw new Error("Task not found");
      return updated;
    },
  });

  t.field("incrementTaskCurrentCount", {
    type: nonNull("Task"),
    args: {
      id: nonNull(idArg()),
      by: intArg(), // default 1
    },
    async resolve(_parent, args, ctx) {
      const by = args.by ?? 1;
      if (by === 0) {
        // no-op, but still return current task
        const task = await ctx.db
          .selectFrom("tasks")
          .select(taskSelect)
          .where("id", "=", args.id)
          .executeTakeFirst();
        if (!task) throw new Error("Task not found");
        return task;
      }

      // Kysely expression builder to do currentCount = currentCount + by
      const updated = await ctx.db
        .updateTable("tasks")
        .set((eb: (arg0: string, arg1: string, arg2: any) => any) => ({
          currentCount: eb("currentCount", "+", by),
          updatedAt: new Date(),
        }))
        .where("id", "=", args.id)
        .returning(taskSelect)
        .executeTakeFirst();

      if (!updated) throw new Error("Task not found");
      return updated;
    },
  });

  t.field("removeTask", {
    type: nonNull("Task"),
    args: {
      id: nonNull(idArg()),
    },
    async resolve(_parent, args, ctx) {
      const deleted = await ctx.db
        .deleteFrom("tasks")
        .where("id", "=", args.id)
        .returning(taskSelect)
        .executeTakeFirst();

      if (!deleted) throw new Error("Task not found");
      return deleted;
    },
  });
});
