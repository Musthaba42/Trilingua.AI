"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Crown, X, CreditCard, Smartphone, Shield,
  Sparkles, ArrowRight, CheckCircle, Lock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/lib/utils/constants";
import { useSession } from "next-auth/react";

// ─── Razorpay global type ────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

// ─── Toast helper (inline, no extra deps) ────────────────────────────────────
function showToast(message: string, type: "success" | "error") {
  const el = document.createElement("div");
  el.textContent = message;
  el.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:99999;
    padding:14px 20px; border-radius:12px; font-size:14px; font-weight:600;
    color:#fff; pointer-events:none;
    background:${type === "success" ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#dc2626,#ef4444)"};
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation:slideUp .3s ease;
  `;
  const style = document.createElement("style");
  style.textContent = `@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`;
  document.head.appendChild(style);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

export default function SubscriptionPage() {
  const { data: session } = useSession();

  const [showModal, setShowModal]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number] | null>(null);
  const [processing, setProcessing]   = useState(false);
  const [activePlan, setActivePlan]   = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  // ── Load Razorpay SDK once ─────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("razorpay-sdk")) {
      setRazorpayReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  // ── Open confirmation modal ────────────────────────────────────────────────
  const handleSubscribe = (plan: (typeof PLANS)[number]) => {
    if (plan.price === 0) return;
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // ── Create Razorpay order → open checkout popup ────────────────────────────
  const handleRazorpayCheckout = async () => {
    if (!selectedPlan || !razorpayReady) return;
    setProcessing(true);

    try {
      // 1. Create order on our backend
      const res = await fetch("/api/payment/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPlan.price,       // amount in INR (route converts to paise)
          planId: selectedPlan.id,
          planName: selectedPlan.name,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details?.error?.description || data.error || "Order creation failed");
      }

      if (data.isMock) {
        showToast("Processing payment in Demo Mode...", "success");
        setTimeout(() => {
          setActivePlan(selectedPlan.id);
          setShowModal(false);
          setProcessing(false);
          showToast(`Subscription activated! (${selectedPlan.name} Plan - Demo Mode)`, "success");
        }, 1500);
        return;
      }

      const { orderId, amount, currency, keyId } = data;

      if (!orderId) throw new Error("Order creation failed - No order ID returned");

      // 2. Open Razorpay native checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
        amount,
        currency,
        name: "Trilingua AI",
        description: `${selectedPlan.name} Plan – ${selectedPlan.period}`,
        order_id: orderId,
        prefill: {
          name: session?.user?.name  || "",
          email: session?.user?.email || "",
        },
        theme: { color: "#7C3AED" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
        handler: async (response: unknown) => {
          try {
            const r = response as {
              razorpay_payment_id: string;
              razorpay_order_id: string;
              razorpay_signature: string;
            };
            
            // Verify payment signature
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: r.razorpay_order_id,
                razorpay_payment_id: r.razorpay_payment_id,
                razorpay_signature: r.razorpay_signature,
              }),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setActivePlan(selectedPlan.id);
              setShowModal(false);
              setProcessing(false);
              showToast("Subscription activated!", "success");
            } else {
              setProcessing(false);
              showToast("Payment verification failed", "error");
            }
          } catch (error) {
            console.error("Verification error:", error);
            setProcessing(false);
            showToast("Payment verification error", "error");
          }
        },
      });

      rzp.on("payment.failed", (response: unknown) => {
        const r = response as { error: { description: string } };
        setProcessing(false);
        showToast(`Payment failed: ${r.error?.description || "Unknown error"}`, "error");
      });

      rzp.open();
    } catch (err: any) {
      setProcessing(false);
      showToast(err.message || "Could not initiate payment. Please try again.", "error");
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
            <Sparkles size={14} className="text-primary-400" />
            <span className="text-sm text-primary-300">Unlock Your Full Potential</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Choose Your <span className="gradient-text">Learning Plan</span>
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Invest in your future. Get unlimited access to AI tutoring, live coding,
            and courses in 3 languages.
          </p>
        </motion.div>
      </div>

      {/* ── Plans Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan, i) => {
          const isActive = activePlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-6 relative flex flex-col ${
                plan.popular
                  ? "border-primary-500/50 shadow-glow ring-1 ring-primary-500/20"
                  : ""
              } ${isActive ? "ring-2 ring-green-500/50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-primary flex items-center gap-1 px-3 py-1">
                    <Crown size={12} /> Most Popular
                  </span>
                </div>
              )}
              {isActive && (
                <div className="absolute -top-3 right-4">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold">
                    <CheckCircle size={11} /> Active
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold gradient-text">{plan.priceLabel}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
                {plan.limitations?.map((l) => (
                  <div key={l} className="flex items-start gap-2 text-sm">
                    <X size={16} className="text-gray-600 shrink-0 mt-0.5" />
                    <span className="text-gray-500">{l}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full justify-center"
                onClick={() => handleSubscribe(plan)}
                disabled={plan.price === 0 || isActive}
                icon={
                  isActive
                    ? <CheckCircle size={16} />
                    : plan.price === 0
                    ? <CheckCircle size={16} />
                    : <ArrowRight size={16} />
                }
              >
                {isActive ? "Subscribed" : plan.price === 0 ? "Current Plan" : "Subscribe Now"}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Trust badges ── */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-green-400" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-primary-400" />
          <span>Cards / UPI / NetBanking</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-accent-400" />
          <span>Powered by Razorpay</span>
        </div>
      </div>

      {/* ── Razorpay Confirmation Modal ── */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => { if (!processing) setShowModal(false); }}
            />

            {/* Modal card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-md rounded-2xl border border-dark-border shadow-2xl"
                style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)" }}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-0">
                  <h2 className="text-lg font-bold text-white">Confirm Subscription</h2>
                  {!processing && (
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  {/* Plan summary */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plan</p>
                        <p className="text-lg font-bold text-white">{selectedPlan.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">{selectedPlan.period} billing</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold gradient-text">{selectedPlan.priceLabel}</p>
                        <p className="text-xs text-gray-500 mt-0.5">incl. GST</p>
                      </div>
                    </div>
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={handleRazorpayCheckout}
                    disabled={processing || !razorpayReady}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)" }}
                  >
                    {processing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Opening Razorpay…
                      </>
                    ) : (
                      <>
                        {/* Official Razorpay logo SVG inline */}
                        <svg width="20" height="20" viewBox="0 0 245 245" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M130.5 0L92 164.5L152 114L130.5 0Z" fill="white"/>
                          <path d="M92 164.5L60 245H120.5L152 114L92 164.5Z" fill="white" fillOpacity="0.7"/>
                        </svg>
                        Pay with Razorpay
                      </>
                    )}
                  </button>

                  {/* Security note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock size={12} className="text-green-400" />
                    <span>Secured by</span>
                    <span className="font-semibold text-gray-400">Razorpay</span>
                    <span>· 256-bit SSL encrypted</span>
                  </div>

                  {/* Accepted methods hint */}
                  <div className="flex items-center justify-center gap-3 pt-1 border-t border-white/5">
                    <span className="text-[10px] text-gray-600">Accepts:</span>
                    {["UPI", "Cards", "NetBanking", "Wallets"].map((m) => (
                      <span
                        key={m}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-gray-400"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
