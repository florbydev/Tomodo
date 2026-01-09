import { extendType, inputObjectType, nonNull, objectType } from "nexus";

// ---- Type ----
export const SessionInfo = objectType({
  name: "SessionInfo",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("user_id");

    t.nonNull.string("session_type"); // later you can switch this to an enum
    t.nonNull.int("planned_duration_seconds");
    t.int("actual_duration_seconds");

    t.nonNull.string("status"); // "running" | "paused" | "completed" | "canceled"
    t.nonNull.field("started_at", { type: "DateTime" });
    t.field("ended_at", { type: "DateTime" });

    t.int("cycle_index");
    t.nonNull.field("created_at", { type: "DateTime" });
  },
});

// ---- Inputs ----
export const StartSessionInput = inputObjectType({
  name: "StartSessionInput",
  definition(t) {
    t.nonNull.string("session_type"); // "focus" | "break" | "long_break"
    t.nonNull.int("planned_duration_seconds");
    t.int("cycle_index");
    // If you want to associate tasks at start, we can add task_ids here later.
  },
});

export const PauseSessionInput = inputObjectType({
  name: "PauseSessionInput",
  definition(t) {
    t.nonNull.id("session_id");
  },
});

export const EndSessionInput = inputObjectType({
  name: "EndSessionInput",
  definition(t) {
    t.nonNull.id("session_id");
    t.int("actual_duration_seconds");
    t.string("status"); // allow "completed" | "canceled" if you want
  },
});

// ---- Mutations ----
export const SessionMutation = extendType({
  type: "Mutation",
  definition(t) {
    // start session
    t.nonNull.field("startSession", {
      type: "SessionInfo",
      args: { input: nonNull("StartSessionInput") },
      async resolve(_root, args, ctx) {
        const now = new Date();

        const insert = await ctx.db
          .insertInto("session_info")
          .values({
            user_id: ctx.userId,
            session_type: args.input.session_type,
            planned_duration_seconds: args.input.planned_duration_seconds,
            actual_duration_seconds: null,
            status: "running",
            started_at: now,
            ended_at: null,
            cycle_index: args.input.cycle_index ?? null,
            created_at: now,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return insert;
      },
    });

    // pause session
    t.nonNull.field("pauseSession", {
      type: "SessionInfo",
      args: { input: nonNull("PauseSessionInput") },
      async resolve(_root, args, ctx) {
        const updated = await ctx.db
          .updateTable("session_info")
          .set({ status: "paused" })
          .where("id", "=", args.input.session_id)
          .where("user_id", "=", ctx.userId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return updated;
      },
    });

    // end session
    t.nonNull.field("endSession", {
      type: "SessionInfo",
      args: { input: nonNull("EndSessionInput") },
      async resolve(_root, args, ctx) {
        const now = new Date();

        const updated = await ctx.db
          .updateTable("session_info")
          .set({
            status: (args.input.status ?? "completed") as any,
            ended_at: now,
            actual_duration_seconds: args.input.actual_duration_seconds ?? null,
          })
          .where("id", "=", args.input.session_id)
          .where("user_id", "=", ctx.userId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return updated;
      },
    });
  },
});
