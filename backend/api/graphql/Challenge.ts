import {
  booleanArg,
  enumType,
  idArg,
  inputObjectType,
  list,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";

export const RoleEnum = enumType({
  name: "RoleEnum",
  members: ["DEVELOPER", "ORGANIZER", "JUDGE"],
});

export const mockUsers = [
  { id: "uc-1", username: "alice", role: "DEVELOPER" as const },
  { id: "uc-2", username: "bob", role: "DEVELOPER" as const },
  { id: "uc-3", username: "judge_jane", role: "JUDGE" as const },
  { id: "uc-4", username: "org_oliver", role: "ORGANIZER" as const },
];

export const mockChallenges = [
  {
    id: "ch-1",
    title: "Build a Todo App",
    description: "Create a full-stack todo application",
    requiredStack: ["React", "Node.js", "PostgreSQL"],
    startAt: new Date("2025-01-01T00:00:00Z"),
    endAt: new Date("2025-01-31T23:59:59Z"),
  },
  {
    id: "ch-2",
    title: "Weather Dashboard",
    description: "Build a weather dashboard using a public weather API",
    requiredStack: ["TypeScript", "Next.js", "REST API"],
    startAt: new Date("2025-02-01T00:00:00Z"),
    endAt: new Date("2025-02-28T23:59:59Z"),
  },
];

export const mockSubmissions = [
  {
    id: "sub-1",
    projectUrl: "https://github.com/alice/todo-app",
    score: 86,
    submitter: mockUsers[0],
    challenge: mockChallenges[0],
    feedback: [
      {
        id: "fb-1",
        author: mockUsers[2],
        body: "Nice UI and good separation of concerns.",
        rating: 4,
        createdAt: new Date("2025-01-15T14:20:00Z"),
      },
      {
        id: "fb-2",
        author: mockUsers[3],
        body: "Solid solution. Add tests next time.",
        rating: 4,
        createdAt: new Date("2025-01-18T10:05:00Z"),
      },
    ],
  },
  {
    id: "sub-2",
    projectUrl: "https://github.com/bob/weather-dashboard",
    score: 93,
    submitter: mockUsers[1],
    challenge: mockChallenges[1],
    feedback: [
      {
        id: "fb-3",
        author: mockUsers[2],
        body: "Excellent API handling and error states.",
        rating: 5,
        createdAt: new Date("2025-02-16T09:45:00Z"),
      },
    ],
  },
];

export const UserChallenge = objectType({
  name: "UserChallenge",
  definition(t) {
    t.id("id");
    t.string("username");
    t.nonNull.field("role", { type: "RoleEnum" });
  },
});

export const Feedback = objectType({
  name: "Feedback",
  definition(t) {
    t.nonNull.id("id");
    t.field("author", { type: nonNull("UserChallenge") });
    t.string("body");
    t.int("rating");
    t.field("createdAt", { type: "DateTime" });
  },
});

export const Submission = objectType({
  name: "Submission",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("projectUrl");

    t.field("submitter", {
      type: nonNull("UserChallenge"),
      resolve(parent) {
        return parent.submitter;
      },
    });

    t.field("challenge", {
      type: nonNull("Challenge"),
      resolve(parent) {
        return parent.challenge;
      },
    });

    t.int("score");

    t.field("feedback", {
      type: nonNull(list(nonNull("Feedback"))),
      resolve(parent) {
        return parent.feedback ?? [];
      },
    });
  },
});

export const Challenge = objectType({
  name: "Challenge",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("title");
    t.string("description");
    t.nonNull.list.nonNull.string("requiredStack");
    t.nonNull.field("startAt", { type: "DateTime" });
    t.nonNull.field("endAt", { type: "DateTime" });

    t.nonNull.field("submissions", {
      type: nonNull(list(nonNull("Submission"))),
      resolve(parent) {
        return mockSubmissions.filter((s) => s.challenge.id === parent.id);
      },
    });
  },
});

export const ChallengeInputType = inputObjectType({
  name: "ChallengeInputType",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("title");
    t.string("description");
    t.nonNull.list.nonNull.string("requiredStack");
    t.nonNull.field("startAt", { type: "DateTime" });
    t.nonNull.field("endAt", { type: "DateTime" });
    t.nonNull.list.nonNull.field("submissions", {
      type: "Submission",
    });
  },
});

export const ChallengeQuery = queryField((t) => {
  t.field("challenges", {
    type: nonNull(list(nonNull("Challenge"))),
    args: {
      activeOnly: booleanArg(),
      stack: stringArg(),
    },
    resolve(_parent, args) {
      const now = new Date();

      let results = [...mockChallenges];

      if (args.activeOnly) {
        results = results.filter((c) => c.startAt <= now && now <= c.endAt);
      }

      if (args.stack && args.stack.trim()) {
        const needle = args.stack.trim().toLowerCase();
        results = results.filter((c) =>
          c.requiredStack.some((s) => s.toLowerCase().includes(needle))
        );
      }

      return results;
    },
  });

  t.field("challenge", {
    type: "Challenge",
    args: { id: nonNull(idArg()) },
    resolve(_parent, args) {
      return mockChallenges.find((c) => c.id === args.id) ?? null;
    },
  });
  t.field("submission", {
    type: nonNull(list(nonNull("Submission"))),
    args: { challengeId: nonNull(idArg()) },
    resolve(_parent, args) {
      return mockSubmissions.filter((s) => s.challenge.id === args.challengeId);
    },
  });
});
