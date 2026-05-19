"use client";

import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, Mail, Eye, Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";

const MOCK_USERS = [
  { id: "1", name: "Alex Student", email: "student@test.com", role: "LEARNER", plan: "PRO", joined: "Oct 12, 2025", lastActive: "2 hrs ago", status: "Active", avatar: "https://ui-avatars.com/api/?name=Alex+Student&background=6D28D9&color=fff" },
  { id: "2", name: "Admin User", email: "admin@test.com", role: "ADMIN", plan: "FREE", joined: "Jan 1, 2024", lastActive: "Just now", status: "Active", avatar: "https://ui-avatars.com/api/?name=Admin+User&background=14B8A6&color=fff" },
  { id: "3", name: "Prof. Instructor", email: "instructor@test.com", role: "INSTRUCTOR", plan: "PRO", joined: "Mar 15, 2024", lastActive: "1 day ago", status: "Active", avatar: "https://ui-avatars.com/api/?name=Prof+Instructor&background=F59E0B&color=fff" },
  { id: "4", name: "Sarah Connor", email: "sarah.c@gmail.com", role: "LEARNER", plan: "FREE", joined: "Nov 5, 2025", lastActive: "3 days ago", status: "Inactive", avatar: "https://ui-avatars.com/api/?name=Sarah+Connor&background=EC4899&color=fff" },
  { id: "5", name: "David Chen", email: "dchen@code.org", role: "INSTRUCTOR", plan: "PRO", joined: "Aug 22, 2024", lastActive: "5 mins ago", status: "Active", avatar: "https://ui-avatars.com/api/?name=David+Chen&background=3B82F6&color=fff" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = MOCK_USERS.filter(u => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
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
      ? <span className="px-2 py-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-semibold">Pro</span>
      : <span className="px-2 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-semibold">Free</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage learners, instructors, and admin accounts.</p>
        </div>
        <Button icon={<Plus size={16} />}>Add New User</Button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 bg-dark-bg p-1 rounded-lg border border-dark-border">
            {(["ALL", "LEARNER", "INSTRUCTOR", "ADMIN"] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${roleFilter === role ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                {role === "ALL" ? "All" : role.charAt(0) + role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
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
                      <button className="p-1.5 text-gray-400 hover:text-white bg-dark-bg rounded border border-dark-border"><Eye size={14} /></button>
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded border border-blue-500/20"><Edit size={14} /></button>
                      <button className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded border border-red-500/20"><Ban size={14} /></button>
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
