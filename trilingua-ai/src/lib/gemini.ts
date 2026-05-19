import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate an AI tutor response using Gemini
 */
export async function generateTutorResponse(
  message: string,
  lang: string = "en",
  context?: { lessonTitle?: string; courseTitle?: string; conversationHistory?: Array<{ role: string; content: string }> }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Map language code to human-readable language names
    const languageMap: Record<string, string> = {
      en: "English",
      ta: "Tamil",
      hi: "Hindi",
    };
    const userLanguage = languageMap[lang] || "English";

    // Format the current topic from context or fallback to general coding
    const currentTopic = context?.lessonTitle
      ? `Studying "${context.lessonTitle}"${context.courseTitle ? ` in the course "${context.courseTitle}"` : ""}`
      : "General Coding & Software Development";

    const systemPrompt = `You are Trilingua AI Tutor — a friendly, expert teaching assistant for an EdTech platform teaching AI, machine learning, data science, and programming in Tamil, English, and Hindi.

RULES:
- Always respond in the language the user writes in (Tamil → Tamil, English → English, Hindi → Hindi)
- Keep answers short, clear, and beginner-friendly
- If explaining code, always give a simple example
- Never waste words — be direct and precise
- If user greets, greet back warmly in their language
- Always relate answers to the current topic the user is learning

CURRENT CONTEXT:
- Platform: Trilingua AI
- User language: ${userLanguage}
- Current topic: ${currentTopic}`;

    // Build conversation history for context
    const history = context?.conversationHistory?.map(msg => ({
      role: msg.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: msg.content }],
    })) || [];

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    // Prepend system instruction to first message if no history
    const fullMessage = history.length === 0
      ? `${systemPrompt}\n\n---\nStudent's question: ${message}`
      : message;

    const result = await chat.sendMessage(fullMessage);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI response");
  }
}

/**
 * Generate career suggestions based on user skills/progress
 */
export async function generateCareerSuggestions(
  skills: string[],
  completedCourses: string[],
  experienceLevel: string,
  lang: string = "en"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const langInstruction = lang === "ta"
      ? "Respond in Tamil (use English for technical terms)."
      : lang === "hi"
      ? "Respond in Hindi (use English for technical terms)."
      : "Respond in English.";

    const prompt = `${langInstruction}

You are a career advisor for tech professionals. Based on the following student profile, provide:

1. **Top 3 Job Roles** they're suited for (with brief descriptions)
2. **Skill Gaps** — what they should learn next to be more competitive
3. **Recommended Courses** — suggest 2-3 specific topics to study next
4. **Market Outlook** — a brief note on demand for their skills

Student Profile:
- Skills: ${skills.join(", ") || "Beginner"}
- Completed Courses: ${completedCourses.join(", ") || "None yet"}
- Experience Level: ${experienceLevel || "Beginner"}

Keep the response structured with clear headings and under 400 words. Use emojis for visual appeal.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Career API Error:", error);
    throw new Error("Failed to generate career suggestions");
  }
}
