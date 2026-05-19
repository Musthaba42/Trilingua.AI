"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Sparkles, Globe, Code2, Shield, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { APP_NAME, APP_TAGLINE } from "@/lib/utils/constants";

const features = [
  { icon: Brain, label: "AI Tutor", desc: "Context-aware in 3 languages" },
  { icon: Code2, label: "Live Code", desc: "Practice in your browser" },
  { icon: Globe, label: "Multilingual", desc: "English • Tamil • Hindi" },
  { icon: Shield, label: "Cybersecurity", desc: "Real-world courses" },
  { icon: BookOpen, label: "Structured", desc: "Guided learning paths" },
  { icon: Sparkles, label: "Smart", desc: "Personalized for you" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      // Use hard redirect to ensure session cookie is sent with the request
      window.location.href = callbackUrl;
    }
  }

  async function handleDemoLogin(type: "student" | "admin" | "instructor") {
    setLoading(true);
    setError("");

    const credentials = {
      student: { email: "student@test.com", password: "password123" },
      admin: { email: "admin@test.com", password: "password123" },
      instructor: { email: "instructor@test.com", password: "password123" },
    };

    const redirectMap = {
      student: callbackUrl,
      admin: "/admin",
      instructor: "/instructor",
    };

    const result = await signIn("credentials", {
      ...credentials[type],
      redirect: false,
    });

    if (!result?.ok) {
      setError("Login failed. Please try again.");
      setLoading(false);
    } else {
      window.location.href = redirectMap[type];
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-hero overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl"
          />
          <motion.div
            animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-400/10 blur-3xl"
          />
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-primary-700/10 blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
                <Brain className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold gradient-text">{APP_NAME}</h1>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Learn anything,<br />
              <span className="gradient-text">in any language.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-md">
              {APP_TAGLINE}
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-md bg-white/5 border border-white/5"
                >
                  <feature.icon size={20} className="text-primary-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{feature.label}</p>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-dark-bg">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold gradient-text">{APP_NAME}</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to continue your learning journey</p>

          {/* Demo Quick Login */}
          <div className="space-y-3 mb-6">
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-center"
              onClick={() => handleDemoLogin("student")}
              loading={loading}
              icon={<BookOpen size={18} />}
            >
              Quick Start as Student
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                className="flex-1 justify-center border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                onClick={() => handleDemoLogin("instructor")}
                loading={loading}
                icon={<GraduationCap size={16} />}
              >
                Instructor Portal
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1 justify-center border-teal-500/30 hover:bg-teal-500/10 text-teal-400"
                onClick={() => handleDemoLogin("admin")}
                loading={loading}
                icon={<Shield size={16} />}
              >
                Admin Panel
              </Button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-dark-bg text-gray-500">or sign in with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="student@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full justify-center"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Google OAuth placeholder */}
          <div className="mt-6">
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-center opacity-50 cursor-not-allowed"
              disabled
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            >
              Continue with Google (coming soon)
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-600">
            Demo mode — no real accounts needed.
            <br />
            Enter any email to sign in automatically.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-bg" />}>
      <LoginForm />
    </Suspense>
  );
}
