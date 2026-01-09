import { PastLogTaskItem } from "@/components/TomodoTaskList/PastLogTaskItem";
import type { TaskType } from "@/components/types";
import { useRef, useEffect } from "react";


type Props = {
  activeTasks: Array<TaskType>;
  pastLogs: Array<TaskType>;
}

const PastLogsView = ({ activeTasks, pastLogs }: Props) => {

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeTasks]);
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
      {
        pastLogs.map(item => {
          return <PastLogTaskItem item={item} onClick={(value: TaskType) => {
            console.log('someValue', value);

            // setActiveTasks([...activeTasks, value])
            // setPastLogs(pastLogs.filter(e => e.id !== value.id))
          }
          } />
        })
      }
    </ul>
  )
}

export default PastLogsView