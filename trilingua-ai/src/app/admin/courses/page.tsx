"use client";

import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

const MOCK_COURSES = [
  { id: "C1", name: "Claude Cowork Masterclass", instructor: "Prof. Instructor", category: "AI & Automation", students: 12450, status: "Published", price: "Free" },
  { id: "C2", name: "Generative AI Full Course", instructor: "David Chen", category: "AI & Automation", students: 8320, status: "Published", price: "Free" },
  { id: "C3", name: "Harvard CS50 Cybersecurity", instructor: "Harvard Univ", category: "Cybersecurity", students: 25100, status: "Published", price: "Free" },
  { id: "C4", name: "Deep Learning Crash Course", instructor: "David Chen", category: "Deep Learning", students: 5400, status: "Draft", price: "₹499" },
  { id: "C5", name: "Advanced Python Pro", instructor: "Prof. Instructor", category: "Programming", students: 1200, status: "Published", price: "₹1,999" },
];

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");

  const filteredCourses = MOCK_COURSES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Course Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage platform courses, categories, and approvals.</p>
        </div>
        <Button icon={<Plus size={16} />}>Create Course</Button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <Button variant="secondary" icon={<Filter size={16} />}>Filter</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-bg/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Course Name</th>
                <th className="p-4 font-medium">Instructor</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Students</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredCourses.map(c => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm font-semibold text-white">{c.name}</td>
                  <td className="p-4 text-sm text-gray-400">{c.instructor}</td>
                  <td className="p-4 text-sm text-gray-400">{c.category}</td>
                  <td className="p-4 text-sm text-gray-300 text-right">{c.students.toLocaleString()}</td>
                  <td className="p-4 text-sm text-white">{c.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${c.status === 'Published' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-white bg-dark-bg rounded border border-dark-border"><Eye size={14} /></button>
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded border border-blue-500/20"><Edit size={14} /></button>
                      <button className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded border border-red-500/20"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
