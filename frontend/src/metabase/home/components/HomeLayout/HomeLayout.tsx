import type { ReactNode } from "react";
import { useState } from "react";
import { t } from "ttag";

import { useHasTokenFeature } from "metabase/common/hooks";
import { getUser, getUserIsAdmin } from "metabase/current-user";
import { useSelector } from "metabase/redux";
import { getLandingPageIllustration } from "metabase/selectors/whitelabel";
import { useSetting } from "metabase/settings";
import { Box, Button, Icon, Tooltip } from "metabase/ui";

import { CustomHomePageModal } from "../CustomHomePageModal";
import { EmbeddingHubHomePage } from "../EmbeddingHubHomePage";
import { HomeGreeting } from "../HomeGreeting";

interface HomeLayoutProps {
  children?: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps): ReactNode => {
  const [showModal, setShowModal] = useState(false);
  const isAdmin = useSelector(getUserIsAdmin);
  const landingPageIllustration = useSelector(getLandingPageIllustration);

  const user = useSelector(getUser);
  const embeddingHomepage = useSetting("embedding-homepage");
  const isSimpleEmbeddingAvailable = useHasTokenFeature("embedding_simple");

  if (
    embeddingHomepage === "visible" &&
    user?.is_superuser &&
    isSimpleEmbeddingAvailable
  ) {
    return <EmbeddingHubHomePage />;
  }

  return (
    <Box
      data-testid="home-page"
      pos="relative"
      p={{
        base: "1rem",
        md: "2.5rem 4rem",
        lg: "3rem 6rem",
        xl: "4rem 8rem",
      }}
      mih="100%"
      bg="background_page-secondary"
    >
      {landingPageIllustration && !landingPageIllustration.isDefault && (
        <Box
          data-testid="landing-page-illustration"
          pos="absolute"
          inset={0}
          bgsz="100% auto"
          bgr="no-repeat"
          bgp="bottom"
          style={{
            backgroundImage: `url(${landingPageIllustration.src})`,
          }}
        />
      )}
      <HomeGreeting />
      {isAdmin && (
        <Tooltip label={t`Pick a dashboard to serve as the homepage`}>
          <Button
            pos="absolute"
            top="0.75rem"
            right="1rem"
            variant="subtle"
            leftSection={<Icon name="pencil" />}
            onClick={() => setShowModal(true)}
          >
            {t`Customize`}
          </Button>
        </Tooltip>
      )}
      <Box
        pos="relative"
        mt={{
          base: "2rem",
          md: "3rem",
        }}
        maw="90rem"
        mx="auto"
      >
        {children}
      </Box>
      <CustomHomePageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </Box>
  );
};
