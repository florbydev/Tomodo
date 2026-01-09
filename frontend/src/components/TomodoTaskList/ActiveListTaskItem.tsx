import { useId } from "react";
import Checkmark from "../shared/ui/Checkmark";
import classNames from "classnames";
import { PomoCount } from "@/components/shared/ui/PomoCount";
import { Badge } from "@/components/shared/ui/Badge";
import type { TaskType } from "@/components/types";


type Props = {
  item: TaskType;
  checked: boolean;
  onCheckedChange: (id: string, next: boolean) => void;
};

export function ActiveListTaskItem({ item, checked, onCheckedChange }: Props) {
  const inputId = useId();

  const liClass = classNames("rounded-lg select-none", {
    'bg-primary-hover': checked,
  })
  return (
    <li className={liClass}>
      <label
        htmlFor={inputId}
        className="flex items-center gap-x-4 py-1.5 pl-4 pr-2 hover:bg-primary-hover rounded-lg cursor-pointer"
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(item.id, e.target.checked)}
          className="sr-only"
        />

        <Checkmark onToggle={() => {
          onCheckedChange(item.id, !checked);
        }} checked={checked} />
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



