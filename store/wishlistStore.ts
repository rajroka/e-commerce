import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  // synced = server fetch has completed at least once this session
  synced: boolean;
  _hydrated: boolean;
  setHydrated: () => void;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      synced: false,
      _hydrated: false,

      setHydrated: () => set({ _hydrated: true }),

      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),

      fetchWishlist: async () => {
        // Don't re-fetch if already synced this session
        if (get().synced) return;
        try {
          const res = await fetch('/api/wishlist');
          if (!res.ok) return;
          const data = await res.json();
          set({ items: data.items ?? [], synced: true });
        } catch {
          // silent — keep locally persisted items
        }
      },

      addToWishlist: async (item) => {
        // Optimistic update
        set((s) => ({ items: [...s.items, item] }));
        try {
          const res = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
          if (!res.ok) throw new Error();
          toast.success('Added to wishlist');
        } catch {
          // Rollback
          set((s) => ({
            items: s.items.filter((i) => i.productId !== item.productId),
          }));
          toast.error('Failed to update wishlist');
        }
      },

      removeFromWishlist: async (productId) => {
        const prev = get().items;
        // Optimistic update
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        }));
        try {
          const res = await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          });
          if (!res.ok) throw new Error();
          toast.success('Removed from wishlist');
        } catch {
          set({ items: prev });
          toast.error('Failed to update wishlist');
        }
      },

      toggleWishlist: async (item) => {
        if (get().isInWishlist(item.productId)) {
          await get().removeFromWishlist(item.productId);
        } else {
          await get().addToWishlist(item);
        }
      },
    }),
    {
      name: 'gg-shop-wishlist-v1',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      // Persist items only; reset synced on every boot so server is re-fetched once per session
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated();
      },
    }
  )
);
