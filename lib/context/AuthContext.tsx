    // lib/context/AuthContext.tsx
    'use client';

    import { log } from "console";
    import React, { createContext, useContext, useState, useEffect } from "react";

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

    interface User {
    id: string;
    phone: string;
    name: string | null;
    email: string | null;
    }

    interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (phone: string) => Promise<void>;
    verifyOtp: (otp: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const u = localStorage.getItem("unifoods_user");
        const t = localStorage.getItem("unifoods_token");
        if (u && t) {
        setUser(JSON.parse(u));
        setToken(t);
        }
        setIsLoading(false);
    }, []);

    // STEP 1 — SEND OTP
    const login = async (phone: string) => {
        const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
        });

        const json = await res.json();

        console.log(json);
        
        if (!json.success) throw new Error(json.error || "Failed to send OTP");

        sessionStorage.setItem("pending_phone", phone);
    };

// STEP 2 — VERIFY OTP + CREATE / FETCH USER
const verifyOtp = async (otp: string) => {
  const phone = sessionStorage.getItem("pending_phone");
  if (!phone) throw new Error("Phone missing");

  // 1️⃣ VERIFY OTP (this already creates/fetches customer)
  const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error);

  const token = json.data.accessToken;
  const user = json.data.user; // ✅ THIS is your customer


const normalizedUser = {
  id: user._id,      // 🔥 normalize here
  phone: user.phone,
  name: user.name ?? null,
  email: user.email ?? null,
};

localStorage.setItem("unifoods_user", JSON.stringify(normalizedUser));
  // 🔥🔥🔥 STORE AUTH DATA (CRITICAL FIX)
//   localStorage.setItem("userId", user.id);
//   localStorage.setItem("unifoods_user", JSON.stringify(user));
  localStorage.setItem("unifoods_token", token);

  // 2️⃣ SET AUTH STATE
  setUser(normalizedUser);
  setToken(token);

  sessionStorage.removeItem("pending_phone");
};

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("unifoods_token");
        localStorage.removeItem("unifoods_user");
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            token,
            login,
            verifyOtp,
            logout,
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
