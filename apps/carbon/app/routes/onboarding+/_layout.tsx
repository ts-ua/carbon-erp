import { ClientOnly, HStack, IconButton, useColor } from "@carbon/react";
import { Avatar, Grid, GridItem } from "@chakra-ui/react";
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
  return (
    // not sure why we need this ClientOnly, but things break without it
    <ClientOnly fallback={null}>
      {() => (
        <Grid h="100vh" w="100vw" templateColumns="auto 1fr">
          <SidebarPlaceholder />
          <Grid templateRows="auto 1fr" h="full" w="full">
            <TopbarPlaceholder />
            <div>
              <Outlet />
            </div>
          </Grid>
        </Grid>
      )}
    </ClientOnly>
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
      <HStack className="justify-end py-2" spacing={1}>
        <Avatar size="sm" />
      </HStack>
    </GridItem>
  );
}

function SidebarPlaceholder() {
  return (
    <div className="h-full border-r border-border bg-background z-1">
      <IconButton
        aria-label="Home"
        icon={<BsFillHexagonFill />}
        variant="ghost"
        size="lg"
        className="rounded-none"
      />
    </div>
  );
}
