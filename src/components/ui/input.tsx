"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, ...props }, ref) => {
    return (
      <div className="space-y-3">
        {label && (
          <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em]">
            {label}{required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          className={cn(
            "w-full bg-transparent border-b border-gray-700 focus:border-gold py-4 text-white outline-none transition-colors text-lg font-light placeholder:text-gray-500",
            className
          )}
          ref={ref}
          required={required}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
