"use client";

import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex flex-col relative overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/[0.03] via-transparent to-transparent" />

      {/* Subtle decorative lines */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/5 to-transparent" />

      {/* Header with logo */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 py-8 px-6"
      >
        <Link href="/" className="inline-block">
          <Image
            src="/images/Logo-bannière-OphirEstate-Rogner.png"
            alt="Ophir Estate"
            width={160}
            height={50}
            className="h-12 w-auto"
          />
        </Link>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 number */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-6"
          >
            <span className="font-serif text-[120px] md:text-[180px] lg:text-[220px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold/30 to-gold/5 select-none">
              404
            </span>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-6">
              Page <span className="text-gold-gradient italic">introuvable</span>
            </h1>

            <p className="text-gray-400 text-lg font-light leading-relaxed mb-12 max-w-md mx-auto">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-dark font-semibold transition-opacity duration-300 hover:opacity-90"
            >
              <Home className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-3 px-8 py-4 border border-gold/30 text-gold-light transition-colors duration-300 hover:border-gold/50"
            >
              <Search className="w-5 h-5" />
              <span>Nous contacter</span>
            </Link>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-16 pt-10 border-t border-gold/10"
          >
            <p className="text-gray-600 text-xs uppercase tracking-[0.2em] mb-6">
              Liens utiles
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { href: "/patrimoine", label: "Patrimoine" },
                { href: "/diaspora", label: "Diaspora" },
                { href: "/advisory", label: "Advisory" },
                { href: "/allocation", label: "Allocation" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gold-light transition-colors duration-300 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 py-8"
      >
        <p className="text-center text-gray-700 text-xs">
          © {new Date().getFullYear()} Ophir Estate
        </p>
      </motion.footer>
    </div>
  );
}
