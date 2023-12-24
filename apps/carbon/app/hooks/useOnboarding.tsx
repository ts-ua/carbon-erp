import { useNavigate } from "@remix-run/react";
import { path } from "~/utils/path";
import { useRouteData } from "./useRouteData";

export function useOnboarding() {
  const routeData = useRouteData<{
    currentIndex: number;
    onboardingSteps: number;
    nextPath: string;
    previousPath: string;
  }>(path.to.onboarding.root);

  const navigate = useNavigate();

  if (!routeData) {
    throw new Error("useOnboarding must be used within an onboarding route");
  }

  return {
    currentIndex: routeData?.currentIndex,
    onboardingSteps: routeData?.onboardingSteps,
    next: routeData?.nextPath,
    previous: routeData?.previousPath,
    onPrevious: routeData?.previousPath
      ? () => navigate(routeData.previousPath)
      : undefined,
  };
}
