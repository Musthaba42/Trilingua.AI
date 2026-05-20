import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Unified content generation wrapper. Supports OpenRouter and Google Gemini SDK.
 */
export async function generateGeminiContent(
  prompt: string,
  modelName: string = "gemini-2.0-flash",
  generationConfig?: { temperature?: number; maxOutputTokens?: number; systemInstruction?: string }
): Promise<string> {
  try {
    if (process.env.OPENROUTER_API_KEY) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://trilingua-ai.vercel.app",
          "X-Title": "Trilingua AI",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openrouter/free",
          messages: [
            ...(generationConfig?.systemInstruction ? [{ role: "system", content: generationConfig.systemInstruction }] : []),
            { role: "user", content: prompt }
          ],
          temperature: generationConfig?.temperature ?? 0.7,
          max_tokens: generationConfig?.maxOutputTokens ?? 1024,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const msg = data.choices?.[0]?.message;
      const content = msg?.content || 
                      msg?.reasoning_content || 
                      msg?.reasoning || 
                      msg?.reasoning_details?.[0]?.text || 
                      (msg?.reasoning_details && msg.reasoning_details.find((d: any) => d.type === "reasoning.text" || d.text)?.text);

      if (!content) {
        throw new Error("Empty response from OpenRouter");
      }
      return content;
    } else {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: generationConfig?.maxOutputTokens,
          temperature: generationConfig?.temperature,
        }
      });
      return result.response.text();
    }
  } catch (error) {
    console.error("generateGeminiContent error:", error);
    throw error;
  }
}

/**
 * Unified chat completion wrapper with history support. Supports OpenRouter and Google Gemini SDK.
 */
export async function generateGeminiChat(
  message: string,
  history: Array<{ role: string; content: string }>,
  systemPrompt: string,
  modelName: string = "gemini-2.0-flash",
  generationConfig?: { temperature?: number; maxOutputTokens?: number }
): Promise<string> {
  try {
    if (process.env.OPENROUTER_API_KEY) {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map(msg => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: message }
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://trilingua-ai.vercel.app",
          "X-Title": "Trilingua AI",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openrouter/free",
          messages,
          temperature: generationConfig?.temperature ?? 0.7,
          max_tokens: generationConfig?.maxOutputTokens ?? 1024,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const msg = data.choices?.[0]?.message;
      const content = msg?.content || 
                      msg?.reasoning_content || 
                      msg?.reasoning || 
                      msg?.reasoning_details?.[0]?.text || 
                      (msg?.reasoning_details && msg.reasoning_details.find((d: any) => d.type === "reasoning.text" || d.text)?.text);

      if (!content) {
        throw new Error("Empty response from OpenRouter");
      }
      return content;
    } else {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });

      const apiHistory = history.map(msg => ({
        role: msg.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: apiHistory,
        generationConfig: {
          maxOutputTokens: generationConfig?.maxOutputTokens,
          temperature: generationConfig?.temperature,
        },
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    }
  } catch (error) {
    console.error("generateGeminiChat error:", error);
    throw error;
  }
}

/**
 * Generate an AI tutor response using Gemini or OpenRouter
 */
export async function generateTutorResponse(
  message: string,
  lang: string = "en",
  context?: { lessonTitle?: string; courseTitle?: string; conversationHistory?: Array<{ role: string; content: string }> }
): Promise<string> {
  const languageMap: Record<string, string> = {
    en: "English",
    ta: "Tamil",
    hi: "Hindi",
  };
  const userLanguage = languageMap[lang] || "English";

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

  return generateGeminiChat(
    message,
    context?.conversationHistory || [],
    systemPrompt,
    "gemini-2.0-flash",
    {
      maxOutputTokens: 1024,
      temperature: 0.7,
    }
  );
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

    return await generateGeminiContent(prompt, "gemini-1.5-pro", {
      maxOutputTokens: 1000,
      temperature: 0.5,
    });
  } catch (error) {
    console.warn("Gemini Career API failed, falling back to mock career suggestions:", error);
    return getMockCareerSuggestions(skills, completedCourses, experienceLevel, lang);
  }
}


function getMockCareerSuggestions(skills: string[], completedCourses: string[], experienceLevel: string, lang: string): string {
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  if (isTa) {
    return `## 🎯 உங்கள் தொழில் வழிகாட்டி (Career Suggestions)

### 1. **AI/ML இன்ஜினியர் (AI/ML Engineer)**
- **சம்பளம்**: ₹6 - ₹12 LPA
- **தேவை**: மிக அதிகம்
- **முக்கிய நகரங்கள்**: சென்னை, பெங்களூர்

### 2. **பைதான் டெவலப்பர் (Python Developer)**
- **சம்பளம்**: ₹4 - ₹8 LPA
- **தேவை**: அதிகம்

### 🚀 பரிந்துரைக்கப்படும் அடுத்த படிகள்
1. **டீப் லேர்னிங்** படிப்பை முடிக்கவும்.
2. உங்கள் திறமைகளை காட்ட 2-3 போர்ட்ஃபோலியோ திட்டங்களை உருவாக்கவும்.`;
  }

  if (isHi) {
    return `## 🎯 आपके करियर सुझाव (Career Suggestions)

### 1. **AI/ML इंजीनियर (AI/ML Engineer)**
- **वेतन**: ₹6 - ₹12 LPA
- **मांग**: बहुत अधिक
- **मुख्य शहर**: बेंगलुरु, मुंबई

### 2. **पायथन डेवलपर (Python Developer)**
- **वेतन**: ₹4 - ₹8 LPA
- **मांग**: उच्च

### 🚀 अगले कदम
1. **डीप लर्निंग** कोर्स पूरा करें।
2. 2-3 प्रोजेक्ट्स का पोर्टफोलियो बनाएं।`;
  }

  return `## 🎯 Your Career Guidance

### 1. **AI/ML Engineer**
- **Salary**: ₹6 - ₹12 LPA
- **Demand**: Very High
- **Key Cities**: Bangalore, Chennai

### 2. **Python Developer**
- **Salary**: ₹4 - ₹8 LPA
- **Demand**: High

### 🚀 Recommended Next Steps
1. Complete the **Deep Learning** course.
2. Build 2-3 portfolio projects to showcase your skills.`;
}
