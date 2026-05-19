"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Globe, Award, BookOpen, Save, Camera, 
  Flame, Target, Code2, Sparkles, Briefcase, Loader2,
  TrendingUp, FolderGit2, CheckCircle, Trophy, Download, FileText
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LANGUAGES } from "@/lib/utils/constants";
import ReactMarkdown from "react-markdown";

const SKILL_TAGS = [
  { name: "Python", level: "Advanced", color: "#3B82F6" },
  { name: "AI/ML", level: "Intermediate", color: "#8B5CF6" },
  { name: "Cybersecurity", level: "Advanced", color: "#10B981" },
  { name: "Deep Learning", level: "Beginner", color: "#EC4899" },
  { name: "Data Analysis", level: "Intermediate", color: "#6366F1" },
  { name: "JavaScript", level: "Beginner", color: "#F59E0B" },
];

const MINI_PROJECTS = [
  { name: "AI Chatbot", progress: 75, color: "#8B5CF6" },
  { name: "Portfolio Site", progress: 100, color: "#10B981" },
  { name: "Password Cracker", progress: 40, color: "#F59E0B" },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preferredLang, setPreferredLang] = useState("en");
  const [careerMatch, setCareerMatch] = useState("");
  const [loadingCareer, setLoadingCareer] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as any).role;
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "INSTRUCTOR") {
        router.push("/instructor");
      }
    }
  }, [session, status, router]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fetchCareerMatch = async () => {
    setLoadingCareer(true);
    try {
      const res = await fetch("/api/ai/job-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: SKILL_TAGS.map(s => s.name),
          completedCourses: ["Claude Masterclass", "Harvard CS50 Cybersecurity"],
          experienceLevel: "Intermediate",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCareerMatch(data.data.content);
      }
    } catch (err) {
      console.error("Career match error", err);
    } finally {
      setLoadingCareer(false);
    }
  };

  const isEmojiLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    const code = trimmed.charCodeAt(0);
    return code > 255 || (code >= 0x2600 && code <= 0x27BF);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const buildWordHTML = (text: string) => {
    const rows = text.split('\n').map(line => {
      const l = line.trim();
      if (!l) return '<br />';
      if (isEmojiLine(l))
        return `<h2 style="font-family:Calibri,sans-serif;font-size:16pt;font-weight:bold;color:#1e293b;margin-top:18px;margin-bottom:4px;">${l}</h2>`;
      if (l.startsWith('##'))
        return `<h2 style="font-family:Calibri,sans-serif;font-size:14pt;font-weight:bold;color:#1e293b;margin-top:16px;margin-bottom:4px;">${l.replace(/^#+/, '').trim()}</h2>`;
      if (l.startsWith('-'))
        return `<li style="font-family:Calibri,sans-serif;font-size:12pt;margin-left:20px;margin-bottom:3px;">${l.substring(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
      return `<p style="font-family:Calibri,sans-serif;font-size:12pt;margin-bottom:4px;">${l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
    }).join('\n');
    return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>AI Career Match Report</title></head>
<body style="font-family:Calibri,sans-serif;font-size:12pt;color:#1e293b;margin:40px;">
  <h1 style="font-family:Calibri,sans-serif;font-size:20pt;font-weight:bold;color:#7c3aed;margin-bottom:8px;">AI Career Match Report</h1>
  <p style="font-size:12pt;margin-bottom:4px;"><strong>Prepared for:</strong> ${session?.user?.name || 'Learner'}</p>
  <p style="font-size:12pt;margin-bottom:16px;"><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
  <hr style="border:1px solid #e2e8f0;margin-bottom:16px;" />
  ${rows}
</body></html>`;
  };

  const handleDownloadWord = () => {
    if (!careerMatch) return;
    const html = buildWordHTML(careerMatch);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI-Career-Report.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden !important; }
          #career-print, #career-print * { visibility: visible !important; }
          #career-print {
            position: fixed;
            left: 0; top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 36px 44px;
            z-index: 99999;
          }
          ::-webkit-scrollbar { display: none; }
        }
      `}} />

      {/* Hidden printable div — visible only during print */}
      <div id="career-print" style={{ display: 'none' }}>
        <h1 style={{ fontFamily: 'Calibri, sans-serif', fontSize: '24px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>AI Career Match Report</h1>
        <p style={{ fontFamily: 'Calibri, sans-serif', fontSize: '13px', color: '#374151', marginBottom: '4px' }}><strong>Prepared for:</strong> {session?.user?.name || 'Learner'}</p>
        <p style={{ fontFamily: 'Calibri, sans-serif', fontSize: '13px', color: '#374151', marginBottom: '16px' }}><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
        <hr style={{ borderColor: '#d1d5db', marginBottom: '20px' }} />
        <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '13px', color: '#1e293b' }}>
          {careerMatch.split('\n').map((line, idx) => {
            const l = line.trim();
            if (!l) return <br key={idx} />;
            if (isEmojiLine(l)) return <h2 key={idx} style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginTop: '18px', marginBottom: '4px' }}>{l}</h2>;
            if (l.startsWith('##')) return <h2 key={idx} style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginTop: '14px', marginBottom: '4px' }}>{l.replace(/^#+/, '').trim()}</h2>;
            if (l.startsWith('-')) return <li key={idx} style={{ marginLeft: '18px', marginBottom: '3px', color: '#374151' }}>{l.substring(1).trim()}</li>;
            return <p key={idx} style={{ marginBottom: '4px', color: '#374151' }}>{l}</p>;
          })}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Profile & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={session?.user?.image || "https://ui-avatars.com/api/?name=User&background=6D28D9&color=fff&bold=true&size=100"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full ring-4 ring-primary-500/20"
                />
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{session?.user?.name || "User"}</h2>
                <p className="text-gray-400 text-sm">{session?.user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge-primary text-xs capitalize">
                    {(session?.user as any)?.role?.toLowerCase() || "learner"}
                  </span>
                  <span className="badge-free text-xs">Free Plan</span>
                </div>
              </div>
              {/* Streak badge */}
              <div className="hidden md:flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                <Flame size={24} className="text-amber-400 mb-1" />
                <span className="text-2xl font-bold text-amber-400">7</span>
                <span className="text-[10px] text-gray-500">day streak</span>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 space-y-6"
          >
            <h3 className="section-header">
              <User size={20} className="text-primary-400" />
              Account Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                defaultValue={session?.user?.name || ""}
                icon={<User size={16} />}
              />
              <Input
                label="Email"
                defaultValue={session?.user?.email || ""}
                icon={<Mail size={16} />}
                disabled
              />
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Globe size={14} className="inline mr-1" /> Preferred Language
              </label>
              <div className="flex gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setPreferredLang(lang.code)}
                    className={`flex-1 p-4 rounded-lg border text-center transition-all ${
                      preferredLang === lang.code
                        ? "border-primary-500 bg-primary-500/10"
                        : "border-dark-border bg-dark-surface hover:border-primary-500/30"
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <p className="font-medium text-white text-sm mt-2">{lang.name}</p>
                    <p className="text-xs text-gray-500">{lang.nativeName}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSave}
              loading={saving}
              icon={saved ? <Award size={16} /> : <Save size={16} />}
            >
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </motion.div>
        </div>

        {/* Right Column — Stats & Skills */}
        <div className="space-y-6">
          {/* Learning Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5 space-y-4"
          >
            <h3 className="section-header text-sm">
              <Trophy size={18} className="text-amber-400" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Courses", value: "4", emoji: "📚" },
                { label: "Lessons", value: "12", emoji: "✅" },
                { label: "Total Hours", value: "24.5", emoji: "⏱️" },
                { label: "Best Streak", value: "14d", emoji: "🔥" },
                { label: "XP Earned", value: "1,240", emoji: "⭐" },
                { label: "Projects", value: "3", emoji: "🛠️" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-lg bg-dark-surface text-center">
                  <p className="text-lg mb-0.5">{stat.emoji}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 space-y-4"
          >
            <h3 className="section-header text-sm">
              <Code2 size={18} className="text-blue-400" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILL_TAGS.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{ 
                    backgroundColor: `${skill.color}15`, 
                    borderColor: `${skill.color}30`,
                    color: skill.color 
                  }}
                >
                  <span>{skill.name}</span>
                  <span className="text-[9px] opacity-70">• {skill.level}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mini Project Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5 space-y-4"
          >
            <h3 className="section-header text-sm">
              <FolderGit2 size={18} className="text-green-400" />
              Projects
            </h3>
            <div className="space-y-3">
              {MINI_PROJECTS.map((project) => (
                <div key={project.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300">{project.name}</span>
                    <span className="text-xs font-semibold" style={{ color: project.color }}>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ 
                      width: `${project.progress}%`, 
                      background: `linear-gradient(90deg, ${project.color}cc, ${project.color})` 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Career Match Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-header">
            <Briefcase size={20} className="text-blue-400" />
            AI Career Match
          </h3>
          <Button 
            size="sm" 
            onClick={fetchCareerMatch} 
            loading={loadingCareer}
            icon={<Sparkles size={14} />}
          >
            {careerMatch ? "Refresh" : "Get Career Match"}
          </Button>
        </div>

        {!careerMatch && !loadingCareer && (
          <div className="text-center py-8 text-gray-500">
            <Briefcase size={36} className="mx-auto mb-3 text-gray-700" />
            <p className="text-sm">Click &quot;Get Career Match&quot; to see AI-powered job recommendations based on your skills.</p>
          </div>
        )}

        {loadingCareer && (
          <div className="text-center py-8">
            <Loader2 size={28} className="mx-auto mb-3 text-primary-400 animate-spin" />
            <p className="text-sm text-gray-400">Analyzing your profile...</p>
          </div>
        )}

        {careerMatch && (
          <div>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{careerMatch}</ReactMarkdown>
            </div>

            {/* Download buttons — appear only after career result is generated */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-dark-border">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] bg-purple-600"
              >
                <Download size={15} />
                Download PDF
              </button>
              <button
                onClick={handleDownloadWord}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 border border-gray-600 transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileText size={15} />
                Download Word
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
