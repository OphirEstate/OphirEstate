"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { locale, setLocale, languages, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-dark-lighter/50 backdrop-blur-sm hover:border-gold/50 transition-colors duration-300"
        aria-label="Select language"
      >
        {currentLanguage.flag && (
          <span className="text-sm">{currentLanguage.flag}</span>
        )}
        <span className="text-xs font-semibold tracking-wider text-gold-light">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-gold-light transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 py-2 min-w-[160px] bg-dark-lighter border border-gold/20 rounded-lg shadow-xl z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gold/10 transition-colors ${
                  locale === lang.code ? "bg-gold/5" : ""
                }`}
              >
                {lang.flag && (
                  <span className="text-base">{lang.flag}</span>
                )}
                <span
                  className={`text-sm font-medium ${
                    locale === lang.code ? "text-gold-light" : "text-gray-400"
                  }`}
                >
                  {lang.label}
                </span>
                {locale === lang.code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
