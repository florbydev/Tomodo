/* eslint-disable react-refresh/only-export-components */
import type { ProjectType, TaskType } from "@/components/types";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { gql, useMutation, useQuery, type UseMutationExecute } from "urql";

export const TaskContext = createContext<TaskProps | undefined>(undefined);

const ACTIVE_TASKS_QUERY = gql`
  query Tasks {
    active_tasks {
      id
      user_id
      project {
        id
        name
        color
      }
      title
      notes
      target_sessions
      completed_sessions
      is_completed
      completed_at
      sort_order
      is_archived
      created_at
      updated_at
    }
  }
`
const PAST_LOGS_QUERY = gql`
  query Tasks {
    past_logs {
      id
      user_id
      project {
        id
        name
        color
      }
      title
      notes
      target_sessions
      completed_sessions
      is_completed
      completed_at
      sort_order
      is_archived
      created_at
      updated_at
    }
  }
`
const PROJECT_QUERY = gql`
  query Projects {
    projects {
      id
      name
      icon
      color
    }
  }
`

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      icon
      color
      is_archived
      created_at
      updated_at
    }
  }
`;

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      project_id
      title
      notes
      target_sessions
      completed_sessions
      is_completed
      completed_at
      sort_order
      is_archived
      created_at
      updated_at
    }
  }
`;

const UPDATE_TASKS_COMPLETION = gql`
  mutation UpdateTasksCompletion($input: UpdateTasksCompletionInput!) {
    updateTasksCompletion(input: $input) {
      id
      is_completed
      completed_at
      updated_at
    }
  }
`;

const UPDATE_TASKS_COMPLETED_SESSIONS = gql`
  mutation UpdateTasksCompletedSessions($input: UpdateTasksCompletedSessionsInput!) {
    updateTasksCompletedSessions(input: $input) {
      id
      completed_sessions
      updated_at
    }
  }
`;

type ActiveTaskQueryData = { active_tasks: TaskType[] };
type PastLogsQueryData = { past_logs: TaskType[] };
type ProjectsQueryData = { projects: ProjectType[] }

type CreateTaskMutationResult = {
  createTask: TaskType;
}
type CreateTaskMutationVariables = {
  input: Pick<TaskType, 'project_id' | 'target_sessions' | 'title'>;
}

type CreateProjectMutationResult = {
  createProject: ProjectType;
}
type CreateProjectMutationVariables = {
  input: Pick<ProjectType, 'name' | 'icon' | 'color'>;
}

type UpdateTasksMutationResult = {
  createTask: TaskType;
}

type UpdateTasksCompletionVariables = {
  input: {
    task_ids: Array<string>; // or Array<string | number> depending on your schema
    is_completed: boolean;
  };
};

type Props = {
  children: ReactNode;
};

type TaskProps = {
  activeTasks: Array<TaskType>;
  onTaskCreate: (title: string, pomoCount: number, projectInfo: ProjectType) => Promise<void>;
  updateTasksCompletion: UseMutationExecute<UpdateTasksMutationResult, UpdateTasksCompletionVariables>;
  onTaskCompletionUpdate: () => Promise<void>;
  onTaskUndo: (taskId: string) => Promise<void>;
  onTasksComplete: (taskIds: string[]) => Promise<void>;
  pastLogs: Array<TaskType>;
  sessionTasks: Array<TaskType>;
  setSessionTasks: Dispatch<SetStateAction<Array<TaskType>>>;
  projectList: Array<ProjectType>;
};

