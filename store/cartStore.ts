import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock?: number;
  color?: string | null;
  size?: string | null;
}

interface CartState {
  items: CartItem[];
  userId: string | null;
  synced: boolean;
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

// ─── Debounced push ─────────────────────────────────────────────────────────
let pushTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(fn: () => Promise<void>, delay = 800) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => fn(), delay);
}

// ─── SSR-safe storage ───────────────────────────────────────────────────────
const safeStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return localStorage;
});

// ─── Store ──────────────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      synced: false,
      syncStatus: 'idle',

      // ── setUserId ──────────────────────────────────────────────────────────
      setUserId: (id, status) => {
        if (status === 'loading') return;

        const { userId: prev, synced } = get();

        if (status === 'unauthenticated') {
          if (prev !== null) {
            // Real sign-out — wipe cart
            get().clearFromServer();
            set({ userId: null, items: [], synced: false });
          }
          return;
        }

        // authenticated
        if (!id) return;

        if (prev && prev !== id) {
          // Different user — reset and fetch from server
          set({ userId: id, items: [], synced: false });
          get().syncWithServer();
          return;
        }

        // Same user: only sync once per session
        set({ userId: id });
        if (!synced) get().syncWithServer();
      },

      // ── addToCart ──────────────────────────────────────────────────────────
      addToCart: (item) => {
        const items = get().items;
        // Same product + same color + same size = same cart line
        const existing = items.find(
          (i) => i.id === item.id && i.color === (item.color ?? null) && i.size === (item.size ?? null)
        );

        if (existing) {
          const maxQty = existing.stock ?? item.stock ?? Infinity;
          if (existing.quantity >= maxQty) return;
          set({
            items: items.map((i) =>
              i.id === item.id && i.color === existing.color && i.size === existing.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1, color: item.color ?? null, size: item.size ?? null }] });
        }
        schedulePush(get().pushToServer);
      },

      // ── updateQuantity ─────────────────────────────────────────────────────
      // id here is the cart line key — for variant products we use a composite key
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          const item = get().items.find((i) => i.id === id);
          if (!item) return;
          const maxQty = item.stock ?? Infinity;
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: Math.min(quantity, maxQty) } : i
            ),
          });
        }
        schedulePush(get().pushToServer);
      },

      // ── removeFromCart ─────────────────────────────────────────────────────
      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        schedulePush(get().pushToServer);
      },

      // ── clearCart ──────────────────────────────────────────────────────────
      clearCart: () => {
        set({ items: [] });
        schedulePush(get().pushToServer);
      },

      // ── computed ───────────────────────────────────────────────────────────
      getTotalQuantity: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),

      // ── syncWithServer ─────────────────────────────────────────────────────
      // Runs once per session per user. Server wins if it has items;
      // otherwise local items are pushed up.
      syncWithServer: async () => {
        const { userId, items: local } = get();
        if (!userId) return;

        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/cart', { credentials: 'include' });

          if (res.status === 401) { set({ syncStatus: 'idle' }); return; }
          if (!res.ok) throw new Error(`GET /api/cart → ${res.status}`);

          const data = await res.json();
          const server: CartItem[] = data.items ?? [];

          if (server.length > 0) {
            set({ items: server, synced: true, syncStatus: 'idle' });
          } else if (local.length > 0) {
            set({ synced: true, syncStatus: 'idle' });
            // Push local items up immediately (no debounce — this is first sync)
            get().pushToServer();
          } else {
            set({ synced: true, syncStatus: 'idle' });
          }
        } catch (err) {
          console.error('[cartStore] syncWithServer:', err);
          set({ syncStatus: 'error' });
        }
      },

      // ── pushToServer ───────────────────────────────────────────────────────
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
        }
      },

      // ── clearFromServer ────────────────────────────────────────────────────
      clearFromServer: async () => {
        try {
          await fetch('/api/cart', { method: 'DELETE', credentials: 'include' });
        } catch {
          // Best-effort on sign-out
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
