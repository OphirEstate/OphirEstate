"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";
import { STATS, SECTION_TEXTS } from "@/lib/constants";

export function Philosophy() {
  const { philosophy } = SECTION_TEXTS;

  return (
    <section id="vision" className="py-32 bg-dark relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold gradient-blur" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-light gradient-blur" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-sm border border-gold/20">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop"
                alt="Détails intérieurs"
                fill
                className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
            {/* Overlapping card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-10 -right-10 bg-dark-footer p-10 border border-gold/20 max-w-sm shadow-2xl z-20 hidden md:block"
            >
              <Quote className="text-gold-light w-8 h-8 mb-6" />
              <p className="font-serif text-2xl italic text-gray-200 leading-normal">
                &quot;{philosophy.quote}&quot;
              </p>
              <p className="mt-6 text-gold text-sm uppercase tracking-[0.2em] font-medium">
                {philosophy.quoteAuthor}
              </p>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-5xl md:text-6xl tracking-tight text-white mb-10 leading-[1.1]">
              {philosophy.title} <br />
              <span className="text-gold-gradient">{philosophy.titleHighlight}</span>
            </h2>
            <div className="space-y-8 text-xl text-gray-400 font-light leading-relaxed">
              {philosophy.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-2 gap-12 border-t border-gold/20 pt-10">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <span className="block text-5xl font-serif text-gold-light mb-2">
                    {stat.value}
                  </span>
                  <span className="text-lg text-gray-500 font-medium uppercase tracking-wide">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
