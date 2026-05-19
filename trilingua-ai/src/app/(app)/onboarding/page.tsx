"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  LEARNER_TYPES,
  EXP_LEVELS,
  LANGUAGES,
  DOMAIN_CONFIG,
  APP_NAME,
} from "@/lib/utils/constants";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Collected data — all hooks must be before any early return
  const [learnerType, setLearnerType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [preferredLang, setPreferredLang] = useState("");
  const [goal, setGoal] = useState("");
  const [domainInterests, setDomainInterests] = useState<string[]>([]);

  // Check if already done
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/user/onboarding");
        const json = await res.json();
        if (json.success && json.data.onboardingDone) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Check failed", err);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [router]);

  if (loading) return null;

  const canProceed = () => {
    switch (step) {
      case 1: return !!learnerType;
      case 2: return !!experienceLevel;
      case 3: return !!preferredLang;
      case 4: return goal.trim().length > 0;
      case 5: return domainInterests.length > 0;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Submit
      setSaving(true);
      try {
        const res = await fetch("/api/user/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnerType,
            experienceLevel,
            preferredLang,
            goal,
            domainInterests,
          }),
        });
        const data = await res.json();
        if (data.success) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const toggleDomain = (slug: string) => {
    setDomainInterests((prev) =>
      prev.includes(slug) ? prev.filter((d) => d !== slug) : [...prev, slug]
    );
  };

  const domainList = Object.entries(DOMAIN_CONFIG).map(([slug, config]) => ({
    slug,
    ...config,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
            <Brain className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold gradient-text">{APP_NAME}</h1>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[...Array(TOTAL_STEPS)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < step ? "bg-primary-500" : "bg-dark-surface"
              }`}
            />
          ))}
        </div>

        {/* Chat-style interface */}
        <div className="glass-card p-8 min-h-[400px] flex flex-col">
          {/* AI Message */}
          <div className="flex items-start gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="chat-ai flex-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-gray-200"
                >
                  {step === 1 && "Welcome! Let's personalize your learning path. What best describes you?"}
                  {step === 2 && "Great! What's your current experience level in tech?"}
                  {step === 3 && "Which language do you prefer for learning?"}
                  {step === 4 && "What's your main learning goal? Tell me in a sentence or two."}
                  {step === 5 && "Last step! Which domains are you interested in? Select all that apply."}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Answer area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* Step 1: Learner Type */}
                {step === 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {LEARNER_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setLearnerType(type.value)}
                        className={`p-4 rounded-md border transition-all text-left ${
                          learnerType === type.value
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-dark-border bg-dark-surface hover:border-primary-500/30"
                        }`}
                      >
                        <span className="text-2xl">{type.emoji}</span>
                        <p className="font-semibold text-white mt-2">{type.label}</p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Experience Level */}
                {step === 2 && (
                  <div className="flex gap-4">
                    {EXP_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setExperienceLevel(level.value)}
                        className={`flex-1 p-6 rounded-md border transition-all text-center ${
                          experienceLevel === level.value
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-dark-border bg-dark-surface hover:border-primary-500/30"
                        }`}
                      >
                        <span className="text-3xl">{level.emoji}</span>
                        <p className="font-semibold text-white mt-3">{level.label}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Language */}
                {step === 3 && (
                  <div className="flex gap-4">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setPreferredLang(lang.code)}
                        className={`flex-1 p-6 rounded-md border transition-all text-center ${
                          preferredLang === lang.code
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-dark-border bg-dark-surface hover:border-primary-500/30"
                        }`}
                      >
                        <span className="text-3xl">{lang.flag}</span>
                        <p className="font-semibold text-white mt-3">{lang.name}</p>
                        <p className="text-xs text-gray-500">{lang.nativeName}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: Goal */}
                {step === 4 && (
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., I want to become a machine learning engineer..."
                    className="input-field h-32 resize-none"
                    maxLength={500}
                  />
                )}

                {/* Step 5: Domain Interests */}
                  {step === 5 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {domainList.map((domain) => (
                        <button
                          key={domain.slug}
                          onClick={() => toggleDomain(domain.slug)}
                          className={`p-4 rounded-md border transition-all text-left relative ${
                            domainInterests.includes(domain.slug)
                              ? "border-primary-500 bg-primary-500/10"
                              : "border-dark-border bg-dark-surface hover:border-primary-500/30"
                          }`}
                        >
                          {domainInterests.includes(domain.slug) && (
                            <Check
                              size={16}
                              className="absolute top-2 right-2 text-primary-400"
                            />
                          )}
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-inner"
                            style={{ backgroundColor: `${domain.color}15`, border: `1px solid ${domain.color}30` }}
                          >
                            <span style={{ color: domain.color }}>
                              {domain.slug.includes("ai") ? "🤖" : 
                               domain.slug.includes("web") ? "🌐" : 
                               domain.slug.includes("cyber") ? "🔒" : "💻"}
                            </span>
                          </div>
                          <p className="font-bold text-white text-xs uppercase tracking-tight">{domain.name}</p>
                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{(domain as any).description || "Master this domain"}</p>
                        </button>
                      ))}
                    </div>
                  )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-dark-border">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={`text-sm text-gray-400 hover:text-white transition-colors ${
                step === 1 ? "invisible" : ""
              }`}
            >
              ← Back
            </button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              loading={saving}
              icon={step === TOTAL_STEPS ? <Check size={16} /> : <ArrowRight size={16} />}
            >
              {step === TOTAL_STEPS ? "Start Learning" : "Continue"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
