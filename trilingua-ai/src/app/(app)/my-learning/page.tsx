"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, Play, CheckCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { MOCK_COURSES } from "@/lib/mock-data";

const ENROLLED = MOCK_COURSES.slice(0, 4).map((c, i) => ({
  ...c,
  progress: [45, 20, 80, 10][i],
  completedLessons: [1, 1, 2, 0][i],
  lastAccessed: ["2 hours ago", "Yesterday", "3 days ago", "1 week ago"][i],
  nextLesson: c.lessons[Math.min([1, 1, 2, 0][i], c.lessons.length - 1)],
}));

export default function MyLearningPage() {
  const [filter, setFilter] = useState<"all" | "progress" | "completed">("all");

  const filtered = ENROLLED.filter((c) => {
    if (filter === "completed") return c.progress === 100;
    if (filter === "progress") return c.progress < 100;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Learning</h1>
          <p className="text-gray-400 mt-1">
            {ENROLLED.length} course{ENROLLED.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <Link href="/courses">
          <Button variant="secondary" icon={<BookOpen size={16} />}>
            Browse Courses
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "progress", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                : "bg-dark-surface text-gray-400 hover:text-white border border-transparent"
            }`}
          >
            {f === "all" ? "All Courses" : f === "progress" ? "In Progress" : "Completed"}
          </button>
        ))}
      </div>

      {/* Course cards */}
      <div className="space-y-4">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail */}
              <div className="md:w-64 shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 md:h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="custom" color={course.domainColor}>
                      {course.domainName}
                    </Badge>
                    <DifficultyBadge level={course.difficulty} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                </div>

                {/* Progress section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">
                      {course.completedLessons} / {course.lessonCount} lessons completed
                    </span>
                    <span className="text-primary-300 font-semibold">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {course.estimatedHrs}h total
                    </span>
                    <span>Last accessed: {course.lastAccessed}</span>
                  </div>
                  <Link href={`/courses/${course.slug}/learn/${course.nextLesson?.id || course.lessons[0]?.id}`}>
                    <Button size="sm" icon={<Play size={14} />}>
                      {course.progress > 0 ? "Continue" : "Start"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-gray-400 text-lg">No courses match this filter</p>
        </div>
      )}
    </div>
  );
}
