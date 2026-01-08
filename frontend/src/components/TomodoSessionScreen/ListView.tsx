import { PomoCount } from "@/components/shared/ui/PomoCount"
import { useTask } from "@/hooks/useTask";

const ListView = () => {

  const { sessionTasks } = useTask();
  return (
    <div className="px-11.5 w-full flex items-center justify-center">
      <div className="border border-outline bg-primary-muted p-4 w-full rounded-md">
        <p className="font-medium text-sm mb-3 text-outline">Session Tasks</p>
        <div className="overflow-auto max-h-40">
          <ul>
            {
              sessionTasks.map(task => {
                return (<li id={task.id} className="flex py-1 px-2 items-baseline">
                  <PomoCount estimated={task.estimatedCount} current={task.currentCount} />
                  <span className="font-light text-outline leading-[150%] ml-2">
                    {task.description}
                  </span>
                </li>)
              })
            }
          </ul>
        </div>
      </div>
    </div >
  )
}

export default ListView