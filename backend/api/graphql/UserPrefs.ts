// UserPrefsType
// - userId
// - darkMode
// - pomoData
//    - focusTime
//    - breakTime
//    - longBreakTime
//    - longBreakInterval

import { objectType } from "nexus";

export const UserPrefs = objectType({
  name: "UserPrefs",
  definition(t) {
    t.nonNull.id("userId"),
      t.nonNull.boolean("darkMode"),
      t.nonNull.int("focusTime"),
      t.nonNull.int("breakTime"),
      t.nonNull.int("longBreakTime"),
      t.nonNull.int("longBreakInterval");
  },
});
