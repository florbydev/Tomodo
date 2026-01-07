import { OutlinedRadialMeter } from "@/components/shared/ui/CircularProgress";

type Props = {
  current: number;
  estimated: number;
};

export const PomoCount = ({
  current,
  estimated,
}: Props) => {
  const percent =
    estimated === 0
      ? 0
      : (current / estimated > 1 ? 99 : (current / estimated) * 99);

  const getFillColor = (percent: number) => {
    if (percent >= 99) return "#FFA2A2"; // red (full / over)
    if (percent < 50) return "#A2FFAD";   // green
    if (percent < 80) return "#FFDEA2";   // yellow
    return "#FFA2A2";                     // red
  };

  return (
    <div className="inline-flex justify-start items-center gap-x-2 min-w-12">
      <span className="text-outline text-sm font-medium min-w-6">
        {current}/{estimated}
      </span>
      <OutlinedRadialMeter
        value={percent}
        size={16}
        thickness={1}
        backgroundColor="#fbf7ee"
        outlineColor="#3b1f14"
        fillColor={getFillColor(percent)}
        innerRadiusRatio={0.32}
        startAngle={-90}
        clockwise
        lineCap="butt"
      />
    </div>
  );
};
