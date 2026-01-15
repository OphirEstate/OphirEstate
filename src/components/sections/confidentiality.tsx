"use client";

import { motion } from "framer-motion";
import { Lock, Eye, FileCheck, UserCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const featureIcons = [
  { icon: Lock, key: "confidential" },
  { icon: Eye, key: "mandate" },
  { icon: FileCheck, key: "offmarket" },
  { icon: UserCheck, key: "qualified" },
];

export function Confidentiality() {
  const { t } = useLanguage();
  return (
    <section className="py-32 bg-dark relative overflow-hidden">
      {/* Diagonal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            #aa864a 80px,
            #aa864a 81px
          )`,
        }}
      />

      {/* Large lock icon background */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.02] pointer-events-none hidden lg:block">
        <Lock className="w-[500px] h-[500px] text-gold" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t("confidentiality.label")}
            </span>

            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-8 leading-[1.1]">
              {t("confidentiality.title")}{" "}
              <span className="text-gold-gradient">{t("confidentiality.titleHighlight")}</span>
            </h2>

            <p className="text-xl text-gray-400 font-light leading-relaxed mb-10">
              {t("confidentiality.description")}
            </p>

            {/* CTA */}
            <div className="inline-flex items-center gap-4 px-6 py-4 border border-gold/30 bg-gold/5">
              <Lock className="w-5 h-5 text-gold" />
              <span className="text-gray-300">{t("confidentiality.cta")}</span>
            </div>
          </motion.div>

          {/* Right - Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featureIcons.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="p-6 bg-dark-lighter border border-gold/10 hover:border-gold/30 transition-all h-full">
                      <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                        <Icon className="w-6 h-6 text-gold-light" />
                      </div>
                      <h3 className="font-serif text-lg text-white mb-2">
                        {t(`confidentiality.features.${feature.key}.title`)}
                      </h3>
                      <p className="text-gray-500 text-sm font-light leading-relaxed">
                        {t(`confidentiality.features.${feature.key}.description`)}
                      </p>
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
