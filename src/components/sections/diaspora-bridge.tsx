"use client";

import { motion } from "framer-motion";
import { Globe2, ArrowRight, Building } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function DiasporaBridge() {
  const { t } = useLanguage();
  return (
    <section className="py-32 bg-dark-lighter relative overflow-hidden">
      {/* Decorative globe pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <svg viewBox="0 0 400 400" className="w-full h-full text-gold">
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(60 200 200)" />
            <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(120 200 200)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
            {t("diasporaBridge.label")}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-8 max-w-4xl mx-auto leading-[1.1]">
            {t("diasporaBridge.title")}{" "}
            <span className="text-gold-gradient">{t("diasporaBridge.titleHighlight")}</span>
          </h2>
        </motion.div>

        {/* Bridge visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left - Diaspora */}
            <div className="text-center md:text-right">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 border border-gold/20 rounded-full mb-6">
                <Globe2 className="w-10 h-10 text-gold-light" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">{t("diasporaBridge.diaspora.title")}</h3>
              <p className="text-gray-400 font-light">
                {t("diasporaBridge.diaspora.description")}
              </p>
            </div>

            {/* Center - Bridge/Connection */}
            <div className="relative py-8">
              <div className="hidden md:block">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-gold/50 via-gold to-gold/50 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-dark-lighter border-2 border-gold rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-gold" />
                </div>
              </div>
              <div className="md:hidden flex justify-center">
                <div className="w-16 h-16 bg-dark border-2 border-gold rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-gold rotate-90" />
                </div>
              </div>
            </div>

            {/* Right - Paris */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 border border-gold/20 rounded-full mb-6">
                <Building className="w-10 h-10 text-gold-light" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-3">{t("diasporaBridge.paris.title")}</h3>
              <p className="text-gray-400 font-light">
                {t("diasporaBridge.paris.description")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            {t("diasporaBridge.description")}
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="flex items-center gap-3 px-6 py-3 border border-gold/20 bg-dark/50"
            >
              <div className="w-2 h-2 bg-gold rounded-full" />
              <span className="text-gray-300 uppercase tracking-wider text-sm">
                {t(`diasporaBridge.indicator${num}`)}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
