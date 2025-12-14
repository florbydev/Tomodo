import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod, list, nonNull, objectType, queryField } from "nexus";

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

export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const TaskType = objectType({
  name: "Task",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.id("projectId"),
      t.nonNull.string("description"),
      t.int("estimatedCount"),
      t.int("currentCount"),
      t.field("createdAt", { type: "DateTime" }),
      t.field("updatedAt", { type: "DateTime" }),
      t.field("completedAt", { type: "DateTime" }),
      t.boolean("isChecked"),
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

// - create task
// - update is_checked
// - update completed
// - update currentCount
// - get a list of task by active task/past logs
// - get a list of task by filter
// - remove a task (?)

// PomoPhase
// focus, short_break, long_break
