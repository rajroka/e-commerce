'use client';

/**
 * StoreHydration — intentionally minimal.
 *
 * The cart store no longer needs a hydration gate.
 * This component exists only to trigger wishlist hydration
 * (which still benefits from knowing when localStorage has been read).
 */

import { useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';

export default function StoreHydration() {
  const setHydrated = useWishlistStore((s) => s.setHydrated);

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  return null;
}


