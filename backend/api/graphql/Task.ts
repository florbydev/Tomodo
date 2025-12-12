import { objectType } from "nexus";

// TaskType
// - id
// - projectID
// - description
// - estimatedCount
// - currentCount
// - createdAt
// - updatedAt
// - is_checked
// - completed
// - completedAt

export const TaskType = objectType({
  name: "Task",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.id("projectID"),
      t.nonNull.string("description"),
      t.int("estimatedCount"),
      t.int("currentCount"),
      t.field("createdAt", { type: "DateTime" }),
      t.field("updatedAt", { type: "DateTime" }),
      t.field("completedAt", { type: "DateTime" }),
      t.boolean("is_checked"),
      t.boolean("completed");
  },
});

// - create task
// - update is_checked
// - update completed
// - update currentCount
// - get a list of task by active task/past logs
// - get a list of task by filter
// - remove a task (?)

// PomoPhase
// focus, short_break, long_break
