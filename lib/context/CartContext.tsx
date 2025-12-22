'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/types/product';
import { CartItem } from '@/lib/types/cart';
import { useAuth } from '@/lib/context/AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, token, isAuthenticated } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const API_URL = "http://localhost:3000/api/cart";

  // ------------------------------------------
  // Get userId from localStorage
  // ------------------------------------------


  const userId = user?.id;

  console.log("🔹 CartContext Loaded");
  console.log("🟦 Logged-in User:", user);
  console.log("🟦 Token:", token);
  console.log("🟦 userId:", userId);

  // ------------------------------------------
  // FETCH CART
  // ------------------------------------------
  const fetchCart = async () => {
    if (!token || !userId) {
      console.warn("⚠️ fetchCart skipped — missing token or userId");
      return;
    }

    console.log("📥 FETCH CART =>", `${API_URL}?userId=${userId}`);

    const res = await fetch(`${API_URL}?userId=${userId}`, {
      method: "GET",
    });

    const json = await res.json();
    console.log("📥 FETCH CART RESPONSE:", json);

    if (json.success) {
      console.log("🟩 Setting cart items:", json.data.items);
      setItems(json.data.items);
      setSubtotal(json.data.subtotal);
    } else {
      console.error("🟥 Failed to fetch cart:", json.error);
    }
  };

useEffect(() => {
  if (isAuthenticated && userId) {
    console.log("🔄 User authenticated — Fetching cart...");
    fetchCart();
  }
}, [isAuthenticated]);

useEffect(() => {
  if (!isAuthenticated || !userId) return;

  const handleCartUpdated = () => {
    console.log("🟢 cart-updated event received — refetching cart");
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
  const addItem = async (product: Product, quantity: number = 1) => {
    if (!token || !userId) {
      alert("Please login first!");
      return;
    }

    const body = {
      userId,
      productId: product.id,
      quantity,
    };

    console.log("📤 ADD TO CART BODY:", body);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    console.log("📤 ADD TO CART RESPONSE:", json);

    if (json.success) {
      console.log("🟩 Add success — fetching cart again");
      fetchCart();
    } else {
      console.error("🟥 Add failed:", json.error);
    }
  };

  // ------------------------------------------
  // UPDATE QUANTITY
  // ------------------------------------------
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!token || !userId) return;

    console.log("productId", productId);
    
    const body = {
      userId,
      productId,
      quantity,
    };

    console.log("📤 UPDATE CART BODY:", body);

    const res = await fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    console.log("📤 UPDATE CART RESPONSE:", json);

    if (json.success) {
      console.log("🟩 Update success — refreshing cart");
      fetchCart();
    } else {
      console.error("🟥 Update failed:", json.error);
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

    console.log("📤 REMOVE CART ITEM BODY:", body);

    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    console.log("📤 REMOVE ITEM RESPONSE:", json);

    if (json.success) {
      console.log("🟩 Remove success — refreshing cart");
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

    console.log("📤 CLEAR CART BODY:", body);

    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    console.log("📤 CLEAR CART RESPONSE:", json);

    console.log("🟩 Cart cleared — refreshing cart");
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
