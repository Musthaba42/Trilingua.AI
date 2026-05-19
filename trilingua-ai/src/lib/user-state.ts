import { cookies } from "next/headers";

export type UserPreferences = {
  onboardingDone: boolean;
  learnerType?: string;
  experienceLevel?: string;
  preferredLang?: string;
  domainInterests?: string[];
  goal?: string;
};

export type CourseProgress = {
  courseId: string;
  progress: number; // 0-100
  lastLessonId?: string;
  completedLessons: string[];
};

export type UserState = {
  preferences: UserPreferences;
  progress: Record<string, CourseProgress>;
  enrolledCourseIds: string[];
};

const DEFAULT_STATE: UserState = {
  preferences: { onboardingDone: false },
  progress: {},
  enrolledCourseIds: ["course-1", "course-2", "course-3", "course-4"], // Default demo courses
};

const COOKIE_NAME = "trilingua_user_state";

/**
 * Server-side User State Manager (Demo Mode)
 * Uses cookies to persist user progress and preferences without a database.
 */
export const UserStateService = {
  getState(): UserState {
    const cookie = cookies().get(COOKIE_NAME);
    if (!cookie) return DEFAULT_STATE;

    try {
      return JSON.parse(cookie.value) as UserState;
    } catch (e) {
      return DEFAULT_STATE;
    }
  },

  saveState(state: UserState) {
    cookies().set(COOKIE_NAME, JSON.stringify(state), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  },

  updatePreferences(prefs: Partial<UserPreferences>) {
    const state = this.getState();
    state.preferences = { ...state.preferences, ...prefs };
    this.saveState(state);
  },

  enrollCourse(courseId: string) {
    const state = this.getState();
    if (!state.enrolledCourseIds.includes(courseId)) {
      state.enrolledCourseIds.push(courseId);
      state.progress[courseId] = {
        courseId,
        progress: 0,
        completedLessons: [],
      };
      this.saveState(state);
    }
  },

  updateProgress(courseId: string, lessonId: string, progress: number) {
    const state = this.getState();
    if (!state.progress[courseId]) {
      state.progress[courseId] = { courseId, progress, completedLessons: [lessonId] };
    } else {
      const p = state.progress[courseId];
      p.progress = progress;
      if (!p.completedLessons.includes(lessonId)) {
        p.completedLessons.push(lessonId);
      }
      p.lastLessonId = lessonId;
    }
    this.saveState(state);
  }
};
