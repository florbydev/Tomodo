import { useId } from "react";
import { PomoCount } from "@/components/shared/ui/PomoCount";
import { Badge } from "@/components/shared/ui/Badge";
import ReturnIcon from "@/svgs/ReturnIcon";
import type { TaskType } from "@/components/types";
import { useTask } from "@/hooks/useTask";


type Props = {
  item: TaskType;
};

export function PastLogTaskItem({ item }: Props) {
  const inputId = useId();
  const { onTaskUndo } = useTask();
  return (
    <li className="rounded-lg select-none">
      <label
        htmlFor={inputId}
        className="flex items-center gap-x-4 py-1.5 pl-4 pr-2 hover:bg-primary-hover rounded-lg cursor-pointer"
      >
        <button onClick={async () => {
          try {
            await onTaskUndo(item.id)
          } catch (error) {
            console.log(error);
          }

        }}>
          <ReturnIcon />
        </button>
        <PomoCount
          current={item.completed_sessions}
          estimated={item.target_sessions}
        />
        <Badge label={item.project.name} backgroundColor={item.project.color} />
        <p className="text-outline font-light text-base leading-[150%]">
          {item.title}
        </p>
      </label>
    </li>
  );
}

// subcomponents (keep here or split into separate files)



