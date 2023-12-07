"use client";

import { clamp, motion } from "framer-motion";
import Head from "next/head";
import React from "react";
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

function Hero() {
  const { height } = useWindowSize();

  if (!height) return null;
  return (
    <Sticky
      cover
      height={height}
      render={({ progress }) => {
        const blur = {
          filter: `blur(${progress * 5}px)`,
          opacity: 1 - progress,
        };

        const scale = {
          transform: `scale(${clamp(0.9, 1.1, 1.1 - progress * 0.3)})`,
        };

        return (
          <div className="flex flex-col justify-between text-center">
            <div style={blur}>
              <motion.h1
                initial={{
                  opacity: 0,
                  scale: 1.2,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                className="max-w-5xl mx-auto nx-text-6xl font-extrabold tracking-tighter leading-[1.1] text-6xl sm:text-7xl lg:nx-text-8xl xl:nx-text-8xl"
              >
                ERP for the builders
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
                Carbon ERP is an open-source ERP starting point
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

      <div>
        {/* <Gradient /> */}
        <Hero />

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            delay: 2.5,
          }}
          className="relative"
        >
          <div className="px-4 py-16 mx-auto sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24">
            <h2 className="nx-text-4xl font-extrabold tracking-tight lg:nx-text-5xl xl:nx-text-6xl lg:text-center dark:text-white">
              Fully customizable and extensible
            </h2>
            <p className="mx-auto mt-4 text-lg font-medium text-black/60 dark:text-white/60 lg:max-w-3xl lg:text-xl lg:text-center">
              We've taken the best of modern, open-source technology and
              combined it into a lightning-fast, easy-to-use, open-source ERP
              system.
            </p>
            <Features />
          </div>
        </motion.div>
      </div>
    </>
  );
}

// function Gradient() {
//   return (
//     <div className="background">
//       <div className="gradient" />
//     </div>
//   );
// }
