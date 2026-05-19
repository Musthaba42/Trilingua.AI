"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  BarChart3, Clock, BookOpen, CheckCircle, TrendingUp, Flame, 
  Award, Target, Briefcase, Sparkles, Code2, FolderGit2,
  ExternalLink, Loader2, Download, FileText
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";

function generateHeatmapData() {
  const today = new Date();
  const result: { date: string; hours: number; xp: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const prob = (i < 30 ? 0.72 : i < 90 ? 0.52 : 0.32) + (dow > 0 && dow < 6 ? 0.2 : 0);
    let hours = 0;
    if (Math.random() < prob) {
      const r = Math.random();
      hours = r < 0.25 ? +((0.5 + Math.random() * 0.5).toFixed(1))
            : r < 0.55 ? +((1 + Math.random()).toFixed(1))
            : r < 0.82 ? +((2 + Math.random() * 2).toFixed(1))
            : +((4.5 + Math.random()).toFixed(1));
    }
    result.push({ date: d.toISOString().split("T")[0], hours, xp: Math.round((hours * 40) / 10) * 10 });
  }
  return result;
}

const WEEKLY_DATA = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 0.5 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 4.1 },
  { day: "Sun", hours: 1.5 },
];

const DOMAIN_PROGRESS = [
  { name: "AI & Automation", progress: 45, color: "#8B5CF6", courses: 2, hours: 6 },
  { name: "Deep Learning", progress: 20, color: "#EC4899", courses: 1, hours: 3 },
  { name: "Cybersecurity", progress: 80, color: "#10B981", courses: 1, hours: 10 },
  { name: "Python", progress: 10, color: "#3B82F6", courses: 1, hours: 1.5 },
];

const STATS = [
  { label: "Total Hours", value: "24.5", icon: Clock, color: "text-primary-400", bg: "from-primary-500/10" },
  { label: "Lessons Done", value: "12", icon: CheckCircle, color: "text-green-400", bg: "from-green-500/10" },
  { label: "Courses Active", value: "4", icon: BookOpen, color: "text-accent-400", bg: "from-accent-400/10" },
  { label: "Current Streak", value: "7 🔥", icon: Flame, color: "text-amber-400", bg: "from-amber-500/10" },
  { label: "Best Streak", value: "14", icon: Award, color: "text-yellow-400", bg: "from-yellow-500/10" },
  { label: "Avg Daily", value: "1.2h", icon: Target, color: "text-rose-400", bg: "from-rose-500/10" },
];

const PROJECTS = [
  { name: "AI Chatbot", progress: 75, language: "Python", status: "In Progress", milestones: ["Setup ✅", "API ✅", "UI ✅", "Deploy 🔲"], color: "#8B5CF6" },
  { name: "Portfolio Website", progress: 100, language: "HTML/CSS", status: "Completed", milestones: ["Design ✅", "Code ✅", "Deploy ✅"], color: "#10B981" },
  { name: "Password Cracker", progress: 40, language: "Python", status: "In Progress", milestones: ["Research ✅", "Hash Logic ✅", "GUI 🔲", "Report 🔲"], color: "#F59E0B" },
  { name: "ML Image Classifier", progress: 15, language: "Python", status: "Just Started", milestones: ["Dataset ✅", "Model 🔲", "Training 🔲", "Eval 🔲"], color: "#EC4899" },
];

const STREAK_CALENDAR_DATA = (() => {
  const today = new Date();
  const DN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return Array.from({ length: 30 }, (_, idx) => {
    const i = 29 - idx;
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const active = i < 7 || (i > 10 && i < 17) || Math.random() > 0.45;
    const hours = active ? +((0.5 + Math.random() * 4.5).toFixed(1)) : 0;
    const lessons = active ? Math.floor(Math.random() * 4) + 1 : 0;
    const xp = Math.round((hours * 40) / 10) * 10;
    return {
      dateKey: d.toISOString().split("T")[0],
      dateNum: d.getDate(),
      dayLetter: ["S","M","T","W","T","F","S"][d.getDay()],
      fullDate: `${DN[d.getDay()]} ${MN[d.getMonth()]} ${d.getDate()}`,
      active, hours, lessons, xp,
      label: hours >= 3 ? "Great day! 🚀" : hours >= 1 ? "Light session" : "Rest day",
    };
  });
})();

