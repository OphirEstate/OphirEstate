"use client";

import { motion } from "framer-motion";
import { Building2, Users, Globe, Landmark } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const pillarIcons = [
  { icon: Building2, key: "acquisition" },
  { icon: Users, key: "transmission" },
  { icon: Globe, key: "allocation" },
  { icon: Landmark, key: "patrimoine" },
];

export function Introduction() {
  const { t } = useLanguage();
  return (
    <section id="maison-patrimoniale" className="py-32 bg-dark-lighter relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-20 right-20 w-64 h-64 border border-gold/5 rounded-full hidden lg:block" />
      <div className="absolute bottom-20 left-20 w-48 h-48 border border-gold/5 rounded-full hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                {t("introduction.label")}
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-10 leading-[1.1]">
              {t("introduction.title")}{" "}
              <span className="text-gold-gradient">{t("introduction.titleHighlight")}</span>
            </h2>

            <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
              <p>{t("introduction.paragraph1")}</p>
              <p>{t("introduction.paragraph2")}</p>
            </div>
          </motion.div>

          {/* Right - Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-4">
              {pillarIcons.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="p-8 bg-dark border border-gold/10 hover:border-gold/30 transition-all text-center">
                      <div className="w-14 h-14 mx-auto bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                        <Icon className="w-7 h-7 text-gold-light" />
                      </div>
                      <span className="text-gray-300 text-sm uppercase tracking-wider">
                        {t(`introduction.pillars.${pillar.key}`)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
