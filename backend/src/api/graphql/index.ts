import { User, UserMutation, UpdatePomodoroPrefsInput } from "./User";
import {
  Project,
  ProjectMutation,
  CreateProjectInput,
  ProjectQuery,
} from "./Project";
import {
  Task,
  TaskQuery,
  TaskMutation,
  CreateTaskInput,
  UpdateTasksCompletionInput,
  UpdateTasksCompletedSessionsInput,
} from "./Task";
import {
  SessionInfo,
  SessionMutation,
  StartSessionInput,
  PauseSessionInput,
  EndSessionInput,
} from "./SesssionInfo";
import { SessionTask } from "./SessionTask";

export const graphqlTypes = [
  // object types
  User,
  Project,
  Task,
  SessionInfo,
  SessionTask,

  // inputs
  CreateTaskInput,
  CreateProjectInput,
  StartSessionInput,
  PauseSessionInput,
  EndSessionInput,
  UpdateTasksCompletionInput,
  UpdatePomodoroPrefsInput,
  UpdateTasksCompletedSessionsInput,

  // query/mutation extensions
  TaskQuery,
  TaskMutation,
  ProjectQuery,
  ProjectMutation,
  SessionMutation,
  UserMutation,
];
