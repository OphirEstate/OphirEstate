"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Button, Logo, LanguageToggle } from "@/components/ui";

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/patrimoine", labelKey: "nav.patrimoine" },
  { href: "/diaspora", labelKey: "nav.diaspora" },
  { href: "/advisory", labelKey: "nav.advisory" },
  { href: "/off-market", labelKey: "nav.offMarket" },
  { href: "/allocation", labelKey: "nav.allocation" },
] as const;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full z-50 bg-dark/90 backdrop-blur-md border-b border-gold/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="flex items-baseline space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-gray-300 hover:text-gold-light transition-colors duration-200"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Toggle & CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageToggle />
            <Link href="/contact">
              <Button>{t("nav.contact")}</Button>
            </Link>
          </div>

          {/* Mobile: Language Toggle & Menu button */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold-light p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark border-t border-gold/20"
          >
            <div className="px-6 py-8 space-y-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-300 hover:text-gold-light transition-colors"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-6">{t("nav.contact")}</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
