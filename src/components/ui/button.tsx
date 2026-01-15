"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-gradient text-dark hover:shadow-[0_0_30px_rgba(170,134,74,0.4)] transform hover:-translate-y-0.5",
        outline:
          "border border-gold text-gold-light hover:bg-gold/10",
        ghost:
          "text-gray-300 hover:text-gold-light",
      },
      size: {
        default: "px-8 py-3 text-lg rounded-sm",
        lg: "px-10 py-4 text-lg rounded-sm",
        sm: "px-6 py-2 text-base rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
