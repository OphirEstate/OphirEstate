"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Show splash screen for 1.5 seconds on every page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until mounted or if loading is done
  if (!isMounted || !isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-dark flex items-center justify-center"
        >
          {/* Background subtle gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-lighter via-dark to-dark" />

          {/* Logo container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image
                src="/images/Icon-OphirEstate.png"
                alt="Ophir Estate"
                width={180}
                height={180}
                className="w-36 h-36 md:w-44 md:h-44 object-contain"
                priority
              />
            </motion.div>

            {/* Animated loading bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-12 w-56 h-[2px] bg-gold/20 overflow-hidden origin-center"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-gold to-transparent"
              />
            </motion.div>

            {/* Brand name */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
              className="mt-8 text-gold/70 text-sm uppercase tracking-[0.5em] font-light"
            >
              Ophir Estate
            </motion.p>
          </div>
        </motion.div>
    </AnimatePresence>
  );
}
