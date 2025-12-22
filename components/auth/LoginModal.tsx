// components/auth/LoginModal.tsx
'use client';

import { useState, useEffect } from "react";
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
      await login(phone.trim());
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
              <div className="text-3xl">🌾</div>
              <span className="text-3xl font-bold text-[#111827]" style={{ fontFamily: "serif" }}>
                Unifoods
              </span>
            </div>
            <p className="text-gray-600">B2B Marketplace</p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit}>
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-6">Enter your phone number</p>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    required
                  />
                </div>
              </div>

              {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-3 bg-[#D97706] text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
              <p className="text-gray-600 mb-6">Sent to +91 {phone}</p>

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
                className="w-full py-3 bg-[#D97706] text-white rounded-lg disabled:opacity-50"
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
