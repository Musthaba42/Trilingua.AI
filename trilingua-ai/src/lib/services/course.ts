import { db } from "@/lib/db";
import { cache } from "@/lib/cache";
import type { CourseCardData } from "@/types";

/**
 * Course service — handles all course-related database queries
 */
export const courseService = {
  /**
   * Get all domains
   */
  async getDomains() {
    return cache.getOrSet("domains", async () => {
      return db.domain.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    }, 600);
  },

  /**
   * List courses with filters and pagination
   */
  async listCourses(params: {
    domain?: string;
    difficulty?: string;
    lang?: string;
    free?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { domain, difficulty, lang, free, search, page = 1, limit = 20 } = params;

    const where: any = { isPublished: true };

    if (domain) {
      where.domain = { slug: domain };
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (free !== undefined) {
      where.isFree = free;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (lang) {
      where.langVariants = { some: { lang } };
    }

    const [items, total] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          domain: true,
          langVariants: true,
          _count: { select: { lessons: true } },
        },
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.course.count({ where }),
    ]);

    const courses: CourseCardData[] = items.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail,
      difficulty: c.difficulty,
      estimatedHrs: c.estimatedHrs,
      isFree: c.isFree,
      domainSlug: c.domain.slug,
      domainName: c.domain.name,
      domainColor: c.domain.color,
      languages: c.langVariants.map((v) => v.lang),
      lessonCount: c._count.lessons,
    }));

    return {
      items: courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get course detail by slug
   */
  async getCourseBySlug(slug: string) {
    return db.course.findUnique({
      where: { slug },
      include: {
        domain: true,
        langVariants: true,
        lessons: {
          orderBy: { sortOrder: "asc" },
          include: {
            videoLinks: true,
            exercises: { select: { id: true, title: true, language: true } },
            quizzes: { select: { id: true, question: true } },
          },
        },
        playlists: true,
        projectDemos: true,
        _count: { select: { lessons: true, enrollments: true } },
      },
    });
  },

  /**
   * Get lessons for a course
   */
  async getCourseLessons(courseSlug: string) {
    const course = await db.course.findUnique({ where: { slug: courseSlug } });
    if (!course) return null;

    return db.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { sortOrder: "asc" },
      include: {
        videoLinks: true,
        exercises: { select: { id: true, title: true, language: true } },
        quizzes: { select: { id: true, question: true } },
      },
    });
  },

  /**
   * Get a single lesson by ID
   */
  async getLessonById(lessonId: string) {
    return db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: { domain: true, langVariants: true },
        },
        videoLinks: true,
        exercises: true,
        quizzes: true,
      },
    });
  },

  /**
   * Enroll a user in a course
   */
  async enrollUser(userId: string, courseSlug: string) {
    const course = await db.course.findUnique({ where: { slug: courseSlug } });
    if (!course) throw new Error("Course not found");

    return db.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {},
      create: { userId, courseId: course.id },
    });
  },

  /**
   * Check if user is enrolled
   */
  async isEnrolled(userId: string, courseId: string) {
    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return !!enrollment;
  },

  /**
   * Get user's enrolled courses with progress
   */
  async getUserEnrollments(userId: string) {
    const enrollments = await db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            domain: true,
            langVariants: true,
            lessons: { select: { id: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Get progress for each enrollment
    const results = await Promise.all(
      enrollments.map(async (e) => {
        const completedLessons = await db.progress.count({
          where: {
            userId,
            lessonId: { in: e.course.lessons.map((l) => l.id) },
            status: "COMPLETED",
          },
        });

        const totalLessons = e.course.lessons.length;
        const percentage = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        return {
          ...e,
          totalLessons,
          completedLessons,
          percentage,
        };
      })
    );

    return results;
  },
};
