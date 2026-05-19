"use client";

import { cn } from "@/lib/utils/cn";

export interface BadgeProps {
  variant?: "primary" | "accent" | "success" | "warning" | "free" | "pro" | "custom";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
  color?: string; // for custom variant
}

export function Badge({
  variant = "primary",
  size = "sm",
  children,
  className,
  color,
}: BadgeProps) {
  const variants = {
    primary: "badge-primary",
    accent: "badge-accent",
    success: "badge-success",
    warning: "badge-warning",
    free: "badge-free",
    pro: "badge-pro",
    custom: "",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
      style={
        variant === "custom" && color
          ? {
              backgroundColor: `${color}20`,
              color: color,
              borderColor: `${color}30`,
              borderWidth: "1px",
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}

/**
 * Language pill component
 */
export function LangBadge({ lang, className }: { lang: string; className?: string }) {
  const config: Record<string, string> = {
    en: "lang-pill-en",
    ta: "lang-pill-ta",
    hi: "lang-pill-hi",
  };

  const labels: Record<string, string> = {
    en: "EN",
    ta: "TA",
    hi: "HI",
  };

  return (
    <span className={cn(config[lang] || "lang-pill-en", "lang-pill", className)}>
      {labels[lang] || lang.toUpperCase()}
    </span>
  );
}

/**
 * Difficulty badge
 */
export function DifficultyBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; class: string }> = {
    BASIC: { label: "Beginner", class: "bg-green-500/20 text-green-400" },
    MEDIUM: { label: "Intermediate", class: "bg-amber-500/20 text-amber-400" },
    PRO: { label: "Advanced", class: "bg-red-500/20 text-red-400" },
  };

  const { label, class: cls } = config[level] || config.BASIC;

  return (
    <span className={cn("badge", cls)}>
      {label}
    </span>
  );
}
