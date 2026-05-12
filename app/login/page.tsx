'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Lock, ArrowRight, ArrowLeft, ChevronDown, X } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

export default function LoginPage() {
  const { loginWithPassword, isAuthenticated } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithPassword(identifier.trim(), password);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit overflow-hidden">
      <main className="flex-grow flex flex-col lg:flex-row relative min-h-screen">
        {/* Left Side: Login Form */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full lg:w-[45%] xl:w-[40%] p-8 sm:p-12 lg:p-16 xl:p-24 flex flex-col justify-center relative bg-white z-20"
        >
          {/* Close button (Cross) to return home */}
          <Link 
            href="/"
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-30 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </Link>
          
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
              Welcome to,<br />
              <span className="text-[#D97706]">Unifoods B2B</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-sm">
              Sign in to your account and unlock exclusive wholesale deals for your business.
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-5 max-w-md relative"
          >
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username or Email"
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-900 text-base focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] font-medium transition-all hover:bg-white hover:border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-900 text-base focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] font-medium transition-all hover:bg-white hover:border-gray-300 shadow-sm"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <Lock size={20} className="text-[#D97706]" /> : <Lock size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 border-2 border-gray-300 rounded-lg text-[#D97706] focus:ring-[#D97706] cursor-pointer" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-gray-500 hover:text-[#D97706] transition-colors">
                Forgot password?
              </Link>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}

            {message && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-green-500 text-sm font-medium"
              >
                {message}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !identifier || !password}
              className="group w-full py-4 bg-[#D97706] hover:bg-[#C26A05] text-white text-lg font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-500 font-medium">
                New to Unifoods?{" "}
                <Link href="/register" className="text-[#D97706] font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </motion.form>
        </motion.div>

        {/* Right Side: Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="hidden lg:block lg:flex-1 relative bg-[#FDFAF7]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/10 to-transparent z-10 pointer-events-none" />
          <Image 
            src="/images/login-illustration.png" 
            alt="Unifoods Wholesale Journey" 
            fill 
            className="object-cover object-center relative z-0"
            priority 
          />
        </motion.div>
      </main>
    </div>
  );
}
