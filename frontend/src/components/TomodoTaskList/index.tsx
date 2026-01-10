import { useMemo, useState, useCallback } from "react";
import classNames from "classnames";
import type { ProjectType } from "@/components/types";
import PastLogsView from "@/components/TomodoTaskList/PastLogsView";
import ActiveTasksView from "@/components/TomodoTaskList/ActiveTasksView";
import Dropdown from "@/components/TomodoTaskList/Dropdown";
import { useTask } from "@/hooks/useTask";
import FileIcon from "@/svgs/big-svgs/FileIcon";

export const TabState = {
  ACTIVE_TASKS: "active-tasks",
  PAST_LOGS: "past-logs",
} as const;

export type TabState = (typeof TabState)[keyof typeof TabState];

// A type-safe sentinel id for "General"
const GENERAL_PROJECT_ID = "__GENERAL__" as const;

// A real ProjectType object for the dropdown (keeps Dropdown unchanged)
const GENERAL_PROJECT_OPTION: ProjectType = {
  id: GENERAL_PROJECT_ID,
  user_id: "",
  name: "General",
  icon: "",
  color: "",
  is_archived: false,
  created_at: null,
  updated_at: null,
};

const TomodoTaskList = () => {
  const { projectList, activeTasks, pastLogs, sessionTasks, setSessionTasks } =
    useTask();

  // Default to General
  const [currentProject, setCurrentProject] =
    useState<ProjectType>(GENERAL_PROJECT_OPTION);

  const projectListWithGeneral = useMemo<ProjectType[]>(() => {
    return [GENERAL_PROJECT_OPTION, ...projectList];
  }, [projectList]);

  const filteredActiveTask = useMemo(() => {
    if (currentProject.id === GENERAL_PROJECT_ID) return activeTasks;

    return activeTasks.filter(task => task.project?.id === currentProject.id);
  }, [currentProject.id, activeTasks]);

  const filteredPastLogs = useMemo(() => {
    if (currentProject.id === GENERAL_PROJECT_ID) return pastLogs;

    return pastLogs.filter(task => task.project?.id === currentProject.id);
  }, [currentProject.id, pastLogs]);

  const onProjectChange = useCallback((newProject: ProjectType) => {
    setCurrentProject(newProject);
  }, []);

  const tabs = useMemo(
    () => [
      { id: TabState.ACTIVE_TASKS, label: "Active Tasks" },
      { id: TabState.PAST_LOGS, label: "Past Logs" },
    ],
    []
  );

  const [currentTab, setCurrentTab] = useState<TabState>(TabState.ACTIVE_TASKS);

  const changeTab = useCallback(
    (tab: TabState) => () => setCurrentTab(tab),
    []
  );

  return (
    <div className="flex justify-start flex-col gap-y-3 pb-4 border-b border-b-outline flex-1">
      <div className="flex items-center justify-between ml-2">
        <div>
          {tabs.map(tabItem => {
            const activeClass = classNames(
              "font-light text-xs mx-2 cursor-pointer",
              { "font-normal underline": currentTab === tabItem.id }
            );

            return (
              <button
                key={tabItem.id}
                className={activeClass}
                onClick={changeTab(tabItem.id)}
                type="button"
              >
                {tabItem.label}
              </button>
            );
          })}
        </div>

        <Dropdown
          projectList={projectListWithGeneral}
          value={currentProject}
          onClick={onProjectChange}
          style={{
            triggerStyle: "",
            contentStyle: "",
          }}
        />
      </div>

      {currentTab === TabState.PAST_LOGS && (
        <PastLogsView
          pastLogs={filteredPastLogs}
        />
      )}

      {currentTab === TabState.ACTIVE_TASKS && (
        <ActiveTasksView
          activeTasks={filteredActiveTask}
          sessionTasks={sessionTasks}
          setSessionTasks={setSessionTasks}
        />
      )}
    </div>
  );
};

export default TomodoTaskList;
