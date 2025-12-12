import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod, enumType, objectType } from "nexus";

export const TaskStatus = enumType({
  name: "TaskStatus",
  members: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "OVERACHIEVED"],
});

export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const Task = objectType({
  name: "Task",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("title");
    t.nonNull.boolean("isChecked");
    t.nonNull.string("listName");
    t.nonNull.int("actualPomodoros");
    t.nonNull.int("estimatedPomodoros");

    // status is derived from actualPomodoros / estimatedPomodoros
    t.nonNull.field("status", {
      type: "TaskStatus",
      resolve(root) {
        const actual = root.actualPomodoros ?? 0;
        const estimate = root.estimatedPomodoros ?? 0;

        if (actual === 0 && estimate > 0) return "NOT_STARTED";
        if (estimate === 0 && actual === 0) return "NOT_STARTED";
        if (actual < estimate) return "IN_PROGRESS";
        if (actual === estimate) return "COMPLETED";
        return "OVERACHIEVED";
      },
    });

    t.nonNull.boolean("isActive");

    // Assuming you have a DateTime scalar wired in your schema
    t.nonNull.field("createdAt", { type: "DateTime" });
    t.nonNull.field("updatedAt", { type: "DateTime" });
  },
});
