"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Lock, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function InstructorSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Instructor User",
    bio: "Passionate educator focusing on AI, programming, and languages.",
    language: "en"
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newEnrollments: true,
    studentMessages: false,
    courseReviews: true
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-md shadow-lg backdrop-blur-md"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Instructor Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your profile, preferences, and security.</p>
        </div>
        <Button 
          icon={<Save size={16} />} 
          onClick={handleSave} 
          loading={isSaving}
          disabled={isSaving}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Forms) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="text-amber-400" size={20} />
                <CardTitle>Profile Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Display Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Bio</label>
                <textarea 
                  rows={4}
                  value={profile.bio}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none" 
                />
                <p className="text-xs text-gray-500">Brief description for your public profile.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Primary Teaching Language</label>
                <select 
                  value={profile.language}
                  onChange={e => setProfile({...profile, language: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="text-amber-400" size={20} />
                <CardTitle>Change Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password"
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password"
                    className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button variant="secondary" size="sm">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Toggles & Info) */}
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="text-amber-400" size={20} />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ToggleItem 
                label="Email Alerts" 
                description="Receive weekly summaries of your stats."
                checked={notifications.emailAlerts}
                onChange={() => setNotifications({...notifications, emailAlerts: !notifications.emailAlerts})}
              />
              <ToggleItem 
                label="New Enrollments" 
                description="Get notified when a student enrolls."
                checked={notifications.newEnrollments}
                onChange={() => setNotifications({...notifications, newEnrollments: !notifications.newEnrollments})}
              />
              <ToggleItem 
                label="Student Messages" 
                description="Alerts for direct messages from students."
                checked={notifications.studentMessages}
                onChange={() => setNotifications({...notifications, studentMessages: !notifications.studentMessages})}
              />
              <ToggleItem 
                label="Course Reviews" 
                description="Alerts when a student leaves a review."
                checked={notifications.courseReviews}
                onChange={() => setNotifications({...notifications, courseReviews: !notifications.courseReviews})}
              />
            </CardContent>
          </Card>

          <Card variant="outline" className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="flex items-start gap-3 p-5">
              <AlertCircle className="text-amber-400 shrink-0" size={18} />
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Need Help?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  If you need assistance setting up your instructor account or have questions about payments, please contact our support team at <a href="#" className="text-amber-400 hover:underline transition-colors">support@trilingua.ai</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}

function ToggleItem({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button 
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-amber-500' : 'bg-gray-700'}`}
      >
        <span 
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}
