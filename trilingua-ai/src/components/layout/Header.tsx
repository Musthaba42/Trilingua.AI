"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

export function Header({ onMenuToggle, className }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 flex items-center justify-between px-6",
        "bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border",
        className
      )}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-sm text-gray-400 hover:text-white hover:bg-dark-surface transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-dark-surface border border-dark-border rounded-sm px-3 py-2 w-64 lg:w-80">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search courses, lessons..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none w-full"
          />
          <kbd className="hidden md:inline text-xs text-gray-600 bg-dark-bg px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-sm text-gray-400 hover:text-white hover:bg-dark-surface transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" />
        </button>

        {/* User avatar */}
        {session?.user && (
          <div className="flex items-center gap-3 ml-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">{session.user.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {(session.user as any).role?.toLowerCase() || "learner"}
              </p>
            </div>
            <img
              src={session.user.image || "https://ui-avatars.com/api/?name=U&background=6D28D9&color=fff"}
              alt=""
              className="w-9 h-9 rounded-full ring-2 ring-dark-border"
            />
          </div>
        )}
      </div>
    </header>
  );
}
