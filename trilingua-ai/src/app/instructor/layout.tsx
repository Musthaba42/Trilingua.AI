"use client";

import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  GraduationCap, BookOpen, PlusCircle, BarChart3, 
  Settings, ArrowLeft, Users, Brain
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { APP_NAME } from "@/lib/utils/constants";

const instructorNavItems = [
  { label: "My Courses", href: "/instructor", icon: BookOpen },
  { label: "Create Course", href: "/instructor/create", icon: PlusCircle },
  { label: "Students", href: "/instructor/students", icon: Users },
  { label: "Analytics", href: "/instructor/analytics", icon: BarChart3 },
  { label: "Settings", href: "/instructor/settings", icon: Settings },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return null;

  // Protect Instructor routes
  if (!session || (session.user as any).role !== "INSTRUCTOR") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Top Instructor Bar */}
      <header className="h-16 border-b border-dark-border bg-dark-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={18} />
            </div>
            <span className="font-bold text-white tracking-tight">{APP_NAME} <span className="text-amber-400">Instructor</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{session.user.name}</p>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">Instructor</p>
          </div>
          <img 
            src={session.user.image || ""} 
            className="w-8 h-8 rounded-full ring-2 ring-amber-500/20" 
            alt="" 
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Instructor Sidebar */}
        <aside className="w-64 border-r border-dark-border bg-dark-card/30 hidden lg:block overflow-y-auto">
          <nav className="p-4 space-y-1">
            {instructorNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-sm transition-all group",
                    isActive 
                      ? "bg-amber-500/10 text-white border-l-2 border-amber-500" 
                      : "text-gray-400 hover:text-white hover:bg-dark-hover"
                  )}
                >
                  <item.icon size={18} className={isActive ? "text-amber-400" : "group-hover:text-amber-400"} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Help Card */}
          <div className="mx-4 mb-4 p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Brain size={16} />
              <span className="text-xs font-bold">AI Assist</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Use our AI to generate lesson descriptions, quiz questions, and more.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
