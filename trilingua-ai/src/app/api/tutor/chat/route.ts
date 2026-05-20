import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const isCodeRequest = (msg: string): boolean => {
  const codeKeywords = [
    "code", "program", "syntax", "write a", "function", "class", 
    "loop", "method", "variable", "compile", "error", "exception",
    "bug", "debug", "run", "script", "algorithm", "database",
    "html", "css", "js", "ts", "python", "java", "sql", "git"
  ];
  const lowerMsg = msg.toLowerCase();
  return codeKeywords.some(kw => lowerMsg.includes(kw)) || /[{}[\]();=<>]/g.test(msg);
};



export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || session?.user?.id || "anonymous";

    let messages: any[] = [];
    try {
      messages = await (db as any).tutorMessage.findMany({
        where: { userId: sessionId },
        orderBy: { createdAt: "asc" },
        take: 10
      });
    } catch (dbError) {
      console.warn("Failed to fetch message history from database (likely offline):", dbError);
    }

    // Convert each TutorMessage record (storing message and response together)
    // into alternating messages in the format expected by the frontend
    const flatMessages = messages.flatMap(msg => [
      { role: "user", content: msg.message },
      { role: "assistant", content: msg.response }
    ]);

    return NextResponse.json({
      success: true,
      data: flatMessages
    });
  } catch (error: any) {
    console.error("Fetch Tutor Chat History Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { message, language, currentTopic, currentDomain, sessionId, history } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const resolvedLanguage = language || "English";
    const resolvedTopic = currentTopic || "General Coding";
    const resolvedDomain = currentDomain || "Computer Science";
    const resolvedSessionId = sessionId || session?.user?.id || "anonymous";

    const systemPrompt = `You are Trilingua AI Tutor. Reply in ${resolvedLanguage} only. Topic: ${resolvedTopic}. Domain: ${resolvedDomain}. Rules: short answers, no filler, beginner-friendly, one code example max, greet only on first message.`;

    const modelName = isCodeRequest(message) ? "gemini-1.5-pro" : "gemini-2.0-flash";

    // 1. Prepare conversation history for Gemini API
    const apiHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    let aiResponse: string;
    try {
      // 2. Initialize model and start chat
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });

      const chat = model.startChat({
        history: apiHistory,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300,
        }
      });

      const result = await chat.sendMessage(message);
      aiResponse = result.response.text();
    } catch (apiError: any) {
      console.error("Gemini API call failed:", apiError);
      throw apiError;
    }

    // 3. Save User message & AI response together into a single TutorMessage record
    try {
      await (db as any).tutorMessage.create({
        data: {
          userId: resolvedSessionId,
          message: message,
          response: aiResponse,
          language: resolvedLanguage,
          topic: resolvedTopic,
          domain: resolvedDomain,
          modelUsed: modelName,
        }
      });

      // Keep only last 10 messages for this user/session
      const count = await (db as any).tutorMessage.count({
        where: { userId: resolvedSessionId }
      });

      if (count > 10) {
        const keepMsgs = await (db as any).tutorMessage.findMany({
          where: { userId: resolvedSessionId },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true }
        });
        const keepIds = keepMsgs.map((m: { id: string }) => m.id);
        await (db as any).tutorMessage.deleteMany({
          where: {
            userId: resolvedSessionId,
            id: { notIn: keepIds }
          }
        });
      }
    } catch (dbError) {
      console.warn("Failed to save AI response or prune database history:", dbError);
    }

    return NextResponse.json({
      success: true,
      data: {
        content: aiResponse,
        modelUsed: modelName,
      }
    });

  } catch (error: any) {
    console.error("Tutor Chat Route Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process chat session"
    }, { status: 500 });
  }
}
