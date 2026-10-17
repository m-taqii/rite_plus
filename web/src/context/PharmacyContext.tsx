'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/content/site';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface PharmacyContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isPrescriptionModalOpen: boolean;
  setIsPrescriptionModalOpen: (open: boolean) => void;
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export function PharmacyProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('rite_plus_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');


  useEffect(() => {
    try {
      localStorage.setItem('rite_plus_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <PharmacyContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isPrescriptionModalOpen,
        setIsPrescriptionModalOpen,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
}
