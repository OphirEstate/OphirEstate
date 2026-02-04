"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Instagram, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

const iconMap: Record<string, typeof Instagram> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
};

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Image
            src="/images/Logo-Ophir-Transparent-rogner.png"
            alt="Ophir Estate"
            width={180}
            height={180}
            className="h-36 w-auto"
            priority
          />
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <div className="w-1.5 h-1.5 rotate-45 border border-gold/50" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/30 bg-dark/50 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold-light/80 text-[11px] font-medium uppercase tracking-[0.2em]">
            Maintenance en cours
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6"
        >
          Nous{" "}
          <span className="italic text-gold-gradient bg-gold-gradient bg-clip-text text-transparent">
            perfectionnons
          </span>
          <br />
          votre expérience
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-gray-400 font-light text-base sm:text-lg leading-relaxed max-w-lg mb-12"
        >
          Notre site fait actuellement l&apos;objet d&apos;améliorations pour mieux vous servir.
          Nous serons de retour très prochainement.
        </motion.p>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center gap-4 mb-10"
        >
          <p className="text-gold-light/80 text-[11px] font-medium uppercase tracking-[0.2em] mb-2">
            Contactez-nous
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-2.5 text-gray-400 hover:text-gold-light transition-colors text-sm font-light"
            >
              <Mail className="w-4 h-4 text-gold/60" />
              {CONTACT_INFO.email}
            </a>
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2.5 text-gray-400 hover:text-gold-light transition-colors text-sm font-light"
            >
              <Phone className="w-4 h-4 text-gold/60" />
              {CONTACT_INFO.phone}
            </a>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex justify-center gap-4 mb-10"
        >
          {SOCIAL_LINKS.map((social) => {
            const Icon = iconMap[social.icon];
            if (!Icon) return null;
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
        </motion.div>

        {/* Decorative bottom divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/30" />
          <div className="w-1.5 h-1.5 rotate-45 border border-gold/40" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/30" />
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-gray-600 text-xs font-light tracking-wide"
        >
          &copy; {new Date().getFullYear()} Ophir Estate. Tous droits r&eacute;serv&eacute;s.
        </motion.p>
      </motion.div>
    </div>
  );
}
