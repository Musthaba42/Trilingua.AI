import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyARNRKK0xUlxrI8tHTmqWTemlPAEo6F_BY");

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

    let guide: string;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.5,
        }
      });
      guide = result.response.text();
    } catch (apiError) {
      console.warn("Gemini Project guide failed, falling back to mock guide:", apiError);
      guide = getMockProjectGuide(title, techStack, resolvedDifficulty, resolvedLanguage);
    }

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

function getMockProjectGuide(title: string, techStack: string, difficulty: string, language: string): string {
  const isTa = language.toLowerCase() === "tamil" || language === "ta";
  const isHi = language.toLowerCase() === "hindi" || language === "hi";

  if (isTa) {
    return `# 🛠️ திட்ட வழிகாட்டி: ${title} (${difficulty})
**தொழில்நுட்பங்கள்**: ${techStack}

## 1. அறிமுகம் மற்றும் வடிவமைப்பு
இந்தத் திட்டம் ${techStack} ஐப் பயன்படுத்தி ${title} உருவாக்குவதை நோக்கமாகக் கொண்டுள்ளது.

## 2. படிப்படியான செயலாக்கம்
- **படி 1**: உங்கள் திட்ட சூழலை உருவாக்கவும்.
- **படி 2**: தேவையான கோப்புகளை உருவாக்கவும்.
- **படி 3**: முக்கிய நிரல்களை எழுதவும்.

## 3. முக்கிய குறியீட்டு பகுதி
\`\`\`javascript
// எடுத்துக்காட்டு குறியீடு
console.log("திட்டம் வெற்றிகரமாக இயங்கியது!");
\`\`\`

## 4. பயிற்சி சவால்
திட்டத்தின் பயனர் இடைமுகத்தை மாற்றி ஒரு புதிய அம்சத்தைச் சேர்க்க முயற்சிக்கவும்!`;
  }

  if (isHi) {
    return `# 🛠️ परियोजना गाइड: ${title} (${difficulty})
**तकनीक**: ${techStack}

## 1. परिचय और वास्तुकला
यह परियोजना ${techStack} का उपयोग करके ${title} बनाने पर केंद्रित है।

## 2. चरण-दर-चरण कार्यान्वयन
- **चरण 1**: प्रोजेक्ट फ़ोल्डर और सेटअप तैयार करें।
- **चरण 2**: मुख्य फ़ाइलों को कॉन्फ़िगर करें।
- **चरण 3**: लॉजिक और कोड लिखें।

## 3. मुख्य कोड ब्लॉक
\`\`\`javascript
// उदाहरण कोड
console.log("परियोजना सफलतापूर्वक प्रारंभ हुई!");
\`\`\`

## 4. अभ्यास चुनौती
इस परियोजना में एक नया फ़ंक्शन जोड़कर अपने कौशल का परीक्षण करें।`;
  }

  return `# 🛠️ Project Guide: ${title} (${difficulty})
**Tech Stack**: ${techStack}

## 1. Introduction & Architecture
This guide provides a walk-through for building "${title}" using ${techStack}.

## 2. Step-by-Step Implementation
- **Step 1**: Initialize your project directory and configure dependencies.
- **Step 2**: Create the primary application files.
- **Step 3**: Implement the core logic of the application.

## 3. Core Code Snippet
\`\`\`javascript
// Starter code snippet
console.log("Project started successfully!");
\`\`\`

## 4. Practice Challenge
Try adding a search or filter feature to customize the project!`;
}
