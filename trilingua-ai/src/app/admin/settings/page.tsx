"use client";

import { useState } from "react";
import { Save, Globe, CreditCard, Shield, Mail, Database, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Tab = "general" | "payments" | "email" | "security" | "backups";

const TABS: { id: Tab; label: string; icon: typeof Globe }[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "email", label: "Email SMTP", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
  { id: "backups", label: "Backups", icon: Database },
];

function showToast(msg: string) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:99999;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg,#059669,#10b981);box-shadow:0 8px 32px rgba(0,0,0,.4);animation:toastIn .3s ease`;
  const s = document.createElement("style");
  s.textContent = `@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(s);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);

  // General
  const [platformName, setPlatformName] = useState("Trilingua AI");
  const [supportEmail, setSupportEmail] = useState("support@trilingua.ai");
  const [siteDesc, setSiteDesc] = useState("Learn anything in 3 languages with AI-powered tutoring and interactive coding environments.");
  const [toggles, setToggles] = useState({ registration: true, maintenance: false, publicCatalog: true });

  // Payments
  const [razorpayKey, setRazorpayKey] = useState("rzp_test_Squk****b2Ovx");
  const [razorpaySecret, setRazorpaySecret] = useState("6JO3****VMXE");
  const [paymentToggles, setPaymentToggles] = useState({ upi: true, cards: true, netbanking: true, wallets: false });

  // Email
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@trilingua.ai");
  const [smtpPass, setSmtpPass] = useState("••••••••••••");

  // Security
  const [secToggles, setSecToggles] = useState({ twoFa: false, rateLimit: true, ipBlock: false, auditLog: true });

  // Backups
  const [backupToggles, setBackupToggles] = useState({ autoBackup: true, includeMedia: false });
  const [backupFreq, setBackupFreq] = useState("daily");

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    showToast("✓ Settings saved successfully!");
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${enabled ? "bg-primary-500" : "bg-gray-600"}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"}`} />
    </button>
  );

  const ToggleRow = ({ label, desc, enabled, onToggle }: { label: string; desc: string; enabled: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure global platform settings, integrations, and branding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                  : "text-gray-400 hover:bg-dark-hover hover:text-white border border-transparent"
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">

          {/* ─── General ─── */}
          {activeTab === "general" && (
            <>
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-5">
                <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">General Information</h2>
                <div className="space-y-4">
                  <Input label="Platform Name" value={platformName} onChange={e => setPlatformName(e.target.value)} />
                  <Input label="Support Email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} type="email" />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Site Description</label>
                    <textarea
                      className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500 h-24 resize-none"
                      value={siteDesc}
                      onChange={e => setSiteDesc(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">Feature Toggles</h2>
                <ToggleRow label="Enable User Registration" desc="Allow new users to sign up for accounts." enabled={toggles.registration} onToggle={() => setToggles(p => ({ ...p, registration: !p.registration }))} />
                <ToggleRow label="Maintenance Mode" desc="Show maintenance page to all non-admin users." enabled={toggles.maintenance} onToggle={() => setToggles(p => ({ ...p, maintenance: !p.maintenance }))} />
                <ToggleRow label="Public Course Catalog" desc="Allow unregistered users to browse courses." enabled={toggles.publicCatalog} onToggle={() => setToggles(p => ({ ...p, publicCatalog: !p.publicCatalog }))} />
              </div>
            </>
          )}

          {/* ─── Payments ─── */}
          {activeTab === "payments" && (
            <>
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-5">
                <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">Razorpay Configuration</h2>
                <div className="space-y-4">
                  <Input label="Razorpay Key ID" value={razorpayKey} onChange={e => setRazorpayKey(e.target.value)} />
                  <Input label="Razorpay Key Secret" value={razorpaySecret} onChange={e => setRazorpaySecret(e.target.value)} type="password" />
                  <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                    <CheckCircle size={14} /> Connected — Test Mode Active
                  </div>
                </div>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">Payment Methods</h2>
                <ToggleRow label="UPI Payments" desc="Accept Google Pay, PhonePe, Paytm UPI." enabled={paymentToggles.upi} onToggle={() => setPaymentToggles(p => ({ ...p, upi: !p.upi }))} />
                <ToggleRow label="Credit / Debit Cards" desc="Visa, Mastercard, RuPay." enabled={paymentToggles.cards} onToggle={() => setPaymentToggles(p => ({ ...p, cards: !p.cards }))} />
                <ToggleRow label="Net Banking" desc="All major Indian banks." enabled={paymentToggles.netbanking} onToggle={() => setPaymentToggles(p => ({ ...p, netbanking: !p.netbanking }))} />
                <ToggleRow label="Wallets" desc="Paytm, Amazon Pay, Mobikwik." enabled={paymentToggles.wallets} onToggle={() => setPaymentToggles(p => ({ ...p, wallets: !p.wallets }))} />
              </div>
            </>
          )}

          {/* ─── Email SMTP ─── */}
          {activeTab === "email" && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-5">
              <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">SMTP Configuration</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="SMTP Host" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} />
                  <Input label="SMTP Port" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} />
                </div>
                <Input label="SMTP Username" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
                <Input label="SMTP Password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} type="password" />
                <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  Send Test Email →
                </button>
              </div>
            </div>
          )}

          {/* ─── Security ─── */}
          {activeTab === "security" && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
              <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">Security Settings</h2>
              <ToggleRow label="Two-Factor Authentication" desc="Require 2FA for admin accounts." enabled={secToggles.twoFa} onToggle={() => setSecToggles(p => ({ ...p, twoFa: !p.twoFa }))} />
              <ToggleRow label="API Rate Limiting" desc="Limit API requests to 100/min per user." enabled={secToggles.rateLimit} onToggle={() => setSecToggles(p => ({ ...p, rateLimit: !p.rateLimit }))} />
              <ToggleRow label="IP Blocklist" desc="Block suspicious IPs automatically." enabled={secToggles.ipBlock} onToggle={() => setSecToggles(p => ({ ...p, ipBlock: !p.ipBlock }))} />
              <ToggleRow label="Audit Logging" desc="Log all admin actions for review." enabled={secToggles.auditLog} onToggle={() => setSecToggles(p => ({ ...p, auditLog: !p.auditLog }))} />
            </div>
          )}

          {/* ─── Backups ─── */}
          {activeTab === "backups" && (
            <>
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">Backup Configuration</h2>
                <ToggleRow label="Automatic Backups" desc="Automatically backup database on schedule." enabled={backupToggles.autoBackup} onToggle={() => setBackupToggles(p => ({ ...p, autoBackup: !p.autoBackup }))} />
                <ToggleRow label="Include Media Files" desc="Include uploaded images and videos in backups." enabled={backupToggles.includeMedia} onToggle={() => setBackupToggles(p => ({ ...p, includeMedia: !p.includeMedia }))} />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Backup Frequency</label>
                  <select
                    value={backupFreq}
                    onChange={e => setBackupFreq(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
                <h2 className="text-lg font-semibold text-white border-b border-dark-border pb-3">Recent Backups</h2>
                {[
                  { date: "May 19, 2026 – 10:00 AM", size: "24.3 MB", status: "Success" },
                  { date: "May 18, 2026 – 10:00 AM", size: "23.8 MB", status: "Success" },
                  { date: "May 17, 2026 – 10:00 AM", size: "23.1 MB", status: "Success" },
                ].map(b => (
                  <div key={b.date} className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50 border border-dark-border">
                    <div>
                      <p className="text-sm text-white">{b.date}</p>
                      <p className="text-xs text-gray-500">{b.size}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{b.status}</span>
                      <button className="text-xs text-primary-400 hover:text-primary-300">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} loading={saving} icon={<Save size={16} />}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
