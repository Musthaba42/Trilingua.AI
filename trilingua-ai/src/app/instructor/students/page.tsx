"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Mail, MoreVertical, ShieldCheck, Clock, CheckCircle2, TrendingUp, Users, Activity, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Inline mock data
const STATS = [
  { label: "Total Students", value: "1,245", trend: "+12% this month", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Active Learners", value: "892", trend: "+5% this week", icon: Activity, color: "text-green-400", bg: "bg-green-400/10" },
  { label: "Completion Rate", value: "68%", trend: "+2% this month", icon: CheckCircle2, color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Avg Progress", value: "45%", trend: "+8% this week", icon: TrendingUp, color: "text-primary-400", bg: "bg-primary-400/10" },
];

const MOCK_STUDENTS = [
  {
    id: "s1",
    name: "Rahul Sharma",
    email: "rahul.s@example.com",
    avatar: "https://i.pravatar.cc/150?u=rahul",
    course: "Claude Cowork Masterclass (தமிழ்)",
    progress: 85,
    lastActive: "2 hours ago",
    status: "Active"
  },
  {
    id: "s2",
    name: "Priya Patel",
    email: "priya.p@example.com",
    avatar: "https://i.pravatar.cc/150?u=priya",
    course: "Deep Learning in Tamil (தமிழ்)",
    progress: 100,
    lastActive: "1 day ago",
    status: "Completed"
  },
  {
    id: "s3",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    avatar: "https://i.pravatar.cc/150?u=vikram",
    course: "CyberSecurity & Ethical Hacking (தமிழ்)",
    progress: 30,
    lastActive: "1 week ago",
    status: "Inactive"
  },
  {
    id: "s4",
    name: "Anita Desai",
    email: "anita.d@example.com",
    avatar: "https://i.pravatar.cc/150?u=anita",
    course: "Python for Beginners (Hindi)",
    progress: 60,
    lastActive: "5 hours ago",
    status: "Active"
  },
  {
    id: "s5",
    name: "Karthik Raj",
    email: "karthik.r@example.com",
    avatar: "https://i.pravatar.cc/150?u=karthik",
    course: "Claude Cowork Masterclass (தமிழ்)",
    progress: 10,
    lastActive: "Just now",
    status: "Active"
  },
  {
    id: "s6",
    name: "Sneha Reddy",
    email: "sneha.r@example.com",
    avatar: "https://i.pravatar.cc/150?u=sneha",
    course: "Data Science Masterclass",
    progress: 95,
    lastActive: "3 days ago",
    status: "Active"
  },
  {
    id: "s7",
    name: "Manoj Kumar",
    email: "manoj.k@example.com",
    avatar: "https://i.pravatar.cc/150?u=manoj",
    course: "Deep Learning in Tamil (தமிழ்)",
    progress: 0,
    lastActive: "2 weeks ago",
    status: "Inactive"
  }
];

const COURSES = Array.from(new Set(MOCK_STUDENTS.map(s => s.course)));

export default function InstructorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Management</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor progress and engagement of your enrolled students.</p>
        </div>
        <Button variant="secondary" icon={<Mail size={16} />}>
          Message All
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
              <p className="text-xs text-green-400 mt-1">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Table Card */}
      <Card className="flex flex-col p-0 overflow-hidden" padding="none">
        <div className="p-5 border-b border-dark-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-dark-surface/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-md py-2.5 pl-10 pr-4 text-sm text-white appearance-none focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                <option value="All Courses">All Courses</option>
                {COURSES.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-dark-surface/50 border-b border-dark-border text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, i) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-dark-surface/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-white">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-gray-400" />
                        <span className="text-gray-300 max-w-[200px] truncate" title={student.course}>{student.course}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-dark-bg rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              student.progress === 100 ? 'bg-green-500' : 
                              student.progress > 50 ? 'bg-amber-500' : 
                              'bg-blue-500'
                            }`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock size={14} />
                        <span>{student.lastActive}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        student.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        student.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {student.status === 'Active' ? <Activity size={10} /> : 
                         student.status === 'Completed' ? <ShieldCheck size={10} /> : 
                         <span className="w-2 h-2 rounded-full bg-red-400" />}
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500">No students found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
