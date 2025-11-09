'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalPrice: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      decreaseQuantity: (id) => {
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          if (existing.quantity === 1) {
            get().removeFromCart(id);
          } else {
            set({
              items: get().items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity - 1 } : i
              ),
            });
          }
        }
      },

      clearCart: () => set({ items: [] }),

      get totalQuantity() {
        return get().items.reduce((acc, i) => acc + i.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage), // 
    }
  )
);
