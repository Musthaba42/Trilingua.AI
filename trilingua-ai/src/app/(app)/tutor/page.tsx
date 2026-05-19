"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Send, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/lib/utils/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  lang: string;
  source?: "gemini" | "fallback";
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hi! I'm your AI tutor powered by Gemini. I can help you learn in English, Tamil, or Hindi. What would you like to study today?",
      lang: "en",
    },
  ]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      lang,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== "1") // skip welcome
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          lang,
          history,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.success
          ? data.data.content
          : "Sorry, I encountered an error. Please try again.",
        lang,
        source: data.data?.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Tutor error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again in a moment.",
          lang,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Tutor</h1>
            <p className="text-xs text-gray-500">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-dark-surface rounded-sm p-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-colors ${
                lang === l.code
                  ? "bg-primary-500/20 text-primary-300"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {l.flag} {l.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${msg.role === "user" ? "chat-user" : "chat-ai"}`}>
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              {msg.source === "gemini" && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-primary-500/50">
                  <Sparkles size={8} />
                  <span>Gemini AI</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500 text-sm"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>Gemini is thinking...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={
              lang === "ta" ? "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்..." :
              lang === "hi" ? "अपना सवाल यहां टाइप करें..." :
              "Type your question here..."
            }
            className="input-field flex-1"
            disabled={isTyping}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping} icon={<Send size={16} />}>
            Send
          </Button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
          {[
            lang === "ta" ? "இதை விளக்குங்கள்" : lang === "hi" ? "यह समझाएं" : "Explain this concept",
            lang === "ta" ? "உதாரணம் கொடுங்கள்" : lang === "hi" ? "उदाहरण दें" : "Give me an example",
            lang === "ta" ? "எளிமையாக சொல்லுங்கள்" : lang === "hi" ? "आसान भाषा में बताएं" : "Explain like I'm 5",
          ].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="px-3 py-1.5 bg-dark-surface border border-dark-border rounded-full text-xs text-gray-400 hover:text-white hover:border-primary-500/30 whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
