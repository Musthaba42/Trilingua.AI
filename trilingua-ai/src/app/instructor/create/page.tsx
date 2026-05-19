"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Check, Upload, Play,
  BookOpen, Globe, Sparkles, PlusCircle, Trash2,
  Youtube, ImageIcon, Tag
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DOMAIN_CONFIG, LANGUAGES, EXP_LEVELS } from "@/lib/utils/constants";

const TOTAL_STEPS = 4;

interface LessonDraft {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  language: string;
  duration: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Course details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Lessons
  const [lessons, setLessons] = useState<LessonDraft[]>([
    { id: "1", title: "", description: "", youtubeUrl: "", language: "en", duration: "" }
  ]);

  const domainList = Object.entries(DOMAIN_CONFIG).map(([slug, config]) => ({
    slug,
    ...config,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  const canProceed = () => {
    switch (step) {
      case 1: return title.trim().length > 3 && description.trim().length > 10;
      case 2: return domain && difficulty && selectedLanguages.length > 0;
      case 3: return lessons.length > 0 && lessons[0].title.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const addLesson = () => {
    setLessons(prev => [...prev, {
      id: String(prev.length + 1),
      title: "", description: "", youtubeUrl: "", language: "en", duration: ""
    }]);
  };

  const removeLesson = (id: string) => {
    if (lessons.length === 1) return;
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  const updateLesson = (id: string, field: keyof LessonDraft, value: string) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };

  const handlePublish = async (asDraft: boolean) => {
    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setSaving(false);
    router.push("/instructor");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <PlusCircle size={24} className="text-amber-400" />
          Create New Course
        </h1>
        <p className="text-gray-400 text-sm mt-1">Build and publish a course for your students.</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {[...Array(TOTAL_STEPS)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < step ? "bg-amber-500" : "bg-dark-surface"
            }`}
          />
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-xs text-gray-500">
        {["Basic Info", "Category & Config", "Add Lessons", "Review & Publish"].map((label, i) => (
          <span key={i} className={i < step ? "text-amber-400 font-semibold" : ""}>
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {/* Form Card */}
      <div className="glass-card p-8 min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 flex-1"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookOpen size={20} className="text-amber-400" />
                Course Details
              </h2>
              
              <Input
                label="Course Title"
                placeholder="e.g., Python for Beginners (தமிழ்)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what students will learn..."
                  className="input-field h-32 resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-600 mt-1">{description.length}/1000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ImageIcon size={14} className="inline mr-1" /> Thumbnail URL
                </label>
                <Input
                  placeholder="https://example.com/thumbnail.jpg"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
                {thumbnailUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-dark-border w-48">
                    <img src={thumbnailUrl} alt="Preview" className="w-full h-28 object-cover" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Category & Config */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 flex-1"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Tag size={20} className="text-amber-400" />
                Category & Configuration
              </h2>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {domainList.map((d) => (
                    <button
                      key={d.slug}
                      onClick={() => setDomain(d.slug)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        domain === d.slug 
                          ? "border-amber-500 bg-amber-500/10" 
                          : "border-dark-border bg-dark-surface hover:border-amber-500/30"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${d.color}15`, border: `1px solid ${d.color}30` }}>
                        <span style={{ color: d.color }}>
                          {d.slug.includes("ai") ? "🤖" : d.slug.includes("cyber") ? "🔒" : d.slug.includes("python") ? "🐍" : d.slug.includes("java") ? "☕" : "💻"}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{d.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                <div className="flex gap-3">
                  {EXP_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setDifficulty(level.value)}
                      className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                        difficulty === level.value 
                          ? "border-amber-500 bg-amber-500/10" 
                          : "border-dark-border bg-dark-surface hover:border-amber-500/30"
                      }`}
                    >
                      <span className="text-2xl">{level.emoji}</span>
                      <p className="font-semibold text-white mt-2 text-sm">{level.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Globe size={14} className="inline mr-1" /> Target Language(s)
                </label>
                <div className="flex gap-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                        selectedLanguages.includes(lang.code) 
                          ? "border-amber-500 bg-amber-500/10" 
                          : "border-dark-border bg-dark-surface hover:border-amber-500/30"
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <p className="font-medium text-white text-sm mt-2">{lang.name}</p>
                      {selectedLanguages.includes(lang.code) && (
                        <Check size={14} className="text-amber-400 mx-auto mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pricing</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFree(true)}
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      isFree ? "border-green-500 bg-green-500/10" : "border-dark-border bg-dark-surface"
                    }`}
                  >
                    <p className="text-2xl">🆓</p>
                    <p className="font-semibold text-white mt-2 text-sm">Free</p>
                  </button>
                  <button
                    onClick={() => setIsFree(false)}
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      !isFree ? "border-amber-500 bg-amber-500/10" : "border-dark-border bg-dark-surface"
                    }`}
                  >
                    <p className="text-2xl">💰</p>
                    <p className="font-semibold text-white mt-2 text-sm">Paid</p>
                  </button>
                </div>
                {!isFree && (
                  <div className="mt-3">
                    <Input
                      label="Price (₹)"
                      type="number"
                      placeholder="199"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Add Lessons */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 flex-1"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Play size={20} className="text-amber-400" />
                  Add Lessons ({lessons.length})
                </h2>
                <Button size="sm" variant="secondary" icon={<PlusCircle size={14} />} onClick={addLesson}>
                  Add Lesson
                </Button>
              </div>

              <div className="space-y-4">
                {lessons.map((lesson, i) => (
                  <div key={lesson.id} className="p-5 rounded-lg bg-dark-surface border border-dark-border space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                        Lesson {i + 1}
                      </span>
                      {lessons.length > 1 && (
                        <button
                          onClick={() => removeLesson(lesson.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <Input
                      label="Lesson Title"
                      placeholder="e.g., Introduction to Variables"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, "description", e.target.value)}
                        placeholder="What will this lesson cover?"
                        className="input-field h-20 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="YouTube Video URL"
                        placeholder="https://youtube.com/watch?v=..."
                        value={lesson.youtubeUrl}
                        onChange={(e) => updateLesson(lesson.id, "youtubeUrl", e.target.value)}
                        icon={<Youtube size={14} />}
                      />
                      <Input
                        label="Duration (minutes)"
                        type="number"
                        placeholder="30"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(lesson.id, "duration", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Publish */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 flex-1"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-amber-400" />
                Review & Publish
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">Title</p>
                  <p className="text-white font-semibold">{title || "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">Domain</p>
                  <p className="text-white font-semibold capitalize">{domain?.replace(/-/g, " ") || "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">Difficulty</p>
                  <p className="text-white font-semibold">{difficulty || "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">Languages</p>
                  <p className="text-white font-semibold">{selectedLanguages.map(l => l.toUpperCase()).join(", ") || "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">Lessons</p>
                  <p className="text-white font-semibold">{lessons.filter(l => l.title.trim()).length}</p>
                </div>
                <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                  <p className="text-xs text-gray-500 mb-1">Pricing</p>
                  <p className="text-white font-semibold">{isFree ? "Free" : `₹${price || 0}`}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-gray-300 text-sm">{description || "—"}</p>
              </div>

              {/* Lesson summary */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Lessons</p>
                <div className="space-y-2">
                  {lessons.filter(l => l.title.trim()).map((l, i) => (
                    <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface border border-dark-border">
                      <span className="text-xs font-bold text-amber-400 w-6">{i + 1}</span>
                      <span className="text-sm text-white flex-1">{l.title}</span>
                      {l.youtubeUrl && <Youtube size={14} className="text-red-400" />}
                      {l.duration && <span className="text-xs text-gray-500">{l.duration}min</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-300">
                  ✅ Your course is ready to be published! You can also save it as a draft first.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-dark-border">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            className={`text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 ${
              step === 1 ? "invisible" : ""
            }`}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex gap-2">
            {step === TOTAL_STEPS && (
              <Button
                variant="secondary"
                onClick={() => handlePublish(true)}
                loading={saving}
              >
                Save as Draft
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < TOTAL_STEPS) setStep(step + 1);
                else handlePublish(false);
              }}
              disabled={!canProceed()}
              loading={saving}
              icon={step === TOTAL_STEPS ? <Check size={16} /> : <ArrowRight size={16} />}
            >
              {step === TOTAL_STEPS ? "Publish Course" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