function getHeatmapColor(hours: number): string {
  if (hours === 0) return "#1a1a2e";
  if (hours < 1)   return "#2d1b69";
  if (hours < 2)   return "#4c2a9e";
  if (hours < 4)   return "#7c3aed";
  return "#a855f7";
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const heatmapData = useMemo(() => generateHeatmapData(), []);
  const maxWeeklyHours = Math.max(...WEEKLY_DATA.map((d) => d.hours));
  const [jobInsights, setJobInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsSource, setInsightsSource] = useState<string>("");
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeDay) return;
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node))
        setActiveDay(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeDay]);

  const heatmapGrid = useMemo(() => {
    const startDow = new Date(heatmapData[0].date).getDay();
    const padded = [...Array(startDow).fill(null), ...heatmapData];
    const weeks = Array.from({ length: Math.ceil(padded.length / 7) }, (_, wi) =>
      padded.slice(wi * 7, wi * 7 + 7)
    );
    const MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthLabels: { week: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const first = week.find((c) => c !== null) as { date: string } | undefined;
      if (first) {
        const m = new Date(first.date).getMonth();
        if (m !== lastMonth) { monthLabels.push({ week: wi, label: MN[m] }); lastMonth = m; }
      }
    });
    return { weeks, monthLabels };
  }, [heatmapData]);

  const fetchJobInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/job-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: ["Python", "AI Basics", "Cybersecurity", "Deep Learning"],
          completedCourses: ["Claude Masterclass", "Harvard CS50 Cybersecurity"],
          experienceLevel: "Intermediate",
          domainProgress: DOMAIN_PROGRESS.reduce((acc, d) => ({ ...acc, [d.name]: d.progress }), {}),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJobInsights(data.data.content);
        setInsightsSource(data.data.source);
      }
    } catch (err) {
      console.error("Failed to fetch insights", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const hasEmojiPrefix = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    const code = trimmed.charCodeAt(0);
    return code > 255 || (code >= 0x2600 && code <= 0x27BF);
  };

  const parseMarkdownToHTML = (text: string) => {
    return text
      .split('\n')
      .map(line => {
        const l = line.trim();
        if (!l) return '<br />';
        if (l.startsWith('##')) {
          return `<h2 style="font-family: Calibri, sans-serif; font-size: 14pt; font-weight: bold; color: #1e293b; margin-top: 20px; margin-bottom: 6px;">${l.replace(/^#+/, '').trim()}</h2>`;
        }
        if (hasEmojiPrefix(l)) {
          return `<h3 style="font-family: Calibri, sans-serif; font-size: 13pt; font-weight: bold; color: #1e293b; margin-top: 16px; margin-bottom: 4px;">${l}</h3>`;
        }
        if (l.startsWith('-')) {
          return `<li style="font-family: Calibri, sans-serif; font-size: 12pt; margin-left: 20px; margin-bottom: 3px;">${l.substring(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
        }
        if (l.match(/^\d+\./)) {
          return `<li style="font-family: Calibri, sans-serif; font-size: 12pt; margin-left: 20px; margin-bottom: 3px;">${l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
        }
        return `<p style="font-family: Calibri, sans-serif; font-size: 12pt; margin-bottom: 4px;">${l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
      })
      .join('\n');
  };

  const handleDownloadWord = () => {
    if (!jobInsights) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>AI Career Match Report</title></head>
      <body style="font-family: Calibri, sans-serif; font-size: 12pt; color: #1e293b; margin: 40px;">
        <h1 style="font-family: Calibri, sans-serif; font-size: 18pt; font-weight: bold; color: #6d28d9; margin-bottom: 8px;">AI Career Match Report</h1>
        <p style="font-family: Calibri, sans-serif; font-size: 12pt; margin-bottom: 4px;"><strong>Prepared for:</strong> ${session?.user?.name || 'Learner'}</p>
        <p style="font-family: Calibri, sans-serif; font-size: 12pt; margin-bottom: 12px;"><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
        <hr style="border: 1px solid #e2e8f0; margin-bottom: 16px;" />
        ${parseMarkdownToHTML(jobInsights)}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI-Career-Report.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 relative">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * { visibility: hidden !important; }
            #career-print, #career-print * { visibility: visible !important; }
            #career-print {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
              padding: 32px 40px;
              z-index: 99999;
            }
            ::-webkit-scrollbar { display: none; }
          }
        `
      }} />

      {/* Printable Area (Hidden normally, visible only in print) */}
      <div id="career-print" style={{ display: 'none' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6d28d9', marginBottom: '8px', fontFamily: 'Calibri, sans-serif' }}>AI Career Match Report</h1>
        <p style={{ fontSize: '13px', color: '#374151', marginBottom: '4px', fontFamily: 'Calibri, sans-serif' }}><strong>Prepared for:</strong> {session?.user?.name || 'Learner'}</p>
        <p style={{ fontSize: '13px', color: '#374151', marginBottom: '16px', fontFamily: 'Calibri, sans-serif' }}><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
        <hr style={{ borderColor: '#d1d5db', marginBottom: '20px' }} />
        <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '12pt', color: '#1e293b' }}>
          {jobInsights.split('\n').map((line, idx) => {
            const l = line.trim();
            if (!l) return <br key={idx} />;
            if (l.startsWith('##')) return <h2 key={idx} style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginTop: '20px', marginBottom: '6px' }}>{l.replace(/^#+/, '').trim()}</h2>;
            if (hasEmojiPrefix(l)) return <h3 key={idx} style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginTop: '16px', marginBottom: '4px' }}>{l}</h3>;
            if (l.startsWith('-')) return <li key={idx} style={{ marginLeft: '20px', marginBottom: '3px', color: '#374151' }}>{l.substring(1).trim()}</li>;
            return <p key={idx} style={{ marginBottom: '4px', color: '#374151' }}>{l}</p>;
          })}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Your learning journey at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-4 text-center bg-gradient-to-br ${stat.bg} to-transparent`}
          >
            <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Streak Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6"
      >
        <h3 className="section-header mb-4">
          <Flame size={20} className="text-amber-400" />
          Streak Calendar
          <span className="ml-auto text-amber-400 text-sm font-bold">7 day streak 🔥</span>
        </h3>
        <div ref={calendarRef} className="flex items-end gap-1 justify-between">
          {STREAK_CALENDAR_DATA.map((d, i) => (
            <div key={i} className="relative flex flex-col items-center gap-1">
              <span className="text-[9px] text-gray-600">{d.dayLetter}</span>
              <button
                onClick={() => setActiveDay(activeDay === d.dateKey ? null : d.dateKey)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110 ${
                  d.active
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                    : "bg-dark-surface text-gray-600 border border-dark-border hover:border-gray-500"
                }`}
              >
                {d.dateNum}
              </button>
              {d.active && <div className="w-1 h-1 rounded-full bg-amber-400" />}
              {activeDay === d.dateKey && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 w-44 rounded-xl border border-dark-border p-3 shadow-2xl pointer-events-none" style={{ background: "#13131f" }}>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent" style={{ borderTopColor: "#2a2a3e" }} />
                  <p className="text-[11px] font-semibold text-white mb-2">{d.fullDate}</p>
                  <p className="text-[11px] text-gray-400">⏱ {d.hours}h studied</p>
                  <p className="text-[11px] text-gray-400">📖 {d.lessons} lessons</p>
                  <p className="text-[11px] font-semibold text-amber-400">🏆 +{d.xp} XP</p>
                  <p className="text-[10px] text-gray-500 mt-1.5 border-t border-white/5 pt-1.5">{d.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-border">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>🔥 Current: <strong className="text-amber-400">7 days</strong></span>
            <span>🏆 Best: <strong className="text-yellow-400">14 days</strong></span>
            <span>📅 This month: <strong className="text-green-400">22/30 days</strong></span>
          </div>
          <Award size={20} className="text-yellow-500" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h3 className="section-header mb-4">
            <BarChart3 size={20} className="text-primary-400" />
            Activity Heatmap
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-[2px]">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-[2px] mr-1 mt-5">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((lbl, di) => (
                  <div key={lbl} className="h-[12px] flex items-center">
                    <span className="text-[9px] text-gray-600 w-6" style={{ visibility: di === 1 || di === 3 || di === 5 ? "visible" : "hidden" }}>{lbl}</span>
                  </div>
                ))}
              </div>
              {/* Weeks columns */}
              <div>
                {/* Month labels */}
                <div className="flex gap-[2px] h-5 mb-[2px]">
                  {heatmapGrid.weeks.map((_, wi) => {
                    const ml = heatmapGrid.monthLabels.find((m) => m.week === wi);
                    return (
                      <div key={wi} className="w-[12px] relative">
                        {ml && <span className="absolute left-0 text-[9px] text-gray-500 whitespace-nowrap">{ml.label}</span>}
                      </div>
                    );
                  })}
                </div>
                {/* Cell grid */}
                <div className="flex gap-[2px]">
                  {heatmapGrid.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]">
                      {Array.from({ length: 7 }, (_, di) => {
                        const cell = week[di] as { date: string; hours: number; xp: number } | null | undefined;
                        return (
                          <div
                            key={di}
                            className="w-[12px] h-[12px] cursor-pointer transition-transform hover:scale-125 hover:ring-1 hover:ring-white/30"
                            style={{ backgroundColor: cell ? getHeatmapColor(cell.hours) : "transparent", borderRadius: "2px" }}
                            title={cell && cell.hours > 0 ? `${cell.date}: ${cell.hours}h · +${cell.xp} XP` : cell ? `${cell.date}: Rest day` : ""}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-500">
            <span>Less</span>
            {["#1a1a2e","#2d1b69","#4c2a9e","#7c3aed","#a855f7"].map((c) => (
              <div key={c} className="w-[12px] h-[12px]" style={{ backgroundColor: c, borderRadius: "2px" }} />
            ))}
            <span>More</span>
            <span className="ml-3 text-gray-600">Last 365 days</span>
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="section-header mb-4">
            <TrendingUp size={20} className="text-accent-400" />
            This Week
          </h3>
          <div className="flex items-end gap-2 h-40">
            {WEEKLY_DATA.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{d.hours}h</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.hours / maxWeeklyHours) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t bg-gradient-to-t from-primary-600 to-primary-400 min-h-[4px]"
                />
                <span className="text-[10px] text-gray-600">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
            <span className="text-xs text-gray-500">Total this week</span>
            <span className="text-sm font-bold gradient-text">
              {WEEKLY_DATA.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}h
            </span>
          </div>
        </motion.div>
      </div>

      {/* Project Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-6"
      >
        <h3 className="section-header mb-6">
          <FolderGit2 size={20} className="text-green-400" />
          Project Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="p-5 rounded-lg bg-dark-surface border border-dark-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                  <h4 className="font-semibold text-white">{project.name}</h4>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  project.progress === 100 ? "bg-green-500/20 text-green-400"
                  : project.progress > 50 ? "bg-blue-500/20 text-blue-400"
                  : "bg-amber-500/20 text-amber-400"
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Code2 size={12} />
                <span>{project.language}</span>
                <span className="ml-auto font-semibold" style={{ color: project.color }}>{project.progress}%</span>
              </div>

              <div className="h-2 bg-dark-bg rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${project.color}cc, ${project.color})` }}
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {project.milestones.map((m, j) => (
                  <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-dark-bg border border-dark-border text-gray-400">
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Domain Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="section-header mb-6">
          <Target size={20} className="text-amber-400" />
          Domain Progress
        </h3>
        <div className="space-y-5">
          {DOMAIN_PROGRESS.map((domain, i) => (
            <div key={domain.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: domain.color }} />
                  <span className="font-medium text-white text-sm">{domain.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{domain.courses} course{domain.courses > 1 ? "s" : ""}</span>
                  <span>{domain.hours}h studied</span>
                  <span className="font-semibold text-primary-300">{domain.progress}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-dark-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${domain.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${domain.color}cc, ${domain.color})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Job Insights / Outsourcing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-header">
            <Briefcase size={20} className="text-blue-400" />
            AI Career Insights & Job Outsourcing
          </h3>
          <Button 
            size="sm" 
            onClick={fetchJobInsights} 
            loading={loadingInsights}
            icon={<Sparkles size={14} />}
          >
            {jobInsights ? "Refresh" : "Generate Insights"}
          </Button>
        </div>

        {!jobInsights && !loadingInsights && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-700" />
            <p className="text-lg font-medium text-gray-400">Get Personalized Career Insights</p>
            <p className="text-sm mt-2">Our AI analyzes your skills and progress to recommend jobs, freelance gigs, and career paths.</p>
            <Button className="mt-4" onClick={fetchJobInsights} icon={<Sparkles size={16} />}>
              Generate with Gemini AI
            </Button>
          </div>
        )}

        {loadingInsights && (
          <div className="text-center py-12">
            <Loader2 size={32} className="mx-auto mb-4 text-primary-400 animate-spin" />
            <p className="text-gray-400">Gemini is analyzing your profile...</p>
          </div>
        )}

        {jobInsights && (
          <div>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{jobInsights}</ReactMarkdown>
              {insightsSource && (
                <div className="flex items-center gap-1 mt-4 text-[10px] text-primary-500/50 not-prose">
                  <Sparkles size={10} />
                  <span>Powered by {insightsSource === "gemini" ? "Gemini AI" : "Demo Data"}</span>
                </div>
              )}
            </div>

            {/* Download Buttons — appear only after career result is generated */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-dark-border">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
              >
                <Download size={15} />
                Download PDF
              </button>
              <button
                onClick={handleDownloadWord}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-200 border transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(255,255,255,0.03)' }}
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
