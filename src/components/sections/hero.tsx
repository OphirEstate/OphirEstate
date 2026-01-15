"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button, Badge } from "@/components/ui";
import { HERO_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Spring config pour une animation fluide
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Zoom de 1 à 1.3 en fonction du scroll avec spring pour fluidité
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const scale = useSpring(scaleRaw, springConfig);

  const opacityRaw = useTransform(scrollYProgress, [0, 0.8], [0.4, 0.2]);
  const opacity = useSpring(opacityRaw, springConfig);

  return (
    <header
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <motion.div
            style={{ scale }}
            className="absolute inset-0 origin-center"
          >
            <motion.div style={{ opacity }} className="absolute inset-0">
              <Image
                src={HERO_CONFIG.backgroundImage}
                alt={HERO_CONFIG.backgroundAlt}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/50 to-dark" />
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(36,38,53,0.4)_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 pb-32 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Badge className="mb-10">
            <span className="w-2 h-2 rounded-full bg-gold-light" />
            <span className="text-sm font-medium text-gold-light tracking-widest uppercase">
              {t("hero.badge")}
            </span>
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight text-white mb-8 leading-[1.1]"
        >
          {t("hero.titleLine1")} <span className="text-gold-gradient italic">{t("hero.highlight1")}</span>,
          <br />
          {t("hero.titleLine2")} <span className="text-gold-gradient italic">{t("hero.highlight2")}</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Button size="lg" className="w-full md:w-auto font-semibold">
            {t("hero.ctaPrimary")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full md:w-auto group flex items-center gap-3"
          >
            {t("hero.ctaSecondary")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* Decorative Scroll Down - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center gap-3 z-10 hidden md:flex"
      >
        <span className="text-xs tracking-[0.3em] text-gold-light uppercase font-medium">
          {t("hero.scroll")}
        </span>
        <motion.div
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-20 bg-gradient-to-b from-gold-light to-transparent origin-top"
        />
      </motion.div>
    </header>
  );
}
