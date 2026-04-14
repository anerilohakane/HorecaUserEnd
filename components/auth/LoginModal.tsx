// components/auth/LoginModal.tsx
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Phone, Lock } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, verifyOtp } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhone("");
      setOtp("");
      setMessage("");
      setError("");
    }
  }, [isOpen]);

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

      setTimeout(() => {
        onClose();
        setStep("phone");
        setPhone("");
        setOtp("");
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden min-h-[500px] transform transition-all">
          
          {/* Left Column - Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative bg-white">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 lg:hidden p-2"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Unifoods"
                  width={130}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                Welcome to,<br />Unifoods B2B
              </h2>
              <p className="text-gray-500 text-base">
                Sign in to your account and unlock exclusive wholesale deals.
              </p>
            </div>

            {step === "phone" ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <div className="flex gap-2">
                    {/* Country Code */}
                    <div className="relative w-[110px]">
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value);
                          setPhone('');
                        }}
                        className="w-full appearance-none pl-3 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] cursor-pointer font-medium transition-colors hover:border-gray-300"
                      >
                        <option value="+91">IN (+91)</option>
                        <option value="+1">US (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+61">AU (+61)</option>
                        <option value="+971">AE (+971)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setPhone(countryCode === "+91" ? val.slice(0, 10) : val.slice(0, 15));
                        }}
                        placeholder={countryCode === "+91" ? "10-digit number" : "Phone number"}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] font-medium placeholder:font-normal transition-colors hover:border-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Checkbox row from reference */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#D97706] checked:border-[#D97706] transition-colors cursor-pointer" />
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="text-sm font-semibold text-gray-500 hover:text-[#D97706] transition-colors">
                    Need help?
                  </button>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || phone.length < 7 || (countryCode === "+91" && phone.length !== 10)}
                  className="w-full py-3 mt-2 bg-[#D97706] hover:bg-[#C26A05] text-white text-base font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-[0.98]"
                >
                  {loading ? "Sending OTP..." : "Sign In"}
                </button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={onClose} className="font-semibold text-[#D97706] hover:underline">
                      Sign Up
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Verify OTP</h3>
                  <p className="text-gray-600 font-medium">Sent securely to <span className="text-gray-900">{countryCode} {phone}</span></p>
                </div>

                {message && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-sm font-medium">
                    {message}
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-gray-400" size={22} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-xl tracking-widest font-medium bg-white focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-colors hover:border-gray-300"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-4 bg-[#D97706] hover:bg-[#C26A05] text-white text-lg font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-[0.98]"
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
                    className="w-full py-4 bg-white border-2 border-gray-100 text-gray-600 hover:border-gray-200 hover:text-gray-900 text-lg font-semibold rounded-xl transition-all duration-200"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="hidden lg:block w-1/2 relative bg-[#FDF8F3] p-4">
            <button
              onClick={onClose}
              className="absolute right-8 top-8 bg-white/60 backdrop-blur-md rounded-full p-2.5 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md z-10 transition-all border border-white/20"
            >
              <X size={20} className="stroke-[2.5]" />
            </button>
            <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner bg-gradient-to-br from-orange-50 to-amber-100/50">
              <Image 
                src="/images/login-illustration.png" 
                alt="Unifoods Wholesale Journey" 
                fill 
                className="object-cover object-center"
                priority 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
