/**
 * Mock data for demo mode — no database required.
 * All course data from the YouTube seed file.
 */

export interface MockDomain {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MockCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: "BASIC" | "MEDIUM" | "PRO";
  estimatedHrs: number;
  isFree: boolean;
  isPublished: boolean;
  domainSlug: string;
  domainId: string;
  domainName: string;
  domainColor: string;
  languages: string[];
  lessonCount: number;
  sortOrder: number;
  lessons: MockLesson[];
}

export interface MockLesson {
  id: string;
  title: string;
  description: string;
  type: "VIDEO" | "PRACTICE" | "PROJECT" | "READING" | "QUIZ";
  duration: number;
  sortOrder: number;
  isFree: boolean;
  videoLinks: {
    youtubeId: string;
    lang: string;
    title: string;
    thumbnail: string;
    duration: number;
  }[];
  exercises: { id: string; title: string; language: string }[];
  quizzes: { id: string; question: string }[];
}

// ===== DOMAINS =====
export const MOCK_DOMAINS: MockDomain[] = [
  { id: "d1", slug: "ai-automation", name: "AI & Automation", description: "Master AI tools, automation workflows, and intelligent systems.", icon: "Bot", color: "#8B5CF6", sortOrder: 1, isActive: true },
  { id: "d2", slug: "deep-learning", name: "Deep Learning", description: "Neural networks, CNNs, RNNs, transformers, and deep learning.", icon: "Brain", color: "#EC4899", sortOrder: 2, isActive: true },
  { id: "d3", slug: "cybersecurity", name: "Cybersecurity", description: "Ethical hacking, network security, cryptography, and cyber defense.", icon: "Shield", color: "#10B981", sortOrder: 3, isActive: true },
  { id: "d4", slug: "machine-learning", name: "Machine Learning", description: "Supervised, unsupervised, and reinforcement learning algorithms.", icon: "Cpu", color: "#F59E0B", sortOrder: 4, isActive: true },
  { id: "d5", slug: "python", name: "Python Programming", description: "Python fundamentals, data structures, OOP, and real-world projects.", icon: "Code2", color: "#3B82F6", sortOrder: 5, isActive: true },
  { id: "d6", slug: "java", name: "Java Programming", description: "Core Java, OOP, collections, multithreading, and enterprise dev.", icon: "Coffee", color: "#EF4444", sortOrder: 6, isActive: true },
  { id: "d7", slug: "excel-productivity", name: "Excel & Productivity", description: "Microsoft Excel, formulas, pivot tables, VBA, and data analysis.", icon: "Table", color: "#22C55E", sortOrder: 7, isActive: true },
  { id: "d8", slug: "data-science", name: "Data Science", description: "Data analysis, visualization, statistics, and data-driven decisions.", icon: "BarChart3", color: "#6366F1", sortOrder: 8, isActive: true },
];