export const TaskProvider = ({ children }: Props) => {
  const [pastLogsOverride, setPastLogsOverride] = useState<Array<TaskType>>([]);
  const [sessionTasksOverride, setSessionTasksOverride] = useState<Array<TaskType>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [projectResults, createProject] = useMutation<CreateProjectMutationResult, CreateProjectMutationVariables>(CREATE_PROJECT_MUTATION);

  const [taskResults, createTask] =
    useMutation<CreateTaskMutationResult, CreateTaskMutationVariables>(CREATE_TASK_MUTATION);

  const [result, updateTasksCompletion] =
    useMutation<UpdateTasksMutationResult, UpdateTasksCompletionVariables>(UPDATE_TASKS_COMPLETION);

  const [, updateTasksCompletedSessions] = useMutation(UPDATE_TASKS_COMPLETED_SESSIONS);

  const [{ data: activeTasks, fetching: fetchingActiveTasks, error: activeTasksError }, refetchActiveTasks] = useQuery<ActiveTaskQueryData>({
    query: ACTIVE_TASKS_QUERY,
    requestPolicy: "cache-and-network",
  });

  const [{ data: projectList, fetching: fetchingProjectList, error: projectListError }, refetchProjectList] = useQuery<ProjectsQueryData>({
    query: PROJECT_QUERY,
    requestPolicy: "cache-and-network",
  });

  const [{ data: pastLogs, fetching: fetchingPastLogs, error: pastLogsError }, refetchPastLogs] = useQuery<PastLogsQueryData>({
    query: PAST_LOGS_QUERY,
    requestPolicy: "cache-and-network",
  });

  const onTaskCompletionUpdate = useCallback(async () => {

    const sessionTaskIds = sessionTasksOverride.map(t => t.id);
    const res = await updateTasksCompletedSessions({
      input: {
        task_ids: sessionTaskIds,
      },
    });

    setSessionTasksOverride(prev => {
      const newPrev = prev.map(e => {
        return {
          ...e,
          completed_sessions: e.completed_sessions + 1,
        }
      })

      return newPrev;
    })

    if (res.error) {
      console.error("Failed to update completed sessions:", res.error);
    }

  }, [sessionTasksOverride, updateTasksCompletedSessions])

  const onTaskCreate = useCallback(async (title: string, pomoCount: number, projectInfo: ProjectType) => {
    const res = await createTask({
      input: {
        project_id: projectInfo.id,
        title: title,
        target_sessions: pomoCount,
      },
    });

    console.log('res info', res);

    if (!res.error) {
      // Re-fetch tasks so UI updates
      refetchActiveTasks({ requestPolicy: "network-only" });
    }
  }, [createTask, refetchActiveTasks]);

  const onProjectCreate = async () => {
    const res = await createProject({
      input: {
        name: "Focus App",
        icon: "🔥",
        color: "#ef4444",
      },
    });

    if (!res.error) {
      refetchProjectList({ requestPolicy: "network-only" })
    }
  }

  const onTaskUndo = useCallback(async (taskId: string) => {
    await updateTasksCompletion({
      input: { task_ids: [taskId], is_completed: false },
    });

    refetchPastLogs();
  }, [refetchPastLogs, updateTasksCompletion])

  const onTasksComplete = useCallback(async (taskIds: string[]) => {
    await updateTasksCompletion({
      input: { task_ids: taskIds, is_completed: true },
    });

    refetchActiveTasks();
  }, [refetchActiveTasks, updateTasksCompletion])

  const value: TaskProps = useMemo(() => {
    return {
      activeTasks: activeTasks?.active_tasks ?? [],
      onTaskCreate: onTaskCreate,
      updateTasksCompletion: updateTasksCompletion,
      onTaskCompletionUpdate: onTaskCompletionUpdate,
      onTaskUndo,
      onTasksComplete,
      pastLogs: pastLogs?.past_logs ?? [],
      sessionTasks: sessionTasksOverride,
      setSessionTasks: setSessionTasksOverride,
      projectList: projectList?.projects ?? [],
    };
  }, [activeTasks?.active_tasks, onTaskCreate, updateTasksCompletion, onTaskCompletionUpdate, onTaskUndo, onTasksComplete, pastLogs?.past_logs, sessionTasksOverride, projectList?.projects]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
