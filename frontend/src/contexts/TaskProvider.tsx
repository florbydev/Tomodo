/* eslint-disable react-refresh/only-export-components */
import type { ProjectType, TaskType } from "@/components/types"
import { createContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"

type Props = {
  children: ReactNode;
}

type TaskProps = {
  activeTasks: Array<TaskType>;
  setActiveTasks: Dispatch<SetStateAction<Array<TaskType>>>;
  pastLogs: Array<TaskType>;
  setPastLogs: (value: Array<TaskType>) => void;
  sessionTasks: Array<TaskType>;
  setSessionTasks: Dispatch<SetStateAction<Array<TaskType>>>;
  projectList: Array<ProjectType>;
  setProjectList: Dispatch<SetStateAction<Array<ProjectType>>>;
}

export const TaskContext = createContext<TaskProps | undefined>(undefined);

export const TaskProvider = ({ children }: Props) => {

  const [projectList, setProjectList] = useState<Array<ProjectType>>([
    {
      id: "proj-1",
      userId: "user-123",
      name: "General",
      description: "Default project for uncategorized tasks",
      color: "#6B7280",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      updatedAt: new Date("2024-01-05T12:30:00Z"),
    },
    {
      id: "proj-2",
      userId: "user-123",
      name: "Work",
      description: "Tasks related to work and career goals",
      color: "#2563EB",
      createdAt: new Date("2024-01-02T09:15:00Z"),
      updatedAt: new Date("2024-01-06T14:45:00Z"),
    },
    {
      id: "proj-3",
      userId: "user-123",
      name: "Personal",
      description: "Personal errands and self-improvement tasks",
      color: "#16A34A",
      createdAt: new Date("2024-01-03T08:00:00Z"),
      updatedAt: new Date("2024-01-07T11:20:00Z"),
    },
    {
      id: "proj-4",
      userId: "user-123",
      name: "Fitness",
      description: "Workout plans and health-related goals",
      color: "#DC2626",
      createdAt: new Date("2024-01-04T07:30:00Z"),
      updatedAt: new Date("2024-01-08T16:10:00Z"),
    },
    {
      id: "proj-5",
      userId: "user-123",
      name: "Learning",
      description: "Courses, reading, and skill development",
      color: "#9333EA",
      createdAt: new Date("2024-01-05T13:00:00Z"),
      updatedAt: new Date("2024-01-09T18:40:00Z"),
    },
  ]);

  const [activeTasks, setActiveTasks] = useState<Array<TaskType>>([
    {
      id: "t1",
      userId: "nothingham-123",
      project: projectList[1], // Work
      description: "Investigate memory leak in backend service.",
      estimatedCount: 2,
      currentCount: 1,
      completed: false,
    },
    {
      id: "t2",
      userId: "nothingham-123",
      project: projectList[1], // Work
      description: "Implement CI/CD (Continuous Integration / Continuous Deployment) pipeline improvements.",
      estimatedCount: 3,
      currentCount: 2,
      completed: false,
    },
    {
      id: "t3",
      userId: "nothingham-123",
      project: projectList[2], // Personal
      description: "Schedule annual health checkup.",
      estimatedCount: 1,
      currentCount: 0,
      completed: false,
    },
    {
      id: "t4",
      userId: "nothingham-123",
      project: projectList[3], // Fitness
      description: "Complete upper-body strength training session.",
      estimatedCount: 1,
      currentCount: 0,
      completed: false,
    },
    {
      id: "t5",
      userId: "nothingham-123",
      project: projectList[4], // Learning
      description: "Finish chapter on system scalability patterns.",
      estimatedCount: 2,
      currentCount: 1,
      completed: false,
    },
    {
      id: "t6",
      userId: "nothingham-123",
      project: projectList[2], // Personal
      description: "Renew car insurance policy.",
      estimatedCount: 1,
      currentCount: 1,
      completed: true,
    },
    {
      id: "t7",
      userId: "nothingham-123",
      project: projectList[0], // General
      description: "Clean up unread emails and archive outdated threads.",
      estimatedCount: 1,
      currentCount: 0,
      completed: false,
    },
    {
      id: "t8",
      userId: "nothingham-123",
      project: projectList[0], // General
      description: "Update personal task tracker with recent notes.",
      estimatedCount: 1,
      currentCount: 1,
      completed: false,
    },
    {
      id: "t9",
      userId: "nothingham-123",
      project: projectList[0], // General
      description: "Back up important files to cloud storage.",
      estimatedCount: 2,
      currentCount: 1,
      completed: false,
    },
    {
      id: "t10",
      userId: "nothingham-123",
      project: projectList[0], // General
      description: "Review upcoming calendar events for the week.",
      estimatedCount: 1,
      currentCount: 0,
      completed: false,
    },
    {
      id: "t11",
      userId: "nothingham-123",
      project: projectList[0], // General
      description: "Organize downloads folder and remove unused files.",
      estimatedCount: 1,
      currentCount: 0,
      completed: false,
    },
  ]);

  const [pastLogs, setPastLogs] = useState<Array<TaskType>>([
    {
      id: "p1",
      userId: "nothingham-123",
      project: projectList[1], // Work
      description: "Resolved production API (Application Programming Interface) timeout issue.",
      currentCount: 2,
      estimatedCount: 2,
      completed: true,
    },
    {
      id: "p2",
      userId: "nothingham-123",
      project: projectList[1], // Work
      description: "Completed quarterly performance review documentation.",
      currentCount: 1,
      estimatedCount: 1,
      completed: true,
    },
    {
      id: "p3",
      userId: "nothingham-123",
      project: projectList[4], // Learning
      description: "Watched course on Kubernetes (Container Orchestration System) fundamentals.",
      currentCount: 3,
      estimatedCount: 3,
      completed: true,
    },
    {
      id: "p4",
      userId: "nothingham-123",
      project: projectList[3], // Fitness
      description: "Completed 10 km (kilometer) cycling workout.",
      currentCount: 1,
      estimatedCount: 1,
      completed: true,
    },
    {
      id: "p5",
      userId: "nothingham-123",
      project: projectList[2], // Personal
      description: "Organized personal finance documents.",
      currentCount: 1,
      estimatedCount: 1,
      completed: true,
    },
    {
      id: "p6",
      userId: "nothingham-123",
      project: projectList[4], // Learning
      description: "Completed hands-on lab for Docker (Containerization Platform).",
      currentCount: 2,
      estimatedCount: 2,
      completed: true,
    },
  ]);

  const [sessionTasks, setSessionTasks] = useState<Array<TaskType>>([]);

  const value: TaskProps = useMemo(() => {
    return {
      activeTasks: activeTasks,
      setActiveTasks: setActiveTasks,
      pastLogs: pastLogs,
      setPastLogs: setPastLogs,
      sessionTasks: sessionTasks,
      setSessionTasks: setSessionTasks,
      projectList: projectList,
      setProjectList: setProjectList,
    }
  }, [activeTasks, pastLogs, projectList, sessionTasks])

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}