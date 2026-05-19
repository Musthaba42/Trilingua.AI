"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Code2,
  MessageSquare,
  BarChart3,
  Crown,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  FileText,
  Briefcase,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils/cn";
import { APP_NAME } from "@/lib/utils/constants";

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Code2,
  MessageSquare,
  BarChart3,
  Crown,
  Settings,
  UserCircle,
  FileText,
  Briefcase,
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Courses", href: "/courses", icon: "GraduationCap" },
  { label: "My Learning", href: "/my-learning", icon: "BookOpen" },
  { label: "Research", href: "/research", icon: "FileText" },
  { label: "Projects", href: "/projects", icon: "Briefcase" },
  { label: "Practice", href: "/practice", icon: "Code2" },
  { label: "AI Tutor", href: "/tutor", icon: "MessageSquare" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Subscription", href: "/subscription", icon: "Crown" },
  { label: "Profile", href: "/profile", icon: "UserCircle" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col",
        "bg-dark-card/95 backdrop-blur-xl border-r border-dark-border"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-dark-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center shrink-0">
          <Brain className="text-white" size={20} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold gradient-text whitespace-nowrap overflow-hidden"
            >
              {APP_NAME}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group relative",
                isActive
                  ? "text-white bg-primary-500/15"
                  : "text-gray-400 hover:text-white hover:bg-dark-hover"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-500 rounded-r"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={20} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-dark-border p-3 space-y-1">
        {/* User info */}
        {session?.user && (
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-sm",
              collapsed ? "justify-center" : ""
            )}
          >
            <img
              src={session.user.image || "https://ui-avatars.com/api/?name=U&background=6D28D9&color=fff"}
              alt=""
              className="w-8 h-8 rounded-full shrink-0"
            />
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-sm w-full",
            "text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors",
            collapsed ? "justify-center" : ""
          )}
          title="Sign out"
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 text-gray-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