// ===== COURSES =====
export const MOCK_COURSES: MockCourse[] = [
  {
    id: "c1", slug: "claude-cowork-masterclass-tamil", title: "Claude Cowork Masterclass (தமிழ்)",
    description: "Automate anything using Claude AI. Learn prompt engineering, workflows, and real-world automation in Tamil.",
    thumbnail: "https://i.ytimg.com/vi/D61JR8jb3JE/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 3, isFree: true, isPublished: true,
    domainSlug: "ai-automation", domainId: "d1", domainName: "AI & Automation", domainColor: "#8B5CF6", languages: ["ta"], lessonCount: 1, sortOrder: 0,
    lessons: [
      { id: "l1", title: "Introduction to Claude & AI Automation", description: "Learn the fundamentals of AI automation", type: "VIDEO", duration: 3600, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "D61JR8jb3JE", lang: "ta", title: "Claude Cowork Masterclass", thumbnail: "https://i.ytimg.com/vi/D61JR8jb3JE/hqdefault.jpg", duration: 3600 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c2", slug: "generative-ai-full-course", title: "Generative AI Full Course",
    description: "Complete Generative AI course covering Gemini Pro, OpenAI, Llama, Langchain, Pinecone, and Vector Databases.",
    thumbnail: "https://i.ytimg.com/vi/mEsleV16qdo/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 12, isFree: true, isPublished: true,
    domainSlug: "ai-automation", domainId: "d1", domainName: "AI & Automation", domainColor: "#8B5CF6", languages: ["en"], lessonCount: 1, sortOrder: 1,
    lessons: [
      { id: "l2", title: "Generative AI – Full freeCodeCamp Course", description: "Complete gen AI course", type: "VIDEO", duration: 43200, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "mEsleV16qdo", lang: "en", title: "Generative AI Full Course", thumbnail: "https://i.ytimg.com/vi/mEsleV16qdo/hqdefault.jpg", duration: 43200 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c3", slug: "deep-learning-5mineng", title: "Deep Learning",
    description: "Comprehensive deep learning playlist covering neural networks, backpropagation, CNNs, RNNs, and more.",
    thumbnail: "https://i.ytimg.com/vi/aO8TXO0rLbU/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 8, isFree: true, isPublished: true,
    domainSlug: "deep-learning", domainId: "d2", domainName: "Deep Learning", domainColor: "#EC4899", languages: ["en"], lessonCount: 3, sortOrder: 2,
    lessons: [
      { id: "l3", title: "Introduction to Deep Learning", description: "", type: "VIDEO", duration: 1800, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "aO8TXO0rLbU", lang: "en", title: "Intro to Deep Learning", thumbnail: "https://i.ytimg.com/vi/aO8TXO0rLbU/hqdefault.jpg", duration: 1800 }],
        exercises: [], quizzes: [] },
      { id: "l4", title: "Neural Network Basics", description: "", type: "VIDEO", duration: 1200, sortOrder: 1, isFree: true,
        videoLinks: [{ youtubeId: "aircAruvnKk", lang: "en", title: "Neural Network Basics", thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg", duration: 1200 }],
        exercises: [], quizzes: [] },
      { id: "l5", title: "Backpropagation Explained", description: "", type: "VIDEO", duration: 1500, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "Ilg3gGewQ5U", lang: "en", title: "Backpropagation", thumbnail: "https://i.ytimg.com/vi/Ilg3gGewQ5U/hqdefault.jpg", duration: 1500 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c4", slug: "deep-learning-tamil", title: "Deep Learning in Tamil (தமிழ்)",
    description: "Deep Learning concepts explained in Tamil. Covers neural networks, CNN, RNN, and practical implementations.",
    thumbnail: "https://i.ytimg.com/vi/CcQZkOFT6aQ/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 10, isFree: false, isPublished: true,
    domainSlug: "deep-learning", domainId: "d2", domainName: "Deep Learning", domainColor: "#EC4899", languages: ["ta"], lessonCount: 3, sortOrder: 3,
    lessons: [
      { id: "l6", title: "Deep Learning அறிமுகம்", description: "", type: "VIDEO", duration: 2400, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "CcQZkOFT6aQ", lang: "ta", title: "Deep Learning அறிமுகம்", thumbnail: "https://i.ytimg.com/vi/CcQZkOFT6aQ/hqdefault.jpg", duration: 2400 }],
        exercises: [], quizzes: [] },
      { id: "l7", title: "Neural Networks - தமிழ்", description: "", type: "VIDEO", duration: 1800, sortOrder: 1, isFree: false,
        videoLinks: [{ youtubeId: "bfxFPF7Ep5g", lang: "ta", title: "Neural Networks Tamil", thumbnail: "https://i.ytimg.com/vi/bfxFPF7Ep5g/hqdefault.jpg", duration: 1800 }],
        exercises: [], quizzes: [] },
      { id: "l8", title: "CNN Explained in Tamil", description: "", type: "VIDEO", duration: 2100, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "2-Ol7ZB0MmU", lang: "ta", title: "CNN Tamil", thumbnail: "https://i.ytimg.com/vi/2-Ol7ZB0MmU/hqdefault.jpg", duration: 2100 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c5", slug: "deep-learning-crash-course", title: "Deep Learning Crash Course",
    description: "Deep Learning crash course for beginners by freeCodeCamp.",
    thumbnail: "https://i.ytimg.com/vi/VyWAvY2CF9c/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 5, isFree: true, isPublished: true,
    domainSlug: "deep-learning", domainId: "d2", domainName: "Deep Learning", domainColor: "#EC4899", languages: ["en"], lessonCount: 1, sortOrder: 4,
    lessons: [
      { id: "l9", title: "Deep Learning Crash Course – Full", description: "", type: "VIDEO", duration: 18000, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "VyWAvY2CF9c", lang: "en", title: "DL Crash Course", thumbnail: "https://i.ytimg.com/vi/VyWAvY2CF9c/hqdefault.jpg", duration: 18000 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c6", slug: "harvard-cs50-cybersecurity", title: "Harvard CS50 – Intro to Cybersecurity",
    description: "Full university course from Harvard covering cybersecurity fundamentals, cryptography, and security.",
    thumbnail: "https://i.ytimg.com/vi/9HOpanT0GRs/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 12, isFree: true, isPublished: true,
    domainSlug: "cybersecurity", domainId: "d3", domainName: "Cybersecurity", domainColor: "#10B981", languages: ["en"], lessonCount: 1, sortOrder: 5,
    lessons: [
      { id: "l10", title: "Harvard CS50 Cybersecurity – Full Course", description: "", type: "VIDEO", duration: 43200, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "9HOpanT0GRs", lang: "en", title: "CS50 Cybersecurity", thumbnail: "https://i.ytimg.com/vi/9HOpanT0GRs/hqdefault.jpg", duration: 43200 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c7", slug: "cyber-ethical-hacking-tamil", title: "CyberSecurity & Ethical Hacking (தமிழ்)",
    description: "43-hour comprehensive cybersecurity and ethical hacking course in Tamil.",
    thumbnail: "https://i.ytimg.com/vi/XWwYm0wPKrg/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 43, isFree: false, isPublished: true,
    domainSlug: "cybersecurity", domainId: "d3", domainName: "Cybersecurity", domainColor: "#10B981", languages: ["ta"], lessonCount: 3, sortOrder: 6,
    lessons: [
      { id: "l11", title: "Cybersecurity அறிமுகம்", description: "", type: "VIDEO", duration: 3600, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "XWwYm0wPKrg", lang: "ta", title: "Cybersecurity Intro Tamil", thumbnail: "https://i.ytimg.com/vi/XWwYm0wPKrg/hqdefault.jpg", duration: 3600 }],
        exercises: [], quizzes: [] },
      { id: "l12", title: "Network Security Basics", description: "", type: "VIDEO", duration: 2700, sortOrder: 1, isFree: false,
        videoLinks: [{ youtubeId: "xWwJbYi3GFo", lang: "ta", title: "Network Security Tamil", thumbnail: "https://i.ytimg.com/vi/xWwJbYi3GFo/hqdefault.jpg", duration: 2700 }],
        exercises: [], quizzes: [] },
      { id: "l13", title: "Ethical Hacking Tools", description: "", type: "VIDEO", duration: 3000, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "3Kq1MIfTWCE", lang: "ta", title: "Hacking Tools Tamil", thumbnail: "https://i.ytimg.com/vi/3Kq1MIfTWCE/hqdefault.jpg", duration: 3000 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c8", slug: "cyber-security-full-2025", title: "Cyber Security Full Course 2025",
    description: "Complete cybersecurity course updated for 2025.",
    thumbnail: "https://i.ytimg.com/vi/yywMI4pQbbc/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 15, isFree: true, isPublished: true,
    domainSlug: "cybersecurity", domainId: "d3", domainName: "Cybersecurity", domainColor: "#10B981", languages: ["en"], lessonCount: 3, sortOrder: 7,
    lessons: [
      { id: "l14", title: "What is Cybersecurity?", description: "", type: "VIDEO", duration: 2400, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "yywMI4pQbbc", lang: "en", title: "What is Cybersecurity", thumbnail: "https://i.ytimg.com/vi/yywMI4pQbbc/hqdefault.jpg", duration: 2400 }],
        exercises: [], quizzes: [] },
      { id: "l15", title: "Types of Cyber Attacks", description: "", type: "VIDEO", duration: 1800, sortOrder: 1, isFree: true,
        videoLinks: [{ youtubeId: "Dk-ZqQ-bU4A", lang: "en", title: "Cyber Attacks", thumbnail: "https://i.ytimg.com/vi/Dk-ZqQ-bU4A/hqdefault.jpg", duration: 1800 }],
        exercises: [], quizzes: [] },
      { id: "l16", title: "Firewalls and Network Security", description: "", type: "VIDEO", duration: 2100, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "kDEX1HXybrU", lang: "en", title: "Firewalls", thumbnail: "https://i.ytimg.com/vi/kDEX1HXybrU/hqdefault.jpg", duration: 2100 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c9", slug: "ml-hindi", title: "Machine Learning Course (हिन्दी)",
    description: "Learn Machine Learning algorithms from scratch with hands-on tutorials in Hindi.",
    thumbnail: "https://i.ytimg.com/vi/brgJYcz2Dc8/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 20, isFree: false, isPublished: true,
    domainSlug: "machine-learning", domainId: "d4", domainName: "Machine Learning", domainColor: "#F59E0B", languages: ["hi"], lessonCount: 3, sortOrder: 8,
    lessons: [
      { id: "l17", title: "ML Introduction – हिन्दी", description: "", type: "VIDEO", duration: 2400, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "brgJYcz2Dc8", lang: "hi", title: "ML Intro Hindi", thumbnail: "https://i.ytimg.com/vi/brgJYcz2Dc8/hqdefault.jpg", duration: 2400 }],
        exercises: [], quizzes: [] },
      { id: "l18", title: "Linear Regression – हिन्दी", description: "", type: "VIDEO", duration: 1800, sortOrder: 1, isFree: false,
        videoLinks: [{ youtubeId: "UZPfbG0jNec", lang: "hi", title: "Linear Regression Hindi", thumbnail: "https://i.ytimg.com/vi/UZPfbG0jNec/hqdefault.jpg", duration: 1800 }],
        exercises: [], quizzes: [] },
      { id: "l19", title: "Logistic Regression – हिन्दी", description: "", type: "VIDEO", duration: 2100, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "L_grVrIqJNg", lang: "hi", title: "Logistic Regression Hindi", thumbnail: "https://i.ytimg.com/vi/L_grVrIqJNg/hqdefault.jpg", duration: 2100 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c10", slug: "ml-freecodecamp", title: "Machine Learning",
    description: "Machine Learning playlist by freeCodeCamp covering all major algorithms.",
    thumbnail: "https://i.ytimg.com/vi/i_LwzRVP7bg/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 18, isFree: true, isPublished: true,
    domainSlug: "machine-learning", domainId: "d4", domainName: "Machine Learning", domainColor: "#F59E0B", languages: ["en"], lessonCount: 3, sortOrder: 9,
    lessons: [
      { id: "l20", title: "Machine Learning for Everybody", description: "", type: "VIDEO", duration: 18000, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "i_LwzRVP7bg", lang: "en", title: "ML for Everyone", thumbnail: "https://i.ytimg.com/vi/i_LwzRVP7bg/hqdefault.jpg", duration: 18000 }],
        exercises: [], quizzes: [] },
      { id: "l21", title: "TensorFlow Overview", description: "", type: "VIDEO", duration: 14400, sortOrder: 1, isFree: true,
        videoLinks: [{ youtubeId: "tPYj3fFJGjk", lang: "en", title: "TensorFlow", thumbnail: "https://i.ytimg.com/vi/tPYj3fFJGjk/hqdefault.jpg", duration: 14400 }],
        exercises: [], quizzes: [] },
      { id: "l22", title: "Scikit-Learn Course", description: "", type: "VIDEO", duration: 10800, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "pqNCD_5r0IU", lang: "en", title: "Scikit-Learn", thumbnail: "https://i.ytimg.com/vi/pqNCD_5r0IU/hqdefault.jpg", duration: 10800 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c11", slug: "python-tamil", title: "Python Programming (தமிழ்)",
    description: "Learn Python programming from scratch in Tamil.",
    thumbnail: "https://i.ytimg.com/vi/HAxm8n9QY50/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 12, isFree: true, isPublished: true,
    domainSlug: "python", domainId: "d5", domainName: "Python Programming", domainColor: "#3B82F6", languages: ["ta"], lessonCount: 3, sortOrder: 10,
    lessons: [
      { id: "l23", title: "Python Introduction – தமிழ்", description: "", type: "VIDEO", duration: 1800, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "HAxm8n9QY50", lang: "ta", title: "Python Intro Tamil", thumbnail: "https://i.ytimg.com/vi/HAxm8n9QY50/hqdefault.jpg", duration: 1800 }],
        exercises: [{ id: "ex1", title: "Hello World in Python", language: "python" }, { id: "ex2", title: "Sum of Two Numbers", language: "python" }],
        quizzes: [] },
      { id: "l24", title: "Variables & Data Types", description: "", type: "VIDEO", duration: 1500, sortOrder: 1, isFree: true,
        videoLinks: [{ youtubeId: "TqPzwR2QGRI", lang: "ta", title: "Variables Tamil", thumbnail: "https://i.ytimg.com/vi/TqPzwR2QGRI/hqdefault.jpg", duration: 1500 }],
        exercises: [], quizzes: [] },
      { id: "l25", title: "Loops & Conditions", description: "", type: "VIDEO", duration: 2100, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "9Ok76LZNPFE", lang: "ta", title: "Loops Tamil", thumbnail: "https://i.ytimg.com/vi/9Ok76LZNPFE/hqdefault.jpg", duration: 2100 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c12", slug: "java-tamil", title: "Java Programming (தமிழ்)",
    description: "Complete Java programming course in Tamil for beginners.",
    thumbnail: "https://i.ytimg.com/vi/kGxSyqKbzsc/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 14, isFree: true, isPublished: true,
    domainSlug: "java", domainId: "d6", domainName: "Java Programming", domainColor: "#EF4444", languages: ["ta"], lessonCount: 3, sortOrder: 11,
    lessons: [
      { id: "l26", title: "Java Introduction – தமிழ்", description: "", type: "VIDEO", duration: 2400, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "kGxSyqKbzsc", lang: "ta", title: "Java Intro Tamil", thumbnail: "https://i.ytimg.com/vi/kGxSyqKbzsc/hqdefault.jpg", duration: 2400 }],
        exercises: [], quizzes: [] },
      { id: "l27", title: "OOP Concepts in Java", description: "", type: "VIDEO", duration: 2100, sortOrder: 1, isFree: true,
        videoLinks: [{ youtubeId: "xk4_1vDrzzo", lang: "ta", title: "OOP Tamil", thumbnail: "https://i.ytimg.com/vi/xk4_1vDrzzo/hqdefault.jpg", duration: 2100 }],
        exercises: [], quizzes: [] },
      { id: "l28", title: "Java Collections", description: "", type: "VIDEO", duration: 1800, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "rzA7UJ-hQn4", lang: "ta", title: "Collections Tamil", thumbnail: "https://i.ytimg.com/vi/rzA7UJ-hQn4/hqdefault.jpg", duration: 1800 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c13", slug: "excel-hindi", title: "Microsoft Excel Complete (हिन्दी)",
    description: "17-hour complete Excel course from beginner to advanced in Hindi.",
    thumbnail: "https://i.ytimg.com/vi/FtQk_tPnD4I/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 17, isFree: true, isPublished: true,
    domainSlug: "excel-productivity", domainId: "d7", domainName: "Excel & Productivity", domainColor: "#22C55E", languages: ["hi"], lessonCount: 1, sortOrder: 12,
    lessons: [
      { id: "l29", title: "Excel Complete Course – Hindi", description: "", type: "VIDEO", duration: 61200, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "FtQk_tPnD4I", lang: "hi", title: "Excel Hindi", thumbnail: "https://i.ytimg.com/vi/FtQk_tPnD4I/hqdefault.jpg", duration: 61200 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c14", slug: "excel-full-2025", title: "Microsoft Excel Full Course 2025",
    description: "Excel full course updated for 2025.",
    thumbnail: "https://i.ytimg.com/vi/r5fXft08dVY/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 10, isFree: true, isPublished: true,
    domainSlug: "excel-productivity", domainId: "d7", domainName: "Excel & Productivity", domainColor: "#22C55E", languages: ["en"], lessonCount: 3, sortOrder: 13,
    lessons: [
      { id: "l30", title: "Excel Basics for Beginners", description: "", type: "VIDEO", duration: 3600, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "r5fXft08dVY", lang: "en", title: "Excel Basics", thumbnail: "https://i.ytimg.com/vi/r5fXft08dVY/hqdefault.jpg", duration: 3600 }],
        exercises: [], quizzes: [] },
      { id: "l31", title: "Formulas & Functions", description: "", type: "VIDEO", duration: 2400, sortOrder: 1, isFree: true,
        videoLinks: [{ youtubeId: "Jl0Qk63z2ZY", lang: "en", title: "Excel Formulas", thumbnail: "https://i.ytimg.com/vi/Jl0Qk63z2ZY/hqdefault.jpg", duration: 2400 }],
        exercises: [], quizzes: [] },
      { id: "l32", title: "Pivot Tables & Charts", description: "", type: "VIDEO", duration: 2700, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "qu-AK0Hv0b4", lang: "en", title: "Pivot Tables", thumbnail: "https://i.ytimg.com/vi/qu-AK0Hv0b4/hqdefault.jpg", duration: 2700 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c15", slug: "excel-tamil", title: "Excel (தமிழ்)",
    description: "Learn Microsoft Excel in Tamil.",
    thumbnail: "https://i.ytimg.com/vi/ZmBjibf8dyQ/hqdefault.jpg", difficulty: "BASIC", estimatedHrs: 8, isFree: true, isPublished: true,
    domainSlug: "excel-productivity", domainId: "d7", domainName: "Excel & Productivity", domainColor: "#22C55E", languages: ["ta"], lessonCount: 2, sortOrder: 14,
    lessons: [
      { id: "l33", title: "Excel அறிமுகம் – Tamil", description: "", type: "VIDEO", duration: 1800, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "ZmBjibf8dyQ", lang: "ta", title: "Excel Tamil", thumbnail: "https://i.ytimg.com/vi/ZmBjibf8dyQ/hqdefault.jpg", duration: 1800 }],
        exercises: [], quizzes: [] },
      { id: "l34", title: "Excel Formulas Tamil", description: "", type: "VIDEO", duration: 2100, sortOrder: 1, isFree: true,
        videoLinks: [{ youtubeId: "LkW8cDGC_Ts", lang: "ta", title: "Excel Formulas Tamil", thumbnail: "https://i.ytimg.com/vi/LkW8cDGC_Ts/hqdefault.jpg", duration: 2100 }],
        exercises: [], quizzes: [] },
    ],
  },
  {
    id: "c16", slug: "data-science-tamil", title: "Data Science (தமிழ்)",
    description: "Complete Data Science course in Tamil covering analysis, visualization, and ML.",
    thumbnail: "https://i.ytimg.com/vi/k6HOBjkUkE4/hqdefault.jpg", difficulty: "MEDIUM", estimatedHrs: 16, isFree: false, isPublished: true,
    domainSlug: "data-science", domainId: "d8", domainName: "Data Science", domainColor: "#6366F1", languages: ["ta"], lessonCount: 3, sortOrder: 15,
    lessons: [
      { id: "l35", title: "Data Science அறிமுகம்", description: "", type: "VIDEO", duration: 2400, sortOrder: 0, isFree: true,
        videoLinks: [{ youtubeId: "k6HOBjkUkE4", lang: "ta", title: "Data Science Tamil", thumbnail: "https://i.ytimg.com/vi/k6HOBjkUkE4/hqdefault.jpg", duration: 2400 }],
        exercises: [], quizzes: [] },
      { id: "l36", title: "Pandas & NumPy Tamil", description: "", type: "VIDEO", duration: 1800, sortOrder: 1, isFree: false,
        videoLinks: [{ youtubeId: "CmorAWRsCAw", lang: "ta", title: "Pandas Tamil", thumbnail: "https://i.ytimg.com/vi/CmorAWRsCAw/hqdefault.jpg", duration: 1800 }],
        exercises: [], quizzes: [] },
      { id: "l37", title: "Data Visualization Tamil", description: "", type: "VIDEO", duration: 2100, sortOrder: 2, isFree: false,
        videoLinks: [{ youtubeId: "4jxHBbfTP8w", lang: "ta", title: "Data Viz Tamil", thumbnail: "https://i.ytimg.com/vi/4jxHBbfTP8w/hqdefault.jpg", duration: 2100 }],
        exercises: [], quizzes: [] },
    ],
  },
];

/**
 * Get courses filtered by params
 */
export function getMockCourses(params: {
  domain?: string;
  difficulty?: string;
  lang?: string;
  free?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let filtered = MOCK_COURSES.filter(c => c.isPublished);

  if (params.domain) filtered = filtered.filter(c => c.domainSlug === params.domain);
  if (params.difficulty) filtered = filtered.filter(c => c.difficulty === params.difficulty);
  if (params.lang) filtered = filtered.filter(c => c.languages.includes(params.lang!));
  if (params.free) filtered = filtered.filter(c => c.isFree);
  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
    );
  }

  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items: items.map(c => ({
      id: c.id, slug: c.slug, title: c.title, description: c.description,
      thumbnail: c.thumbnail, difficulty: c.difficulty, estimatedHrs: c.estimatedHrs,
      isFree: c.isFree, domainSlug: c.domainSlug, domainName: c.domainName,
      domainColor: c.domainColor, languages: c.languages, lessonCount: c.lessonCount,
    })),
    total: filtered.length,
    page, limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}
