import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { ActiveListTaskItem } from "@/components/TomodoTaskList/ActiveListTaskItem";
import type { TaskType } from "@/components/types";
import FileIcon from "@/svgs/big-svgs/FileIcon";

type Props = {
  activeTasks: Array<TaskType>;
  sessionTasks: Array<TaskType>;
  setSessionTasks: Dispatch<SetStateAction<Array<TaskType>>>;
}

const ActiveTasksView = ({ activeTasks, sessionTasks, setSessionTasks }: Props) => {

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeTasks]);



  return (<>
    <ul
      ref={listRef}
      className="
        max-h-76
        overflow-y-auto
        scroll-smooth
        pr-1
      "
    >
      {activeTasks.map((item) => {
        const isChecked = sessionTasks.some(task => task.id === item.id)

        return (
          <ActiveListTaskItem
            key={item.id}
            item={item}
            checked={isChecked}
            onCheckedChange={() => {
              if (isChecked) {
                (
                  setSessionTasks(prev => prev.filter((value) => value.id !== item.id))
                );
              } else {
                setSessionTasks([...sessionTasks, item]);
              }
            }}
          />
        );
      })}
    </ul>
    {
      activeTasks.length <= 0 && <div className="flex-1 grow shrink-0 flex items-center justify-center flex-col gap-y-2">
        <FileIcon />
        <p className="text-sm font-light">No tasks at the moment.</p>
      </div>
    }
  </>
  );
};

export default ActiveTasksView;
