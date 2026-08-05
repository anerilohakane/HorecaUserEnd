"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, CheckCircle, AlertCircle, Loader, Eye, EyeOff, ShieldCheck } from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_HORECA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://horeca-backend-six.vercel.app"
).replace(/\/$/, "");

function ChangePasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password change token. Please check your link.");
    }
  }, [token]);

  useEffect(() => {
    if (success) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 2.5)); // 40 steps * 100ms = 4s
      }, 100);
      return () => clearInterval(interval);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing change password token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/customer-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 4000);
    } catch (err: any) {
      console.error("Change password error:", err);
      setError(err.message || "Failed to change password. The token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600 mb-2">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Change Account Password</h2>
          <p className="text-sm text-slate-500">Set a new secure password for your B2B account</p>
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
            <h3 className="font-bold text-lg">Password Changed Successfully!</h3>
            <p className="text-sm text-emerald-700">
              Your password has been updated. Redirecting you to the Login page in a few seconds...
            </p>
            <div className="w-full bg-emerald-200/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-600 h-full transition-all duration-100 ease-linear" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* New Password input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-slate-900"
                  required
                  disabled={loading || !token}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-slate-900"
                  required
                  disabled={loading || !token}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token || !password || !confirmPassword}
              className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <a href="/login" className="text-sm font-semibold text-slate-500 hover:text-amber-600 transition-colors">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <Loader className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    }>
      <ChangePasswordContent />
    </Suspense>
  );
}
