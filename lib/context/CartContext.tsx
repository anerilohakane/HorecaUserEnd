'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/types/product';
import { CartItem } from '@/lib/types/cart';
import { useAuth } from '@/lib/context/AuthContext';
import { sileo } from 'sileo';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity: number) => Promise<{ success: boolean; message?: string }>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; message?: string }>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, token, isAuthenticated } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const API_URL = `${API_BASE}/api/cart`;

  // ------------------------------------------
  // Get userId from localStorage
  // ------------------------------------------


  const userId = user?.id;

  // console.log("🔹 CartContext Loaded");
  // console.log("🟦 Logged-in User:", user);
  // console.log("🟦 Token:", token);
  // console.log("🟦 userId:", userId);

  // ------------------------------------------
  // FETCH CART
  // ------------------------------------------
  const fetchCart = async () => {
    if (!token || !userId) {
      console.warn("⚠️ fetchCart skipped — missing token or userId");
      return;
    }

    // console.log("📥 FETCH CART =>", `${API_URL}?userId=${userId}`);

    const res = await fetch(`${API_URL}?userId=${userId}`, {
      method: "GET",
    });

    const json = await res.json();
    // console.log("📥 FETCH CART RESPONSE:", json);

    if (json.success) {
      // console.log("🟩 Setting cart items:", json.data.items);
      setItems(json.data.items);
      setSubtotal(json.data.subtotal);
    } else {
      console.error("🟥 Failed to fetch cart:", json.error);
    }
  };

useEffect(() => {
  if (isAuthenticated && userId) {
    // console.log("🔄 User authenticated — Fetching cart...");
    fetchCart();
  }
}, [isAuthenticated]);

useEffect(() => {
  if (!isAuthenticated || !userId) return;

  const handleCartUpdated = () => {
    // console.log("🟢 cart-updated event received — refetching cart");
    fetchCart();
  };

  window.addEventListener("cart-updated", handleCartUpdated);

  return () => {
    window.removeEventListener("cart-updated", handleCartUpdated);
  };
}, [isAuthenticated, userId]);


  // ------------------------------------------
  // ADD ITEM
  // ------------------------------------------
  const addItem = async (product: Product, quantity: number = 1): Promise<{ success: boolean; message?: string }> => {
    if (!token || !userId) {
      sileo.error({ title: "Login Required", description: "Please login to add items to your cart." });
      return { success: false, message: "Login required" };
    }

    try {
      const body = {
        userId,
        productId: product.id,
        quantity,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (json.success) {
        fetchCart();
        return { success: true };
      } else {
        console.error("🟥 Add failed:", json.error);
        return { success: false, message: json.error || "Failed to add to cart" };
      }
    } catch (err: any) {
      console.error("ADD ITEM ERROR:", err);
      return { success: false, message: err.message || "Network error" };
    }
  };

  // ------------------------------------------
  // UPDATE QUANTITY
  // ------------------------------------------
  const updateQuantity = async (productId: string, quantity: number): Promise<{ success: boolean; message?: string }> => {
    if (!token || !userId) return { success: false, message: "Login required" };

    try {
      const body = {
        userId,
        productId,
        quantity,
      };

      const res = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (json.success) {
        fetchCart();
        return { success: true };
      } else {
        console.error("🟥 Update failed:", json.error);
        return { success: false, message: json.error || "Failed to update quantity" };
      }
    } catch (err: any) {
      console.error("UPDATE QUANTITY ERROR:", err);
      return { success: false, message: err.message || "Network error" };
    }
  };

  // ------------------------------------------
  // REMOVE ITEM
  // ------------------------------------------
  const removeItem = async (productId: string) => {
    if (!token || !userId) return;

    const body = {
      userId,
      productId,
    };

    // console.log("📤 REMOVE CART ITEM BODY:", body);

    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    // console.log("📤 REMOVE ITEM RESPONSE:", json);

    if (json.success) {
      // console.log("🟩 Remove success — refreshing cart");
      fetchCart();
    } else {
      console.error("🟥 Remove failed:", json.error);
    }
  };

  // ------------------------------------------
  // CLEAR CART
  // ------------------------------------------
  const clearCart = async () => {
    if (!token || !userId) return;

    const body = { userId };

    // console.log("📤 CLEAR CART BODY:", body);

    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    // console.log("📤 CLEAR CART RESPONSE:", json);

    // console.log("🟩 Cart cleared — refreshing cart");
    fetchCart();
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
