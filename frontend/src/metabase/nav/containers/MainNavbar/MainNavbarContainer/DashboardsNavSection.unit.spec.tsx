import userEvent from "@testing-library/user-event";

import { setupSearchEndpoints } from "__support__/server-mocks";
import {
  renderWithProviders,
  screen,
  waitForLoaderToBeRemoved,
  within,
} from "__support__/ui";
import { createMockSearchResult } from "metabase-types/api/mocks";

import { DashboardsNavSection } from "./DashboardsNavSection";

describe("DashboardsNavSection", () => {
  it("shows every visible dashboard alphabetically and links directly to it", async () => {
    setupSearchEndpoints([
      createMockSearchResult({ id: 2, model: "dashboard", name: "Sales" }),
      createMockSearchResult({ id: 1, model: "dashboard", name: "Executive" }),
    ]);

    renderWithProviders(
      <DashboardsNavSection
        dashboardItem={{ type: "dashboard", id: 2, url: "/dashboard/2" }}
        onItemSelect={jest.fn()}
      />,
    );
    await waitForLoaderToBeRemoved();

    const section = screen.getByRole("section", { name: "Dashboards" });
    const links = within(section).getAllByRole("listitem");
    expect(links.map((link) => link.textContent)).toEqual([
      "Executive",
      "Sales",
    ]);
    expect(within(section).getByText("Executive").closest("a")).toHaveAttribute(
      "href",
      "/dashboard/1-executive",
    );
    expect(
      within(section).getByRole("listitem", { name: "Sales" }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("is expanded by default and can be collapsed", async () => {
    setupSearchEndpoints([
      createMockSearchResult({ id: 1, model: "dashboard", name: "Executive" }),
    ]);
    renderWithProviders(<DashboardsNavSection onItemSelect={jest.fn()} />);
    await waitForLoaderToBeRemoved();

    const section = screen.getByRole("section", { name: "Dashboards" });
    const toggle = within(section).getByRole("button", { name: /Dashboards/ });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(within(section).getByText("Executive")).toBeInTheDocument();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(within(section).queryByText("Executive")).not.toBeInTheDocument();
  });
});
