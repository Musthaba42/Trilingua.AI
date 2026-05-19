"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Globe, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  English: [
    "Explain this concept simply",
    "Give me one coding example",
    "How does this connect to real-world projects?",
    "Give me a quick quiz question"
  ],
  Tamil: [
    "இதை எளிமையாக விளக்குங்கள்",
    "ஒரு Code உதாரணம் கொடுங்கள்",
    "நடைமுறையில் இது எங்கு பயன்படுகிறது?",
    "ஒரு சிறிய கேள்வி கேளுங்கள்"
  ],
  Hindi: [
    "इसे आसान भाषा में समझाएं",
    "मुझे एक कोड उदाहरण दें",
    "यह वास्तविक प्रोजेक्ट्स में कैसे काम आता है?",
    "मुझसे एक छोटा सवाल पूछें"
  ]
};

export function TutorChat() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"English" | "Tamil" | "Hindi">("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Session ID determination
  const [sessionId, setSessionId] = useState<string>("anonymous");
  useEffect(() => {
    if (session?.user?.id) {
      setSessionId(session.user.id);
    } else {
      let anonId = localStorage.getItem("trilingua_anon_tutor_id");
      if (!anonId) {
        anonId = `anon-${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem("trilingua_anon_tutor_id", anonId);
      }
      setSessionId(anonId);
    }
  }, [session]);

  // Load chat history on mount or when sessionId changes
  useEffect(() => {
    if (sessionId === "anonymous") return;

    async function loadHistory() {
      try {
        const res = await fetch(`/api/tutor/chat?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setMessages(data.data.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })));
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    }
    loadHistory();
  }, [sessionId]);

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Parse current topic & domain based on URL path
  const getContextFromPath = () => {
    const parts = pathname.split("/").filter(Boolean);
    let currentTopic = "General Software Engineering";
    let currentDomain = "Computer Science";

    if (parts[0] === "courses" && parts[1]) {
      currentTopic = parts[1]
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      currentDomain = "Coding Platform";
    }
    if (parts.includes("learn") && parts[parts.length - 1]) {
      const lessonSlug = parts[parts.length - 1];
      currentTopic += ` - ${lessonSlug
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")}`;
    }
    return { currentTopic, currentDomain };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    const { currentTopic, currentDomain } = getContextFromPath();

    // Limit history array to last 10 messages for request payload
    const historyPayload = messages.slice(-10);

    try {
      const response = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language,
          currentTopic,
          currentDomain,
          sessionId,
          history: historyPayload
        })
      });

      const result = await response.json();
      if (result.success && result.data?.content) {
        setMessages(prev => [...prev, { role: "assistant", content: result.data.content }]);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the tutor. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 bottom-6 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-full shadow-glow active:scale-95 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={18} className="animate-pulse" />
        <span className="text-sm font-semibold">AI Tutor</span>
      </motion.button>

      {/* Slide-out Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-6 bottom-24 z-50 w-96 h-[580px] max-w-[calc(100vw-3rem)] rounded-2xl border border-dark-border bg-dark-card/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-dark-surface/50 border-b border-dark-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                <span className="text-sm font-bold text-white tracking-wide">Trilingua AI Tutor</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-dark-hover transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Language Toggle & Current Context Info */}
            <div className="px-4 py-2 bg-dark-surface/20 border-b border-dark-border flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Globe size={12} /> Language:
                </span>
                <div className="flex gap-1 bg-dark-surface p-0.5 rounded-md border border-dark-border">
                  {(["English", "Tamil", "Hindi"] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                        language === lang
                          ? "bg-primary-500/20 text-primary-300 border border-primary-500/20"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {lang === "English" ? "EN" : lang === "Tamil" ? "TA" : "HI"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-gray-500 truncate">
                Topic: <span className="text-gray-400 font-medium">{getContextFromPath().currentTopic}</span>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <MessageSquare size={36} className="text-primary-500/40" />
                  <p className="text-sm text-gray-300 font-medium">Ask me anything in {language}!</p>
                  <p className="text-xs text-gray-500 max-w-[200px]">
                    I can explain concepts, write code snippets, and help you debug.
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary-600/20 border border-primary-500/30 text-white rounded-tr-none"
                        : "bg-dark-surface border border-dark-border text-gray-100 rounded-tl-none"
                    }`}
                  >
                    <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed font-sans">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-dark-surface border border-dark-border rounded-lg rounded-tl-none p-3 flex flex-col gap-1.5">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[10px] text-gray-500">Tutor is thinking...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg flex items-start gap-2.5">
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-red-200">{error}</p>
                    <button
                      onClick={() => handleSendMessage()}
                      className="text-[10px] text-primary-400 hover:text-primary-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw size={10} /> Retry
                    </button>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="px-4 py-2 bg-dark-surface/10 border-t border-dark-border overflow-x-auto hide-scrollbar flex gap-2">
              {SUGGESTED_QUESTIONS[language].map(q => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 bg-dark-surface hover:bg-dark-hover border border-dark-border rounded-full text-[10px] text-gray-400 hover:text-white whitespace-nowrap transition-colors"
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-dark-border bg-dark-surface/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder={
                    language === "Tamil" ? "கேள்வி கேளுங்கள்..." :
                    language === "Hindi" ? "सवाल पूछें..." :
                    "Ask your AI tutor..."
                  }
                  className="flex-1 px-3 py-2 bg-dark-surface border border-dark-border rounded-md text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 text-white rounded-md flex items-center justify-center transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
