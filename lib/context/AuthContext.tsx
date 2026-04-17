// lib/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthSession, setAuthSession, clearAuthSession } from "@/app/actions/session";
import { getCurrentLocation } from "@/lib/utils/location";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  category: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { user } = await getAuthSession();
      if (user) {
        setUser(user);
      }
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true);
        const { token, user } = await getAuthSession();
        if (token && user) {
          setUser(user);
          setToken(token);
        }
      } catch (err) {
        console.error("Failed to load session", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  // STEP 1 — SEND OTP
  const login = async (phone: string) => {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to send OTP");

    sessionStorage.setItem("pending_phone", phone);
  };

  // STEP 2 — VERIFY OTP + CREATE / FETCH USER
  const verifyOtp = async (otp: string) => {
    const phone = sessionStorage.getItem("pending_phone");
    if (!phone) throw new Error("Phone missing");

    // 1️⃣ CAPTURE LOCATION (Dynamic)
    const coords = await getCurrentLocation();

    // 2️⃣ VERIFY OTP
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        otp,
        lat: coords?.lat || null,
        lng: coords?.lng || null
      }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    const token = json.data.accessToken;
    const userData = json.data.user;

    const normalizedUser = {
      id: userData._id || userData.id,
      phone: userData.phone,
      name: userData.name ?? null,
      email: userData.email ?? null,
      category: userData.category ?? "D",
    };

    // Call Server Action to persist session
    await setAuthSession(token, normalizedUser);

    // SET AUTH STATE
    setUser(normalizedUser);
    setToken(token);

    sessionStorage.removeItem("pending_phone");
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await clearAuthSession();
    // Clear any pending phone or other cached auth session data
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        verifyOtp,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
