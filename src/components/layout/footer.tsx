"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
};

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/patrimoine", labelKey: "nav.patrimoine" },
  { href: "/diaspora", labelKey: "nav.diaspora" },
  { href: "/advisory", labelKey: "nav.advisory" },
  { href: "/off-market", labelKey: "nav.offMarket" },
  { href: "/allocation", labelKey: "nav.allocation" },
] as const;

const LEGAL_ITEMS = [
  { href: "/mentions-legales", labelKey: "footer.legalLinks.mentions" },
  { href: "/conditions-utilisation", labelKey: "footer.legalLinks.terms" },
  { href: "/politique-confidentialite", labelKey: "footer.legalLinks.privacy" },
  { href: "/politique-cookies", labelKey: "footer.legalLinks.cookies" },
  { href: "/clause-off-market", labelKey: "footer.legalLinks.offMarket" },
] as const;

// Composant Accordion pour mobile
interface FooterAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FooterAccordion({ title, children, defaultOpen = false }: FooterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gold/10 md:border-none">
      {/* Header - Cliquable sur mobile uniquement */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 md:py-0 md:justify-center md:cursor-default"
      >
        <h4 className="text-gold-light/80 text-[11px] font-medium uppercase tracking-[0.2em] md:mb-6">
          {title}
        </h4>
        <ChevronDown
          className={`w-4 h-4 text-gold/60 transition-transform duration-300 md:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Contenu - Animé sur mobile, toujours visible sur desktop */}
      <div className="hidden md:block">
        {children}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2 }}
              className="pb-6"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-footer border-t border-gold/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Top Section - Logo & Tagline */}
          <div className="text-center mb-16">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/Logo-Ophir-Transparent-rogner.png"
                alt="Ophir Estate"
                width={180}
                height={180}
                className="h-32 w-auto mx-auto"
              />
            </Link>
            <p className="text-gray-500 text-sm max-w-md mx-auto font-light leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold/30" />
            <div className="w-1.5 h-1.5 rotate-45 border border-gold/40" />
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold/30" />
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-16 mb-16 max-w-4xl mx-auto">
            {/* Navigation */}
            <FooterAccordion title={t("footer.navigation")}>
              <ul className="space-y-3 text-center">
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-gold-light transition-colors text-sm font-light"
                    >
                      {t(item.labelKey)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </FooterAccordion>

            {/* Contact */}
            <FooterAccordion title={t("footer.contactTitle")}>
              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start justify-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                  <span className="text-gray-500 text-sm font-light whitespace-pre-line leading-relaxed text-left">
                    {CONTACT_INFO.address}
                  </span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="flex items-center justify-center gap-3"
                >
                  <Phone className="w-4 h-4 text-gold/60 shrink-0" />
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="text-gray-500 text-sm font-light hover:text-gold-light transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex items-center justify-center gap-3"
                >
                  <Mail className="w-4 h-4 text-gold/60 shrink-0" />
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-gray-500 text-sm font-light hover:text-gold-light transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </motion.li>
              </ul>
            </FooterAccordion>

            {/* Legal */}
            <FooterAccordion title={t("footer.legal")}>
              <ul className="space-y-3 text-center">
                {LEGAL_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-gold-light transition-colors text-sm font-light"
                    >
                      {t(item.labelKey)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            {SOCIAL_LINKS.map((social) => {
              const Icon = iconMap[social.icon];
              return (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gray-500 hover:text-gold-light hover:border-gold/40 transition-all duration-300"
                  aria-label={social.icon}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 mt-2 border-t border-gray-800/50">
            <p className="text-gray-600 text-xs font-light tracking-wide">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>

        </motion.div>
      </div>
    </footer>
  );
}
