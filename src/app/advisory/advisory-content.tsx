"use client";

import { motion } from "framer-motion";
import {
  Search,
  FileCheck,
  Briefcase,
  PieChart,
  Scale,
  Globe,
  Building,
  Check,
  X,
  ArrowRight
} from "lucide-react";
import { ContactForm } from "@/components/ui";
import { useLanguage } from "@/lib/language-context";
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

const messages = { fr: frMessages, en: enMessages };

const serviceKeys = [
  { icon: Building, key: "localAnalysis" },
  { icon: Search, key: "offMarketSearch" },
  { icon: FileCheck, key: "dueDiligence" },
  { icon: Briefcase, key: "acquisitionMandate" },
  { icon: PieChart, key: "allocation" },
  { icon: Scale, key: "notarialCoordination" },
  { icon: Globe, key: "crossBorder" },
];

export function AdvisoryContent() {
  const { locale } = useLanguage();
  const t = messages[locale as keyof typeof messages]?.advisory || messages.fr.advisory;

  const services = serviceKeys.map(s => ({
    icon: s.icon,
    label: t.services[s.key as keyof typeof t.services]
  }));

  const keywords = [
    t.hero.keywords.structure,
    t.hero.keywords.filter,
    t.hero.keywords.analyze,
    t.hero.keywords.coordinate,
    t.hero.keywords.represent
  ];

  return (
    <>
      {/* Hero Section - Minimal, typography-focused */}
      <section className="relative min-h-screen bg-dark-lighter overflow-hidden flex items-center">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 z-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, #aa864a 1px, transparent 1px),
                               linear-gradient(to bottom, #aa864a 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}
          />
          {/* Large decorative text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
            <span className="font-serif text-[20vw] text-gold/[0.03] whitespace-nowrap">
              ADVISORY
            </span>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-32 left-10 hidden lg:block">
          <div className="w-20 h-20 border-l border-t border-gold/20" />
        </div>
        <div className="absolute bottom-32 right-10 hidden lg:block">
          <div className="w-20 h-20 border-r border-b border-gold/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left column - Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 hidden lg:flex flex-col items-center"
            >
              <div className="w-px h-24 bg-gradient-to-b from-transparent to-gold/40" />
              <div className="my-6 w-3 h-3 rotate-45 border border-gold/60" />
              <span className="text-gold text-xs uppercase tracking-[0.3em] writing-mode-vertical transform rotate-180"
                style={{ writingMode: 'vertical-rl' }}>
                {t.hero.badge}
              </span>
              <div className="w-px h-24 bg-gradient-to-b from-gold/40 to-transparent mt-6" />
            </motion.div>

            {/* Center column - Main content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8"
            >
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block lg:hidden">
                {t.hero.badge}
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white mb-12 leading-[1.05]">
                {t.hero.title}{" "}
                <span className="text-gold-gradient">{t.hero.titleHighlight}</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-gray-400 font-light leading-relaxed">
                <p>{t.hero.paragraph1}</p>
                <p>{t.hero.paragraph2}</p>
              </div>

              {/* Key words */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 flex flex-wrap gap-4"
              >
                {keywords.map((word) => (
                  <span
                    key={word}
                    className="px-5 py-2 border border-gold/20 text-gold-light text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors"
                  >
                    {word}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right column - Visual element */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 hidden lg:block"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border border-gold/30 rotate-45 flex items-center justify-center">
                  <div className="w-8 h-8 border border-gold/50 rotate-0" />
                </div>
                <div className="w-px h-32 bg-gradient-to-b from-gold/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/10" />
      </section>

      {/* Services Section - Two Column Comparison with Unique Layout */}
      <section className="py-32 bg-dark relative overflow-hidden">
        {/* Diagonal line decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 w-px h-[200%] bg-gradient-to-b from-transparent via-gold/10 to-transparent transform -rotate-12 origin-top" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t.positioning.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white max-w-3xl">
              {t.positioning.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Ce que nous faisons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-gold/20 flex items-center justify-center">
                  <Check className="w-7 h-7 text-gold-light" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-white">
                    {t.positioning.whatWeDo.title}
                  </h3>
                  <p className="text-sm text-gold/60 uppercase tracking-wider mt-1">{t.positioning.whatWeDo.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.05 * index }}
                      className="group"
                    >
                      <div className="flex items-center gap-4 p-4 bg-dark-lighter/50 border-l-2 border-transparent hover:border-gold/50 hover:bg-dark-lighter transition-all">
                        <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                          <Icon className="w-5 h-5 text-gold-light" />
                        </div>
                        <span className="text-gray-300 font-light flex-1">
                          {service.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gold/0 group-hover:text-gold/60 transition-all transform group-hover:translate-x-1" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Ce que nous ne faisons pas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:pt-20"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-gray-800/50 flex items-center justify-center">
                  <X className="w-7 h-7 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-white">
                    {t.positioning.whatWeDont.title}
                  </h3>
                  <p className="text-sm text-gray-600 uppercase tracking-wider mt-1">{t.positioning.whatWeDont.subtitle}</p>
                </div>
              </div>

              <div className="relative">
                {/* Strikethrough decoration */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700/50 transform -rotate-1" />

                <div className="p-10 lg:p-12 border border-gray-800/50 bg-dark-lighter/30 relative">
                  <div className="space-y-6">
                    <p className="text-xl text-gray-500 font-light leading-relaxed line-through decoration-gray-700">
                      {t.positioning.whatWeDont.item1}
                    </p>
                    <p className="text-xl text-gray-500 font-light leading-relaxed line-through decoration-gray-700">
                      {t.positioning.whatWeDont.item2}
                    </p>
                    <p className="text-xl text-gray-500 font-light leading-relaxed line-through decoration-gray-700">
                      {t.positioning.whatWeDont.item3}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notre engagement - highlighted */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 relative"
              >
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/50 to-transparent" />
                <div className="p-8 bg-dark border border-gold/20">
                  <p className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                    {t.positioning.commitment.badge}
                  </p>
                  <p className="text-2xl font-serif text-white leading-relaxed">
                    {t.positioning.commitment.text}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section - Minimal with Geometric Elements */}
      <section className="py-32 bg-dark-footer relative overflow-hidden">
        {/* Geometric background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Multiple rotating squares */}
          <div className="absolute top-20 left-20 w-40 h-40 border border-gold/5 rotate-12 hidden lg:block" />
          <div className="absolute top-32 left-32 w-32 h-32 border border-gold/10 rotate-45 hidden lg:block" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-gold/5 -rotate-12 hidden lg:block" />
          <div className="absolute bottom-32 right-32 w-24 h-24 border border-gold/10 rotate-45 hidden lg:block" />

          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left side - Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="sticky top-32">
                <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
                  {t.contact.badge}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-8">
                  {t.contact.title}
                </h2>
                <p className="text-xl text-gray-400 font-light leading-relaxed mb-10">
                  {t.contact.subtitle}
                </p>

                {/* Process steps */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{t.contact.step1.title}</p>
                      <p className="text-gray-500 text-sm">{t.contact.step1.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{t.contact.step2.title}</p>
                      <p className="text-gray-500 text-sm">{t.contact.step2.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{t.contact.step3.title}</p>
                      <p className="text-gray-500 text-sm">{t.contact.step3.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <ContactForm animate={false} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
