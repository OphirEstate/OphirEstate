"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Landmark, TrendingUp, Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const featureIcons = [
  { icon: Landmark, key: "pierre" },
  { icon: TrendingUp, key: "famille" },
  { icon: Shield, key: "heritage" },
];

export function ParisPatrimoine() {
  const { t } = useLanguage();
  return (
    <section className="py-32 bg-dark relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1920&auto=format&fit=crop"
          alt="Paris architecture"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/80" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t("parisPatrimoine.label")}
            </span>

            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-8 leading-[1.1]">
              {t("parisPatrimoine.title")}{" "}
              <span className="text-gold-gradient">{t("parisPatrimoine.titleHighlight")}</span>
            </h2>

            <p className="text-xl text-gray-400 font-light leading-relaxed mb-12">
              {t("parisPatrimoine.description")}
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6">
              {featureIcons.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 mx-auto border border-gold/30 rounded-full flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-gold-light" />
                    </div>
                    <span className="text-white font-medium block mb-1">
                      {t(`parisPatrimoine.features.${feature.key}.label`)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {t(`parisPatrimoine.features.${feature.key}.description`)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5]">
              {/* Main image */}
              <div className="absolute inset-0 border border-gold/20 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=800&auto=format&fit=crop"
                  alt="Paris Haussmannien"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-gold/30 -z-10" />
              {/* Stats overlay */}
              <div className="absolute -bottom-6 -left-6 bg-dark/95 backdrop-blur-sm p-6 border border-gold/20">
                <span className="text-4xl font-serif text-gold-light block">1+</span>
                <span className="text-gray-400 text-sm uppercase tracking-wider">{t("parisPatrimoine.stats")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
