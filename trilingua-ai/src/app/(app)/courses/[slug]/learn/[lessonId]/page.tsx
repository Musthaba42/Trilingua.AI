"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, MessageSquare, FileText, Play,
  CheckCircle, Send, Sparkles, Globe
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { LangBadge } from "@/components/ui/Badge";
import { LANGUAGES } from "@/lib/utils/constants";
import Link from "next/link";

// Mock AI responses for the lesson tutor
const TUTOR_RESPONSES: Record<string, string[]> = {
  en: [
    "Great question! Let me explain this concept from the lesson...\n\nThe key idea is to break complex problems into smaller, manageable parts. Each part can be understood individually, then combined for a complete picture.\n\nWould you like a code example?",
    "I'd be happy to help! Based on this lesson, here's what you need to know:\n\n1. **Core concept** — understand the foundation first\n2. **Application** — see how it's used in practice\n3. **Practice** — try it yourself with exercises\n\nWhich part should I elaborate on?",
    "Here's a practical example related to this lesson:\n\n```python\n# Example from the lesson\ndef process(data):\n    result = []\n    for item in data:\n        result.append(transform(item))\n    return result\n```\n\nThis pattern is very common. Want me to explain each line?",
    "Think of it this way — just like learning to ride a bicycle, you start with training wheels (basic concepts), then gradually remove them as you gain confidence.\n\nThe lesson covers this progression perfectly. Any specific part you're stuck on?",
  ],
  ta: [
    "நல்ல கேள்வி! இந்த பாடத்தின் அடிப்படையில் விளக்குகிறேன்...\n\nமுக்கியமான யோசனை என்னவென்றால், சிக்கலான பிரச்சினைகளை சிறிய பகுதிகளாக பிரிப்பது. ஒவ்வொரு பகுதியையும் தனித்தனியாக புரிந்து கொள்ளலாம்.\n\nகூடுதல் விளக்கம் தேவையா?",
    "சரி, இந்த பாடத்தை பொருத்தவரை முக்கியமான அம்சங்கள்:\n\n1. **அடிப்படை** — முதலில் foundation புரிந்து கொள்ளுங்கள்\n2. **பயன்பாடு** — நடைமுறையில் எப்படி பயன்படுத்தப்படுகிறது\n3. **பயிற்சி** — நீங்களே முயற்சிக்கவும்\n\nஎந்த பகுதியில் உதவி வேண்டும்?",
  ],
  hi: [
    "बढ़िया सवाल! इस lesson के आधार पर समझाता हूं...\n\nमुख्य विचार यह है कि जटिल समस्याओं को छोटे भागों में बांटें। हर भाग को अलग-अलग समझा जा सकता है।\n\nक्या और detail चाहिए?",
    "ठीक है, इस lesson के हिसाब से:\n\n1. **Basics** — पहले foundation समझें\n2. **Application** — practice में कैसे use होता है\n3. **Practice** — खुद try करें\n\nकिस part में help चाहिए?",
  ],
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [loading, setLoading] = useState(true);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatLang, setChatLang] = useState("en");
  const [notes, setNotes] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/courses/${params.slug}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.data);
          const lesson = data.data.lessons?.find(
            (l: any) => l.id === params.lessonId
          );
          if (lesson) {
            setCurrentLesson(lesson);
            if (lesson.videoLinks?.[0]) {
              setSelectedLang(lesson.videoLinks[0].lang);
              setChatLang(lesson.videoLinks[0].lang);
            }
            // Set initial AI message
            setChatMessages([
              {
                id: "welcome",
                role: "assistant",
                content: `👋 Hi! I'm your AI tutor. I'll help you understand "${lesson.title}". Ask me anything about this lesson!`,
              },
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.slug, params.lessonId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (message?: string) => {
    const text = message || chatInput.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const history = chatMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lang: chatLang,
          context: {
            lessonTitle: currentLesson?.title,
            courseTitle: course?.title,
          },
          history,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.success
          ? data.data.content
          : "Sorry, I encountered an error. Please try again.",
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Lesson tutor error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 bg-dark-surface rounded" />
        <div className="aspect-video bg-dark-surface rounded-md" />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Lesson not found</p>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentIndex = lessons.findIndex((l: any) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const selectedVideo = currentLesson.videoLinks?.find(
    (v: any) => v.lang === selectedLang
  ) || currentLesson.videoLinks?.[0];

  const handleCompleteLesson = async () => {
    try {
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId: currentLesson.id,
          progress: Math.min(100, Math.round(((currentIndex + 1) / lessons.length) * 100))
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (nextLesson) {
          router.push(`/courses/${params.slug}/learn/${nextLesson.id}`);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  const suggestedQuestions =
    chatLang === "ta"
      ? ["இதை விளக்குங்கள்", "உதாரணம் கொடுங்கள்", "எளிமையாக சொல்லுங்கள்"]
      : chatLang === "hi"
      ? ["यह समझाएं", "उदाहरण दें", "आसान भाषा में बताएं"]
      : ["Explain this concept", "Show me an example", "How is this used in practice?"];

  return (
    <div className="space-y-4 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
      {/* Top bar */}
      <div className="px-4 py-3 bg-dark-card border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${params.slug}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm hidden sm:inline">{course.title}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {currentLesson.videoLinks?.length > 1 && (
            <div className="flex gap-1">
              {currentLesson.videoLinks.map((v: any) => (
                <button
                  key={v.lang}
                  onClick={() => setSelectedLang(v.lang)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                    selectedLang === v.lang
                      ? "bg-primary-500/30 text-primary-300"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {v.lang.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <span className="text-sm text-gray-500">
            Lesson {currentIndex + 1} of {lessons.length}
          </span>
        </div>
      </div>

      {/* Split screen */}
      <div className="flex flex-col lg:flex-row" style={{ height: "calc(100vh - 8rem)" }}>
        {/* Left: Video Player */}
        <div className="lg:w-[65%] flex flex-col">
          <div className="relative aspect-video bg-black">
            {selectedVideo && (
              <iframe
                key={selectedVideo.youtubeId}
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
                title={currentLesson.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          <div className="p-4 space-y-2">
            <h1 className="text-xl font-bold text-white">{currentLesson.title}</h1>
            <div className="flex items-center gap-2">
              {selectedVideo && <LangBadge lang={selectedVideo.lang} />}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-dark-border mt-auto">
            {prevLesson ? (
              <Link href={`/courses/${params.slug}/learn/${prevLesson.id}`}>
                <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>
                  Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Button variant="primary" size="sm" onClick={handleCompleteLesson}>
                Next Lesson <ArrowRight size={14} />
              </Button>
            ) : (
              <Button variant="accent" size="sm" icon={<CheckCircle size={14} />} onClick={handleCompleteLesson}>
                Complete Course
              </Button>
            )}
          </div>
        </div>

        {/* Right: Tabbed Panel */}
        <div className="lg:w-[35%] border-l border-dark-border bg-dark-card flex flex-col overflow-hidden">
          <Tabs
            variant="pills"
            className="px-3 pt-3"
            tabs={[
              {
                id: "ai-tutor",
                label: "AI Tutor",
                icon: <MessageSquare size={14} />,
                content: (
                  <div className="flex flex-col h-[calc(100vh-16rem)]">
                    {/* Chat language selector */}
                    <div className="flex items-center gap-1 px-3 py-2 border-b border-dark-border">
                      <Globe size={12} className="text-gray-500" />
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setChatLang(l.code)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            chatLang === l.code
                              ? "bg-primary-500/20 text-primary-300"
                              : "text-gray-500 hover:text-white"
                          }`}
                        >
                          {l.flag} {l.code.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[90%] ${msg.role === "user" ? "chat-user" : "chat-ai"}`}>
                            <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                          </div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-gray-500 text-xs"
                        >
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span>AI is thinking...</span>
                        </motion.div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-dark-border">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                          placeholder={
                            chatLang === "ta" ? "கேள்வி கேளுங்கள்..." :
                            chatLang === "hi" ? "सवाल पूछें..." :
                            "Ask a question..."
                          }
                          className="input-field text-sm"
                          disabled={isTyping}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSendMessage()}
                          disabled={!chatInput.trim() || isTyping}
                          icon={<Send size={14} />}
                        >
                          Send
                        </Button>
                      </div>
                      <div className="flex gap-1.5 mt-2 overflow-x-auto hide-scrollbar">
                        {suggestedQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSendMessage(q)}
                            className="px-2.5 py-1 bg-dark-surface border border-dark-border rounded-full text-[11px] text-gray-400 hover:text-white hover:border-primary-500/30 whitespace-nowrap transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: "notes",
                label: "Notes",
                icon: <FileText size={14} />,
                content: (
                  <div className="p-4 h-[calc(100vh-16rem)] flex flex-col">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your notes here... They'll be saved locally."
                      className="input-field flex-1 resize-none text-sm"
                    />
                    <p className="text-xs text-gray-600 mt-2">{notes.length} characters</p>
                  </div>
                ),
              },
              {
                id: "lessons",
                label: "Lessons",
                icon: <Play size={14} />,
                content: (
                  <div className="overflow-y-auto max-h-[calc(100vh-16rem)] space-y-1 p-2">
                    {lessons.map((lesson: any, i: number) => (
                      <Link
                        key={lesson.id}
                        href={`/courses/${params.slug}/learn/${lesson.id}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors ${
                          lesson.id === currentLesson.id
                            ? "bg-primary-500/15 text-white"
                            : "text-gray-400 hover:text-white hover:bg-dark-hover"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-dark-surface flex items-center justify-center text-xs shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm truncate">{lesson.title}</span>
                      </Link>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
