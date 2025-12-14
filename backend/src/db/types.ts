import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export type SessionStatus = "running" | "paused" | "ended";
export type SessionCountAction = "PAUSE" | "END";
export type PomoPhase = "focus" | "short_break" | "long_break";

type Timestamp = ColumnType<Date, Date | string | null, Date | string | null>;
type UUID = string;

export interface UsersTable {
  id: UUID; // if you generate server-side, keep as UUID; if DB generates, use Generated<UUID>
  name: string | null;
  email: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface ProjectsTable {
  id: UUID;
  userId: UUID;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface TasksTable {
  id: UUID;
  projectId: UUID;
  description: string;
  estimatedCount: number | null;
  currentCount: number | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  isChecked: boolean | null;
  completed: boolean | null;
  completedAt: Timestamp | null;
}

export interface SessionsTable {
  id: UUID;
  userId: UUID;
  sessionCount: SessionCountAction | null;
  sessionStatus: SessionStatus | null;
  actualFocusTime: number | null;
  actualBreakTime: number | null;
  sessionFocusTime: number | null;
  sessionBreakTime: number | null;
  startedAt: Timestamp | null;
  pausedAt: Timestamp | null;
  endedAt: Timestamp | null;
}

export interface PersonalPrefsTable {
  userId: UUID;
  darkMode: boolean | null;
}

export interface PomoPrefsTable {
  userId: UUID;
  focusTime: number | null;
  breakTime: number | null;
  longBreakTime: number | null;
  longBreakInterval: number | null;
}

export interface MusicTracksTable {
  id: UUID;
  title: string;
  artist: string | null;
  durationSeconds: number | null;
  audioUrl: string | null;
  coverImageUrl: string | null;
  isLoopable: boolean | null;
}

export interface Database {
  users: UsersTable;
  projects: ProjectsTable;
  tasks: TasksTable;
  sessions: SessionsTable;
  personal_prefs: PersonalPrefsTable;
  pomo_prefs: PomoPrefsTable;
  music_tracks: MusicTracksTable;
}

// Optional convenience types per table
export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;
