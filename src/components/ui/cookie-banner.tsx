"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

const translations = {
  fr: {
    description: "Ce site utilise uniquement des cookies essentiels. Aucun tracking.",
    accept: "Compris",
    learnMore: "En savoir plus",
  },
  en: {
    description: "This site only uses essential cookies. No tracking.",
    accept: "Got it",
    learnMore: "Learn more",
  },
};

export function CookieBanner() {
  const { locale } = useLanguage();
  const t = translations[locale as keyof typeof translations] || translations.fr;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ophir-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ophir-cookie-consent", "essential");
    localStorage.setItem("ophir-cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4"
        >
          <div className="max-w-5xl mx-auto">
            <div className="bg-dark-card/95 backdrop-blur-md border border-gold/10 shadow-xl px-4 py-3 md:px-5 md:py-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                {/* Icon + Text */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Cookie className="w-4 h-4 text-gold flex-shrink-0" />
                  <p className="text-gray-400 text-sm">
                    {t.description}{" "}
                    <Link
                      href="/politique-cookies"
                      className="text-gold-light hover:text-gold transition-colors underline underline-offset-2"
                    >
                      {t.learnMore}
                    </Link>
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={handleAccept}
                  className="flex-shrink-0 px-5 py-2 text-sm bg-gradient-to-r from-gold to-gold-light text-dark font-medium hover:opacity-90 transition-opacity"
                >
                  {t.accept}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
