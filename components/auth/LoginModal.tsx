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
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Image
                src="/images/logo.png"
                alt="Unifoods"
                width={150}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600">B2B Marketplace</p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-xl p-4 mb-6 border border-[#F59E0B] text-center shadow-sm">
                <h2 className="text-xl font-bold text-[#111827]">Welcome to Unifoods! 🎉</h2>
                <p className="text-[#4B5563] text-sm mt-1">Sign in to unlock exclusive wholesale deals.</p>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex gap-2 relative">
                  <div className="relative w-1/3 max-w-[120px]">
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        setPhone(''); // reset phone when switching country
                      }}
                      className="w-full appearance-none pl-3 pr-8 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] cursor-pointer"
                    >
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+61">AU (+61)</option>
                      <option value="+971">AE (+971)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPhone(countryCode === "+91" ? val.slice(0, 10) : val.slice(0, 15));
                      }}
                      placeholder={countryCode === "+91" ? "10-digit number" : "Phone number"}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && <p className="mb-4 text-red-600 text-sm max-w-[80%] mx-auto text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || phone.length < 7 || (countryCode === "+91" && phone.length !== 10)}
                className="w-full py-3.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#C26A05] hover:to-[#92400E] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
              <p className="text-gray-600 mb-6">Sent to {countryCode} {phone}</p>

              {message && (
                <p className="mb-4 text-yellow-700 bg-yellow-100 p-3 rounded">{message}</p>
              )}

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Enter OTP</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className="w-full pl-10 py-3 border rounded-lg text-center text-xl"
                    required
                  />
                </div>
              </div>

              {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#C26A05] hover:to-[#92400E] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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
                className="w-full py-3 mt-3 border rounded-lg"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
