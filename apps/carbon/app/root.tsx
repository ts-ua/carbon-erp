// root.tsx
import { Heading, ThemeProvider } from "@carbon/react";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { getBrowserEnv } from "~/config/env";
import Background from "~/styles/background.css";
import NProgress from "~/styles/nprogress.css";
import Tailwind from "~/styles/tailwind.css";

export function links() {
  return [
    { rel: "stylesheet", href: Tailwind },
    { rel: "stylesheet", href: Background },
    { rel: "stylesheet", href: NProgress },
  ];
}

export const meta: MetaFunction = () => {
  return [
    {
      charset: "utf-8",
    },
    {
      title: "Carbon ERP",
    },
    {
      viewport: "width=device-width",
    },
  ];
};

export async function loader() {
  const { SUPABASE_API_URL, SUPABASE_ANON_PUBLIC } = getBrowserEnv();
  return json({
    env: {
      SUPABASE_API_URL,
      SUPABASE_ANON_PUBLIC,
    },
  });
}

function Document({
  children,
  title = "Carbon ERP",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const env = loaderData?.env ?? {};

  return (
    <Document>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(env)}`,
        }}
      />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.data.message ?? error.data
    : error instanceof Error
    ? error.message
    : String(error);

  return (
    <Document title="Error!">
      <ThemeProvider>
        <div className="dark">
          <div className="flex flex-col w-full h-screen bg-zinc-900 items-center justify-center space-y-4">
            <Heading size="display">Something went wrong</Heading>
            <p className="text-foreground">{message}</p>
          </div>
        </div>
      </ThemeProvider>
    </Document>
  );
}
