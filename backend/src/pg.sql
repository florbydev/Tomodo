-- enums
DO $$ BEGIN
  CREATE TYPE session_status AS ENUM ('running', 'paused', 'ended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE session_count_action AS ENUM ('PAUSE', 'END');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE pomo_phase AS ENUM ('focus', 'short_break', 'long_break');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- tables
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  name varchar,
  email varchar UNIQUE,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES users(id),
  name varchar NOT NULL,
  description text,
  color varchar,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE INDEX IF NOT EXISTS projects_userId_idx ON projects ("userId");

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY,
  "projectId" uuid NOT NULL REFERENCES projects(id),
  description text NOT NULL,
  "estimatedCount" int,
  "currentCount" int,
  "createdAt" timestamp,
  "updatedAt" timestamp,
  is_checked boolean,
  completed boolean,
  "completedAt" timestamp
);

CREATE INDEX IF NOT EXISTS tasks_projectId_idx ON tasks ("projectId");
CREATE INDEX IF NOT EXISTS tasks_projectId_completed_idx ON tasks ("projectId", completed);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES users(id),
  "sessionCount" session_count_action,
  "sessionStatus" session_status,
  "actualFocusTime" int,      -- seconds
  "actualBreakTime" int,      -- seconds
  "sessionFocusTime" int,     -- planned seconds
  "sessionBreakTime" int,     -- planned seconds
  "startedAt" timestamp,
  "pausedAt" timestamp,
  "endedAt" timestamp
);

CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions ("userId");
CREATE INDEX IF NOT EXISTS sessions_sessionStatus_idx ON sessions ("sessionStatus");
CREATE INDEX IF NOT EXISTS sessions_startedAt_idx ON sessions ("startedAt");

CREATE TABLE IF NOT EXISTS personal_prefs (
  "userId" uuid PRIMARY KEY REFERENCES users(id),
  "darkMode" boolean
);

CREATE TABLE IF NOT EXISTS pomo_prefs (
  "userId" uuid PRIMARY KEY REFERENCES users(id),
  "focusTime" int,           -- seconds
  "breakTime" int,           -- seconds
  "longBreakTime" int,       -- seconds
  "longBreakInterval" int
);

CREATE TABLE IF NOT EXISTS music_tracks (
  id uuid PRIMARY KEY,
  title varchar NOT NULL,
  artist varchar,
  "durationSeconds" int,
  "audioUrl" varchar,
  "coverImageUrl" varchar,
  "isLoopable" boolean
);
