import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 px-5 py-2 rounded-full",
        variant === "default" && "border border-gold/30 bg-dark/50 backdrop-blur-sm",
        variant === "outline" && "bg-dark/90 backdrop-blur border border-gold/30",
        className
      )}
    >
      {children}
    </div>
  );
}
