'use client';

import { create } from 'zustand';
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
  synced: boolean;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  synced: false,

  isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

  fetchWishlist: async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (!res.ok) return;
      const data = await res.json();
      set({ items: data.items ?? [], synced: true });
    } catch {
      // silent
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
      set((s) => ({ items: s.items.filter((i) => i.productId !== item.productId) }));
      toast.error('Failed to update wishlist');
    }
  },

  removeFromWishlist: async (productId) => {
    const prev = get().items;
    set((s) => ({ items: s.items.filter((i) => i.productId !== productId) }));
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
}));
