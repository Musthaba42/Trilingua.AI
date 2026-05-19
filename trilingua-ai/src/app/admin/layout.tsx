"use client";

import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Shield, Users, GraduationCap, CreditCard, 
  Settings, LayoutDashboard, ArrowLeft, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { APP_NAME } from "@/lib/utils/constants";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: GraduationCap },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return null;

  // Protect Admin routes
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Top Admin Bar */}
      <header className="h-16 border-b border-dark-border bg-dark-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="text-primary-400" size={24} />
            <span className="font-bold text-white tracking-tight">{APP_NAME} <span className="text-primary-400">Admin</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{session.user.name}</p>
            <p className="text-xs text-primary-400 font-bold uppercase tracking-widest">Administrator</p>
          </div>
          <img 
            src={session.user.image || ""} 
            className="w-8 h-8 rounded-full ring-2 ring-primary-500/20" 
            alt="" 
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-dark-border bg-dark-card/30 hidden lg:block overflow-y-auto">
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-sm transition-all group",
                    isActive 
                      ? "bg-primary-500/10 text-white border-l-2 border-primary-500" 
                      : "text-gray-400 hover:text-white hover:bg-dark-hover"
                  )}
                >
                  <item.icon size={18} className={isActive ? "text-primary-400" : "group-hover:text-primary-400"} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
