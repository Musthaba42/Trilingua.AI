// ============================================================
// App-wide Constants — Trilingua AI
// ============================================================

export const APP_NAME = "Trilingua AI";
export const APP_TAGLINE = "Learn anything, in any language, with AI by your side.";

/**
 * Supported languages
 */
export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

/**
 * Domain metadata (visual config)
 */
export const DOMAIN_CONFIG: Record<
  string,
  { icon: string; color: string; gradient: string }
> = {
  "ai-automation": {
    icon: "Bot",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600",
  },
  "deep-learning": {
    icon: "Brain",
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-600",
  },
  cybersecurity: {
    icon: "Shield",
    color: "#10B981",
    gradient: "from-emerald-500 to-green-600",
  },
  "machine-learning": {
    icon: "Cpu",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
  },
  python: {
    icon: "Code2",
    color: "#3B82F6",
    gradient: "from-blue-500 to-indigo-600",
  },
  java: {
    icon: "Coffee",
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
  },
  "excel-productivity": {
    icon: "Table",
    color: "#22C55E",
    gradient: "from-green-500 to-emerald-600",
  },
  "data-science": {
    icon: "BarChart3",
    color: "#6366F1",
    gradient: "from-indigo-500 to-violet-600",
  },
};

/**
 * Subscription plans
 */
export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    priceLabel: "₹0",
    period: "forever",
    popular: false,
    features: [
      "Basic video courses",
      "Limited AI Q&A (5/day)",
      "Progress tracking",
      "1 language",
    ],
    limitations: [
      "No live coding",
      "No project demos",
      "No research assist",
      "No language switching",
    ],
  },
  {
    id: "BASIC_199",
    name: "Basic",
    price: 19900, // paise
    priceLabel: "₹199",
    period: "month",
    popular: false,
    features: [
      "All free features",
      "AI tutor (20 msgs/day)",
      "Live coding practice",
      "Language switching",
      "Basic analytics",
    ],
    limitations: ["No project demos", "No research assist"],
  },
  {
    id: "PRO_299",
    name: "Pro",
    price: 29900,
    priceLabel: "₹299",
    period: "month",
    popular: true,
    features: [
      "All Basic features",
      "Advanced AI tutor (50 msgs/day)",
      "Project demos & walkthroughs",
      "Research paper assist",
      "Advanced analytics",
    ],
    limitations: [],
  },
  {
    id: "PREMIUM_399",
    name: "Premium",
    price: 39900,
    priceLabel: "₹399",
    period: "month",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited AI tutor",
      "Priority support",
      "Early access to new courses",
      "Custom learning paths",
    ],
    limitations: [],
  },
] as const;

/**
 * Experience levels
 */
export const EXP_LEVELS = [
  { value: "BASIC", label: "Beginner", emoji: "🌱" },
  { value: "MEDIUM", label: "Intermediate", emoji: "🌿" },
  { value: "PRO", label: "Advanced", emoji: "🌳" },
] as const;

/**
 * Learner types
 */
export const LEARNER_TYPES = [
  { value: "STUDENT", label: "Student", emoji: "🎓", description: "Currently studying" },
  { value: "WORKER", label: "Working Professional", emoji: "💼", description: "Learning alongside work" },
  { value: "BUSINESS", label: "Business Owner", emoji: "🏢", description: "Growing a business" },
  { value: "OTHER", label: "Other", emoji: "🌟", description: "Self-learner / Hobbyist" },
] as const;

/**
 * Onboarding step configuration
 */
export const ONBOARDING_STEPS = [
  {
    step: 1,
    question: "What best describes you?",
    field: "learnerType",
    type: "choice" as const,
  },
  {
    step: 2,
    question: "What's your experience level in tech?",
    field: "experienceLevel",
    type: "choice" as const,
  },
  {
    step: 3,
    question: "Which language do you prefer to learn in?",
    field: "preferredLang",
    type: "choice" as const,
  },
  {
    step: 4,
    question: "What's your learning goal?",
    field: "goal",
    type: "text" as const,
  },
  {
    step: 5,
    question: "Which domains interest you? (select all that apply)",
    field: "domainInterests",
    type: "multi-choice" as const,
  },
] as const;

/**
 * Navigation items for sidebar
 */
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Courses", href: "/courses", icon: "GraduationCap" },
  { label: "My Learning", href: "/my-learning", icon: "BookOpen" },
  { label: "Practice", href: "/practice", icon: "Code2" },
  { label: "AI Tutor", href: "/tutor", icon: "MessageSquare" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Subscription", href: "/subscription", icon: "Crown" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Courses", href: "/admin/courses", icon: "GraduationCap" },
  { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;
