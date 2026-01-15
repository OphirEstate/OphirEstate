"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bed, Bath, Maximize } from "lucide-react";
import Image from "next/image";
import { SectionHeader, Badge } from "@/components/ui";
import { PROPERTIES, SECTION_TEXTS } from "@/lib/constants";

interface PropertyCardProps {
  property: (typeof PROPERTIES)[number];
  index: number;
}

function PropertyCard({ property, index }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[3/4] mb-8">
        <Badge
          variant="outline"
          className="absolute top-6 right-6 z-20 px-5 py-2 rounded-none"
        >
          <span className="text-gold-light text-xs font-semibold uppercase tracking-widest">
            {property.status}
          </span>
        </Badge>
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-serif text-3xl text-white group-hover:text-gold-light transition-colors leading-tight">
            {property.title}
          </h3>
          <span className="text-2xl text-gold font-serif whitespace-nowrap">
            {property.price}
          </span>
        </div>
        <p className="text-gray-400 text-lg font-light">{property.location}</p>
        <div className="flex items-center gap-8 text-gray-500 pt-4 border-t border-gray-800 mt-6">
          <div className="flex items-center gap-3">
            <Bed className="w-5 h-5" />
            <span className="text-lg">{property.beds}</span>
          </div>
          <div className="flex items-center gap-3">
            <Bath className="w-5 h-5" />
            <span className="text-lg">{property.baths}</span>
          </div>
          <div className="flex items-center gap-3">
            <Maximize className="w-5 h-5" />
            <span className="text-lg">{property.area}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Properties() {
  const { properties } = SECTION_TEXTS;

  return (
    <section id="properties" className="py-32 bg-dark-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <SectionHeader label={properties.label} title={properties.title} />
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group flex items-center gap-3 text-gold-light text-lg font-medium hover:text-gold transition-colors pb-2 border-b border-transparent hover:border-gold"
          >
            {properties.viewAll}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PROPERTIES.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
