"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, BookOpen, Activity,
  Search, Shield, GraduationCap, 
  TrendingUp, PlayCircle, Eye, Ban, CreditCard, BarChart,
  Plus, Download, Bell, X, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const MOCK_STATS = [
  { label: "Total Users", value: "342", trend: "+12%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Total Instructors", value: "12", trend: "+5%", icon: GraduationCap, color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Total Revenue", value: "₹48,200", trend: "+24%", icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
  { label: "Active Subscriptions", value: "89", trend: "+18%", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Total Courses", value: "24", trend: "+2%", icon: BookOpen, color: "text-pink-400", bg: "bg-pink-400/10" },
  { label: "Total Lessons", value: "186", trend: "+8%", icon: PlayCircle, color: "text-teal-400", bg: "bg-teal-400/10" },
];

const MOCK_USERS = [
  { id: 1, name: "Alex Student", email: "student@test.com", role: "LEARNER", plan: "PRO", joined: "Oct 12, 2025", status: "Active", avatar: "https://ui-avatars.com/api/?name=Alex+Student&background=6D28D9&color=fff" },
  { id: 2, name: "Admin User", email: "admin@test.com", role: "ADMIN", plan: "FREE", joined: "Jan 1, 2024", status: "Active", avatar: "https://ui-avatars.com/api/?name=Admin+User&background=14B8A6&color=fff" },
  { id: 3, name: "Prof. Instructor", email: "instructor@test.com", role: "INSTRUCTOR", plan: "PRO", joined: "Mar 15, 2024", status: "Active", avatar: "https://ui-avatars.com/api/?name=Prof+Instructor&background=F59E0B&color=fff" },
  { id: 4, name: "Sarah Connor", email: "sarah.c@gmail.com", role: "LEARNER", plan: "FREE", joined: "Nov 5, 2025", status: "Inactive", avatar: "https://ui-avatars.com/api/?name=Sarah+Connor&background=EC4899&color=fff" },
  { id: 5, name: "David Chen", email: "dchen@code.org", role: "INSTRUCTOR", plan: "PRO", joined: "Aug 22, 2024", status: "Active", avatar: "https://ui-avatars.com/api/?name=David+Chen&background=3B82F6&color=fff" },
  { id: 6, name: "Emma Watson", email: "emma@example.com", role: "LEARNER", plan: "PRO", joined: "Dec 10, 2025", status: "Active", avatar: "https://ui-avatars.com/api/?name=Emma+Watson&background=EF4444&color=fff" },
  { id: 7, name: "John Doe", email: "john.doe@test.com", role: "LEARNER", plan: "FREE", joined: "Jan 15, 2026", status: "Active", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=22C55E&color=fff" },
  { id: 8, name: "Priya Sharma", email: "priya@india.in", role: "INSTRUCTOR", plan: "PRO", joined: "Feb 2, 2026", status: "Active", avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=EAB308&color=fff" },
  { id: 9, name: "Robert Fox", email: "robert.f@mail.com", role: "LEARNER", plan: "FREE", joined: "Mar 8, 2026", status: "Inactive", avatar: "https://ui-avatars.com/api/?name=Robert+Fox&background=6366F1&color=fff" },
  { id: 10, name: "Michael Scott", email: "michael@dundermifflin.com", role: "ADMIN", plan: "PRO", joined: "Jan 1, 2022", status: "Active", avatar: "https://ui-avatars.com/api/?name=Michael+Scott&background=A855F7&color=fff" },
];

const MOCK_PAYMENTS = [
  { id: 1, user: "Alex Student", plan: "PRO", amount: "₹4,999", date: "May 18, 2026", method: "Razorpay", status: "Success" },
  { id: 2, user: "Sarah Connor", plan: "FREE", amount: "₹0", date: "May 17, 2026", method: "Free", status: "Success" },
  { id: 3, user: "John Doe", plan: "PRO", amount: "₹4,999", date: "May 16, 2026", method: "Razorpay", status: "Pending" },
  { id: 4, user: "Priya Sharma", plan: "PRO", amount: "₹1,999", date: "May 15, 2026", method: "Razorpay", status: "Failed" },
  { id: 5, user: "David Chen", plan: "PRO", amount: "₹9,999", date: "May 14, 2026", method: "Razorpay", status: "Success" },
  { id: 6, user: "Emma Watson", plan: "PRO", amount: "₹4,999", date: "May 12, 2026", method: "Razorpay", status: "Success" },
  { id: 7, user: "Robert Fox", plan: "FREE", amount: "₹0", date: "May 10, 2026", method: "Free", status: "Success" },
  { id: 8, user: "Michael Scott", plan: "PRO", amount: "₹4,999", date: "May 8, 2026", method: "Razorpay", status: "Success" },
];

const MOCK_COURSES = [
  { id: 1, name: "Complete Python Masterclass", instructor: "Prof. Instructor", enrolled: 1245, completionRate: 85, revenue: "₹62,25,000" },
  { id: 2, name: "React for Beginners", instructor: "David Chen", enrolled: 890, completionRate: 65, revenue: "₹26,70,000" },
  { id: 3, name: "Advanced Data Structures", instructor: "Priya Sharma", enrolled: 432, completionRate: 45, revenue: "₹8,64,000" },
  { id: 4, name: "Machine Learning A-Z", instructor: "David Chen", enrolled: 2150, completionRate: 72, revenue: "₹1,07,50,000" },
  { id: 5, name: "Cybersecurity 101", instructor: "Prof. Instructor", enrolled: 560, completionRate: 35, revenue: "₹11,20,000" },
  { id: 6, name: "Next.js Fullstack Apps", instructor: "Priya Sharma", enrolled: 720, completionRate: 58, revenue: "₹36,00,000" },
];

export default function AdminDashboard() {
  const [userTab, setUserTab] = useState<"ALL" | "STUDENTS" | "INSTRUCTORS">("ALL");
  const [search, setSearch] = useState("");
  
  // Modals state
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [activeNavTab, setActiveNavTab] = useState("overview");

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const filteredUsers = MOCK_USERS.filter(u => {
    if (userTab === "STUDENTS" && u.role !== "LEARNER") return false;
    if (userTab === "INSTRUCTORS" && u.role !== "INSTRUCTOR") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold border border-purple-500/30">Admin</span>;
      case "INSTRUCTOR": return <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">Instructor</span>;
      default: return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">Learner</span>;
    }
  };

  const getPlanBadge = (plan: string) => {
    return plan === "PRO" 
      ? <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">Pro</span>
      : <span className="px-2 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-semibold border border-white/10">Free</span>;
  };

  const handleExportCSV = () => {
    const headers = "ID,Name,Email,Role,Plan,Joined,Status\n";
    const csvContent = MOCK_USERS.map(u => 
      `${u.id},"${u.name}","${u.email}",${u.role},${u.plan},"${u.joined}",${u.status}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToSection = (id: string) => {
    setActiveNavTab(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; 
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto p-2 pb-10">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dark-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="text-purple-500" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage users, courses and revenue</p>
        </div>
        <div className="text-sm font-medium text-gray-400">
          {todayDate}
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setShowAddUser(true)} icon={<Plus size={16} />} className="bg-purple-600 hover:bg-purple-700 text-white border-none shadow-lg shadow-purple-900/20">
          Add User
        </Button>
        <Button variant="secondary" onClick={handleExportCSV} icon={<Download size={16} />}>
          Export CSV
        </Button>
        <Button variant="secondary" onClick={() => setShowAnnouncement(true)} icon={<Bell size={16} />}>
          Send Announcement
        </Button>
      </div>

      {/* NAVIGATION TAB BAR */}
      <div className="flex items-center gap-1 border-b border-dark-border mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'Users' },
          { id: 'payments', label: 'Payments' },
          { id: 'courses', label: 'Courses' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeNavTab === tab.id 
                ? 'border-primary-500 text-primary-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Stats Row */}
      <div id="overview" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 scroll-mt-24">
        {MOCK_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                <TrendingUp size={12} /> {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* USERS TABLE */}
      <div id="users" className="bg-dark-card border border-dark-border rounded-xl overflow-hidden scroll-mt-24">
        <div className="p-5 border-b border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-primary-400" /> User Directory
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex bg-dark-bg rounded-lg p-1 border border-dark-border">
              {(["ALL", "STUDENTS", "INSTRUCTORS"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setUserTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${userTab === tab ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200"}`}
                >
                  {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="relative w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-bg/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Join Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-9 h-9 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{getRoleBadge(u.role)}</td>
                  <td className="p-4">{getPlanBadge(u.plan)}</td>
                  <td className="p-4 text-sm text-gray-300">{u.joined}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-xs text-gray-400">{u.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-white bg-dark-bg rounded border border-dark-border" title="View">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded border border-red-500/20" title="Suspend">
                        <Ban size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* REVENUE AND PAYMENTS TABLE */}
        <div id="payments" className="bg-dark-card border border-dark-border rounded-xl overflow-hidden flex flex-col scroll-mt-24">
          <div className="p-5 border-b border-dark-border">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard size={18} className="text-primary-400" /> Payment History
            </h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-bg/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">User Name</th>
                  <th className="p-4 font-medium">Plan</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 font-medium">Payment Date</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {MOCK_PAYMENTS.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm font-semibold text-white">{payment.user}</td>
                    <td className="p-4">{getPlanBadge(payment.plan)}</td>
                    <td className="p-4 text-sm font-bold text-green-400 text-right">{payment.amount}</td>
                    <td className="p-4 text-xs text-gray-300">{payment.date}</td>
                    <td className="p-4 text-xs text-gray-400 font-medium">{payment.method}</td>
                    <td className="p-4 text-right">
                      {payment.status === "Success" && <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">Success</span>}
                      {payment.status === "Pending" && <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">Pending</span>}
                      {payment.status === "Failed" && <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">Failed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COURSE PERFORMANCE TABLE */}
        <div id="courses" className="bg-dark-card border border-dark-border rounded-xl overflow-hidden flex flex-col scroll-mt-24">
          <div className="p-5 border-b border-dark-border">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart size={18} className="text-primary-400" /> Course Performance
            </h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-bg/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Course Name</th>
                  <th className="p-4 font-medium">Instructor</th>
                  <th className="p-4 font-medium text-right">Enrolled</th>
                  <th className="p-4 font-medium w-40">Completion</th>
                  <th className="p-4 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {MOCK_COURSES.map((course) => {
                  let progressColor = "bg-red-500";
                  if (course.completionRate >= 70) progressColor = "bg-green-500";
                  else if (course.completionRate >= 40) progressColor = "bg-amber-500";

                  return (
                    <tr key={course.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm font-semibold text-white">{course.name}</td>
                      <td className="p-4 text-xs text-gray-400">{course.instructor}</td>
                      <td className="p-4 text-sm text-gray-300 text-right">{course.enrolled.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-300 font-semibold">{course.completionRate}%</span>
                          <div className="h-1.5 w-full bg-dark-bg rounded-full overflow-hidden">
                            <div className={`h-full ${progressColor} rounded-full`} style={{ width: `${course.completionRate}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-green-400 text-right">{course.revenue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS & TOASTS */}
      <AnimatePresence>
        {showAddUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Add New User</h3>
                <button onClick={() => setShowAddUser(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <Input label="Full Name" placeholder="e.g. Jane Doe" />
                <Input label="Email Address" type="email" placeholder="jane@example.com" />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                  <select className="w-full bg-dark-bg border border-dark-border rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary-500">
                    <option value="LEARNER">Learner</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <Button className="w-full mt-4" onClick={() => setShowAddUser(false)}>Save User</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Send Announcement</h3>
                <button onClick={() => setShowAnnouncement(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Announcement Message</label>
                  <textarea 
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500 h-32 resize-none"
                    placeholder="Write your announcement here. It will be sent to all users..."
                  />
                </div>
                <Button 
                  className="w-full mt-2" 
                  onClick={() => {
                    setShowAnnouncement(false);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                >
                  Send to All Users
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 bg-green-500/90 text-white px-4 py-3 rounded-lg shadow-xl backdrop-blur-md"
          >
            <CheckCircle size={18} />
            <span className="font-medium text-sm">Announcement sent successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
