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

// Module-level debounce timer (outside state to avoid re-renders)
let pushDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const schedulePush = (pushFn: () => Promise<void>) => {
  if (pushDebounceTimer) clearTimeout(pushDebounceTimer);
  pushDebounceTimer = setTimeout(() => pushFn(), 600);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      syncStatus: 'idle',

      setUserId: (id, status) => {
        // Still resolving auth — do nothing
        if (status === 'loading') return;

        const currentUserId = get().userId;

        // Explicit logout — clear cart and remove from server
        if (status === 'unauthenticated') {
          if (currentUserId !== null) {
            get().clearFromServer();
            set({ userId: null, items: [] });
          }
          return;
        }

        // Authenticated branch
        if (id && status === 'authenticated') {
          // Different user logged in — start fresh and pull from server
          if (currentUserId && currentUserId !== id) {
            set({ userId: id, items: [] });
            get().syncWithServer();
            return;
          }

          // Same user (or first login) — set userId and sync
          set({ userId: id });

          // If we already have local items (restored from localStorage on refresh),
          // push them to keep the server in sync, then do a server read to merge.
          get().syncWithServer();
        }
      },

      syncWithServer: async () => {
        const { userId, items: localItems } = get();
        if (!userId) return;

        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/cart');
          if (res.status === 401) {
            set({ syncStatus: 'error' });
            return;
          }
          if (!res.ok) throw new Error('sync failed');

          const data = await res.json();
          const serverItems: CartItem[] = data.items ?? [];

          if (serverItems.length > 0) {
            // Server has items — use them (authoritative)
            set({ items: serverItems, syncStatus: 'idle' });
          } else if (localItems.length > 0) {
            // Server is empty but we have local items — push them up
            set({ syncStatus: 'idle' });
            schedulePush(get().pushToServer);
          } else {
            set({ syncStatus: 'idle' });
          }
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
          if (!res.ok) throw new Error('push failed');
          set({ syncStatus: 'idle' });
        } catch {
          set({ syncStatus: 'error' });
        }
      },

      clearFromServer: async () => {
        try {
          await fetch('/api/cart', { method: 'DELETE' });
        } catch {
          // Silently fail on sign-out clear
        }
      },

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
        schedulePush(get().pushToServer);
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        schedulePush(get().pushToServer);
      },

      decreaseQuantity: (id) => {
        const existing = get().items.find((i) => i.id === id);
        if (!existing) return;
        if (existing.quantity === 1) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({
            items: get().items.map((i) =>
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
      getTotalPrice:    () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'gg-shop-cart-v2',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          // SSR: no-op storage so server render doesn't throw
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
        return localStorage;
      }),
      // Persist items + userId so they survive page refresh
      partialize: (state) => ({ items: state.items, userId: state.userId }),
    }
  )
);
