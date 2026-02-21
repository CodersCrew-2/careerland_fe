'use client';

import * as React from "react";
import { cn } from "@/components/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined" | "text" | "tonal";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "filled", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      filled: "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary)]/90 shadow-sm hover:shadow-md",
      outlined: "border border-[var(--color-outline)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
      text: "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 px-4",
      tonal: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] hover:bg-[var(--color-secondary-container)]/80 shadow-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
