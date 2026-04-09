    // lib/context/AuthContext.tsx
    'use client';


    import React, { createContext, useContext, useState, useEffect } from "react";
    import { getAuthSession, setAuthSession, clearAuthSession } from "@/app/actions/session";
    import { getCurrentLocation } from "@/lib/utils/location";

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app";

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
        async function loadSession() {
            try {
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

        console.log(json);
        
        if (!json.success) throw new Error(json.error || "Failed to send OTP");

        sessionStorage.setItem("pending_phone", phone);
    };

// STEP 2 — VERIFY OTP + CREATE / FETCH USER
const verifyOtp = async (otp: string) => {
  const phone = sessionStorage.getItem("pending_phone");
  if (!phone) throw new Error("Phone missing");

  // 1️⃣ CAPTURE LOCATION (Dynamic)
  const coords = await getCurrentLocation();

  // 2️⃣ VERIFY OTP (this already creates/fetches customer)
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
  const user = json.data.user; // ✅ THIS is your customer


const normalizedUser = {
  id: user._id,      // 🔥 normalize here
  phone: user.phone,
  name: user.name ?? null,
  email: user.email ?? null,
};

// Call Server Action to persist session
await setAuthSession(token, normalizedUser);

  // 2️⃣ SET AUTH STATE
  setUser(normalizedUser);
  setToken(token);

  sessionStorage.removeItem("pending_phone");
};

    const logout = () => {
        setUser(null);
        setToken(null);
        clearAuthSession();
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
