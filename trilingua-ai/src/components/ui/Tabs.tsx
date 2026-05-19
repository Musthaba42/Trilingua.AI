"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "underline" | "pills";
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className,
  variant = "underline",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const handleChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div
        className={cn(
          "flex gap-1",
          variant === "underline"
            ? "border-b border-dark-border"
            : "bg-dark-surface p-1 rounded-sm"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
              variant === "underline"
                ? cn(
                    "pb-3",
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  )
                : cn(
                    "rounded-sm flex-1 justify-center",
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  )
            )}
          >
            {tab.icon}
            {tab.label}
            {/* Active indicator */}
            {activeTab === tab.id && variant === "underline" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {activeTab === tab.id && variant === "pills" && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-primary-500/20 border border-primary-500/30 rounded-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="pt-4"
      >
        {activeContent}
      </motion.div>
    </div>
  );
}
