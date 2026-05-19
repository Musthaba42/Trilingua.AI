import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, difficulty, techStack, language } = await request.json();

    if (!title || !techStack) {
      return NextResponse.json(
        { success: false, error: "Project title and tech stack are required" },
        { status: 400 }
      );
    }

    const resolvedLanguage = language || "English";
    const resolvedDifficulty = difficulty || "Medium";

    const prompt = `Generate a detailed step-by-step programming guide for building a "${title}" using "${techStack}" at a "${resolvedDifficulty}" level.
The entire guide must be written in ${resolvedLanguage}.
Structure the guide with:
1. **Introduction & Architecture**: Explain the project's concept and how the parts connect.
2. **Step-by-Step Implementation**: Write out the code implementation steps with explanations.
3. **Core Code Snippets**: Provide explanation for the critical JavaScript/CSS/HTML code blocks.
4. **Practice Challenge**: Suggest one small feature or tweak the student can add to the starter code to practice.

Make it clean, highly educational, and formatted in beautiful Markdown. Do not include unnecessary introduction/conclusion text outside of the guide.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.5,
      }
    });

    const guide = result.response.text();

    return NextResponse.json({
      success: true,
      data: { guide }
    });
  } catch (error: any) {
    console.error("Project Guide Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate project guide" },
      { status: 500 }
    );
  }
}
