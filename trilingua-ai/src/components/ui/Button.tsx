"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-glow active:bg-primary-700",
      secondary:
        "bg-dark-surface text-white border border-dark-border hover:bg-dark-hover hover:border-primary-500/30",
      ghost:
        "bg-transparent text-gray-400 hover:text-white hover:bg-dark-surface",
      danger:
        "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
      accent:
        "bg-accent-400 text-white hover:bg-accent-500 hover:shadow-glow-accent",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5",
      md: "px-5 py-2.5 text-sm rounded-sm gap-2",
      lg: "px-7 py-3.5 text-base rounded-sm gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-dark-bg",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
          variants[variant],
          sizes[size],
          loading && "opacity-70 cursor-wait",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
