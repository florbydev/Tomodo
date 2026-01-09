import { PomoCount } from "@/components/shared/ui/PomoCount";
import { useTask } from "@/hooks/useTask";
import FileIcon from "@/svgs/big-svgs/FileIcon"
import CloseIcon from "@/svgs/CloseIcon"

type Props = {
  open: boolean;
  hide: () => void;
}

const SessionPanel = ({ open, hide }: Props) => {

  const { sessionTasks } = useTask();

  return open && <div className="absolute h-80 w-2xl bg-primary-muted border border-outline rounded-md p-4 top-6 flex z-10">
    <div className="flex flex-col w-full gap-y-3">
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm text-outline">Session Tasks</p>
        <button onClick={hide}>
          <CloseIcon />
        </button>
      </div>
      <div className="max-h-80 overflow-auto">
        <ul>
          {
            sessionTasks.map(task => {
              return (<li id={task.id} className="flex py-1 px-2 items-baseline">
                <PomoCount estimated={task.target_sessions} current={task.completed_sessions} />
                <span className="font-light text-outline leading-[150%] ml-2">
                  {task.title}
                </span>
              </li>)
            })
          }
        </ul>
        {sessionTasks.length <= 0 && <div className="flex-1 grow shrink-0 flex items-center justify-center flex-col gap-y-2">
          <FileIcon />
          <p className="text-sm font-light">No tasks at the moment.</p>
        </div>}
      </div>
    </div>
  </div>
}

export default SessionPanel