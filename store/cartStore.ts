'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

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
  syncStatus: 'idle' | 'syncing' | 'error';
  setUserId: (id: string | null, status: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  syncWithServer: () => Promise<void>;
  pushToServer: () => Promise<void>;
  clearFromServer: () => Promise<void>;
}

// Module-level debounce timer ref (outside Zustand state to avoid re-renders)
let pushDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const schedulePush = (pushFn: () => Promise<void>) => {
  if (pushDebounceTimer) clearTimeout(pushDebounceTimer);
  pushDebounceTimer = setTimeout(() => {
    pushFn();
  }, 400);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      syncStatus: 'idle',

      setUserId: (id, status) => {
        const currentUserId = get().userId;

        // 1. HYDRATION/LOADING GUARD
        if (status === 'loading') return;

        // 2. EXPLICIT LOGOUT
        if (status === 'unauthenticated' && currentUserId !== null) {
          get().clearFromServer();
          set({ userId: null, items: [] });
          return;
        }

        // 3. SWITCH USER
        if (id && currentUserId && id !== currentUserId) {
          set({ userId: id, items: [] });
          get().syncWithServer();
          return;
        }

        // 4. LOGIN / REFRESH SUCCESS
        if (id) {
          set({ userId: id });
          if (status === 'authenticated') {
            get().syncWithServer();
          }
        }
      },

      syncWithServer: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/cart');
          if (res.status === 401) {
            set({ items: [], syncStatus: 'error' });
            toast.error('Cart sync failed. Please sign in again.');
            return;
          }
          if (!res.ok) throw new Error('Failed to sync cart');
          const data = await res.json();
          set({ items: data.items || [], syncStatus: 'idle' });
        } catch {
          set({ syncStatus: 'error' });
          toast.error('Cart sync failed. Please sign in again.');
        }
      },

      pushToServer: async () => {
        const { userId, items } = get();
        if (!userId) return;

        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
          if (!res.ok) throw new Error('Failed to push cart');
          set({ syncStatus: 'idle' });
        } catch {
          set({ syncStatus: 'error' });
        }
      },

      clearFromServer: async () => {
        const { userId } = get();
        if (!userId) return;

        try {
          await fetch('/api/cart', { method: 'DELETE' });
        } catch {
          // Silently fail on sign-out clear
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
        schedulePush(get().pushToServer);
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        schedulePush(get().pushToServer);
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
        schedulePush(get().pushToServer);
      },

      clearCart: () => {
        set({ items: [] });
        schedulePush(get().pushToServer);
      },

      getTotalQuantity: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'gg-shop-persistent-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, userId: state.userId }),
    }
  )
);
