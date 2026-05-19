import { NextResponse } from "next/server";
import { generateCareerSuggestions } from "@/lib/gemini";

const FALLBACK_CAREER = `## 🎯 Top Matching Roles

1. **Junior Software Developer** — Build web applications and tools using Python/JavaScript
2. **Data Analyst** — Analyze datasets to drive business decisions  
3. **IT Security Intern** — Help organizations secure their digital infrastructure

## 📊 Skill Scores
- Python: 85%
- Cloud Computing: 40%
- SQL Database: 65%
- Cybersecurity: 90%

## 🎓 Recommended Next Steps
1. Master Cloud Deployment (AWS/Vercel)
2. Build 3 full-stack portfolio projects
3. Obtain basic cybersecurity certification (Security+)

## 💼 Freelance Opportunities
- Web scraping scripts for local businesses
- Python automation for data entry
- Basic vulnerability scanning for small websites

## 📈 Market Trends
Tech roles continue to grow rapidly. Python and AI skills are in especially high demand in 2025-2026, with an emphasis on automation and secure coding practices.`;

export async function POST(request: Request) {
  try {
    const { skills, completedCourses, experienceLevel, lang } = await request.json();

    try {
      const response = await generateCareerSuggestions(
        skills || [],
        completedCourses || [],
        experienceLevel || "Beginner",
        lang || "en"
      );

      return NextResponse.json({
        success: true,
        data: { content: response, source: "gemini" },
      });
    } catch (apiError) {
      console.error("Career suggest fallback:", apiError);
      return NextResponse.json({
        success: true,
        data: { content: FALLBACK_CAREER, source: "fallback" },
      });
    }
  } catch (error) {
    console.error("Career Suggest Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
