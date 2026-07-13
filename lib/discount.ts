/**
 * lib/discount.ts — shared discount helpers
 *
 * Used on both client and server so price logic is never duplicated.
 */

export interface DiscountableProduct {
  price: number;
  discountPct?: number | null;
  discountEndsAt?: string | Date | null;
}

/**
 * Returns the active discount percentage for a product.
 * Returns 0 if there is no discount or if it has expired.
 */
export function getActiveDiscountPct(product: DiscountableProduct): number {
  const pct = product.discountPct ?? 0;
  if (pct <= 0) return 0;

  if (product.discountEndsAt) {
    const expiry = new Date(product.discountEndsAt);
    if (!isNaN(expiry.getTime()) && expiry < new Date()) return 0; // expired
  }

  return pct;
}

/**
 * Returns { salePrice, originalPrice, discountPct, isSale, savedAmount }.
 * salePrice === originalPrice when there is no active discount.
 */
export function getEffectivePrice(product: DiscountableProduct) {
  const originalPrice = product.price;
  const pct           = getActiveDiscountPct(product);
  const isSale        = pct > 0;
  const salePrice     = isSale
    ? parseFloat((originalPrice * (1 - pct / 100)).toFixed(2))
    : originalPrice;
  const savedAmount   = parseFloat((originalPrice - salePrice).toFixed(2));

  return { salePrice, originalPrice, discountPct: pct, isSale, savedAmount };
}
