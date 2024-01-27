import { createRemixRoute } from "@trigger.dev/remix";
import { triggerClient } from "~/lib/trigger.server";

// Remix will automatically strip files with side effects
// So you need to *export* your Job definitions like this:
export * from "~/jobs";

export const { action } = createRemixRoute(triggerClient);
