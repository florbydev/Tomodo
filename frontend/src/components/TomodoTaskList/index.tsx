import { useMemo, useState } from "react";
import classNames from "classnames";
import type { ProjectType } from "@/components/types";
import PastLogsView from "@/components/TomodoTaskList/PastLogsView";
import ActiveTasksView from "@/components/TomodoTaskList/ActiveTasksView";
import Dropdown from "@/components/TomodoTaskList/Dropdown";
import { useTask } from "@/hooks/useTask";

export const TabState = {
  ACTIVE_TASKS: 'active-tasks',
  PAST_LOGS: 'past-logs',
} as const;

export type TabState = typeof TabState[keyof typeof TabState];


const TomodoTaskList = () => {

  const { projectList, activeTasks, pastLogs, sessionTasks, setSessionTasks } = useTask();
  const [currentProject, setCurrentProject] = useState(projectList[0]);

  const filteredActiveTask = useMemo(() => {
    if (currentProject) {
      return activeTasks.filter(task => task.project_id === currentProject.id)
    }

    return activeTasks;
  }, [currentProject, activeTasks])

  const filteredPastLogs = useMemo(() => {
    if (currentProject) {
      return pastLogs.filter(task => task.project_id === currentProject.id)
    }

    return pastLogs;
  }, [currentProject, pastLogs])


  console.log('active tasks', activeTasks, filteredActiveTask);


  const onProjectChange = (newProject: ProjectType) => {
    setCurrentProject(newProject);
  }

  const tabs = useMemo(() => [{
    id: TabState.ACTIVE_TASKS,
    label: 'Active Tasks'
  }, {
    id: TabState.PAST_LOGS,
    label: 'Past Logs'
  }], [])

  const [currentTab, setCurrentTab] = useState<TabState>(TabState.ACTIVE_TASKS)

  const changeTab = (currentTab: TabState) => {
    return () => {
      setCurrentTab(currentTab)
    }
  }

  return (
    <div className="flex justify-start flex-col gap-y-3 pb-4 border-b border-b-outline flex-1 overflow-auto">
      <div className="flex items-center justify-between ml-2">
        <div>
          {
            tabs.map((tabItem) => {
              const activeClass = classNames("font-light text-xs mx-2 cursor-pointer",
                {
                  'font-normal underline': currentTab === tabItem.id
                }
              )
              return <button key={tabItem.id} className={activeClass} onClick={changeTab(tabItem.id)}>{tabItem.label}</button>
            })
          }
        </div>
        <Dropdown projectList={projectList} value={currentProject} onClick={onProjectChange} style={{
          triggerStyle: "",
          contentStyle: ""
        }} />
      </div>

      {currentTab == TabState.PAST_LOGS && <PastLogsView
        activeTasks={filteredActiveTask}
        pastLogs={filteredPastLogs}
      />}
      {currentTab == TabState.ACTIVE_TASKS && <ActiveTasksView
        activeTasks={filteredActiveTask}
        sessionTasks={sessionTasks}
        setSessionTasks={setSessionTasks}
      />}
    </div>
  )
}

export default TomodoTaskList;
