"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Globe, PiggyBank } from "lucide-react";
import { ContactForm } from "@/components/ui";
import { useLanguage } from "@/lib/language-context";

const audienceIcons = [
  { icon: Users, key: "families" },
  { icon: Users, key: "heirs" },
  { icon: Briefcase, key: "entrepreneurs" },
  { icon: Globe, key: "diaspora" },
  { icon: PiggyBank, key: "capital" },
];

export function Vocation() {
  const { t } = useLanguage();
  return (
    <section className="py-32 bg-dark-lighter relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

      {/* Decorative frame */}
      <div className="absolute inset-10 lg:inset-20 border border-gold/5 pointer-events-none hidden lg:block" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 border border-gold/30 bg-dark/50 mb-10">
            <div className="w-2 h-2 bg-gold rounded-full" />
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">
              {t("vocation.label")}
            </span>
          </div>

          {/* Main text */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-white mb-10 leading-[1.2] max-w-4xl mx-auto">
            {t("vocation.title")}{" "}
            <span className="text-gold-gradient">{t("vocation.titleHighlight")}</span>{" "}
            {t("vocation.titleEnd")}
          </h2>

          {/* Audiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {audienceIcons.map((audience) => {
              const Icon = audience.icon;
              return (
                <div
                  key={audience.key}
                  className="flex items-center gap-2 px-4 py-2 bg-dark border border-gold/10 hover:border-gold/30 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gold-light" />
                  <span className="text-gray-300 text-sm">{t(`vocation.audiences.${audience.key}`)}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <ContactForm animate={false} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
