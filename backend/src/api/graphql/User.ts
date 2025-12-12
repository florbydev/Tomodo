// UserType
// - id
// - name
// - email
// - createdAt: DateTime!
// - updatedAt: DateTime!

import { objectType } from "nexus";
export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.string("name"),
      t.nonNull.string("email"),
      t.field("createdAt", { type: "DateTime" }),
      t.field("updatedAt", { type: "DateTime" });
  },
});
