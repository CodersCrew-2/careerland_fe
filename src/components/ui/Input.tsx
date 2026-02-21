'use client';

import * as React from "react";
import { cn } from "@/components/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="relative group">
        <input
          type={type}
          className={cn(
            "peer block w-full rounded-t-lg border-b-2 border-[var(--color-outline)] bg-[var(--color-surface-variant)]/30 px-4 pt-6 pb-2 text-base text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-variant)]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className
          )}
          placeholder=" "
          ref={ref}
          {...props}
        />
        {label && (
          <label
            className="pointer-events-none absolute left-4 top-4 origin-[0] -translate-y-3 scale-75 text-[var(--color-on-surface-variant)] duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-[var(--color-primary)]"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
