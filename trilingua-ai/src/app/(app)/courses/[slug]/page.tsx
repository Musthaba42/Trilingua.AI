"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock, BookOpen, Play, ChevronRight, Users, Lock,
  CheckCircle, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, LangBadge, DifficultyBadge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { DOMAIN_CONFIG } from "@/lib/utils/constants";
import { formatDuration } from "@/lib/utils/format";
import Link from "next/link";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${params.slug}`);
        const data = await res.json();
        if (data.success) setCourse(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [params.slug]);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${params.slug}/enroll`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setEnrolled(true);
        // Go to first lesson
        if (course?.lessons?.[0]) {
          router.push(`/courses/${params.slug}/learn/${course.lessons[0].id}`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-dark-surface rounded-md" />
        <div className="h-8 w-1/3 bg-dark-surface rounded" />
        <div className="h-4 w-2/3 bg-dark-surface rounded" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Course not found</p>
        <Link href="/courses" className="text-primary-400 hover:underline mt-2 inline-block">
          Back to catalog
        </Link>
      </div>
    );
  }

  const domainConfig = DOMAIN_CONFIG[course.domain?.slug || ""];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Back</span>
      </button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-0 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="md:w-2/5 aspect-video md:aspect-auto">
            <img
              src={course.thumbnail || ""}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="custom" color={course.domain?.color || "#6D28D9"}>
                {course.domain?.name}
              </Badge>
              <DifficultyBadge level={course.difficulty} />
              {course.isFree ? (
                <Badge variant="free">Free</Badge>
              ) : (
                <Badge variant="pro">Pro</Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {course.title}
            </h1>

            <p className="text-gray-400">{course.description}</p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {course.estimatedHrs && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {course.estimatedHrs}h
                </span>
              )}
              <span className="flex items-center gap-1">
                <BookOpen size={14} /> {course.lessons?.length || 0} lessons
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {course._count?.enrollments || 0} enrolled
              </span>
            </div>

            {/* Language pills */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Available in:</span>
              {course.langVariants?.map((v: any) => (
                <LangBadge key={v.lang} lang={v.lang} />
              ))}
            </div>

            {/* CTA */}
            <Button
              size="lg"
              onClick={handleEnroll}
              loading={enrolling}
              disabled={enrolled}
              icon={enrolled ? <CheckCircle size={18} /> : <Play size={18} />}
              className="mt-2"
            >
              {enrolled ? "Enrolled — Start Learning" : "Enroll & Start Learning"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Curriculum */}
      <Tabs
        tabs={[
          {
            id: "curriculum",
            label: "Curriculum",
            icon: <BookOpen size={16} />,
            content: (
              <div className="space-y-2">
                {course.lessons?.map((lesson: any, i: number) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={enrolled ? `/courses/${params.slug}/learn/${lesson.id}` : "#"}
                      onClick={(e) => {
                        if (!enrolled && !lesson.isFree) e.preventDefault();
                      }}
                      className={`glass-card p-4 flex items-center gap-4 group ${
                        enrolled || lesson.isFree ? "hover:border-primary-500/30 cursor-pointer" : "opacity-75"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-dark-surface flex items-center justify-center shrink-0">
                        {lesson.isFree || enrolled ? (
                          <Play size={16} className="text-primary-400" />
                        ) : (
                          <Lock size={16} className="text-gray-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate group-hover:text-primary-300 transition-colors">
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="capitalize">{lesson.type.toLowerCase()}</span>
                          {lesson.duration && <span>{formatDuration(lesson.duration)}</span>}
                          {lesson.videoLinks?.map((v: any) => (
                            <LangBadge key={v.lang} lang={v.lang} />
                          ))}
                        </div>
                      </div>

                      {(enrolled || lesson.isFree) && (
                        <ChevronRight size={16} className="text-gray-500 group-hover:text-primary-400 transition-colors" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            ),
          },
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="glass-card p-6 prose prose-invert max-w-none">
                <h3>About this course</h3>
                <p>{course.description || "No description available."}</p>
                <h3>What you&apos;ll learn</h3>
                <ul>
                  <li>Core concepts and fundamentals</li>
                  <li>Hands-on practice exercises</li>
                  <li>Real-world project applications</li>
                  <li>AI-assisted learning support</li>
                </ul>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
