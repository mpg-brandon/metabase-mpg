import { t } from "ttag";

import { useSearchQuery } from "metabase/api";
import { CollapseSection } from "metabase/common/components/CollapseSection";
import { useUserSetting } from "metabase/settings";
import { modelToUrl } from "metabase/urls";

import { PaddedSidebarLink, SidebarHeading } from "../MainNavbar.styled";

import type { SelectedItem } from "../types";

const DASHBOARD_SEARCH_LIMIT = 1000;

type Props = {
  dashboardItem?: SelectedItem;
  onItemSelect: () => void;
};

/**
 * Gives MPG users a direct, permission-aware dashboard index while leaving the
 * existing collection tree available for organizing all other content.
 */
export function DashboardsNavSection({
  dashboardItem,
  onItemSelect,
}: Props) {
  const [expandDashboards = true, setExpandDashboards] = useUserSetting(
    "expand-dashboards-in-nav",
  );
  const { data } = useSearchQuery({
    models: ["dashboard"],
    archived: false,
    context: "browse",
    limit: DASHBOARD_SEARCH_LIMIT,
  });

  const dashboards = [...(data?.data ?? [])].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
  );

  return (
    <CollapseSection
      header={<SidebarHeading>{t`Dashboards`}</SidebarHeading>}
      initialState={expandDashboards ? "expanded" : "collapsed"}
      iconPosition="right"
      iconSize={8}
      onToggle={setExpandDashboards}
      role="section"
      aria-label={t`Dashboards`}
    >
      {dashboards.map((dashboard) => (
        <PaddedSidebarLink
          key={dashboard.id}
          icon="dashboard"
          url={modelToUrl(dashboard)}
          isSelected={dashboardItem?.id === dashboard.id}
          onClick={onItemSelect}
        >
          {dashboard.name}
        </PaddedSidebarLink>
      ))}
    </CollapseSection>
  );
}
