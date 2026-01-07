import { TaskContext } from "@/contexts/TaskProvider";
import { useContext } from "react";

export const useTask = () => {
  const ctx = useContext(TaskContext);

  if (!ctx) {
    throw new Error("Task Context is undefined.");
  }

  return ctx;
};
