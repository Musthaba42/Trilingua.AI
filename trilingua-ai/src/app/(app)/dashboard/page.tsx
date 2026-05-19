"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, CheckCircle, Flame, Clock, ChevronRight,
  TrendingUp, Brain, Sparkles, Play
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MOCK_COURSES } from "@/lib/mock-data";

// Default enrolled courses for first-time demo users
const INITIAL_ENROLLED = MOCK_COURSES.slice(0, 4).map((c, i) => ({
  ...c,
  progress: [45, 20, 80, 10][i],
  lastLesson: c.lessons[0]?.title || "Getting Started",
  lastLessonId: c.lessons[0]?.id || "l1",
}));

const DEFAULT_RECOMMENDED = MOCK_COURSES.slice(4, 7);

const RECENT_ACTIVITY = [
  { action: "Completed lesson", detail: "Introduction to Claude & AI Automation", time: "2 hours ago", icon: CheckCircle, color: "text-green-400" },
  { action: "Started course", detail: "Deep Learning Crash Course", time: "Yesterday", icon: Play, color: "text-primary-400" },
  { action: "AI Tutor session", detail: "Asked about backpropagation", time: "Yesterday", icon: Brain, color: "text-accent-400" },
  { action: "Practice complete", detail: "Hello World in Python — All tests passed", time: "2 days ago", icon: Sparkles, color: "text-amber-400" },
];

const stats = [
  { label: "Courses Enrolled", value: "4", icon: BookOpen, color: "from-primary-500/20 to-primary-500/5", iconColor: "text-primary-400" },
  { label: "Lessons Done", value: "12", icon: CheckCircle, color: "from-green-500/20 to-green-500/5", iconColor: "text-green-400" },
  { label: "Day Streak", value: "7", icon: Flame, color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
  { label: "Hours Learned", value: "24", icon: Clock, color: "from-accent-400/20 to-accent-400/5", iconColor: "text-accent-400" },
];

function ProgressRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#progressGradient)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="progress-ring-circle"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-bold text-white">{progress}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("Welcome back");
  const [profile, setProfile] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState(INITIAL_ENROLLED);
  const [recommended, setRecommended] = useState(DEFAULT_RECOMMENDED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const fetchState = async () => {
      try {
        const res = await fetch("/api/user/onboarding");
        const json = await res.json();
        if (json.success) {
          setProfile(json.data);
          
          // Set enrolled courses from state if they exist
          const enrolledIds = json.data.enrolledCourseIds || [];
          const progressData = json.data.progress || {};
          
          if (enrolledIds.length > 0) {
            const mapped = MOCK_COURSES.filter(c => enrolledIds.includes(c.id)).map(c => ({
              ...c,
              progress: progressData[c.id]?.progress || 0,
              lastLesson: progressData[c.id]?.completedLessons?.length 
                ? c.lessons.find(l => l.id === progressData[c.id].lastLessonId)?.title || "Continue" 
                : "Not started",
              lastLessonId: progressData[c.id]?.lastLessonId || c.lessons[0]?.id || ""
            }));
            setEnrolledCourses(mapped);
          }

          // Re-calculate recommendations based on interests
          const interests = json.data.domainInterests || [];
          if (interests.length > 0) {
            const filtered = MOCK_COURSES.filter(c => 
              interests.includes(c.domainSlug) && 
              !enrolledIds.includes(c.id)
            ).slice(0, 3);
            
            if (filtered.length > 0) {
              setRecommended(filtered);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch state", err);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, []);

  const router = require("next/navigation").useRouter();
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role;
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "INSTRUCTOR") {
        router.push("/instructor");
      }
    }
  }, [session, router]);

  const userName = profile?.name || session?.user?.name?.split(" ")[0] || "Learner";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Continue your learning journey. You&apos;re on a <span className="text-amber-400 font-semibold">7-day streak 🔥</span>
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <Flame className="text-amber-400" size={24} />
            <div>
              <p className="text-2xl font-bold text-amber-400">7</p>
              <p className="text-xs text-gray-500">day streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards — LeetCode-style equal-height grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-5 h-full bg-gradient-to-br ${stat.color} group hover:border-primary-500/30 hover:scale-[1.02] transition-all flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-dark-bg/30 flex items-center justify-center">
                <stat.icon size={20} className={stat.iconColor} />
              </div>
              <TrendingUp size={14} className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white leading-tight">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-header">
            <Play size={20} className="text-primary-400" />
            Continue Learning
          </h2>
          <Link href="/my-learning" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {enrolledCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="h-full"
            >
              <Link
                href={`/courses/${course.slug}/learn/${course.lastLessonId}`}
                className="glass-card-hover block overflow-hidden group h-full flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
                  <div className="absolute bottom-2 right-2">
                    <ProgressRing progress={course.progress} size={40} />
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-medium text-white text-sm truncate">{course.title}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{course.lastLesson}</p>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-dark-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400 transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-header">
            <Sparkles size={20} className="text-accent-400" />
            Your Learning Path
          </h2>
          <Link href="/courses" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
            Browse all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {recommended.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="h-full"
            >
              <Link href={`/courses/${course.slug}`} className="glass-card-hover block overflow-hidden group h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="badge text-[10px]" style={{ backgroundColor: `${course.domainColor}30`, color: course.domainColor }}>
                      {course.domainName}
                    </span>
                  </div>
                  {course.isFree && (
                    <span className="absolute top-2 right-2 badge-free text-[10px]">Free</span>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <p className="font-medium text-white text-sm truncate">{course.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{course.lessonCount} lessons</span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">{course.estimatedHrs}h</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="section-header mb-4">
          <Clock size={20} className="text-gray-400" />
          Recent Activity
        </h2>
        <div className="glass-card divide-y divide-dark-border">
          {RECENT_ACTIVITY.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center gap-4 p-4"
            >
              <div className={`w-9 h-9 rounded-full bg-dark-surface flex items-center justify-center shrink-0`}>
                <activity.icon size={16} className={activity.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{activity.action}</p>
                <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
