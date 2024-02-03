import { getThemeCode, themes } from "@carbon/utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getTheme } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {});

  const theme = await getTheme(client);
  if (theme.error) {
    return new Response("", {
      headers: {
        "Content-Type": "text/css",
      },
    });
  }

  const selectedThemeName = theme.data?.theme || "zinc";
  const selectedTheme = themes.find(
    (theme) => theme.name === selectedThemeName
  );

  if (!selectedTheme) {
    return new Response("", {
      headers: {
        "Content-Type": "text/css",
      },
    });
  }

  const css = getThemeCode(selectedTheme);

  return new Response(css, {
    headers: {
      "Content-Type": "text/css",
    },
  });
}
