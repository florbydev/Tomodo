// SessionStatus
// running, paused, ended

// SessionType
// - userId
// - sessionCount (PAUSE | END)
// - sessionStatus
// - actualFocusTime
// - actualBreakTime
// - sessionFocusTime
// - sessionBreakTime
// - startedAt
// - pausedAt
// - endedAt

import { enumType, objectType } from "nexus";

export const SessionStatus = enumType({
  name: "SessionStatus",
  members: ["PLAY", "PAUSE", "RUNNING", "END"],
});

export const Session = objectType({
  name: "Session",
  definition(t) {
    t.nonNull.id("userId"),
      t.nonNull.int("sessionCount"),
      t.nonNull.field("sessionStatus", { type: SessionStatus });
    t.nonNull.int("actualFocusTime"),
      t.nonNull.int("actualBreakTime"),
      t.nonNull.int("sessionFocusTime"),
      t.nonNull.int("sessionBreakTime"),
      t.field("createdAt", { type: "DateTime" }),
      t.field("pausedAt", { type: "DateTime" });
    t.field("endedAt", { type: "DateTime" });
  },
});
