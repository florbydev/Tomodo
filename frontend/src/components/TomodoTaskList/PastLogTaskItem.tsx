import { useId } from "react";
import { PomoCount } from "@/components/shared/ui/PomoCount";
import { Badge } from "@/components/shared/ui/Badge";
import ReturnIcon from "@/svgs/ReturnIcon";
import type { TaskType } from "@/components/types";


type Props = {
  item: TaskType;
  onClick: (value: TaskType) => void;
};

export function PastLogTaskItem({ item, onClick }: Props) {
  const inputId = useId();
  return (
    <li className="rounded-lg select-none">
      <label
        htmlFor={inputId}
        className="flex items-center gap-x-4 py-1.5 pl-4 pr-2 hover:bg-primary-hover rounded-lg cursor-pointer"
      >
        <button onClick={() => {
          onClick(item);
        }}>
          <ReturnIcon />
        </button>
        <PomoCount
          current={item.currentCount}
          estimated={item.estimatedCount}
        />
        <Badge label={item.project.name} backgroundColor={item.project.color} />
        <p className="text-outline font-light text-base leading-[150%]">
          {item.description}
        </p>
      </label>
    </li>
  );
}

// subcomponents (keep here or split into separate files)



