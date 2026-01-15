"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, required, ...props }, ref) => {
    return (
      <div className="space-y-3">
        {label && (
          <label className="text-gold-light text-xs font-semibold uppercase tracking-[0.2em]">
            {label}{required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            "w-full bg-transparent border-b border-gray-700 focus:border-gold py-4 text-white outline-none transition-colors text-lg font-light placeholder:text-gray-500 resize-none",
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

Textarea.displayName = "Textarea";

export { Textarea };
