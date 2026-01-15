"use client";

import { motion } from "framer-motion";
import { Search, Briefcase, Key, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { SERVICES, SECTION_TEXTS } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  search: Search,
  briefcase: Briefcase,
  key: Key,
};

interface ServiceCardProps {
  service: (typeof SERVICES)[number];
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = iconMap[service.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="p-10 border border-gold/20 bg-dark-lighter/50 hover:bg-dark-lighter transition-colors group"
    >
      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-10 group-hover:bg-gold/20 transition-colors">
        <Icon className="w-8 h-8 text-gold-light" />
      </div>
      <h3 className="font-serif text-3xl text-white mb-4">{service.title}</h3>
      <p className="text-gray-400 leading-relaxed text-lg font-light">
        {service.description}
      </p>
    </motion.div>
  );
}

export function Services() {
  const { services } = SECTION_TEXTS;

  return (
    <section id="expertise" className="py-32 bg-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label={services.label}
          title={services.title}
          description={services.description}
          align="center"
          className="mb-24"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
