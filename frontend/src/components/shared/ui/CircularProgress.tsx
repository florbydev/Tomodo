import React from "react";

type OutlinedRadialMeterProps = {
  /** 0..100 */
  value: number;

  /** overall size in px */
  size?: number;

  /** outline thickness in px (outer circle, inner circle, divider lines) */
  thickness?: number;

  /** background behind the whole icon */
  backgroundColor?: string;

  /** outline color for circles + dividers */
  outlineColor?: string;

  /** fill color for the progress sector */
  fillColor?: string;

  /** radius of the inner circle as a fraction of outer radius (0..1) */
  innerRadiusRatio?: number;

  /** start angle in degrees for the fixed divider (default 0 = pointing right) */
  startAngle?: number;

  /** progress direction: clockwise (default) or counterclockwise */
  clockwise?: boolean;

  className?: string;
  style?: React.CSSProperties;

  /** optional: slightly round the joins; keep "butt" to match your image */
  lineCap?: "butt" | "round" | "square";
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = degToRad(angleDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/**
 * Donut-sector path (ring wedge) from a0 -> a1, between radii rOuter and rInner.
 * Angles are in degrees, SVG coord system (0° = right, 90° = down).
 */
function donutSectorPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number
) {
  const p0 = polarToCartesian(cx, cy, rOuter, a0);
  const p1 = polarToCartesian(cx, cy, rOuter, a1);
  const p2 = polarToCartesian(cx, cy, rInner, a1);
  const p3 = polarToCartesian(cx, cy, rInner, a0);

  // normalize sweep to decide large-arc
  let sweep = a1 - a0;
  // put into [0, 360)
  while (sweep < 0) sweep += 360;
  while (sweep >= 360) sweep -= 360;

  const largeArc = sweep > 180 ? 1 : 0;

  // Sweep flag 1 = clockwise, 0 = CCW. We handle direction by ordering angles in caller.
  const sweepFlag = 1;

  return [
    `M ${p0.x} ${p0.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} ${sweepFlag} ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} ${0} ${p3.x} ${p3.y}`, // reverse arc back
    "Z",
  ].join(" ");
}

export const OutlinedRadialMeter: React.FC<OutlinedRadialMeterProps> = ({
  value,
  size = 220,
  thickness = 18,
  backgroundColor = "#fbf7ee",
  outlineColor = "#3b1f14",
  fillColor = "#f8dca6",
  innerRadiusRatio = 0.22,
  startAngle = 0,
  clockwise = true,
  className,
  style,
  lineCap = "butt",
}) => {
  const v = clamp(value, 0, 100);

  const cx = size / 2;
  const cy = size / 2;

  // Outer outline circle radius (stroke centered on radius)
  const rOuterStroke = cx - thickness / 2;

  // Inner outline circle radius (stroke centered)
  const rInnerStroke = rOuterStroke * innerRadiusRatio;

  // Filled sector should sit INSIDE the outlines:
  const rOuterFill = rOuterStroke - thickness / 2; // inside outer stroke
  const rInnerFill = rInnerStroke + thickness / 2; // outside inner stroke

  // Convert value -> angle sweep
  const sweep = (v / 100) * 360;

  // Angle math: in SVG coordinates, 0° is right, 90° is down.
  const a0 = startAngle;
  const a1 = clockwise ? startAngle + sweep : startAngle - sweep;

  const fixedDividerOuter = polarToCartesian(cx, cy, rOuterFill, a0);
  const fixedDividerInner = polarToCartesian(cx, cy, rInnerFill, a0);

  const movingDividerOuter = polarToCartesian(cx, cy, rOuterFill, a1);
  const movingDividerInner = polarToCartesian(cx, cy, rInnerFill, a1);

  // Build fill path; handle CCW by swapping so our path helper stays “clockwise”
  const fillPath =
    v === 0
      ? null
      : clockwise
        ? donutSectorPath(cx, cy, rOuterFill, rInnerFill, a0, a1)
        : donutSectorPath(cx, cy, rOuterFill, rInnerFill, a1, a0);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={style}
      role="img"
      aria-label={`Progress ${v}%`}
    >
      {/* background */}
      <rect width={size} height={size} fill={backgroundColor} />

      {/* fill wedge (between circles) */}
      {fillPath && <path d={fillPath} fill={fillColor} />}

      {/* outer outline */}
      <circle
        cx={cx}
        cy={cy}
        r={rOuterStroke}
        fill="transparent"
        stroke={outlineColor}
        strokeWidth={thickness}
      />

      {/* inner outline */}
      <circle
        cx={cx}
        cy={cy}
        r={rInnerStroke}
        fill="transparent"
        stroke={outlineColor}
        strokeWidth={thickness}
      />

      {/* fixed divider line (points right by default) */}
      <line
        x1={fixedDividerInner.x}
        y1={fixedDividerInner.y}
        x2={fixedDividerOuter.x}
        y2={fixedDividerOuter.y}
        stroke={outlineColor}
        strokeWidth={thickness}
        strokeLinecap={lineCap}
      />

      {/* moving divider line (progress boundary) */}
      {v > 0 && v < 100 && (
        <line
          x1={movingDividerInner.x}
          y1={movingDividerInner.y}
          x2={movingDividerOuter.x}
          y2={movingDividerOuter.y}
          stroke={outlineColor}
          strokeWidth={thickness}
          strokeLinecap={lineCap}
        />
      )}
    </svg>
  );
};
