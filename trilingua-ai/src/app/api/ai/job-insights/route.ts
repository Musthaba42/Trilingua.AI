import { NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini";

const FALLBACK_INSIGHTS = `## 🎯 Job Market Insights

### Top Matching Roles
1. **Junior AI/ML Engineer** — ₹6-12 LPA | High demand in Bangalore, Chennai, Hyderabad
2. **Python Developer** — ₹4-8 LPA | Strong demand across startups and enterprises
3. **Cybersecurity Analyst** — ₹5-10 LPA | Growing demand with 35% YoY increase

### 📊 Your Skill Score
- **AI & Machine Learning**: 72/100
- **Python Programming**: 85/100
- **Cybersecurity**: 45/100
- **Data Analysis**: 60/100

### 🚀 Recommended Next Steps
1. Complete the **Deep Learning** track to unlock AI Engineer roles
2. Build 2-3 portfolio projects showcasing your Python skills
3. Get certified in **AWS Cloud Practitioner** for cloud-related roles

### 💼 Freelance Opportunities
- **AI Chatbot Development** — ₹15,000-50,000 per project
- **Data Analysis & Visualization** — ₹10,000-30,000 per project
- **Security Auditing** — ₹20,000-60,000 per project

### 📈 Market Trends (2025-2026)
- AI/ML roles growing at **42% YoY** in India
- Remote work opportunities increased by **28%** 
- Tamil Nadu tech sector expanding with **15+ new tech parks**`;

export async function POST(request: Request) {
  try {
    const { skills, completedCourses, experienceLevel, domainProgress, lang } = await request.json();

    try {
      const langInstruction = lang === "ta"
        ? "Respond in Tamil (use English for technical terms and job titles)."
        : lang === "hi"
        ? "Respond in Hindi (use English for technical terms and job titles)."
        : "Respond in English.";

      const prompt = `${langInstruction}

You are a career advisor and job market analyst for Indian tech professionals. Based on the following student profile, provide:

1. **Top 3 Matching Job Roles** — with salary range (in LPA/INR), demand level, and key cities
2. **Skill Score** — rate their proficiency out of 100 for each domain they're learning
3. **Recommended Next Steps** — 3 actionable steps to improve employability
4. **Freelance/Outsourcing Opportunities** — list 3 freelance gig types with price ranges in INR
5. **Market Trends** — brief 2025-2026 outlook for their skill areas

Student Profile:
- Skills: ${skills?.join(", ") || "Python, Basic AI"}
- Completed Courses: ${completedCourses?.join(", ") || "None yet"}
- Experience Level: ${experienceLevel || "Beginner"}
- Domain Progress: ${JSON.stringify(domainProgress || {})}

Use emojis, markdown formatting, and make it visually engaging. Keep under 500 words.`;

      const response = await generateGeminiContent(prompt, "gemini-2.0-flash");

      return NextResponse.json({
        success: true,
        data: { content: response, source: "gemini" },
      });
    } catch (apiError) {
      console.error("Job insights fallback:", apiError);
      return NextResponse.json({
        success: true,
        data: { content: FALLBACK_INSIGHTS, source: "fallback" },
      });
    }
  } catch (error) {
    console.error("Job Insights Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
