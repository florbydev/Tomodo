import { extendType, inputObjectType, nonNull, objectType } from "nexus";

// ---- Type ----
export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");

    t.nonNull.string("email");
    t.string("display_name");
    t.string("avatar_url");
    t.nonNull.string("timezone");

    t.nonNull.int("default_focus_minutes");
    t.nonNull.int("default_break_minutes");
    t.nonNull.int("default_long_break_minutes");
    t.nonNull.int("long_break_every");

    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });
  },
});

// ---- Input ----
export const UpdatePomodoroPrefsInput = inputObjectType({
  name: "UpdatePomodoroPrefsInput",
  definition(t) {
    t.int("default_focus_minutes");
    t.int("default_break_minutes");
    t.int("default_long_break_minutes");
    t.int("long_break_every");
  },
});

// ---- Mutation ----
export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    // change pomodoro preference
    t.nonNull.field("updatePomodoroPrefs", {
      type: "User",
      args: { input: nonNull("UpdatePomodoroPrefsInput") },
      async resolve(_root, args, ctx) {
        const now = new Date();

        const updated = await ctx.db
          .updateTable("users")
          .set({
            default_focus_minutes:
              args.input.default_focus_minutes ?? undefined,
            default_break_minutes:
              args.input.default_break_minutes ?? undefined,
            default_long_break_minutes:
              args.input.default_long_break_minutes ?? undefined,
            long_break_every: args.input.long_break_every ?? undefined,
            updated_at: now,
          })
          .where("id", "=", ctx.userId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return updated;
      },
    });
  },
});
