"use client";

import { motion } from "framer-motion";
import { FileText, Target, Globe, Mail, Briefcase, CreditCard, Lock, Users, AlertTriangle, Copyright, Scale, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

const messages = { fr: frMessages, en: enMessages };

const sectionIcons = [Target, FileText, Globe, Mail, Briefcase, CreditCard, Lock, Users, AlertTriangle, Copyright, Scale, RefreshCw];
const sectionKeys = ["object", "nature", "access", "precontract", "mandate", "regulation", "confidentiality", "international", "liability", "ip", "law", "modification"] as const;

export function TermsContent() {
  const { locale } = useLanguage();
  const t = messages[locale as keyof typeof messages]?.terms || messages.fr.terms;

  const sections = sectionKeys.map((key, index) => ({
    id: index + 1,
    icon: sectionIcons[index],
    title: t.sections[key].title,
    content: t.sections[key].content,
  }));
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-dark overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-10 w-64 h-64 border border-gold/5 rotate-45 hidden lg:block" />
        <div className="absolute bottom-10 left-10 w-32 h-32 border border-gold/5 rotate-12 hidden lg:block" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 border border-gold/30 rounded-full mb-8">
              <FileText className="w-10 h-10 text-gold" />
            </div>

            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">
              {t.hero.badge}
            </span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-8 leading-[1.1]">
              {t.hero.title}{" "}
              <span className="bg-gold-gradient bg-clip-text text-transparent">{t.hero.titleHighlight}</span>
            </h1>

            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-lighter to-transparent" />
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-dark-lighter">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.article
                  key={section.id}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-dark border border-gold/10 hover:border-gold/20 transition-colors p-8 md:p-10">
                    {/* Section number */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-gold flex items-center justify-center">
                      <span className="text-dark font-semibold text-sm">
                        {String(section.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 border border-gold/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gold-light" />
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl text-white">
                        {section.title}
                      </h2>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-gold max-w-none">
                      {section.content.split("\n\n").map((paragraph, pIndex) => (
                        <div key={pIndex} className="mb-4 last:mb-0">
                          {paragraph.startsWith("**") ? (
                            <p className="text-gray-300 leading-relaxed">
                              {paragraph.split("\n").map((line, lIndex) => {
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  return (
                                    <strong key={lIndex} className="text-gold-light block mt-4 mb-2 first:mt-0">
                                      {line.replace(/\*\*/g, "")}
                                    </strong>
                                  );
                                } else if (line.startsWith("**")) {
                                  return (
                                    <strong key={lIndex} className="text-gold-light block mt-4 mb-2 first:mt-0">
                                      {line.replace(/\*\*/g, "")}
                                    </strong>
                                  );
                                } else if (line.startsWith("•")) {
                                  return (
                                    <span key={lIndex} className="block pl-4 py-1 text-gray-400">
                                      <span className="text-gold mr-2">•</span>
                                      {line.substring(2)}
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span key={lIndex} className="block text-gray-400">
                                      {line}
                                    </span>
                                  );
                                }
                              })}
                            </p>
                          ) : paragraph.startsWith("•") ? (
                            <div className="space-y-1">
                              {paragraph.split("\n").map((line, lIndex) => (
                                <p key={lIndex} className="pl-4 text-gray-400">
                                  <span className="text-gold mr-2">•</span>
                                  {line.substring(2)}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                              {paragraph}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center gap-4 p-8 border border-gold/20 bg-dark">
              <FileText className="w-8 h-8 text-gold" />
              <p className="text-gray-400 max-w-md">
                {t.contact.text}{" "}
                <a
                  href="mailto:contact@ophirestate.com"
                  className="text-gold-light hover:text-gold transition-colors"
                >
                  contact@ophirestate.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
