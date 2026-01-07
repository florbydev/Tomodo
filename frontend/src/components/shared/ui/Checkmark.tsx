// Checkmark.tsx
import Check from "@/svgs/Check";
import classNames from "classnames";

type Props = { checked: boolean };

export default function Checkmark({ checked }: Props) {
  const buttonClass = classNames(
    "w-4.5 h-4.5 rounded-md border border-outline flex items-center justify-center shrink-0",
    {
      "bg-primary": checked,
      "bg-white": !checked,
    }
  );

  return (
    <span className={buttonClass} aria-hidden="true">
      {checked && <Check />}
    </span>
  );
}
