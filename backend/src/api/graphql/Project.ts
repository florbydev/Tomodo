// ProjectType
// - id
// - userId
// - name
// - description
// - color
// - createdAt
// - updatedAt

import { mutationField, objectType } from "nexus";
export const Project = objectType({
  name: "Project",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.id("userId"),
      t.nonNull.string("name"),
      t.nonNull.string("description"),
      t.nonNull.string("color"),
      t.field("createdAt", { type: "DateTime" }),
      t.field("updatedAt", { type: "DateTime" });
  },
});

export const ProjectMutation = mutationField((t) => {
  t.field("createProject", {
    type: "Project",
    resolve(_parent, _args, ctx) {},
  });
});
