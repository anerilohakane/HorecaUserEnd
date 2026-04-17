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
  const { login, verifyOtp, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // ⬅️ SEND OTP
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(countryCode + phone.trim());
      setStep("otp");
      setMessage("OTP sent successfully! Enter 123456 to continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ⬅️ VERIFY OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOtp(otp.trim());
      setMessage("Login successful!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
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
            title="Close and return home"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </Link>
          {/* Decorative background grid pattern */}
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

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePhoneSubmit} 
                className="space-y-6 max-w-md relative"
              >
                <div className="space-y-4">
                  <motion.div variants={itemVariants} className="flex gap-3">
                    {/* Country Code Selection */}
                    <div className="relative w-[120px]">
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value);
                          setPhone('');
                        }}
                        className="w-full appearance-none pl-4 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 text-base focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] cursor-pointer font-medium transition-all hover:bg-white hover:border-gray-300"
                      >
                        <option value="+91">IN (+91)</option>
                        <option value="+1">US (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+61">AU (+61)</option>
                        <option value="+971">AE (+971)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <ChevronDown size={18} />
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setPhone(countryCode === "+91" ? val.slice(0, 10) : val.slice(0, 15));
                        }}
                        placeholder={countryCode === "+91" ? "10-digit number" : "Phone number"}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-900 text-base focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] font-medium placeholder:font-normal transition-all hover:bg-white hover:border-gray-300"
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-lg checked:bg-[#D97706] checked:border-[#D97706] transition-colors cursor-pointer" />
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="text-sm font-semibold text-gray-500 hover:text-[#D97706] transition-colors">
                    Need help?
                  </button>
                </motion.div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-500 text-sm font-medium"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading || phone.length < 7 || (countryCode === "+91" && phone.length !== 10)}
                  className="group w-full py-4.5 bg-[#D97706] hover:bg-[#C26A05] text-white text-lg font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden relative"
                >
                  <span className="relative z-10">{loading ? "Sending OTP..." : "Continue to Sign In"}</span>
                  {!loading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleOtpSubmit} 
                className="space-y-6 max-w-md relative"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Verify OTP</h3>
                  <p className="text-gray-600 font-medium text-base">
                    Sent securely to <span className="text-gray-900 font-bold">{countryCode} {phone}</span>
                  </p>
                </div>

                {message && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-50 text-amber-800 p-4 rounded-2xl border border-amber-100 text-sm font-medium flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    {message}
                  </motion.div>
                )}

                <div className="relative">
                  <Lock className="absolute left-5 top-5 text-gray-400 group-focus-within:text-[#D97706] transition-colors" size={22} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    autoFocus
                    className="w-full pl-14 pr-5 py-5 border border-gray-200 rounded-2xl text-xl tracking-[0.5em] font-bold bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] focus:bg-white transition-all hover:border-gray-300"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-4.5 bg-[#D97706] hover:bg-[#C26A05] text-white text-lg font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl active:scale-[0.98]"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setError("");
                      setMessage("");
                    }}
                    className="w-full py-4 bg-white border-2 border-gray-100 text-gray-600 hover:border-gray-200 hover:text-gray-900 text-lg font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Change Number
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Side: Featured Brand Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="hidden lg:block lg:flex-1 relative"
        >
          <div className="absolute inset-0 bg-[#FDFAF7] z-0" />
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
