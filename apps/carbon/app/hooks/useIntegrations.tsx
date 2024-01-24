import { useCallback } from "react";
import type { Integration } from "~/modules/settings";
import { path } from "~/utils/path";
import { useRouteData } from "./useRouteData";

export function useIntegrations(): {
  integrations: Integration[];
  has: (id: string) => boolean;
} {
  const data = useRouteData<{
    integrations: Integration[];
  }>(path.to.authenticatedRoot);

  const has = useCallback(
    (id: string) => {
      return data?.integrations.find((i) => i.id === id)?.active ?? false;
    },
    [data?.integrations]
  );

  return {
    integrations: data?.integrations ?? [],
    has,
  };
}
