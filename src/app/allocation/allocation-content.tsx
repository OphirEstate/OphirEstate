"use client";

import { motion } from "framer-motion";
import { TrendingUp, PieChart, ShieldCheck, Target, Building, Landmark, Briefcase, Globe2, ArrowUpRight, BarChart3, Layers, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/ui";
import { useLanguage } from "@/lib/language-context";

const pillarKeys = ["diversification", "risk", "liquidity", "projection"] as const;
const pillarIcons = {
  diversification: PieChart,
  risk: ShieldCheck,
  liquidity: TrendingUp,
  projection: Target,
};

const clientKeys = ["familyOffice", "privateBank", "entrepreneurs", "diaspora"] as const;
const clientIcons = {
  familyOffice: Building,
  privateBank: Landmark,
  entrepreneurs: Briefcase,
  diaspora: Globe2,
};

export function AllocationContent() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section - Data-driven, institutional aesthetic */}
      <section className="relative min-h-screen bg-dark overflow-hidden flex items-center">
        {/* Abstract data visualization background */}
        <div className="absolute inset-0">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(to right, #aa864a 1px, transparent 1px),
                               linear-gradient(to bottom, #aa864a 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Animated chart lines - decorative */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="none">
            <motion.path
              d="M0,400 Q200,350 400,380 T800,320 T1200,360 T1600,300 T2000,340"
              fill="none"
              stroke="#aa864a"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,500 Q300,420 600,480 T1200,400 T1800,450"
              fill="none"
              stroke="#e5cb91"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
            />
          </svg>

          {/* Floating data points */}
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gold/30 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gold/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 right-1/5 w-4 h-4 bg-gold/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Large decorative percentage */}
        <div className="absolute top-1/2 right-10 lg:right-20 -translate-y-1/2 pointer-events-none hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.03, x: 0 }}
            transition={{ duration: 1 }}
            className="font-serif text-[25vw] text-gold leading-none"
          >
            %
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge with chart icon */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 border border-gold/30 flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-gold" />
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-gold/50 to-transparent" />
                <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                  {t("allocation.hero.badge")}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white mb-10 leading-[1.05]">
                {t("allocation.hero.title")}{" "}
                <span className="text-gold-gradient">{t("allocation.hero.titleHighlight")}</span>
              </h1>

              <div className="space-y-6 text-xl text-gray-400 font-light leading-relaxed max-w-3xl">
                <p>
                  {t("allocation.hero.paragraph1")}{" "}
                  <span className="text-white">{t("allocation.hero.paragraph1Highlight")}</span>.
                </p>
                <p>
                  {t("allocation.hero.paragraph2")}
                </p>
              </div>

              {/* Quick metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 flex flex-wrap gap-8"
              >
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="w-5 h-5 text-gold" />
                  <span className="text-gray-300">{t("allocation.hero.metrics.yield")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="w-5 h-5 text-gold" />
                  <span className="text-gray-300">{t("allocation.hero.metrics.vision")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="w-5 h-5 text-gold" />
                  <span className="text-gray-300">{t("allocation.hero.metrics.approach")}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom progress line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-lighter">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-gold via-gold-light to-gold/50"
          />
        </div>
      </section>

      {/* NEW: Allocation Patrimoniale Section */}
      <section className="py-32 bg-dark relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-gold/10 to-transparent" />
        <div className="absolute top-1/2 right-0 w-1/3 h-px bg-gradient-to-l from-gold/10 to-transparent" />

        {/* Large decorative icon */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden lg:block">
          <Layers className="w-[400px] h-[400px] text-gold" strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gold" />
                <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                  {t("allocation.patrimoniale.label")}
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-10 leading-[1.1]">
                {t("allocation.patrimoniale.title")}{" "}
                <span className="text-gold-gradient">{t("allocation.patrimoniale.titleHighlight")}</span>
              </h2>

              <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
                <p>{t("allocation.patrimoniale.paragraph1")}</p>
                <p className="text-white/90 border-l-2 border-gold/50 pl-6 italic">
                  {t("allocation.patrimoniale.paragraph2")}
                </p>
              </div>
            </motion.div>

            {/* Right - Visual elements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Cards stack */}
              <div className="space-y-4">
                {(["usage", "transmission", "diversification"] as const).map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="flex items-center gap-6 p-6 bg-dark-lighter border border-gold/10 hover:border-gold/30 transition-all">
                      <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0">
                        <span className="font-serif text-2xl text-gold-light">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl text-white group-hover:text-gold-light transition-colors">
                          {t(`allocation.patrimoniale.points.${key}`)}
                        </h3>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gold/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-gold/10 -z-10 hidden lg:block" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section - Dashboard style cards */}
      <section className="py-32 bg-dark-lighter relative overflow-hidden">
        {/* Subtle radial background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t("allocation.pillars.label")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6">
              {t("allocation.pillars.title")}
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              {t("allocation.pillars.subtitle")}
            </p>
          </motion.div>

          {/* Dashboard-style grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {pillarKeys.map((key, index) => {
              const Icon = pillarIcons[key];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="relative h-full bg-dark border border-gold/10 hover:border-gold/30 transition-all duration-500 overflow-hidden">
                    {/* Top metric bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-gold/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    <div className="p-8 lg:p-10">
                      {/* Header with icon and metric */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/10 transition-all">
                          <Icon className="w-8 h-8 text-gold-light" />
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                            {t("allocation.pillars.status")}
                          </span>
                          <span className="text-gold-light font-semibold">
                            {t(`allocation.pillars.${key}.metric`)}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif text-2xl lg:text-3xl text-white mb-4 group-hover:text-gold-light transition-colors">
                        {t(`allocation.pillars.${key}.title`)}
                      </h3>
                      <p className="text-gray-400 leading-relaxed font-light">
                        {t(`allocation.pillars.${key}.description`)}
                      </p>

                      {/* Bottom decorative element */}
                      <div className="mt-8 pt-6 border-t border-gold/10 flex items-center justify-between">
                        <span className="text-xs text-gray-600 uppercase tracking-wider">
                          {t("allocation.pillars.pillar")} {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${i <= index ? 'bg-gold/60' : 'bg-gray-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clients Section - Horizontal scroll style */}
      <section className="py-32 bg-dark relative overflow-hidden">
        {/* Horizontal lines decoration */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none hidden lg:block">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
          <div className="h-px bg-gradient-to-r from-transparent via-gold/5 to-transparent mt-20" />
          <div className="h-px bg-gradient-to-r from-transparent via-gold/5 to-transparent -mt-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
                  {t("allocation.clients.label")}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white">
                  {t("allocation.clients.title")}
                </h2>
              </div>
              <p className="text-xl text-gray-400 font-light max-w-md">
                {t("allocation.clients.subtitle")}
              </p>
            </div>
          </motion.div>

          {/* Client cards - Asymmetric layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {clientKeys.map((key, index) => {
              const Icon = clientIcons[key];
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`${isEven ? 'lg:mt-0' : 'lg:mt-12'}`}
                >
                  <div className="relative group">
                    {/* Connector line */}
                    <div className="absolute -top-6 left-1/2 w-px h-6 bg-gradient-to-b from-transparent to-gold/30 hidden lg:block" />

                    <div className="p-8 bg-dark-lighter border border-gold/10 hover:border-gold/30 transition-all h-full">
                      {/* Number */}
                      <span className="absolute top-4 right-4 font-serif text-4xl text-gold/10 group-hover:text-gold/20 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                        <Icon className="w-6 h-6 text-gold-light" />
                      </div>

                      <h3 className="font-serif text-xl text-white mb-3 group-hover:text-gold-light transition-colors">
                        {t(`allocation.clients.${key}.title`)}
                      </h3>
                      <p className="text-gray-500 text-sm font-light">
                        {t(`allocation.clients.${key}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Contact Section - Split with data visualization */}
      <section className="py-32 bg-dark-footer relative overflow-hidden">
        {/* Abstract chart background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Candlestick-like elements */}
            {[...Array(20)].map((_, i) => (
              <g key={i} transform={`translate(${i * 100 + 50}, 0)`}>
                <line x1="0" y1="100" x2="0" y2="300" stroke="#aa864a" strokeWidth="1" />
                <rect x="-15" y={150 + Math.random() * 50} width="30" height={50 + Math.random() * 50} fill="#aa864a" />
              </g>
            ))}
          </svg>
        </div>

        {/* Radial glow */}
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="sticky top-32">
                <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
                  {t("allocation.contact.label")}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-8">
                  {t("allocation.contact.title")}
                </h2>
                <p className="text-xl text-gray-400 font-light leading-relaxed mb-10">
                  {t("allocation.contact.subtitle")}
                </p>

                {/* Key metrics display */}
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between p-4 bg-dark border border-gold/10">
                    <span className="text-gray-400">{t("allocation.contact.metrics.volume")}</span>
                    <span className="text-gold-light font-semibold">{t("allocation.contact.metrics.volumeValue")}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-dark border border-gold/10">
                    <span className="text-gray-400">{t("allocation.contact.metrics.clients")}</span>
                    <span className="text-gold-light font-semibold">{t("allocation.contact.metrics.clientsValue")}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-dark border border-gold/10">
                    <span className="text-gray-400">{t("allocation.contact.metrics.track")}</span>
                    <span className="text-gold-light font-semibold">{t("allocation.contact.metrics.trackValue")}</span>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-3 text-gray-500">
                  <ShieldCheck className="w-5 h-5 text-gold/60" />
                  <span className="text-sm">{t("allocation.contact.trust")}</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ContactForm animate={false} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
