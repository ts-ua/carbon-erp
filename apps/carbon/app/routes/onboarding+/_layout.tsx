import { useColor } from "@carbon/react";
import {
  Avatar,
  Box,
  Grid,
  GridItem,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { BsFillHexagonFill } from "react-icons/bs";
import { getLocationsList } from "~/modules/resources";
import { getCompany } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { onboardingSequence, path } from "~/utils/path";

import type { ShouldRevalidateFunction } from "@remix-run/react";

export const shouldRevalidate: ShouldRevalidateFunction = () => true;

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    create: "settings",
  });

  const [company, locations] = await Promise.all([
    getCompany(client),
    getLocationsList(client),
  ]);
  // we don't need to do onboarding if we have a company name or locations
  if (company.data?.name && locations.data?.length) {
    return redirect(path.to.authenticatedRoot);
  }

  const pathname = new URL(request.url).pathname;
  const pathIndex = onboardingSequence.findIndex((p) => p === pathname);

  const previousPath =
    pathIndex === 0 ? undefined : onboardingSequence[pathIndex - 1];

  const nextPath =
    pathIndex === onboardingSequence.length - 1
      ? path.to.authenticatedRoot
      : onboardingSequence[pathIndex + 1];

  return {
    currentIndex: pathIndex,
    onboardingSteps: onboardingSequence.length,
    previousPath,
    nextPath,
  };
}

export default function OnboardingLayout() {
  // const { currentIndex, onboardingSteps } = useOnboarding();

  return (
    <Grid h="100vh" w="100vw" templateColumns="auto 1fr">
      <SidebarPlaceholder />
      <Grid templateRows="auto 1fr" h="full" w="full">
        <TopbarPlaceholder />
        <div>
          <Outlet />
        </div>
      </Grid>
    </Grid>
  );
}

function TopbarPlaceholder() {
  return (
    <GridItem
      bg={useColor("white")}
      borderBottom={1}
      borderBottomColor={useColor("gray.200")}
      borderBottomStyle="solid"
      display="grid"
      gap={4}
      gridTemplateColumns="1fr"
      position="sticky"
      px={4}
      top={0}
      zIndex={1}
    >
      <HStack py={2} justifyContent="end" spacing={1}>
        <Avatar size="sm" />
      </HStack>
    </GridItem>
  );
}

function SidebarPlaceholder() {
  return (
    <Box
      h="full"
      borderRight={1}
      borderRightColor={useColor("gray.200")}
      borderRightStyle="solid"
      background={useColor("white")}
      zIndex={1}
    >
      <IconButton
        aria-label="Home"
        variant="ghost"
        size="lg"
        icon={<BsFillHexagonFill />}
        position="sticky"
        top={0}
        mb={4}
      />
    </Box>
  );
}
