"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, IndianRupee, CheckCircle2, Download, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

// Inline mock data
const STATS = [
  { label: "Total Students", value: "1,245", trend: "+12% this month", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Total Revenue", value: "₹45,200", trend: "+24% this month", icon: IndianRupee, color: "text-green-400", bg: "bg-green-400/10" },
  { label: "Completion Rate", value: "68%", trend: "+2% this month", icon: CheckCircle2, color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Avg Progress", value: "45%", trend: "+8% this week", icon: TrendingUp, color: "text-primary-400", bg: "bg-primary-400/10" },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15500 },
  { month: "Apr", revenue: 25000 },
  { month: "May", revenue: 32000 },
  { month: "Jun", revenue: 45200 },
];
const MAX_REVENUE = Math.max(...REVENUE_DATA.map(d => d.revenue));

const COURSE_BREAKDOWN = [
  { id: 1, title: "Claude Cowork Masterclass (தமிழ்)", enrollments: 450, revenue: "₹0", completion: "75%", rating: 4.8 },
  { id: 2, title: "Deep Learning in Tamil (தமிழ்)", enrollments: 320, revenue: "₹18,500", completion: "62%", rating: 4.5 },
  { id: 3, title: "CyberSecurity & Ethical Hacking (தமிழ்)", enrollments: 280, revenue: "₹21,000", completion: "54%", rating: 4.9 },
  { id: 4, title: "Python for Beginners (Hindi)", enrollments: 145, revenue: "₹5,700", completion: "80%", rating: 4.6 },
  { id: 5, title: "Data Science Masterclass", enrollments: 50, revenue: "₹0", completion: "20%", rating: 0 },
];

export default function InstructorAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Track your course performance, revenue, and student engagement.</p>
        </div>
        <Button variant="secondary" icon={<Download size={16} />}>
          Export Report
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="text-amber-400" size={20} />
              <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 mt-4">
              {REVENUE_DATA.map((data, i) => {
                const heightPercent = (data.revenue / MAX_REVENUE) * 100;
                return (
                  <div key={data.month} className="flex flex-col items-center gap-2 flex-1 group">
                    {/* Tooltip-like label */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-dark-surface px-2 py-1 rounded text-white mb-1">
                      ₹{(data.revenue / 1000).toFixed(1)}k
                    </div>
                    {/* Bar */}
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, type: "spring" }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-amber-600/50 to-amber-400 rounded-t-md relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    {/* Label */}
                    <span className="text-xs text-gray-400 font-medium">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Top Performing Course</span>
                <span className="text-white font-medium">Deep Learning</span>
              </div>
              <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Highest Completion</span>
                <span className="text-white font-medium">Python for Beginners</span>
              </div>
              <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-4/5 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Most Drop-offs</span>
                <span className="text-white font-medium">Data Science Masterclass</span>
              </div>
              <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-1/5 rounded-full" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-dark-border">
              <p className="text-sm text-gray-400 italic">&quot;Students who complete the first 2 lessons are 75% more likely to finish the course.&quot;</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Breakdown Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-5 border-b border-dark-border">
          <CardTitle>Course Breakdown</CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-dark-surface/50 border-b border-dark-border text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Course Name</th>
                <th className="px-6 py-4 font-medium text-right">Enrollments</th>
                <th className="px-6 py-4 font-medium text-right">Revenue</th>
                <th className="px-6 py-4 font-medium text-right">Completion</th>
                <th className="px-6 py-4 font-medium text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {COURSE_BREAKDOWN.map((course, i) => (
                <motion.tr 
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + (i * 0.05) }}
                  className="hover:bg-dark-surface/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{course.title}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-300">{course.enrollments}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={course.revenue === "₹0" ? "text-gray-500" : "text-green-400 font-medium"}>
                      {course.revenue}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-300">{course.completion}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-amber-400">
                      {course.rating > 0 ? `⭐ ${course.rating}` : "N/A"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
