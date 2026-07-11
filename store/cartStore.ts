import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock?: number; // optional — used for client-side stock validation
}

interface CartState {
  items: CartItem[];
  userId: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';

  // Actions
  setUserId: (id: string | null, status: 'loading' | 'authenticated' | 'unauthenticated') => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Computed
  getTotalQuantity: () => number;
  getTotalPrice: () => number;

  // Server sync
  syncWithServer: () => Promise<void>;
  pushToServer: () => Promise<void>;
  clearFromServer: () => Promise<void>;
}

// ─── Debounced push ────────────────────────────────────────────────────────────
let pushTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(fn: () => Promise<void>) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => fn(), 600);
}

// ─── SSR-safe storage ──────────────────────────────────────────────────────────
const safeStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return localStorage;
});

// ─── Store ─────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      syncStatus: 'idle',

      // ── setUserId ────────────────────────────────────────────────────────────
      // Called by Nav / cart page whenever the auth state changes.
      // Rules:
      //  • loading → do nothing (session still resolving)
      //  • unauthenticated + we had a userId → user just signed out → clear
      //  • unauthenticated + no prior userId → guest browsing → leave items alone
      //  • authenticated, same user → just make sure server is in sync
      //  • authenticated, different user → start fresh from server
      setUserId: (id, status) => {
        if (status === 'loading') return;

        const prev = get().userId;

        if (status === 'unauthenticated') {
          if (prev !== null) {
            // Actual sign-out — wipe cart
            get().clearFromServer();
            set({ userId: null, items: [] });
          }
          // else: guest with no prior session — leave items untouched
          return;
        }

        // authenticated
        if (!id) return;

        if (prev && prev !== id) {
          // Different user — reset and fetch from server
          set({ userId: id, items: [] });
          get().syncWithServer();
          return;
        }

        // Same user (or first login this session)
        set({ userId: id });
        get().syncWithServer();
      },

      // ── addToCart ────────────────────────────────────────────────────────────
      addToCart: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);

        if (existing) {
          // Respect stock limit if provided
          const maxQty = item.stock ?? Infinity;
          if (existing.quantity >= maxQty) return; // silently cap — caller shows toast

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

      // ── updateQuantity ───────────────────────────────────────────────────────
      // Replaces both the old increaseQuantity / decreaseQuantity pair.
      // Pass 0 or negative to remove.
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          const item = get().items.find((i) => i.id === id);
          if (!item) return;
          const maxQty = item.stock ?? Infinity;
          const clamped = Math.min(quantity, maxQty);
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: clamped } : i
            ),
          });
        }
        schedulePush(get().pushToServer);
      },

      // ── removeFromCart ───────────────────────────────────────────────────────
      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        schedulePush(get().pushToServer);
      },

      // ── clearCart ────────────────────────────────────────────────────────────
      clearCart: () => {
        set({ items: [] });
        schedulePush(get().pushToServer);
      },

      // ── getTotalQuantity / getTotalPrice ─────────────────────────────────────
      getTotalQuantity: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),

      // ── syncWithServer ───────────────────────────────────────────────────────
      // Fetches the server cart and merges:
      //  • Server has items  → server wins (authoritative after login)
      //  • Server empty, local has items → push local up (added while logged out)
      //  • Both empty → nothing to do
      syncWithServer: async () => {
        const { userId, items: local } = get();
        if (!userId) return;

        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/cart', { credentials: 'include' });

          if (res.status === 401) {
            // Session expired mid-flight — don't blow up
            set({ syncStatus: 'idle' });
            return;
          }
          if (!res.ok) throw new Error(`GET /api/cart → ${res.status}`);

          const data = await res.json();
          const server: CartItem[] = data.items ?? [];

          if (server.length > 0) {
            set({ items: server, syncStatus: 'idle' });
          } else if (local.length > 0) {
            set({ syncStatus: 'idle' });
            schedulePush(get().pushToServer);
          } else {
            set({ syncStatus: 'idle' });
          }
        } catch (err) {
          console.error('[cartStore] syncWithServer:', err);
          set({ syncStatus: 'error' });
          // Don't toast — silent background sync; items still show from localStorage
        }
      },

      // ── pushToServer ─────────────────────────────────────────────────────────
      pushToServer: async () => {
        const { userId, items } = get();
        if (!userId) return;

        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ items }),
          });
          if (!res.ok) throw new Error(`POST /api/cart → ${res.status}`);
          set({ syncStatus: 'idle' });
        } catch (err) {
          console.error('[cartStore] pushToServer:', err);
          set({ syncStatus: 'error' });
          // Items are still safe in localStorage — no data loss
        }
      },

      // ── clearFromServer ──────────────────────────────────────────────────────
      clearFromServer: async () => {
        try {
          await fetch('/api/cart', { method: 'DELETE', credentials: 'include' });
        } catch {
          // Best-effort on sign-out — ignore failure
        }
      },
    }),
    {
      name: 'gg-shop-cart-v2',
      storage: safeStorage,
      partialize: (s) => ({ items: s.items, userId: s.userId }),
    }
  )
);
