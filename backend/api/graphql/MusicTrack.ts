// MusicTrack
// - id
// - title
// - artist
// - durationSeconds
// - audioUrl
// - coverImageUrl
// - isLoopable

import { objectType } from "nexus";

export const MusicTrack = objectType({
  name: "MusicTrack",
  definition(t) {
    t.nonNull.id("id"),
      t.nonNull.string("title"),
      t.nonNull.string("artistName"),
      t.nonNull.int("durationSeconds"),
      t.nonNull.string("audioUrl"),
      t.nonNull.string("coverImageUrl"),
      t.boolean("isLoopable");
  },
});
