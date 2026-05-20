import { NextResponse } from "next/server";
import { generateTutorResponse } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { message, lang, context, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await generateTutorResponse(message, lang || "en", {
      lessonTitle: context?.lessonTitle,
      courseTitle: context?.courseTitle,
      conversationHistory: history,
    });

    return NextResponse.json({
      success: true,
      data: { content: response, source: "gemini" },
    });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
