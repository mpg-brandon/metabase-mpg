import { useEffect, useMemo, useRef } from "react";

import DashboardS from "metabase/css/dashboard.module.css";
import { Box, Flex } from "metabase/ui";
import { color } from "metabase/ui/colors";
import {
  ScalarValue,
  ScalarWrapper,
} from "metabase/visualizations/components/ScalarValue/ScalarValue";
import { useBrowserRenderingContext } from "metabase/visualizations/hooks/use-browser-rendering-context";
import { compactifyValue } from "metabase/visualizations/lib/scalar_utils";
import type {
  VisualizationPassThroughProps,
  VisualizationProps,
} from "metabase/visualizations/types";

import { ScalarValueContainer } from "../Scalar/ScalarValueContainer";
import { PreviousValueComparison } from "../SmartScalar/PreviousValueComparison";
import { ScalarPeriod } from "../SmartScalar/ScalarPeriod";
import { computeTrend } from "../SmartScalar/compute";
import { DASHCARD_HEADER_HEIGHT } from "../SmartScalar/constants";
import {
  getValueHeight,
  getValueWidth,
  isPeriodVisible,
} from "../SmartScalar/utils";

import { Sparkline } from "./Sparkline";
import { KPI_SPARKLINE_CHART_DEFINITION } from "./definition";

function KpiSparklineComponent({
  onVisualizationClick,
  isDashboard,
  settings,
  visualizationIsClickable,
  series,
  rawSeries,
  gridSize,
  width,
  height,
  totalNumGridCols,
  fontFamily,
  onRenderError,
}: VisualizationProps & VisualizationPassThroughProps) {
  const scalarRef = useRef(null);
  const { getColor } = useBrowserRenderingContext({ fontFamily });
  const insights = rawSeries?.[0].data?.insights;
  const { trend, error } = useMemo(
    () => computeTrend(series, insights, settings, { getColor }),
    [series, insights, settings, getColor],
  );

  useEffect(() => {
    if (error) {
      onRenderError(error.message);
    }
  }, [error, onRenderError]);

  const sparklineValues = useMemo(() => {
    const data = series[0]?.data;
    if (!data) {
      return [];
    }
    const metricName = settings["scalar.field"];
    const selectedMetricIndex = data.cols.findIndex(
      (column) => column.name === metricName,
    );
    // Trend-compatible result sets normally put the date first and the metric
    // second. Avoid accidentally drawing the date column before settings have
    // been initialized for a newly selected visualization.
    const metricIndex =
      selectedMetricIndex >= 0
        ? selectedMetricIndex
        : Math.min(1, data.cols.length - 1);
    return data.rows.map((row) => row[metricIndex]);
  }, [series, settings]);

  if (trend == null) {
    return null;
  }

  const { value, clicked, comparisons, display, formatOptions } = trend;
  const innerHeight = isDashboard ? height - DASHCARD_HEADER_HEIGHT : height;
  const showSparkline = sparklineValues.length > 1 && innerHeight >= 64;
  const sparklineHeight = showSparkline
    ? Math.max(24, Math.min(64, Math.round(innerHeight * 0.34)))
    : 0;
  const contentHeight = Math.max(44, innerHeight - sparklineHeight - 4);
  const isClickable = onVisualizationClick != null;

  const handleClick = () => {
    if (scalarRef.current == null) {
      return;
    }
    const clickData = { ...clicked, element: scalarRef.current };
    if (onVisualizationClick && visualizationIsClickable(clickData)) {
      onVisualizationClick(clickData);
    }
  };

  const { displayValue, fullScalarValue } = compactifyValue(
    value,
    width,
    formatOptions,
  );
  const { valueHeight, comparisonsCount } = getValueHeight(
    contentHeight,
    comparisons.length,
  );

  return (
    <ScalarWrapper>
      <Flex direction="column" h="100%" miw={0} w="100%">
        <Flex align="center" direction="column" flex="1" miw={0}>
          <ScalarValueContainer
            className={DashboardS.fullscreenNormalText}
            tooltip={fullScalarValue}
            alwaysShowTooltip={fullScalarValue !== displayValue}
            isClickable={isClickable}
          >
            <span onClick={handleClick} ref={scalarRef}>
              <ScalarValue
                fontFamily={fontFamily}
                gridSize={gridSize}
                height={valueHeight}
                totalNumGridCols={totalNumGridCols}
                // compactifyValue returns a renderable scalar string here.
                value={displayValue as string}
                width={getValueWidth(width)}
              />
            </span>
          </ScalarValueContainer>
          {isPeriodVisible(contentHeight) && (
            <ScalarPeriod period={display.date} />
          )}
          {comparisonsCount === 1 && (
            <Box maw="100%" data-testid="scalar-previous-value">
              <PreviousValueComparison
                comparison={comparisons[0]}
                fontFamily={fontFamily}
                formatOptions={formatOptions}
                tooltipComparisons={comparisons}
                width={width}
              />
            </Box>
          )}
          {comparisonsCount !== 1 &&
            comparisons.map((comparison, index) => (
              <Box maw="100%" key={index} data-testid="scalar-previous-value">
                <PreviousValueComparison
                  comparison={comparison}
                  fontFamily={fontFamily}
                  formatOptions={formatOptions}
                  tooltipComparisons={[comparison]}
                  width={width}
                />
              </Box>
            ))}
        </Flex>
        {showSparkline && (
          <Box mt="xs" w="100%">
            <Sparkline
              color={settings["kpi_sparkline.color"] ?? color("accent0")}
              height={sparklineHeight}
              showArea={settings["kpi_sparkline.show_area"] ?? false}
              values={sparklineValues}
            />
          </Box>
        )}
      </Flex>
    </ScalarWrapper>
  );
}

export const KpiSparkline = Object.assign(
  KpiSparklineComponent,
  KPI_SPARKLINE_CHART_DEFINITION,
);
