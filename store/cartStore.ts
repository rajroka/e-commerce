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
  userId: string | null;
  setUserId: (id: string | null, status: string) => void; // Added status
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,

      setUserId: (id, status) => {
        const currentUserId = get().userId;

        // 1. HYDRATION/LOADING GUARD:
        // If NextAuth is still loading, do absolutely nothing.
        if (status === 'loading') return;

        // 2. EXPLICIT LOGOUT:
        // Only wipe if status is 'unauthenticated' AND we previously had a user.
        if (status === 'unauthenticated' && currentUserId !== null) {
          set({ userId: null, items: [] });
          return;
        }

        // 3. SWITCH USER:
        if (id && currentUserId && id !== currentUserId) {
          set({ userId: id, items: [] });
          return;
        }

        // 4. LOGIN / REFRESH SUCCESS:
        if (id) {
          set({ userId: id });
        }
      },

      addToCart: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      decreaseQuantity: (id) => {
        const { items } = get();
        const existing = items.find((i) => i.id === id);
        if (existing?.quantity === 1) {
          set({ items: items.filter((i) => i.id !== id) });
        } else if (existing) {
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),
      getTotalQuantity: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'gg-shop-persistent-v1', // Fresh name to kill old broken data
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, userId: state.userId }),
    }
  )
);