"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, ShieldCheck, UserCheck, Lock } from "lucide-react";
import { ContactForm } from "@/components/ui";
import { CONTACT_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

const messages = { fr: frMessages, en: enMessages };

const guaranteeIcons = [ShieldCheck, UserCheck, Lock];
const guaranteeKeys = ["discreet", "simple", "protected"] as const;

export function ContactPageContent() {
  const { locale } = useLanguage();
  const t = messages[locale as keyof typeof messages]?.contactPage || messages.fr.contactPage;

  const guarantees = guaranteeKeys.map((key, index) => ({
    icon: guaranteeIcons[index],
    title: t.guarantees[key].title,
    description: t.guarantees[key].description,
  }));

  return (
    <>
      {/* Hero Section - Minimal, elegant with focus on discretion */}
      <section className="relative min-h-[70vh] bg-dark overflow-hidden flex items-center">
        {/* Subtle diagonal lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 100px,
              #aa864a 100px,
              #aa864a 101px
            )`
          }}
        />

        {/* Floating envelope icon */}
        <div className="absolute top-1/2 right-10 lg:right-32 -translate-y-1/2 pointer-events-none hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.03, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2 }}
          >
            <MessageCircle className="w-[400px] h-[400px] text-gold" strokeWidth={0.5} />
          </motion.div>
        </div>

        {/* Decorative corner frame */}
        <div className="absolute top-20 left-10 w-32 h-32 border-l-2 border-t-2 border-gold/20 hidden lg:block" />
        <div className="absolute bottom-20 right-10 w-32 h-32 border-r-2 border-b-2 border-gold/20 hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 border border-gold/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-gold" />
                </div>
                <div className="h-px flex-1 max-w-[80px] bg-gold/30" />
                <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                  {t.badge}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-8 leading-[1.1]">
                {t.title}{" "}
                <span className="text-gold-gradient">{t.titleHighlight}</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl">
                {t.subtitle}{" "}
                <span className="text-gray-300">{t.subtitleHighlight}</span>
              </p>
            </motion.div>

            {/* Guarantees - Horizontal pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              {guarantees.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 px-5 py-3 bg-dark-lighter/50 border border-gold/10 hover:border-gold/30 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gold-light" />
                    <span className="text-gray-300 text-sm">{item.title}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </section>

      {/* Main Contact Section */}
      <section className="py-24 bg-dark-lighter relative overflow-hidden">
        {/* Subtle radial background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Left - Form (larger) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="relative">
                {/* Corner decoration */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-gold/30 hidden lg:block" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-gold/30 hidden lg:block" />

                <ContactForm animate={false} />
              </div>
            </motion.div>

            {/* Right - Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="lg:sticky lg:top-32">
                <h2 className="font-serif text-3xl text-white mb-10">
                  {t.info.title}
                </h2>

                {/* Contact cards - Stacked */}
                <div className="space-y-4">
                  {/* Address */}
                  <div className="group p-6 bg-dark border border-gold/10 hover:border-gold/30 transition-all">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <MapPin className="w-5 h-5 text-gold-light" />
                      </div>
                      <div>
                        <h3 className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                          {t.info.address}
                        </h3>
                        <p className="text-gray-300 font-light whitespace-pre-line leading-relaxed">
                          {CONTACT_INFO.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group p-6 bg-dark border border-gold/10 hover:border-gold/30 transition-all">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Phone className="w-5 h-5 text-gold-light" />
                      </div>
                      <div>
                        <h3 className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                          {t.info.phone}
                        </h3>
                        <a
                          href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                          className="text-gray-300 font-light hover:text-gold-light transition-colors"
                        >
                          {CONTACT_INFO.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group p-6 bg-dark border border-gold/10 hover:border-gold/30 transition-all">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Mail className="w-5 h-5 text-gold-light" />
                      </div>
                      <div>
                        <h3 className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                          {t.info.email}
                        </h3>
                        <a
                          href={`mailto:${CONTACT_INFO.email}`}
                          className="text-gray-300 font-light hover:text-gold-light transition-colors"
                        >
                          {CONTACT_INFO.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="group p-6 bg-dark border border-gold/10 hover:border-gold/30 transition-all">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Clock className="w-5 h-5 text-gold-light" />
                      </div>
                      <div>
                        <h3 className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                          {t.info.hours}
                        </h3>
                        <p className="text-gray-300 font-light whitespace-pre-line leading-relaxed">
                          {t.info.hoursValue}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidentiality note */}
                <div className="mt-8 p-5 border-l-2 border-gold/40 bg-gold/5">
                  <div className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-gold mt-1 shrink-0" />
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {t.confidentialityNote}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section - Full width with overlay */}
      <section className="relative h-[400px] lg:h-[500px] bg-dark">
        {/* Map */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.0158746985795!2d2.3063!3d48.8719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc5a3d9b1e7%3A0x9d0a8c8c8c8c8c8c!2s50%20Av.%20des%20Champs-%C3%89lys%C3%A9es%2C%2075008%20Paris!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation Ophir Estate"
          className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        />

        {/* Overlay card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12"
        >
          <div className="p-6 lg:p-8 bg-dark/95 backdrop-blur-sm border border-gold/20 max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="text-gold-light text-sm uppercase tracking-wider font-semibold">{t.map.title}</span>
            </div>
            <p className="text-white font-serif text-lg mb-1">50 Avenue des Champs-Élysées</p>
            <p className="text-gray-400 font-light">75008 Paris, France</p>
          </div>
        </motion.div>

        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-dark-lighter to-transparent pointer-events-none" />
      </section>
    </>
  );
}
