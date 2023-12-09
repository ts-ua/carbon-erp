import type { AppProps } from "next/app";
import "nextra-theme-docs/style.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import React from "react";
import "../styles.css";

export default function Docs({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.classList.add("relative");
  }, []);

  return (
    <Component
      {...pageProps}
      className={[GeistSans.className, GeistMono.className].join(" ")}
    />
  );
}
