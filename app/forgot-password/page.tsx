"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const API_BASE = (
  process.env.NEXT_PUBLIC_HORECA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://horeca-backend-six.vercel.app"
).replace(/\/$/, "");

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/customer-forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to request password reset");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Forgot password request error:", err);
      setError(err.message || "Failed to request password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 font-outfit">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600 mb-2">
            <KeyRound size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
          <p className="text-sm text-slate-500">Enter your email to receive a password reset link</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900 text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Error:</span> {error}
            </div>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center text-center gap-3 text-emerald-900 animate-in fade-in duration-200">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
            <h3 className="font-bold text-lg">Reset Link Sent!</h3>
            <p className="text-sm text-emerald-700">
              If an account is associated with this email address, a password reset link has been dispatched. Please check your inbox and spam folders.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-5 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-slate-900"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-amber-600 transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
