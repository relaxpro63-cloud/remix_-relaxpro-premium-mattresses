import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, MattressSize, SizeCategory } from '../../types';

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  addToCartDirect: (
    product: Product,
    size: MattressSize,
    includeAcc: boolean,
    fabricOption?: '300GSM' | '450GSM',
    customSizeData?: { length: number; width: number; thickness?: number },
    sizeCategory?: SizeCategory,
  ) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
}

const CartContext = createContext<CartState | undefined>(undefined);

const STORAGE_KEY = 'relaxpro_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse cart local storage:', e);
    }
  }, []);

  const saveCart = (next: CartItem[]) => {
    setCart(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save cart to local storage:', e);
    }
  };

  const addToCart = (item: CartItem) => saveCart([...cart, item]);

  const addToCartDirect = (
    product: Product,
    size: MattressSize,
    includeAcc: boolean,
    fabricOption?: '300GSM' | '450GSM',
    customSizeData?: { length: number; width: number; thickness?: number },
    sizeCategory?: SizeCategory,
  ) => {
    let basePrice = 0;
    const isCustom = size === 'custom';

    if (!isCustom) {
      if (product.pricingModel === 'with_without_accessories') {
        basePrice = includeAcc
          ? product.pricing.withAccessories?.[size] || 0
          : product.pricing.withoutAccessories?.[size] || 0;
      } else {
        basePrice = fabricOption === '450GSM'
          ? product.pricing.fabric450Gsm?.[size] || 0
          : product.pricing.fabric300Gsm?.[size] || 0;
      }
    }

    const compositeKey = isCustom
      ? `${product.slug}-custom-${customSizeData?.length}x${customSizeData?.width}-${customSizeData?.thickness || 'n/a'}`
      : `${product.slug}-${sizeCategory || size}-${size}-${includeAcc ? 'acc' : 'no_acc'}-${fabricOption || 'std'}`;

    const existingIdx = cart.findIndex((item) => item.id === compositeKey);

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        id: compositeKey,
        slug: product.slug,
        name: `${product.name} Mattress`,
        size: isCustom ? 'custom' : size,
        price: isCustom ? 0 : basePrice,
        quantity: 1,
        includeAccessories: includeAcc,
        fabricOption,
        image: product.image,
        type: isCustom ? 'custom' : 'prebuilt',
        customSize: isCustom ? customSizeData : undefined,
        sizeCategory: isCustom ? undefined : sizeCategory,
      };
      saveCart([...cart, newItem]);
    }
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    saveCart(cart.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const removeItem = (id: string) => saveCart(cart.filter((item) => item.id !== id));
  const clearCart = () => saveCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addToCartDirect,
        updateQty,
        removeItem,
        clearCart,
        totalCount: cart.reduce((acc, curr) => acc + curr.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
