"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        align === "center" && "text-center max-w-3xl mx-auto",
        className
      )}
    >
      {label && (
        <span className="text-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">
          {label}
        </span>
      )}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white">
        {title}
      </h2>
      {description && (
        <p className="text-gray-400 text-xl font-light mt-6">{description}</p>
      )}
    </motion.div>
  );
}
