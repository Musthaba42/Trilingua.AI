import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, abstract, language } = await request.json();

    if (!title || !abstract) {
      return NextResponse.json(
        { success: false, error: "Title and abstract are required" },
        { status: 400 }
      );
    }

    const resolvedLanguage = language || "English";
    const prompt = `Summarize this paper in 5 simple lines in ${resolvedLanguage}: ${title} - ${abstract}`;

    let summary: string;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.5,
        }
      });
      summary = result.response.text();
    } catch (apiError: any) {
      console.error("Gemini Research summary failed:", apiError);
      throw apiError;
    }

    return NextResponse.json({
      success: true,
      data: { summary }
    });
  } catch (error: any) {
    console.error("Research Summary Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}


