/**
 * Discount Calculator Module
 * 
 * Handles discount calculations, coupon validation, and promotional pricing
 */

export type DiscountType = "percentage" | "fixed" | "bogo" | "tiered";

export interface Coupon {
  code: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  applicableCategories?: string[];
  excludedProducts?: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface DiscountResult {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  appliedCoupon?: string;
  savings: number;
  savingsPercentage: number;
}

export interface TieredDiscount {
  threshold: number;
  discountPercent: number;
}

// Tiered discount configuration
export const TIERED_DISCOUNTS: TieredDiscount[] = [
  { threshold: 50, discountPercent: 5 },
  { threshold: 100, discountPercent: 10 },
  { threshold: 200, discountPercent: 15 },
  { threshold: 500, discountPercent: 20 },
];

/**
 * Calculate the subtotal of cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Validate if a coupon is currently valid
 */
export function isCouponValid(coupon: Coupon): boolean {
  const now = new Date();
  
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return false;
  }
  
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return false;
  }
  
  return true;
}

/**
 * Check if coupon is applicable to cart items
 */
export function isCouponApplicable(coupon: Coupon, items: CartItem[], subtotal: number): boolean {
  if (!isCouponValid(coupon)) {
    return false;
  }
  
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return false;
  }
  
  // Check if any items are in applicable categories
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const hasApplicableItem = items.some(
      (item) => coupon.applicableCategories!.includes(item.category)
    );
    if (!hasApplicableItem) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calculate percentage discount
 */
export function calculatePercentageDiscount(
  subtotal: number,
  percentage: number,
  maxDiscount?: number
): number {
  const discount = subtotal * (percentage / 100);
  
  if (maxDiscount && discount > maxDiscount) {
    return maxDiscount;
  }
  
  return discount;
}

/**
 * Calculate fixed amount discount
 */
export function calculateFixedDiscount(subtotal: number, amount: number): number {
  // Don't allow discount to exceed subtotal
  return Math.min(amount, subtotal);
}

/**
 * Calculate Buy One Get One discount
 * Applies to the cheapest eligible item
 */
export function calculateBogoDiscount(items: CartItem[], applicableCategories?: string[]): number {
  let eligibleItems = items;
  
  if (applicableCategories && applicableCategories.length > 0) {
    eligibleItems = items.filter((item) => applicableCategories.includes(item.category));
  }
  
  if (eligibleItems.length === 0) {
    return 0;
  }
  
  // Sort by price ascending to find cheapest
  const sorted = [...eligibleItems].sort((a, b) => a.price - b.price);
  
  // Calculate how many free items (one free for every two purchased)
  const totalQuantity = sorted.reduce((sum, item) => sum + item.quantity, 0);
  const freeItems = Math.floor(totalQuantity / 2);
  
  if (freeItems === 0) {
    return 0;
  }
  
  // Calculate discount based on cheapest items
  let discount = 0;
  let remainingFree = freeItems;
  
  for (const item of sorted) {
    const freeFromThis = Math.min(remainingFree, item.quantity);
    discount += freeFromThis * item.price;
    remainingFree -= freeFromThis;
    
    if (remainingFree <= 0) break;
  }
  
  return discount;
}

/**
 * Calculate tiered discount based on subtotal
 */
export function calculateTieredDiscount(subtotal: number): number {
  // Find the highest applicable tier
  const applicableTier = TIERED_DISCOUNTS
    .filter((tier) => subtotal >= tier.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];
  
  if (!applicableTier) {
    return 0;
  }
  
  return subtotal * (applicableTier.discountPercent / 100);
}

/**
 * Get the current tier and next tier info
 */
export function getTierInfo(subtotal: number): {
  currentTier: TieredDiscount | null;
  nextTier: TieredDiscount | null;
  amountToNextTier: number | null;
} {
  const sortedTiers = [...TIERED_DISCOUNTS].sort((a, b) => a.threshold - b.threshold);
  
  let currentTier: TieredDiscount | null = null;
  let nextTier: TieredDiscount | null = null;
  
  for (let i = 0; i < sortedTiers.length; i++) {
    if (subtotal >= sortedTiers[i].threshold) {
      currentTier = sortedTiers[i];
      nextTier = sortedTiers[i + 1] || null;
    }
  }
  
  // If no current tier, next tier is the first one
  if (!currentTier && sortedTiers.length > 0) {
    nextTier = sortedTiers[0];
  }
  
  const amountToNextTier = nextTier ? nextTier.threshold - subtotal : null;
  
  return { currentTier, nextTier, amountToNextTier };
}

/**
 * Apply a coupon to calculate total discount
 */
export function applyCoupon(coupon: Coupon, items: CartItem[]): DiscountResult {
  const subtotal = calculateSubtotal(items);
  
  if (!isCouponApplicable(coupon, items, subtotal)) {
    return {
      originalTotal: subtotal,
      discountAmount: 0,
      finalTotal: subtotal,
      savings: 0,
      savingsPercentage: 0,
    };
  }
  
  let discountAmount: number;
  
  switch (coupon.type) {
    case "percentage":
      discountAmount = calculatePercentageDiscount(subtotal, coupon.value, coupon.maxDiscount);
      break;
    case "fixed":
      discountAmount = calculateFixedDiscount(subtotal, coupon.value);
      break;
    case "bogo":
      discountAmount = calculateBogoDiscount(items, coupon.applicableCategories);
      break;
    case "tiered":
      discountAmount = calculateTieredDiscount(subtotal);
      break;
    default:
      discountAmount = 0;
  }
  
  const finalTotal = subtotal - discountAmount;
  
  return {
    originalTotal: subtotal,
    discountAmount,
    finalTotal,
    appliedCoupon: coupon.code,
    savings: discountAmount,
    savingsPercentage: (discountAmount / subtotal) * 100,
  };
}

/**
 * Calculate the best automatic discount (no coupon required)
 */
export function calculateBestDiscount(items: CartItem[]): DiscountResult {
  const subtotal = calculateSubtotal(items);
  
  // Apply tiered discount automatically
  const tieredDiscount = calculateTieredDiscount(subtotal);
  
  const finalTotal = subtotal - tieredDiscount;
  
  return {
    originalTotal: subtotal,
    discountAmount: tieredDiscount,
    finalTotal,
    savings: tieredDiscount,
    savingsPercentage: subtotal > 0 ? (tieredDiscount / subtotal) * 100 : 0,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Validate coupon code format
 */
export function isValidCouponFormat(code: string): boolen {
  // Coupon codes should be 4-20 alphanumeric characters
  const pattern = /^[A-Z0-9]{4,20}$/;
  return pattern.test(code.toUpperCase());
}

/**
 * Generate a summary message for the discount
 */
export function getDiscountSummary(result: DiscountResult): string {
  if (result.discountAmount === 0) {
    return "No discount applied";
  }
  
  const savings = formatCurrency(result.savings);
  const percentage = formatPercentage(result.savingsPercentage);
  
  if (result.appliedCoupon) {
    return `Coupon ${result.appliedCoupon} applied! You saved ${savings} (${percentage})`;
  }
  
  return `You saved ${savings} (${percentage}) with automatic discount`;
}
