import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { ActiveListTaskItem } from "@/components/TomodoTaskList/ActiveListTaskItem";
import type { TaskType } from "@/components/types";

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

  console.log('just checking');


  return (
    <ul
      ref={listRef}
      className="
        max-h-64
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
                console.log('checked', isChecked);

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
  );
};

export default ActiveTasksView;
