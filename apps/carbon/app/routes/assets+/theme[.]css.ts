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

  const {
    primaryBackgroundLight,
    primaryForegroundLight,
    accentBackgroundLight,
    accentForegroundLight,
    primaryBackgroundDark,
    primaryForegroundDark,
    accentBackgroundDark,
    accentForegroundDark,
  } = theme.data;

  console.log(theme.data);

  let css = `
  :root {
    --primary: ${primaryBackgroundLight};
    --primary-foreground: ${primaryForegroundLight};
    --accent: ${accentBackgroundLight};
    --accent-foreground: ${accentForegroundLight};
  }

  .dark {
    --primary: ${primaryBackgroundDark};
    --primary-foreground: ${primaryForegroundDark};
    --accent: ${accentBackgroundDark};
    --accent-foreground: ${accentForegroundDark};
  }
  `;

  return new Response(css, {
    headers: {
      "Content-Type": "text/css",
    },
  });
}
