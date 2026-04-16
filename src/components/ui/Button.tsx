"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "pink" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "pink", size = "md", loading, fullWidth, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 relative overflow-hidden select-none";

    const variants = {
      pink: "btn-pink text-white",
      gold: "btn-gold text-dark-900",
      outline: "btn-outline",
      ghost: "bg-transparent text-white hover:bg-white/5 rounded-full border border-white/10",
      danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_24px_rgba(239,68,68,0.4)] hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
      xl: "px-10 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        suppressHydrationWarning
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          (disabled || loading) && "opacity-60 cursor-not-allowed transform-none",
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {variant === "pink" || variant === "gold" ? (
          <span className={cn("inline-flex items-center gap-2", variant !== "gold" && "relative z-10")}>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
