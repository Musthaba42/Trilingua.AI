import { z } from "zod";

// ============================================================
// Shared Zod Validators — Trilingua AI
// ============================================================

/**
 * Pagination params
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Language code
 */
export const langCodeSchema = z.enum(["en", "ta", "hi"]);

/**
 * CUID format for IDs
 */
export const cuidSchema = z.string().min(1);

/**
 * User profile update
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  preferredLang: langCodeSchema.optional(),
  learnerType: z.enum(["STUDENT", "WORKER", "BUSINESS", "OTHER"]).optional(),
  experienceLevel: z.enum(["BASIC", "MEDIUM", "PRO"]).optional(),
  goal: z.string().max(500).optional(),
  domainInterests: z.array(z.string()).max(10).optional(),
});

/**
 * Onboarding submission
 */
export const onboardingSchema = z.object({
  learnerType: z.enum(["STUDENT", "WORKER", "BUSINESS", "OTHER"]),
  experienceLevel: z.enum(["BASIC", "MEDIUM", "PRO"]),
  preferredLang: langCodeSchema,
  goal: z.string().max(500),
  domainInterests: z.array(z.string()).min(1).max(10),
});

/**
 * Course filters
 */
export const courseFilterSchema = z.object({
  domain: z.string().optional(),
  difficulty: z.enum(["BASIC", "MEDIUM", "PRO"]).optional(),
  lang: langCodeSchema.optional(),
  free: z.coerce.boolean().optional(),
  search: z.string().max(200).optional(),
  ...paginationSchema.shape,
});

/**
 * Chat message input
 */
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long (max 2000 characters)"),
  sessionId: z.string().optional(),
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  lang: langCodeSchema.default("en"),
});

/**
 * Create chat session
 */
export const createSessionSchema = z.object({
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  title: z.string().max(200).optional(),
});

/**
 * Progress update
 */
export const progressUpdateSchema = z.object({
  lessonId: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
  watchedSec: z.number().int().min(0).optional(),
});

/**
 * Code submission
 */
export const codeSubmissionSchema = z.object({
  exerciseId: z.string(),
  code: z.string().max(10240, "Code too long (max 10KB)"),
  language: z.enum(["python", "javascript"]).default("python"),
});

/**
 * Enrollment
 */
export const enrollSchema = z.object({
  courseSlug: z.string(),
});

/**
 * Helper: strip HTML tags from user input
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Helper: check for common prompt injection patterns
 */
export function detectPromptInjection(input: string): boolean {
  const patterns = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /you\s+are\s+now\s+/i,
    /system\s*:\s*/i,
    /\[INST\]/i,
    /\<\|im_start\|\>/i,
    /forget\s+(everything|all)/i,
    /reveal\s+(your|the)\s+(system|prompt)/i,
    /what\s+is\s+your\s+(system\s+)?prompt/i,
  ];

  return patterns.some((pattern) => pattern.test(input));
}
