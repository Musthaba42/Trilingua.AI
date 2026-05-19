"use client";

import { motion } from "framer-motion";
import { 
  CreditCard, Search, Filter, CheckCircle, 
  XCircle, Clock, Smartphone, MoreVertical, ExternalLink 
} from "lucide-react";

const MOCK_PAYMENTS = [
  { id: "PAY-101", user: "Priya Sharma", plan: "Basic", amount: "₹199", method: "Paytm", status: "Pending", proof: "View Proof", date: "Today, 10:45 AM" },
  { id: "PAY-102", user: "Mike Ross", plan: "Pro", amount: "₹299", method: "GPay", status: "Pending", proof: "View Proof", date: "Today, 09:30 AM" },
  { id: "PAY-099", user: "John Doe", plan: "Pro", amount: "₹299", method: "GPay", status: "Approved", proof: "View Proof", date: "Yesterday, 04:15 PM" },
  { id: "PAY-098", user: "Jane Smith", plan: "Premium", amount: "₹399", method: "PayPal", status: "Approved", proof: "View Proof", date: "2 days ago" },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Requests</h1>
          <p className="text-gray-400 text-sm mt-1">Verify and approve manual GPay/Paytm/PayPal payments.</p>
        </div>
        <div className="flex gap-2 text-xs font-semibold px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <span className="text-primary-300">Pending total:</span>
          <span className="text-white">₹498</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Approved Today", value: "8", color: "text-green-400" },
          { label: "Pending Verification", value: "2", color: "text-amber-400" },
          { label: "Failed/Rejected", value: "1", color: "text-rose-400" },
        ].map(s => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-dark-bg/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Learner Info</th>
                <th className="px-6 py-4 font-medium">Plan & Amount</th>
                <th className="px-6 py-4 font-medium text-center">Proof</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {MOCK_PAYMENTS.map((p) => (
                <tr key={p.id} className="text-sm hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-primary-400">{p.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{p.user}</div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {p.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-white">{p.amount}</span>
                       <span className="text-[10px] px-1.5 py-0.5 bg-primary-500/10 text-primary-300 border border-primary-500/20 rounded uppercase font-semibold">{p.plan}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                      <Smartphone size={10} /> {p.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[10px] font-semibold text-primary-400 hover:text-white flex items-center gap-1 mx-auto group underline-offset-4 hover:underline">
                      {p.proof} <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === "Approved" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-md transition-colors" title="Reject">
                           <XCircle size={14} />
                         </button>
                         <button className="p-1.5 text-green-400 hover:text-green-300 bg-green-500/10 border border-green-500/20 rounded-md transition-colors" title="Approve">
                           <CheckCircle size={14} />
                         </button>
                      </div>
                    ) : (
                      <button className="p-2 text-gray-500 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    )}
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
