import { objectType } from "nexus";

export const SessionTask = objectType({
  name: "SessionTask",
  definition(t) {
    // Composite PK (Primary Key): (session_id, task_id)
    t.nonNull.id("session_id");
    t.nonNull.id("task_id");

    t.int("sort_order");
    t.int("seconds_spent");

    t.nonNull.field("created_at", { type: "DateTime" });
  },
});
