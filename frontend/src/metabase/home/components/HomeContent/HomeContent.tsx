import { useMemo } from "react";
import { t } from "ttag";

import { useSearchQuery } from "metabase/api";
import { LoadingAndErrorWrapper } from "metabase/common/components/LoadingAndErrorWrapper";
import { getUser } from "metabase/current-user";
import { useSelector } from "metabase/redux";
import { useSetting } from "metabase/settings";
import {
  Box,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
} from "metabase/ui";
import * as Urls from "metabase/urls";
import type { SearchModel, SearchResult } from "metabase-types/api";

import { EmbedHomepage } from "../EmbedHomepage";
import { HomeModelCard } from "../HomeModelCard";

const HOME_RESULT_LIMIT = 1000;
const HOME_CARD_LIMIT = 12;

type ContentType = {
  value: "dashboard" | "card" | "dataset" | "metric";
  label: string;
  emptyLabel: string;
  icon: "dashboard" | "bar" | "model" | "metric";
  searchModels: SearchModel[];
};

const CONTENT_TYPES: ContentType[] = [
  {
    value: "dashboard",
    label: t`Dashboards`,
    emptyLabel: t`No dashboards are available yet.`,
    icon: "dashboard",
    searchModels: ["dashboard"],
  },
  {
    value: "card",
    label: t`Questions`,
    emptyLabel: t`No saved questions are available yet.`,
    icon: "bar",
    searchModels: ["card"],
  },
  {
    value: "dataset",
    label: t`Models`,
    emptyLabel: t`No models are available yet.`,
    icon: "model",
    searchModels: ["dataset"],
  },
  {
    value: "metric",
    label: t`Metrics`,
    emptyLabel: t`No metrics are available yet.`,
    icon: "metric",
    searchModels: ["metric"],
  },
];

export const HomeContent = (): JSX.Element | null => {
  const user = useSelector(getUser);
  const embeddingHomepage = useSetting("embedding-homepage");
  const { data, isLoading, error } = useSearchQuery({
    models: CONTENT_TYPES.flatMap(({ searchModels }) => searchModels),
    archived: false,
    context: "browse",
    limit: HOME_RESULT_LIMIT,
  });

  const contentByType = useMemo(() => {
    const results = [...(data?.data ?? [])].sort((left, right) =>
      left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
    );

    return Object.fromEntries(
      CONTENT_TYPES.map(({ value, searchModels }) => [
        value,
        results.filter(({ model }) => searchModels.includes(model)),
      ]),
    ) as Record<ContentType["value"], SearchResult[]>;
  }, [data?.data]);

  if (!user || isLoading) {
    return <LoadingAndErrorWrapper loading />;
  }

  if (error) {
    return <LoadingAndErrorWrapper error={error} />;
  }

  if (embeddingHomepage === "visible" && user.is_superuser) {
    return <EmbedHomepage />;
  }

  return (
    <Stack gap="xl">
      <Box>
        <Title order={2}>{t`Browse your analytics`}</Title>
        <Text c="text-secondary" mt="xs">
          {t`Jump straight to the dashboards, questions, models, and metrics available to you.`}
        </Text>
      </Box>

      <Tabs defaultValue="dashboard" keepMounted={false}>
        <Tabs.List aria-label={t`Content types`}>
          {CONTENT_TYPES.map(({ value, label }) => (
            <Tabs.Tab key={value} value={value}>
              {label} ({contentByType[value].length})
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {CONTENT_TYPES.map(({ value, label, emptyLabel, icon }) => {
          const items = contentByType[value];
          return (
            <Tabs.Panel key={value} value={value} pt="xl">
              <Group justify="space-between" mb="md">
                <Title order={3}>{label}</Title>
                {items.length > HOME_CARD_LIMIT && (
                  <Button
                    component="a"
                    href={`/search?type=${value}`}
                    variant="subtle"
                  >
                    {t`View all`}
                  </Button>
                )}
              </Group>

              {items.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {items.slice(0, HOME_CARD_LIMIT).map((item) => (
                    <HomeModelCard
                      key={`${item.model}:${item.id}`}
                      title={item.name}
                      icon={{ name: icon }}
                      url={Urls.modelToUrl(item)}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Text c="text-secondary" py="xl">
                  {emptyLabel}
                </Text>
              )}
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Stack>
  );
};
