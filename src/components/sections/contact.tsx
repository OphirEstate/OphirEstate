"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ContactForm } from "@/components/ui";
import { SECTION_TEXTS } from "@/lib/constants";

export function Contact() {
  const { contact } = SECTION_TEXTS;

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop"
          alt="Bureau"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-dark/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-8">
            {contact.title}
          </h2>
          <p className="text-xl text-gray-300 mb-16 font-light">
            {contact.subtitle}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
