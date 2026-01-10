import { ExpressionBuilder } from "kysely";
import { extendType, inputObjectType, nonNull, objectType, idArg } from "nexus";
import { Database } from "../../db/types";

// ---- Type ----
export const Task = objectType({
  name: "Task",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("user_id");
    t.id("project_id");

    t.field("project", {
      type: "Project",
      async resolve(task, _args, ctx) {
        if (!task.project_id) return null; // inbox task

        return ctx.db
          .selectFrom("projects")
          .selectAll()
          .where("id", "=", task.project_id)
          .where("user_id", "=", ctx.userId) // security
          .executeTakeFirst();
      },
    });

    t.nonNull.string("title");
    t.string("notes");
    t.nonNull.int("target_sessions");
    t.nonNull.int("completed_sessions");
    t.nonNull.boolean("is_completed");
    t.field("completed_at", { type: "DateTime" });
    t.int("sort_order");
    t.nonNull.boolean("is_archived");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });
  },
});

// ---- Inputs ----
export const CreateTaskInput = inputObjectType({
  name: "CreateTaskInput",
  definition(t) {
    t.id("project_id"); // optional -> inbox task
    t.nonNull.string("title");
    t.string("notes");
    t.int("target_sessions");
    t.int("sort_order");
  },
});

export const UpdateTasksCompletionInput = inputObjectType({
  name: "UpdateTasksCompletionInput",
  definition(t) {
    t.nonNull.list.nonNull.id("task_ids");
    t.nonNull.boolean("is_completed");
  },
});

export const UpdateTasksCompletedSessionsInput = inputObjectType({
  name: "UpdateTasksCompletedSessionsInput",
  definition(t) {
    t.nonNull.list.nonNull.id("task_ids");
  },
});

// ---- Queries ----
export const TaskQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("tasks", {
      type: "Task",
      async resolve(_root, _args, ctx) {
        return ctx.db
          .selectFrom("tasks")
          .selectAll()
          .where("user_id", "=", ctx.userId)
          .where("is_archived", "=", false)
          .orderBy("sort_order", "asc")
          .orderBy("created_at", "desc")
          .execute();
      },
    });

    t.nonNull.list.nonNull.field("active_tasks", {
      type: "Task",
      async resolve(_root, _args, ctx) {
        return ctx.db
          .selectFrom("tasks")
          .selectAll()
          .where("user_id", "=", ctx.userId)
          .where("is_archived", "=", false)
          .where("is_completed", "=", false)
          .orderBy("sort_order", "asc")
          .orderBy("created_at", "desc")
          .execute();
      },
    });

    t.nonNull.list.nonNull.field("past_logs", {
      type: "Task",
      async resolve(_root, _args, ctx) {
        return ctx.db
          .selectFrom("tasks")
          .selectAll()
          .where("user_id", "=", ctx.userId)
          .where("is_archived", "=", false)
          .where("is_completed", "=", true)
          .orderBy("sort_order", "asc")
          .orderBy("created_at", "desc")
          .execute();
      },
    });

    t.nonNull.list.nonNull.field("tasksByProjectId", {
      type: "Task",
      args: {
        project_id: nonNull(idArg()),
      },
      async resolve(_root, args, ctx) {
        return ctx.db
          .selectFrom("tasks")
          .selectAll()
          .where("user_id", "=", ctx.userId)
          .where("project_id", "=", args.project_id)
          .where("is_archived", "=", false)
          .orderBy("sort_order", "asc")
          .orderBy("created_at", "desc")
          .execute();
      },
    });
  },
});

// ---- Mutations ----
export const TaskMutation = extendType({
  type: "Mutation",
  definition(t) {
    // create task
    t.nonNull.field("createTask", {
      type: "Task",
      args: {
        input: nonNull("CreateTaskInput"),
      },
      async resolve(_root, args, ctx) {
        const now = new Date();

        const insert = await ctx.db
          .insertInto("tasks")
          .values({
            user_id: ctx.userId,
            project_id: args.input.project_id ?? null,
            title: args.input.title,
            notes: args.input.notes ?? null,
            target_sessions: args.input.target_sessions ?? 1,
            completed_sessions: 0,
            is_completed: false,
            completed_at: null,
            sort_order: args.input.sort_order ?? null,
            is_archived: false,
            created_at: now,
            updated_at: now,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return insert;
      },
    });
    t.nonNull.list.nonNull.field("updateTasksCompletion", {
      type: "Task",
      args: {
        input: nonNull("UpdateTasksCompletionInput"),
      },
      async resolve(_root, args, ctx) {
        const now = new Date();
        const { task_ids, is_completed } = args.input;

        const updatedTasks = await ctx.db
          .updateTable("tasks")
          .set({
            is_completed,
            completed_at: is_completed ? now : null,
            updated_at: now,
          })
          .where("id", "in", task_ids)
          .where("user_id", "=", ctx.userId) // 🔒 security
          .returningAll()
          .execute();

        return updatedTasks;
      },
    });
    t.nonNull.list.nonNull.field("updateTasksCompletedSessions", {
      type: "Task",
      args: {
        input: nonNull("UpdateTasksCompletedSessionsInput"),
      },
      async resolve(_root, args, ctx) {
        const now = new Date();
        const { task_ids } = args.input;

        if (task_ids.length === 0) return [];

        const updatedTasks = await ctx.db
          .updateTable("tasks")
          .set((eb: ExpressionBuilder<Database, "tasks">) => ({
            completed_sessions: eb("completed_sessions", "+", 1),
            updated_at: now,
          }))
          .where("id", "in", task_ids)
          .where("user_id", "=", ctx.userId) // 🔒 security
          .returningAll()
          .execute();

        return updatedTasks;
      },
    });
  },
});
