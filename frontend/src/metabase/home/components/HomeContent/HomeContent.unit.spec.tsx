import userEvent from "@testing-library/user-event";

import { setupSearchEndpoints } from "__support__/server-mocks";
import {
  renderWithProviders,
  screen,
  waitForLoaderToBeRemoved,
} from "__support__/ui";
import {
  createMockSettingsState,
  createMockState,
} from "metabase/redux/store/mocks";
import type { SearchResult, Settings, User } from "metabase-types/api";
import {
  createMockSearchResult,
  createMockUser,
} from "metabase-types/api/mocks";

import { HomeContent } from "./HomeContent";

interface SetupOpts {
  user?: User;
  results?: SearchResult[];
  settings?: Partial<Settings>;
}

const setup = async ({
  user = createMockUser(),
  results = [],
  settings = {},
}: SetupOpts = {}) => {
  setupSearchEndpoints(results);
  renderWithProviders(<HomeContent />, {
    storeInitialState: createMockState({
      currentUser: user,
      settings: createMockSettingsState(settings),
    }),
  });
  await waitForLoaderToBeRemoved();
};

describe("HomeContent", () => {
  it("segments permission-aware content by type", async () => {
    await setup({
      results: [
        createMockSearchResult({
          id: 3,
          model: "dashboard",
          name: "Sales Dashboard",
        }),
        createMockSearchResult({
          id: 2,
          model: "card",
          name: "Weekly Sales",
        }),
        createMockSearchResult({
          id: 1,
          model: "dataset",
          name: "Sales Model",
        }),
      ],
    });

    expect(
      screen.getByRole("tab", { name: "Dashboards (1)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Questions (1)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Models (1)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sales Dashboard")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("tab", { name: "Questions (1)" }),
    );
    expect(screen.getByText("Weekly Sales")).toBeInTheDocument();
    expect(screen.queryByText("Sales Dashboard")).not.toBeInTheDocument();
  });

  it("shows a useful empty state for each content type", async () => {
    await setup();
    expect(
      screen.getByText("No dashboards are available yet."),
    ).toBeInTheDocument();
  });

  it("keeps the embed-focused homepage for admins when enabled", async () => {
    await setup({
      user: createMockUser({ is_superuser: true }),
      settings: { "embedding-homepage": "visible" },
    });
    expect(screen.getByText("Embedding Metabase")).toBeInTheDocument();
  });
});
