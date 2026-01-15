"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Compass, MapPin, Users, Building2 } from "lucide-react";
import Image from "next/image";
import { ContactForm } from "@/components/ui";
import { useLanguage } from "@/lib/language-context";
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

const messages = { fr: frMessages, en: enMessages };

const serviceIcons = [Globe, Shield, Compass];
const serviceKeys = ["context", "role", "crossBorder"] as const;

const highlightIcons = [MapPin, Users, Building2];
const highlightKeys = ["presence", "families", "assets"] as const;

export function DiasporaContent() {
  const { locale } = useLanguage();
  const t = messages[locale as keyof typeof messages]?.diaspora || messages.fr.diaspora;

  const services = serviceKeys.map((key, index) => ({
    icon: serviceIcons[index],
    title: t.services[key].title,
    description: t.services[key].description,
  }));

  const highlights = highlightKeys.map((key, index) => ({
    icon: highlightIcons[index],
    label: t.highlights[key].label,
    value: t.highlights[key].value,
  }));

  return (
    <>
      {/* Hero Section - Asymmetric split with overlapping content */}
      <section className="relative min-h-screen bg-dark overflow-hidden">
        {/* Large background image - right side */}
        <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full">
          <Image
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1920&auto=format&fit=crop"
            alt="Paris Tour Eiffel vue panoramique"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50" />
        </div>

        {/* Decorative vertical line */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

        {/* Content - Left side, overlapping */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="lg:w-1/2 lg:pr-12 pt-32 pb-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Badge */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-gold" />
                  <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                    {t.hero.badge}
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-10 leading-[1.1]">
                  {t.hero.title}{" "}
                  <span className="text-gold-gradient">{t.hero.titleHighlight}</span>
                </h1>

                <div className="space-y-6 text-xl text-gray-400 font-light leading-relaxed">
                  <p>{t.hero.paragraph1}</p>
                  <p>{t.hero.paragraph2}</p>
                </div>

                {/* Stats or highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-12 pt-10 border-t border-gold/20"
                >
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <span className="text-3xl font-serif text-gold-light">40+</span>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">{t.hero.stats.countries}</p>
                    </div>
                    <div>
                      <span className="text-3xl font-serif text-gold-light">100%</span>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">{t.hero.stats.confidential}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
      </section>

      {/* Services Section - Horizontal Cards with Gradient Borders */}
      <section className="py-32 bg-dark-lighter relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 border border-gold/5 rounded-full hidden lg:block" />
        <div className="absolute top-40 right-40 w-32 h-32 border border-gold/10 rounded-full hidden lg:block" />
        <div className="absolute bottom-20 left-20 w-48 h-48 border border-gold/5 rounded-full hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t.approach.badge}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6">
              {t.approach.title}
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              {t.approach.subtitle}
            </p>
          </motion.div>

          {/* Cards - Stacked horizontally */}
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-full lg:w-4/5 ${isEven ? 'lg:pr-20' : 'lg:pl-20'}`}>
                    <div className="relative p-[1px] bg-gradient-to-r from-gold/50 via-gold/20 to-transparent rounded-sm group">
                      <div className="bg-dark p-8 lg:p-12 flex flex-col md:flex-row gap-8 items-start">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center shrink-0 group-hover:from-gold/30 transition-all">
                          <Icon className="w-10 h-10 text-gold-light" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="font-serif text-2xl lg:text-3xl text-white mb-4">
                            {service.title}
                          </h3>
                          <p className="text-gray-400 leading-relaxed text-lg font-light">
                            {service.description}
                          </p>
                        </div>

                        {/* Number */}
                        <div className="hidden lg:block">
                          <span className="font-serif text-7xl text-gold/10">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Highlights bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/20"
          >
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-dark p-8 text-center group hover:bg-dark-lighter transition-colors">
                  <Icon className="w-8 h-8 text-gold-light mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-serif text-white mb-2">{item.value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">{item.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Section - With Globe Pattern */}
      <section className="py-32 bg-dark relative overflow-hidden">
        {/* Globe pattern background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]">
            <svg viewBox="0 0 400 400" className="w-full h-full text-gold">
              <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(60 200 200)" />
              <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(120 200 200)" />
              <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="0.5" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
                {t.contact.badge}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-6">
                {t.contact.title}
              </h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
                {t.contact.subtitle}
              </p>

              {/* Contact points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                  <span className="text-gray-300">{t.contact.points.consultation}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                  <span className="text-gray-300">{t.contact.points.languages}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                  <span className="text-gray-300">{t.contact.points.timezone}</span>
                </div>
              </div>
            </motion.div>

            {/* Right form */}
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
