import type { CardDisplayType } from "metabase-types/api";

export const DEFAULT_VIZ_ORDER: CardDisplayType[] = [
  "table",
  "bar",
  "line",
  "pie",
  "scalar",
  "row",
  "area",
  "combo",
  "pivot",
  "smartscalar",
  "kpi_sparkline",
  "gauge",
  "progress",
  "funnel",
  "object",
  "map",
  "scatter",
  "waterfall",
  "boxplot",
  "sankey",
] as const;
