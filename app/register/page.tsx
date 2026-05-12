'use client';

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Phone, Building, FileText, Lock, Upload, ArrowRight, ArrowLeft, CheckCircle, X, MapPin } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

export default function RegisterPage() {
  const { registerCustomer, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const uploadLicense = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to upload license image");
    }
    return data.url;
  };

  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (name.trim().length < 2) return "Full name is required";
      if (username.trim().length < 3) return "Username must be at least 3 characters";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return "Please enter a valid email address";
      if (phone.length < 10) return "Please enter a valid 10-digit phone number";
    } else if (step === 2) {
      if (businessName.trim().length < 2) return "Business name is required";
      if (address.trim().length < 5) return "Please enter a complete business address";
      if (city.trim().length < 2) return "City is required";
      if (state.trim().length < 2) return "State is required";
      
      const pinRegex = /^[1-9][0-9]{5}$/;
      if (!pinRegex.test(pincode)) return "Please enter a valid 6-digit PIN code";
      
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstNumber || !gstRegex.test(gstNumber.toUpperCase())) {
        return "Please enter a valid GST number (e.g. 22AAAAA0000A1Z5)";
      }
    }
    return null;
  };

  const nextStep = () => {
    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!licenseFile) {
      setError("Please upload your business license");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload License Image
      const licenseUrl = await uploadLicense(licenseFile);

      // 2. Register Customer
      await registerCustomer({
        username: username.trim(),
        email: email.trim(),
        name: name.trim(),
        phone: countryCode + phone.trim(),
        businessName: businessName.trim(),
        gstNumber: gstNumber.trim().toUpperCase(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        password,
        licenseImage: licenseUrl
      });

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit overflow-hidden">
      <main className="flex-grow flex flex-col lg:flex-row relative min-h-screen">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[50%] xl:w-[45%] p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center relative bg-white z-20 overflow-y-auto">
          <Link href="/" className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
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

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-[#D97706]' : 'w-4 bg-gray-200'}`} />
              ))}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Business Account</h2>
            <p className="text-gray-500">Step {step} of 3 — {step === 1 ? 'Contact Details' : step === 2 ? 'Business Information' : 'Security & Verification'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-[100px] px-3 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm font-bold"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="Phone Number"
                        className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                  <button type="button" onClick={nextStep} className="w-full py-4 bg-[#D97706] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Business Name"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="GST Number *"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full Business Address"
                      rows={2}
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                        required
                      />
                    </div>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="PIN Code"
                      className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl flex items-center justify-center gap-2">
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="flex-2 py-4 bg-[#D97706] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 px-8">
                      Continue <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Business License / FSSAI (Photo) *</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${licenseFile ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#D97706]'}`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      {licenseFile ? (
                        <>
                          <CheckCircle className="text-green-500 mb-2" size={32} />
                          <span className="text-sm font-medium text-green-700">{licenseFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400 mb-2" size={32} />
                          <span className="text-sm font-medium text-gray-600">Click to upload license image</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-sm"
                      required
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                  {message && <p className="text-green-500 text-sm font-medium">{message}</p>}

                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl">
                      Back
                    </button>
                    <button type="submit" disabled={loading} className="flex-2 py-4 bg-[#D97706] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 px-8">
                      {loading ? "Creating Account..." : "Register Now"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-6">
              <p className="text-gray-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-[#D97706] font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden lg:block lg:flex-1 relative bg-[#FDF1D3]">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="relative w-[80%] aspect-square">
               <Image 
                src="/images/login-illustration.png" 
                alt="Unifoods Wholesale Journey" 
                fill 
                className="object-contain"
                priority 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}