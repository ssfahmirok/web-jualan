'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, target: string, zone?: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: (isLoggedIn: boolean) => number;
  getDiscountAmount: (isLoggedIn: boolean) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DISCOUNT_PER_ITEM = 1000;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, target: string, zone?: string, quantity: number = 1) => {
    setItems((prev) => [...prev, { product, target, zone, quantity }]);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback((isLoggedIn: boolean) => {
    const baseTotal = items.reduce((total, item) => {
      return total + item.product.priceTotal * item.quantity;
    }, 0);

    if (isLoggedIn) {
      const discount = items.length * DISCOUNT_PER_ITEM;
      return Math.max(0, baseTotal - discount);
    }

    return baseTotal;
  }, [items]);

  const getDiscountAmount = useCallback((isLoggedIn: boolean) => {
    if (!isLoggedIn) return 0;
    return items.length * DISCOUNT_PER_ITEM;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getDiscountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
