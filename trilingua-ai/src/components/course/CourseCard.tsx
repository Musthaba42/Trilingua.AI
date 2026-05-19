"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BookOpen } from "lucide-react";
import { Badge, LangBadge, DifficultyBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { DOMAIN_CONFIG } from "@/lib/utils/constants";
import type { CourseCardData } from "@/types";

interface CourseCardProps {
  course: CourseCardData;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const domainConfig = DOMAIN_CONFIG[course.domainSlug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/courses/${course.slug}`}>
        <div className="glass-card-hover p-0 overflow-hidden group">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center",
                  `bg-gradient-to-br ${domainConfig?.gradient || "from-primary-500 to-accent-400"}`
                )}
              >
                <BookOpen size={48} className="text-white/50" />
              </div>
            )}

            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {course.isFree ? (
                <Badge variant="free">Free</Badge>
              ) : (
                <Badge variant="pro">Pro</Badge>
              )}
            </div>

            <div className="absolute top-3 right-3 flex gap-1">
              {course.languages.map((lang) => (
                <LangBadge key={lang} lang={lang} />
              ))}
            </div>

            {/* Progress ring overlay */}
            {course.progress !== undefined && course.progress > 0 && (
              <div className="absolute bottom-3 right-3">
                <div className="w-10 h-10 rounded-full bg-dark-bg/80 backdrop-blur flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-400">
                    {course.progress}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Domain badge */}
            <Badge variant="custom" color={course.domainColor || "#6D28D9"} size="sm">
              {course.domainName}
            </Badge>

            {/* Title */}
            <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary-300 transition-colors">
              {course.title}
            </h3>

            {/* Description */}
            {course.description && (
              <p className="text-sm text-gray-400 line-clamp-2">
                {course.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between pt-2 border-t border-dark-border">
              <DifficultyBadge level={course.difficulty} />
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {course.estimatedHrs && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {course.estimatedHrs}h
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {course.lessonCount} lessons
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
