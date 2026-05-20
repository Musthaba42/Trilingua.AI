import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyARNRKK0xUlxrI8tHTmqWTemlPAEo6F_BY");

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
    console.warn("Gemini API call failed, falling back to mock response:", error);
    return getMockTutorResponse(message, lang, context?.lessonTitle || "General Coding");
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
    console.warn("Gemini Career API failed, falling back to mock career suggestions:", error);
    return getMockCareerSuggestions(skills, completedCourses, experienceLevel, lang);
  }
}

function getMockTutorResponse(message: string, language: string, currentTopic: string): string {
  const lang = language.toLowerCase();
  
  if (lang.includes("tamil") || lang === "ta") {
    return `வணக்கம்! நான் உங்கள் Trilingua AI Tutor (Demo Mode).

தற்போது நீங்கள் படித்துக் கொண்டிருக்கும் தலைப்பு: **${currentTopic}**. 

கணினி நிரலாக்கம் (Programming) என்பது கணினிக்கு நாம் கொடுக்கும் கட்டளைகளின் தொகுப்பாகும்.

எடுத்துக்காட்டு (JavaScript):
\`\`\`javascript
// ஒரு எளிய செயல்பாடு
function welcome() {
  console.log("வரவேற்கிறோம்!");
}
welcome();
\`\`\`

வேறு ஏதாவது சந்தேகம் உள்ளதா?`;
  } else if (lang.includes("hindi") || lang === "hi") {
    return `नमस्ते! मैं आपका Trilingua AI Tutor (Demo Mode) हूँ।

आपका वर्तमान विषय है: **${currentTopic}**।

प्रोग्रामिंग में हम समस्याओं को छोटे कार्यों में विभाजित करते हैं।

उदाहरण (JavaScript):
\`\`\`javascript
// एक साधारण फ़ंक्शन
function welcome() {
  console.log("स्वागत है!");
}
welcome();
\`\`\`

क्या आप कुछ और जानना चाहते हैं?`;
  } else {
    return `Hi! I am your Trilingua AI Tutor (Demo Mode).

Your current topic is: **${currentTopic}**.

In programming, we break down complex problems into smaller, manageable functions.

Example (JavaScript):
\`\`\`javascript
// A simple greeting function
function greetUser(name) {
  return "Hello, " + name + "!";
}
console.log(greetUser("Learner"));
\`\`\`

Let me know if you want to explore any specific coding concept!`;
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
