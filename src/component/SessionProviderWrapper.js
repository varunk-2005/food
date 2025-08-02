"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useState, useCallback, useEffect } from "react";

export const CartContext = createContext({});

export default function SessionProviderWrapper({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch { }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = useCallback((product, size = null, extras = []) => {
    setCart(prevCart => [
      ...prevCart,
      { ...product, size, extras }
    ]);
  }, []);

  return (
    <SessionProvider>
      <CartContext.Provider value={{ cart, setCart, addToCart }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}
