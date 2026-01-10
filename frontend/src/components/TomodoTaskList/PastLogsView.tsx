import { PastLogTaskItem } from "@/components/TomodoTaskList/PastLogTaskItem";
import type { TaskType } from "@/components/types";
import FileIcon from "@/svgs/big-svgs/FileIcon";
import { useRef, useEffect } from "react";


type Props = {
  pastLogs: Array<TaskType>;
}

const PastLogsView = ({ pastLogs }: Props) => {

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [pastLogs]);

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
      {
        pastLogs.map(item => {
          return <PastLogTaskItem item={item} />
        })
      }
    </ul>
    {
      pastLogs.length <= 0 && <div className="flex-1 grow shrink-0 flex items-center justify-center flex-col gap-y-2">
        <FileIcon />
        <p className="text-sm font-light">No tasks completed yet.</p>
      </div>
    }
  </>
  )
}

export default PastLogsView