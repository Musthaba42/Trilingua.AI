"use client";

import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-md h-48",
  };

  return (
    <div
      className={cn("shimmer", variants[variant], className)}
      style={{ width, height }}
    />
  );
}

/** Pre-built skeleton for a course card */
export function CourseCardSkeleton() {
  return (
    <div className="glass-card p-0 overflow-hidden">
      <Skeleton variant="rectangular" className="w-full h-40" />
      <div className="p-4 space-y-3">
        <Skeleton className="w-3/4" />
        <Skeleton className="w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="w-12 h-5 rounded-full" />
          <Skeleton className="w-12 h-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Pre-built skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-16 h-8" />
      <Skeleton className="w-24 h-3" />
    </div>
  );
}
