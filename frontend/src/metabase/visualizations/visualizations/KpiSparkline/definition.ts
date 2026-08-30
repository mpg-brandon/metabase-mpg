import { t } from "ttag";

import { color } from "metabase/ui/colors";
import type {
  VisualizationDefinition,
  VisualizationSettingsDefinitions,
} from "metabase/visualizations/types";

import {
  SETTINGS_DEFINITIONS,
  SMART_SCALAR_CHART_DEFINITION,
} from "../SmartScalar/definition";

export const KPI_SPARKLINE_SETTINGS_DEFINITIONS: VisualizationSettingsDefinitions =
  {
    ...SETTINGS_DEFINITIONS,
    "kpi_sparkline.color": {
      getSection: () => t`Display`,
      get title() {
        return t`Sparkline color`;
      },
      widget: "color",
      getDefault: () => color("accent0"),
    },
    "kpi_sparkline.show_area": {
      getSection: () => t`Display`,
      get title() {
        return t`Show area fill`;
      },
      widget: "toggle",
      inline: true,
      getDefault: () => false,
    },
  };

export const KPI_SPARKLINE_CHART_DEFINITION: VisualizationDefinition = {
  ...SMART_SCALAR_CHART_DEFINITION,
  getUiName: () => t`KPI with sparkline`,
  identifier: "kpi_sparkline",
  iconName: "line",
  settings: KPI_SPARKLINE_SETTINGS_DEFINITIONS,
};
