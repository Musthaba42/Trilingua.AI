// ============================================================
// Shared TypeScript Types — Trilingua AI
// ============================================================

export type { LangCode } from "@/lib/utils/constants";

/** API Response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Dashboard stats */
export interface DashboardStats {
  coursesEnrolled: number;
  lessonsCompleted: number;
  currentStreak: number;
  totalHours: number;
}

/** Course card data */
export interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  difficulty: "BASIC" | "MEDIUM" | "PRO";
  estimatedHrs: number | null;
  isFree: boolean;
  domainSlug: string;
  domainName: string;
  domainColor: string | null;
  languages: string[];
  lessonCount: number;
  progress?: number; // 0-100 for enrolled users
}

/** Lesson data for player */
export interface LessonData {
  id: string;
  title: string;
  description: string | null;
  type: "VIDEO" | "PRACTICE" | "PROJECT" | "READING" | "QUIZ";
  duration: number | null;
  sortOrder: number;
  isFree: boolean;
  videoLinks: {
    youtubeId: string;
    lang: string;
    title: string;
    thumbnail: string | null;
  }[];
  exercises: {
    id: string;
    title: string;
    language: string;
  }[];
  quizzes: {
    id: string;
    question: string;
  }[];
}

/** Chat message */
export interface ChatMessageData {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  lang: string;
  createdAt: string;
}

/** Chat session */
export interface ChatSessionData {
  id: string;
  title: string | null;
  courseId: string | null;
  lessonId: string | null;
  context: Record<string, unknown> | null;
  createdAt: string;
  messageCount: number;
}

/** Streak data */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  recentDays: { date: string; minutes: number }[];
}

/** Progress overview */
export interface ProgressOverview {
  totalEnrollments: number;
  completedCourses: number;
  lessonsCompleted: number;
  lessonsInProgress: number;
  totalWatchedMinutes: number;
  courseProgress: {
    courseId: string;
    courseTitle: string;
    courseThumbnail: string | null;
    courseSlug: string;
    totalLessons: number;
    completedLessons: number;
    percentage: number;
  }[];
}
