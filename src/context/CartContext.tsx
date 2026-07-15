"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export interface CartItem {
  id: string;
  nameEn: string;
  nameBn: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cng_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {}
  }, []);

  const saveCart = useCallback((newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("cng_cart", JSON.stringify(newCart));
    } catch {}
  }, []);

  const addToCart = useCallback((product: any, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      let newCart: CartItem[];
      if (existingIndex > -1) {
        newCart = [...prev];
        const newQty = newCart[existingIndex].quantity + quantity;
        newCart[existingIndex].quantity = Math.min(newQty, product.stock);
      } else {
        const newItem: CartItem = {
          id: product.id,
          nameEn: product.nameEn,
          nameBn: product.nameBn,
          price: product.price,
          image: product.images?.[0] || "/placeholder.jpg",
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        };
        newCart = [...prev, newItem];
      }
      try {
        localStorage.setItem("cng_cart", JSON.stringify(newCart));
      } catch {}
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const newCart = prev.filter((item) => item.id !== productId);
      try {
        localStorage.setItem("cng_cart", JSON.stringify(newCart));
      } catch {}
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const newCart = prev.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.min(quantity, item.stock) };
        }
        return item;
      });
      try {
        localStorage.setItem("cng_cart", JSON.stringify(newCart));
      } catch {}
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
