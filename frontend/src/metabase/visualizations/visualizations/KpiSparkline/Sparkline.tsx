import { useId, useMemo } from "react";

import type { RowValue } from "metabase-types/api";

import S from "./Sparkline.module.css";

type SparklineProps = {
  color: string;
  height: number;
  showArea: boolean;
  values: RowValue[];
};

const SVG_WIDTH = 1000;

export function Sparkline({ color, height, showArea, values }: SparklineProps) {
  const gradientId = useId().replaceAll(":", "");
  const points = useMemo(() => {
    const numbers = values
      .map((value) => (typeof value === "number" ? value : Number(value)))
      .filter(Number.isFinite);

    if (numbers.length < 2) {
      return [];
    }

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min || 1;
    const top = 4;
    const bottom = Math.max(top + 1, height - 5);

    return numbers.map((value, index) => ({
      x: (index / (numbers.length - 1)) * SVG_WIDTH,
      y: bottom - ((value - min) / range) * (bottom - top),
    }));
  }, [height, values]);

  if (points.length < 2) {
    return null;
  }

  const linePath = points
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const lastPoint = points.at(-1)!;
  const areaPath = `${linePath} L${lastPoint.x},${height} L0,${height} Z`;

  return (
    <div
      aria-label="Metric history"
      className={S.container}
      data-testid="kpi-sparkline"
      role="img"
      style={{ height }}
    >
      <svg
        aria-hidden="true"
        className={S.sparkline}
        height={height}
        preserveAspectRatio="none"
        viewBox={`0 0 ${SVG_WIDTH} ${height}`}
        width="100%"
      >
        {showArea && (
          <>
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d={areaPath}
              data-testid="kpi-sparkline-area"
              fill={`url(#${gradientId})`}
            />
          </>
        )}
        <path
          className={S.line}
          data-testid="kpi-sparkline-line"
          d={linePath}
          fill="none"
          stroke={color}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        aria-hidden="true"
        className={S.lastPoint}
        data-testid="kpi-sparkline-endpoint"
        style={{ backgroundColor: color, color, top: lastPoint.y }}
      />
    </div>
  );
}
