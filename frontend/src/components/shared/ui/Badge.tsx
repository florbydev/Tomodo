import classNames from "classnames";
import { PiSuitcase } from "react-icons/pi";

type Props = {
  label: string;
  backgroundColor: string
}


export const Badge = ({ label, backgroundColor }: Props) => {

  const divColor = classNames("flex items-center gap-x-1 justify-start rounded-full border border-outline bg-primary-muted px-2 py-1 min-w-22 shrink-0",
    backgroundColor,
  );
  return (
    <div
      className={divColor}
      title={label} // shows full text on hover
    >
      <PiSuitcase className="text-outline shrink-0" />
      <span
        className="
          text-outline text-xs font-medium tracking-[3.5%]
          truncate
          whitespace-nowrap
          overflow-hidden
        "
      >
        {label}
      </span>
    </div>
  );
}