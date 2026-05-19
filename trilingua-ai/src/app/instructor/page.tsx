"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Users, TrendingUp, Eye, Edit3, 
  PlusCircle, MoreVertical, Globe, Clock, 
  CheckCircle, ArrowUpRight, IndianRupee, Sparkles,
  ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";

const INSTRUCTOR_STATS = [
  { label: "Total Courses", value: "6", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-400/10", trend: "+2 this month" },
  { label: "Total Students", value: "342", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", trend: "+28 this week" },
  { label: "Revenue Earned", value: "₹12,450", icon: IndianRupee, color: "text-green-400", bg: "bg-green-400/10", trend: "+18% ↑" },
  { label: "Avg Completion", value: "67%", icon: TrendingUp, color: "text-primary-400", bg: "bg-primary-400/10", trend: "+5% ↑" },
];

const MY_COURSES = [
  {
    id: "ic1", title: "Claude Cowork Masterclass (தமிழ்)", status: "published",
    students: 128, revenue: "₹0", rating: 4.8, lessons: 1, domain: "AI & Automation",
    domainColor: "#8B5CF6", thumbnail: "https://i.ytimg.com/vi/D61JR8jb3JE/hqdefault.jpg",
    difficulty: "MEDIUM" as const, languages: ["ta"], views: 2340, created: "2 months ago",
  },
  {
    id: "ic2", title: "Deep Learning in Tamil (தமிழ்)", status: "published",
    students: 89, revenue: "₹4,200", rating: 4.5, lessons: 3, domain: "Deep Learning",
    domainColor: "#EC4899", thumbnail: "https://i.ytimg.com/vi/CcQZkOFT6aQ/hqdefault.jpg",
    difficulty: "MEDIUM" as const, languages: ["ta"], views: 1820, created: "1 month ago",
  },
  {
    id: "ic3", title: "CyberSecurity & Ethical Hacking (தமிழ்)", status: "published",
    students: 76, revenue: "₹5,700", rating: 4.9, lessons: 3, domain: "Cybersecurity",
    domainColor: "#10B981", thumbnail: "https://i.ytimg.com/vi/XWwYm0wPKrg/hqdefault.jpg",
    difficulty: "MEDIUM" as const, languages: ["ta"], views: 1540, created: "3 weeks ago",
  },
  {
    id: "ic4", title: "Python for Beginners (Hindi)", status: "draft",
    students: 0, revenue: "₹0", rating: 0, lessons: 2, domain: "Python Programming",
    domainColor: "#3B82F6", thumbnail: "https://i.ytimg.com/vi/HAxm8n9QY50/hqdefault.jpg",
    difficulty: "BASIC" as const, languages: ["hi"], views: 0, created: "2 days ago",
  },
  {
    id: "ic5", title: "Data Science Masterclass", status: "draft",
    students: 0, revenue: "₹0", rating: 0, lessons: 0, domain: "Data Science",
    domainColor: "#6366F1", thumbnail: "https://i.ytimg.com/vi/k6HOBjkUkE4/hqdefault.jpg",
    difficulty: "PRO" as const, languages: ["en", "ta"], views: 0, created: "1 day ago",
  },
];

export default function InstructorDashboardPage() {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filteredCourses = MY_COURSES.filter(c => {
    if (filter === "published") return c.status === "published";
    if (filter === "draft") return c.status === "draft";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Instructor Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your courses and track student engagement.</p>
        </div>
        <Link href="/instructor/create">
          <Button icon={<PlusCircle size={16} />}>
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INSTRUCTOR_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
              <p className="text-xs text-green-400 mt-1">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">My Courses</h2>
          <div className="flex gap-2">
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-dark-surface text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="md:w-56 shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-36 md:h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${course.domainColor}20`, color: course.domainColor }}
                      >
                        {course.domain}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        course.status === "published" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {course.status === "published" ? "● Published" : "◌ Draft"}
                      </span>
                      <span className="text-[10px] text-gray-500">{course.languages.map(l => l.toUpperCase()).join(", ")}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Users size={14} />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <BookOpen size={14} />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Eye size={14} />
                      <span>{course.views.toLocaleString()} views</span>
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <span>⭐ {course.rating}</span>
                      </div>
                    )}
                    {course.revenue !== "₹0" && (
                      <div className="flex items-center gap-1.5 text-green-400">
                        <IndianRupee size={14} />
                        <span>{course.revenue}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="secondary" icon={<Edit3 size={14} />}>Edit</Button>
                    <Button size="sm" variant="ghost" icon={<Eye size={14} />}>Preview</Button>
                    {course.status === "draft" && (
                      <Button size="sm" variant="primary" icon={<CheckCircle size={14} />}>Publish</Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 text-amber-400 mb-3">
          <Sparkles size={18} />
          <h3 className="font-semibold text-white">Pro Tips for Instructors</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { tip: "Add multi-language support", desc: "Courses in Tamil, Hindi & English reach 3x more students." },
            { tip: "Include practice exercises", desc: "Courses with coding challenges see 67% higher completion rates." },
            { tip: "Keep lessons under 20 min", desc: "Shorter, focused lessons improve retention and engagement." },
          ].map((t, i) => (
            <div key={i} className="p-4 rounded-lg bg-dark-surface border border-dark-border">
              <p className="text-sm font-semibold text-white mb-1">{t.tip}</p>
              <p className="text-xs text-gray-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
