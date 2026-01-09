import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

/**
 * UUID (Universally Unique Identifier)
 */
type UUID = string;

/**
 * Timestamp columns:
 * - Select: Date
 * - Insert/Update: Date | string | null (lets you pass ISO strings or Date)
 */
type Timestamp = ColumnType<Date, Date | string | null, Date | string | null>;

/**
 * SessionStatus: matches session_info.status in your tables
 */
export type SessionStatus = "running" | "paused" | "completed" | "canceled";

/**
 * SessionType: matches session_info.session_type in your tables
 */
export type SessionType = "focus" | "break" | "long_break";

export interface UsersTable {
  id: UUID;

  email: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string; // default "UTC"

  // default pomodoro settings
  default_focus_minutes: number;
  default_break_minutes: number;
  default_long_break_minutes: number;
  long_break_every: number;

  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ProjectsTable {
  id: UUID;
  user_id: UUID;

  name: string;
  icon: string | null;
  color: string | null;
  is_archived: boolean;

  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TasksTable {
  id: UUID;
  user_id: UUID;
  project_id: UUID | null; // nullable: inbox tasks

  title: string;
  notes: string | null;

  target_sessions: number;
  completed_sessions: number;

  is_completed: boolean;
  completed_at: Timestamp | null;

  sort_order: number | null;
  is_archived: boolean;

  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SessionInfoTable {
  id: UUID;
  user_id: UUID;

  session_type: SessionType;
  planned_duration_seconds: number;
  actual_duration_seconds: number | null;

  status: SessionStatus; // default "completed"
  started_at: Timestamp;
  ended_at: Timestamp | null;

  cycle_index: number | null;
  created_at: Timestamp;
}

export interface SessionTasksTable {
  session_id: UUID;
  task_id: UUID;

  sort_order: number | null;
  seconds_spent: number | null;

  created_at: Timestamp;
}

export interface Database {
  users: UsersTable;
  projects: ProjectsTable;
  tasks: TasksTable;
  session_info: SessionInfoTable;
  session_tasks: SessionTasksTable;
}

/* Optional convenience types per table */
export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type Project = Selectable<ProjectsTable>;
export type NewProject = Insertable<ProjectsTable>;
export type ProjectUpdate = Updateable<ProjectsTable>;

export type Task = Selectable<TasksTable>;
export type NewTask = Insertable<TasksTable>;
export type TaskUpdate = Updateable<TasksTable>;

export type SessionInfo = Selectable<SessionInfoTable>;
export type NewSessionInfo = Insertable<SessionInfoTable>;
export type SessionInfoUpdate = Updateable<SessionInfoTable>;

export type SessionTask = Selectable<SessionTasksTable>;
export type NewSessionTask = Insertable<SessionTasksTable>;
export type SessionTaskUpdate = Updateable<SessionTasksTable>;
