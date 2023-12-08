"use client";

import { clamp, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Head from "next/head";
import React, { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import Features from "../features";
import Sticky from "../sticky";

const fadeIn = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

function Gradient() {
  const { scrollYProgress } = useScroll();

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  const style = {
    opacity: clamp(0, 1, progress * 4),
  };

  return (
    <div className="background" style={style}>
      <div className="gradient" />
    </div>
  );
}

function Hero() {
  const { height } = useWindowSize();

  if (!height) return null;
  return (
    <section>
      <Sticky
        cover
        height={height}
        render={({ progress }) => {
          const blur = {
            filter: `blur(${progress * 3}px)`,
            opacity: 1 - progress * 1.4,
          };

          const scale = {
            transform: `scale(${clamp(0.9, 1.1, 1.1 - progress * 0.3)})`,
          };

          return (
            <div className="flex flex-col justify-between text-center">
              <div style={blur}>
                <motion.h1
                  initial={{
                    filter: "blur(3px)",
                    opacity: 0,
                    scale: 1.2,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                  }}
                  className="max-w-5xl mx-auto nx-text-6xl font-extrabold tracking-tighter leading-[1.1] text-6xl sm:text-7xl lg:nx-text-8xl xl:nx-text-8xl"
                >
                  ERP for{" "}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 dark:from-purple-100 dark:via-purple-200 dark:to-orange-200 bg-clip-text text-transparent">
                    the builders
                  </span>
                </motion.h1>
                <motion.p
                  {...fadeIn}
                  transition={{
                    duration: 0.5,
                    delay: 2.6,
                    ease: "easeInOut",
                  }}
                  className="mt-6 nx-text-xl font-medium leading-tight text-black/60 dark:text-white/60 sm:nx-text-2xl md:nx-text-3xl lg:nx-text-4xl"
                >
                  Carbon is an open-source starting point for business
                </motion.p>
              </div>
              <div
                className="flex fix-flex-col h-32 mt-4 md:mt-0 mb-6 md:mb-0 items-center justify-center gap-3 md:flex-row xl:flex-row"
                style={scale}
              >
                <motion.a
                  {...fadeIn}
                  transition={{
                    duration: 0.5,
                    delay: 3.0,
                    ease: "easeInOut",
                  }}
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-black no-underline bg-zinc-200 border border-transparent rounded-md dark:bg-zinc-800 dark:text-white betterhover:dark:hover:bg-gray-800 betterhover:hover:bg-zinc-300 md:py-3 md:text-lg md:px-10 md:leading-6 fix-width-auto xl:w-auto"
                  href="/learn/introduction"
                >
                  Learn
                </motion.a>
                <motion.a
                  {...fadeIn}
                  transition={{
                    duration: 0.5,
                    delay: 3.2,
                    ease: "easeInOut",
                  }}
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white no-underline bg-zinc-800 border border-transparent rounded-md dark:bg-zinc-100 dark:text-black betterhover:dark:hover:bg-gray-300 betterhover:hover:bg-gray-700 md:py-3 md:text-lg md:px-10 md:leading-6 fix-width-auto xl:w-auto"
                  href="/develop/getting-started"
                >
                  Develop
                </motion.a>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
}

function Overview() {
  return (
    <motion.section id="overview" className="relative" {...fadeIn}>
      <div className="px-4 py-16 mx-auto sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24">
        <h2 className="nx-text-4xl font-extrabold tracking-tight lg:nx-text-5xl xl:nx-text-6xl lg:text-center dark:text-white">
          The{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-100 dark:via-purple-200 dark:to-orange-200 bg-clip-text text-transparent">
            open core
          </span>{" "}
          for your digital operations
        </h2>
        <p className="mx-auto mt-4 text-lg font-medium text-black/60 dark:text-white/60 lg:max-w-3xl lg:text-xl lg:text-center">
          Every business is unique. Carbon gives you the basic building blocks
          to build your own proprietary business systems with the best in
          modern, open-source software.
        </p>
        <Features />
      </div>
    </motion.section>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Carbon ERP</title>
        <meta
          name="og:description"
          content="Carbon is an open-source, high-performance ERP"
        />
      </Head>

      <section>
        <Gradient />
        <Hero />
        <Overview />
      </section>
    </>
  );
}
