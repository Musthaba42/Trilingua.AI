import { PrismaClient, ExpLevel, LessonType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed data for Trilingua AI — sourced from the YouTube playlist file.
 * Creates 8 domains, 18 courses, lessons, exercises, and quizzes.
 */
async function main() {
  console.log("🌱 Seeding Trilingua AI database...");

  // ============================================================
  // DOMAINS
  // ============================================================
  const domains = [
    {
      slug: "ai-automation",
      name: "AI & Automation",
      description: "Master AI tools, automation workflows, and intelligent systems.",
      icon: "Bot",
      color: "#8B5CF6",
      sortOrder: 1,
    },
    {
      slug: "deep-learning",
      name: "Deep Learning",
      description: "Neural networks, CNNs, RNNs, transformers, and deep learning fundamentals.",
      icon: "Brain",
      color: "#EC4899",
      sortOrder: 2,
    },
    {
      slug: "cybersecurity",
      name: "Cybersecurity",
      description: "Ethical hacking, network security, cryptography, and cyber defense.",
      icon: "Shield",
      color: "#10B981",
      sortOrder: 3,
    },
    {
      slug: "machine-learning",
      name: "Machine Learning",
      description: "Supervised, unsupervised, and reinforcement learning algorithms.",
      icon: "Cpu",
      color: "#F59E0B",
      sortOrder: 4,
    },
    {
      slug: "python",
      name: "Python Programming",
      description: "Python fundamentals, data structures, OOP, and real-world projects.",
      icon: "Code2",
      color: "#3B82F6",
      sortOrder: 5,
    },
    {
      slug: "java",
      name: "Java Programming",
      description: "Core Java, OOP, collections, multithreading, and enterprise development.",
      icon: "Coffee",
      color: "#EF4444",
      sortOrder: 6,
    },
    {
      slug: "excel-productivity",
      name: "Excel & Productivity",
      description: "Microsoft Excel, formulas, pivot tables, VBA, and data analysis.",
      icon: "Table",
      color: "#22C55E",
      sortOrder: 7,
    },
    {
      slug: "data-science",
      name: "Data Science",
      description: "Data analysis, visualization, statistics, and data-driven decision making.",
      icon: "BarChart3",
      color: "#6366F1",
      sortOrder: 8,
    },
  ];

  for (const domain of domains) {
    await prisma.domain.upsert({
      where: { slug: domain.slug },
      update: domain,
      create: domain,
    });
  }
  console.log(`✅ Created ${domains.length} domains`);

  // ============================================================
  // COURSES & LESSONS
  // ============================================================

  const domainMap = await prisma.domain.findMany();
  const getDomainId = (slug: string) =>
    domainMap.find((d) => d.slug === slug)?.id || domainMap[0].id;

  const courses = [
    // --- AI & Automation ---
    {
      slug: "claude-cowork-masterclass-tamil",
      title: "Claude Cowork Masterclass (தமிழ்)",
      description: "Automate anything using Claude AI. Learn prompt engineering, workflows, and real-world automation in Tamil.",
      thumbnail: "https://i.ytimg.com/vi/D61JR8jb3JE/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 3,
      isFree: true,
      isPublished: true,
      domainSlug: "ai-automation",
      lang: "ta",
      lessons: [
        {
          title: "Introduction to Claude & AI Automation",
          youtubeId: "D61JR8jb3JE",
          lang: "ta",
          duration: 3600,
          isFree: true,
        },
      ],
    },
    {
      slug: "generative-ai-full-course",
      title: "Generative AI Full Course",
      description: "Complete Generative AI course covering Gemini Pro, OpenAI, Llama, Langchain, Pinecone, and Vector Databases.",
      thumbnail: "https://i.ytimg.com/vi/mEsleV16qdo/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 12,
      isFree: true,
      isPublished: true,
      domainSlug: "ai-automation",
      lang: "en",
      lessons: [
        {
          title: "Generative AI – Full freeCodeCamp Course",
          youtubeId: "mEsleV16qdo",
          lang: "en",
          duration: 43200,
          isFree: true,
        },
      ],
    },

    // --- Deep Learning ---
    {
      slug: "deep-learning-5mineng",
      title: "Deep Learning",
      description: "Comprehensive deep learning playlist covering neural networks, backpropagation, CNNs, RNNs, and more.",
      thumbnail: "https://i.ytimg.com/vi/aO8TXO0rLbU/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 8,
      isFree: true,
      isPublished: true,
      domainSlug: "deep-learning",
      lang: "en",
      playlistId: "PLYwpaL_SFmcD-6P8cuX2bZAHSThF6AYvq",
      lessons: [
        { title: "Introduction to Deep Learning", youtubeId: "aO8TXO0rLbU", lang: "en", duration: 1800, isFree: true },
        { title: "Neural Network Basics", youtubeId: "aircAruvnKk", lang: "en", duration: 1200, isFree: true },
        { title: "Backpropagation Explained", youtubeId: "Ilg3gGewQ5U", lang: "en", duration: 1500, isFree: false },
      ],
    },
    {
      slug: "deep-learning-tamil",
      title: "Deep Learning in Tamil (தமிழ்)",
      description: "Deep Learning concepts explained in Tamil. Covers neural networks, CNN, RNN, and practical implementations.",
      thumbnail: "https://i.ytimg.com/vi/CcQZkOFT6aQ/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 10,
      isFree: false,
      isPublished: true,
      domainSlug: "deep-learning",
      lang: "ta",
      playlistId: "PLJtSFa-YIedY82pcM1RCKkqqArpQRm6tL",
      lessons: [
        { title: "Deep Learning அறிமுகம்", youtubeId: "CcQZkOFT6aQ", lang: "ta", duration: 2400, isFree: true },
        { title: "Neural Networks - தமிழ்", youtubeId: "bfxFPF7Ep5g", lang: "ta", duration: 1800, isFree: false },
        { title: "CNN Explained in Tamil", youtubeId: "2-Ol7ZB0MmU", lang: "ta", duration: 2100, isFree: false },
      ],
    },
    {
      slug: "deep-learning-crash-course",
      title: "Deep Learning Crash Course",
      description: "Deep Learning crash course for beginners by freeCodeCamp. Perfect for getting started quickly.",
      thumbnail: "https://i.ytimg.com/vi/VyWAvY2CF9c/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 5,
      isFree: true,
      isPublished: true,
      domainSlug: "deep-learning",
      lang: "en",
      lessons: [
        { title: "Deep Learning Crash Course – Full Video", youtubeId: "VyWAvY2CF9c", lang: "en", duration: 18000, isFree: true },
      ],
    },

    // --- Cybersecurity ---
    {
      slug: "harvard-cs50-cybersecurity",
      title: "Harvard CS50 – Intro to Cybersecurity",
      description: "Full university course from Harvard covering cybersecurity fundamentals, cryptography, and security practices.",
      thumbnail: "https://i.ytimg.com/vi/9HOpanT0GRs/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 12,
      isFree: true,
      isPublished: true,
      domainSlug: "cybersecurity",
      lang: "en",
      lessons: [
        { title: "Harvard CS50 Cybersecurity – Full Course", youtubeId: "9HOpanT0GRs", lang: "en", duration: 43200, isFree: true },
      ],
    },
    {
      slug: "cyber-ethical-hacking-tamil",
      title: "CyberSecurity & Ethical Hacking (தமிழ்)",
      description: "43-hour comprehensive cybersecurity and ethical hacking course in Tamil by Cappriciosec University.",
      thumbnail: "https://i.ytimg.com/vi/XWwYm0wPKrg/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 43,
      isFree: false,
      isPublished: true,
      domainSlug: "cybersecurity",
      lang: "ta",
      playlistId: "PLfKsTB9vcgpnAXOXKA6exgILk4VyamDxW",
      lessons: [
        { title: "Cybersecurity அறிமுகம்", youtubeId: "XWwYm0wPKrg", lang: "ta", duration: 3600, isFree: true },
        { title: "Network Security Basics", youtubeId: "xWwJbYi3GFo", lang: "ta", duration: 2700, isFree: false },
        { title: "Ethical Hacking Tools", youtubeId: "3Kq1MIfTWCE", lang: "ta", duration: 3000, isFree: false },
      ],
    },
    {
      slug: "cyber-security-full-2025",
      title: "Cyber Security Full Course 2025",
      description: "Complete cybersecurity course updated for 2025 by WsCube. Covers all essential topics.",
      thumbnail: "https://i.ytimg.com/vi/yywMI4pQbbc/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 15,
      isFree: true,
      isPublished: true,
      domainSlug: "cybersecurity",
      lang: "en",
      playlistId: "PLwO5-rumi8A7RnPxB6Zx0wKFjFy75hCQs",
      lessons: [
        { title: "What is Cybersecurity?", youtubeId: "yywMI4pQbbc", lang: "en", duration: 2400, isFree: true },
        { title: "Types of Cyber Attacks", youtubeId: "Dk-ZqQ-bU4A", lang: "en", duration: 1800, isFree: true },
        { title: "Firewalls and Network Security", youtubeId: "kDEX1HXybrU", lang: "en", duration: 2100, isFree: false },
      ],
    },

    // --- Machine Learning ---
    {
      slug: "ml-hindi",
      title: "Machine Learning Course (हिन्दी)",
      description: "Learn Machine Learning algorithms from scratch with hands-on tutorials in Hindi.",
      thumbnail: "https://i.ytimg.com/vi/brgJYcz2Dc8/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 20,
      isFree: false,
      isPublished: true,
      domainSlug: "machine-learning",
      lang: "hi",
      playlistId: "PLlpUUtQ9RrF4o3UTYbc4cP3NCEyE5BwX5",
      lessons: [
        { title: "ML Introduction – हिन्दी", youtubeId: "brgJYcz2Dc8", lang: "hi", duration: 2400, isFree: true },
        { title: "Linear Regression – हिन्दी", youtubeId: "UZPfbG0jNec", lang: "hi", duration: 1800, isFree: false },
        { title: "Logistic Regression – हिन्दी", youtubeId: "L_grVrIqJNg", lang: "hi", duration: 2100, isFree: false },
      ],
    },
    {
      slug: "ml-freecodecamp",
      title: "Machine Learning",
      description: "Machine Learning playlist by freeCodeCamp covering all major algorithms and techniques.",
      thumbnail: "https://i.ytimg.com/vi/i_LwzRVP7bg/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 18,
      isFree: true,
      isPublished: true,
      domainSlug: "machine-learning",
      lang: "en",
      playlistId: "PLWKjhJtqVAblStefaz_YOVpDWqcRScc2s",
      lessons: [
        { title: "Machine Learning for Everybody", youtubeId: "i_LwzRVP7bg", lang: "en", duration: 18000, isFree: true },
        { title: "TensorFlow Overview", youtubeId: "tPYj3fFJGjk", lang: "en", duration: 14400, isFree: true },
        { title: "Scikit-Learn Course", youtubeId: "pqNCD_5r0IU", lang: "en", duration: 10800, isFree: false },
      ],
    },
    {
      slug: "ml-nptel-tamil",
      title: "Introduction to Machine Learning (தமிழ்)",
      description: "NPTEL IIT Madras course on Introduction to Machine Learning taught in Tamil.",
      thumbnail: "https://i.ytimg.com/vi/zxVz2I3ZMHs/hqdefault.jpg",
      difficulty: "PRO" as const,
      estimatedHrs: 30,
      isFree: false,
      isPublished: true,
      domainSlug: "machine-learning",
      lang: "ta",
      playlistId: "PLyqSpQzTE6M-9thAeyB2mRFYvvW8AWxXX",
      lessons: [
        { title: "ML Introduction – NPTEL Tamil", youtubeId: "zxVz2I3ZMHs", lang: "ta", duration: 3600, isFree: true },
        { title: "Probability & Statistics Review", youtubeId: "HBtu6AOg0FE", lang: "ta", duration: 3000, isFree: false },
      ],
    },
    {
      slug: "ml-python-tamil",
      title: "Basic Machine Learning with Python (தமிழ்)",
      description: "Full course on basic ML using Python, explained in Tamil by Dr. Nancy Jane.",
      thumbnail: "https://i.ytimg.com/vi/yOi7AiUXEG8/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 15,
      isFree: true,
      isPublished: true,
      domainSlug: "machine-learning",
      lang: "ta",
      playlistId: "PL6yMCxtZM6g_ilywH39m75GxgKG9wgGfG",
      lessons: [
        { title: "ML with Python – அறிமுகம்", youtubeId: "yOi7AiUXEG8", lang: "ta", duration: 2400, isFree: true },
        { title: "Data Preprocessing Tamil", youtubeId: "rN8H0QFKD8I", lang: "ta", duration: 1800, isFree: true },
      ],
    },

    // --- Python ---
    {
      slug: "python-tamil",
      title: "Python Programming (தமிழ்)",
      description: "Learn Python programming from scratch in Tamil.",
      thumbnail: "https://i.ytimg.com/vi/HAxm8n9QY50/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 12,
      isFree: true,
      isPublished: true,
      domainSlug: "python",
      lang: "ta",
      playlistId: "PLo-eE9EcR0iuevVVeRHZcR9MRi_8v2kBq",
      lessons: [
        { title: "Python Introduction – தமிழ்", youtubeId: "HAxm8n9QY50", lang: "ta", duration: 1800, isFree: true },
        { title: "Variables & Data Types", youtubeId: "TqPzwR2QGRI", lang: "ta", duration: 1500, isFree: true },
        { title: "Loops & Conditions", youtubeId: "9Ok76LZNPFE", lang: "ta", duration: 2100, isFree: false },
      ],
    },

    // --- Java ---
    {
      slug: "java-tamil",
      title: "Java Programming (தமிழ்)",
      description: "Complete Java programming course in Tamil for beginners.",
      thumbnail: "https://i.ytimg.com/vi/kGxSyqKbzsc/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 14,
      isFree: true,
      isPublished: true,
      domainSlug: "java",
      lang: "ta",
      playlistId: "PLo-eE9EcR0ivg1qNb7YcJeRVRVKoTl-WO",
      lessons: [
        { title: "Java Introduction – தமிழ்", youtubeId: "kGxSyqKbzsc", lang: "ta", duration: 2400, isFree: true },
        { title: "OOP Concepts in Java", youtubeId: "xk4_1vDrzzo", lang: "ta", duration: 2100, isFree: true },
        { title: "Java Collections", youtubeId: "rzA7UJ-hQn4", lang: "ta", duration: 1800, isFree: false },
      ],
    },

    // --- Excel & Productivity ---
    {
      slug: "excel-hindi",
      title: "Microsoft Excel Complete (हिन्दी)",
      description: "17-hour complete Excel course from beginner to advanced in Hindi.",
      thumbnail: "https://i.ytimg.com/vi/FtQk_tPnD4I/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 17,
      isFree: true,
      isPublished: true,
      domainSlug: "excel-productivity",
      lang: "hi",
      lessons: [
        { title: "Excel Complete Course – Hindi", youtubeId: "FtQk_tPnD4I", lang: "hi", duration: 61200, isFree: true },
      ],
    },
    {
      slug: "excel-full-2025",
      title: "Microsoft Excel Full Course 2025",
      description: "Excel full course updated for 2025 by Pavan Lalwani.",
      thumbnail: "https://i.ytimg.com/vi/r5fXft08dVY/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 10,
      isFree: true,
      isPublished: true,
      domainSlug: "excel-productivity",
      lang: "en",
      playlistId: "PL6Omre3duO-N7yY1Uxl7hOC3gRMMomamK",
      lessons: [
        { title: "Excel Basics for Beginners", youtubeId: "r5fXft08dVY", lang: "en", duration: 3600, isFree: true },
        { title: "Formulas & Functions", youtubeId: "Jl0Qk63z2ZY", lang: "en", duration: 2400, isFree: true },
        { title: "Pivot Tables & Charts", youtubeId: "qu-AK0Hv0b4", lang: "en", duration: 2700, isFree: false },
      ],
    },
    {
      slug: "excel-tamil",
      title: "Excel (தமிழ்)",
      description: "Learn Microsoft Excel in Tamil – formulas, charts, and data analysis.",
      thumbnail: "https://i.ytimg.com/vi/ZmBjibf8dyQ/hqdefault.jpg",
      difficulty: "BASIC" as const,
      estimatedHrs: 8,
      isFree: true,
      isPublished: true,
      domainSlug: "excel-productivity",
      lang: "ta",
      playlistId: "PLo-eE9EcR0ivKwu40gTlLsIKBZoYm0e4X",
      lessons: [
        { title: "Excel அறிமுகம் – Tamil", youtubeId: "ZmBjibf8dyQ", lang: "ta", duration: 1800, isFree: true },
        { title: "Excel Formulas Tamil", youtubeId: "LkW8cDGC_Ts", lang: "ta", duration: 2100, isFree: true },
      ],
    },

    // --- Data Science ---
    {
      slug: "data-science-tamil",
      title: "Data Science (தமிழ்)",
      description: "Complete Data Science course in Tamil covering analysis, visualization, and ML.",
      thumbnail: "https://i.ytimg.com/vi/k6HOBjkUkE4/hqdefault.jpg",
      difficulty: "MEDIUM" as const,
      estimatedHrs: 16,
      isFree: false,
      isPublished: true,
      domainSlug: "data-science",
      lang: "ta",
      playlistId: "PLo-eE9EcR0iu-A-WmUj-KQZVCeXGv2SJp",
      lessons: [
        { title: "Data Science அறிமுகம்", youtubeId: "k6HOBjkUkE4", lang: "ta", duration: 2400, isFree: true },
        { title: "Pandas & NumPy Tamil", youtubeId: "CmorAWRsCAw", lang: "ta", duration: 1800, isFree: false },
        { title: "Data Visualization Tamil", youtubeId: "4jxHBbfTP8w", lang: "ta", duration: 2100, isFree: false },
      ],
    },
  ];

  let courseCount = 0;
  let lessonCount = 0;

  for (const courseData of courses) {
    const {
      slug,
      title,
      description,
      thumbnail,
      difficulty,
      estimatedHrs,
      isFree,
      isPublished,
      domainSlug,
      lang,
      playlistId,
      lessons,
    } = courseData;

    const domainId = getDomainId(domainSlug);

    // Upsert course
    const course = await prisma.course.upsert({
      where: { slug },
      update: {
        title,
        description,
        thumbnail,
        difficulty: difficulty as ExpLevel,
        estimatedHrs,
        isFree,
        isPublished,
        domainId,
      },
      create: {
        slug,
        title,
        description,
        thumbnail,
        difficulty: difficulty as ExpLevel,
        estimatedHrs,
        isFree,
        isPublished,
        domainId,
        sortOrder: courseCount,
      },
    });
    courseCount++;

    // Language variant
    await prisma.languageVariant.upsert({
      where: { courseId_lang: { courseId: course.id, lang } },
      update: { title },
      create: { courseId: course.id, lang, title },
    });

    // Playlist if applicable
    if (playlistId) {
      const existingPlaylist = await prisma.playlist.findFirst({
        where: { courseId: course.id, youtubeId: playlistId },
      });
      if (!existingPlaylist) {
        await prisma.playlist.create({
          data: {
            courseId: course.id,
            youtubeId: playlistId,
            title,
            lang,
            sourceUrl: `https://youtube.com/playlist?list=${playlistId}`,
          },
        });
      }
    }

    // Lessons
    for (let i = 0; i < lessons.length; i++) {
      const lessonData = lessons[i];
      const existingLesson = await prisma.lesson.findFirst({
        where: { courseId: course.id, sortOrder: i },
      });

      const lesson = existingLesson
        ? await prisma.lesson.update({
            where: { id: existingLesson.id },
            data: {
              title: lessonData.title,
              duration: lessonData.duration,
              isFree: lessonData.isFree,
              type: LessonType.VIDEO,
            },
          })
        : await prisma.lesson.create({
            data: {
              courseId: course.id,
              title: lessonData.title,
              sortOrder: i,
              duration: lessonData.duration,
              isFree: lessonData.isFree,
              type: LessonType.VIDEO,
            },
          });

      // Video link
      await prisma.videoLink.upsert({
        where: { lessonId_lang: { lessonId: lesson.id, lang: lessonData.lang } },
        update: {
          youtubeId: lessonData.youtubeId,
          title: lessonData.title,
          duration: lessonData.duration,
        },
        create: {
          lessonId: lesson.id,
          youtubeId: lessonData.youtubeId,
          lang: lessonData.lang,
          title: lessonData.title,
          thumbnail: `https://i.ytimg.com/vi/${lessonData.youtubeId}/hqdefault.jpg`,
          duration: lessonData.duration,
        },
      });

      lessonCount++;
    }
  }

  console.log(`✅ Created ${courseCount} courses with ${lessonCount} lessons`);

  // ============================================================
  // SAMPLE PRACTICE EXERCISES
  // ============================================================
  const pythonCourse = await prisma.course.findUnique({ where: { slug: "python-tamil" } });
  if (pythonCourse) {
    const firstLesson = await prisma.lesson.findFirst({
      where: { courseId: pythonCourse.id },
      orderBy: { sortOrder: "asc" },
    });

    if (firstLesson) {
      const existingExercise = await prisma.practiceExercise.findFirst({
        where: { lessonId: firstLesson.id },
      });


      if (!existingExercise) {
        await prisma.practiceExercise.create({
          data: {
            lessonId: firstLesson.id,
            title: "Hello World in Python",
            instructions:
              'Write a Python program that prints "Hello, Trilingua AI!" to the console.\n\n**Expected Output:**\n```\nHello, Trilingua AI!\n```',
            starterCode: '# Write your code here\nprint("Hello, ")',
            solution: 'print("Hello, Trilingua AI!")',
            language: "python",
            testCases: JSON.parse(
              '[{"input":"","expectedOutput":"Hello, Trilingua AI!","description":"Should print the greeting"}]'
            ),
            difficulty: "BASIC",
            sortOrder: 0,
          },
        });

        await prisma.practiceExercise.create({
          data: {
            lessonId: firstLesson.id,
            title: "Sum of Two Numbers",
            instructions:
              "Write a function `add(a, b)` that returns the sum of two numbers.\n\n**Example:**\n```python\nadd(3, 5)  # Returns 8\n```",
            starterCode: "def add(a, b):\n    # Write your code here\n    pass\n\n# Test\nprint(add(3, 5))",
            solution: "def add(a, b):\n    return a + b\n\nprint(add(3, 5))",
            language: "python",
            testCases: JSON.parse(
              '[{"input":"","expectedOutput":"8","description":"add(3, 5) should return 8"}]'
            ),
            difficulty: "BASIC",
            sortOrder: 1,
          },
        });

        console.log("✅ Created sample practice exercises");
      }
    }
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
