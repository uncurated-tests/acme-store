/**
 * Cart Management Module
 * 
 * Handles cart operations, persistence, and calculations
 */

import type { Cart, CartItem, Product, ProductVariant, Coupon } from "./types";

// Storage key for cart persistence
const CART_STORAGE_KEY = "acme_store_cart";

// Mock coupon database
const coupons: Map<string, Coupon> = new Map([
  [
    "SAVE10",
    {
      id: "coupon_001",
      code: "SAVE10",
      type: "percentage",
      value: 10,
      minOrderAmount: 50,
      usageLimit: 100,
      usageCount: 45,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      active: true,
    },
  ],
  [
    "FLAT20",
    {
      id: "coupon_002",
      code: "FLAT20",
      type: "fixed",
      value: 20,
      minOrderAmount: 100,
      usageLimit: 50,
      usageCount: 12,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      active: true,
    },
  ],
  [
    "FREESHIP",
    {
      id: "coupon_003",
      code: "FREESHIP",
      type: "free_shipping",
      value: 0,
      usageLimit: 200,
      usageCount: 89,
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      active: true,
    },
  ],
]);

// Create a new cart
export function createCart(userId: string | null = null): Cart {
  return {
    id: `cart_${Date.now()}`,
    userId,
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Add item to cart
export function addToCart(
  cart: Cart,
  product: Product,
  quantity: number = 1,
  variant?: ProductVariant
): Cart {
  const existingIndex = cart.items.findIndex(
    item =>
      item.productId === product.id &&
      item.selectedVariant?.id === variant?.id
  );

  let newItems: CartItem[];

  if (existingIndex >= 0) {
    // Update existing item quantity
    newItems = cart.items.map((item, index) =>
      index === existingIndex
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    // Add new item
    const newItem: CartItem = {
      productId: product.id,
      product,
      quantity,
      selectedVariant: variant,
      addedAt: new Date(),
    };
    newItems = [...cart.items, newItem];
  }

  return recalculateCart({ ...cart, items: newItems });
}

// Remove item from cart
export function removeFromCart(cart: Cart, productId: string, variantId?: string): Cart {
  const newItems = cart.items.filter(
    item =>
      !(item.productId === productId &&
        (variantId ? item.selectedVariant?.id === variantId : true))
  );

  return recalculateCart({ ...cart, items: newItems });
}

// Update item quantity
export function updateCartItemQuantity(
  cart: Cart,
  productId: string,
  quantity: number,
  variantId?: string
): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, productId, variantId);
  }

  const newItems = cart.items.map(item => {
    if (
      item.productId === productId &&
      (variantId ? item.selectedVariant?.id === variantId : true)
    ) {
      // Check stock
      const maxQuantity = item.product.stock + (item.selectedVariant?.stockModifier || 0);
      const newQuantity = Math.min(quantity, maxQuantity);
      return { ...item, quantity: newQuantity };
    }
    return item;
  });

  return recalculateCart({ ...cart, items: newItems });
}

// Clear cart
export function clearCart(cart: Cart): Cart {
  return recalculateCart({
    ...cart,
    items: [],
    couponCode: undefined,
    discount: 0,
  });
}

// Apply coupon code
export async function applyCoupon(
  cart: Cart,
  code: string
): Promise<{ success: boolean; cart: Cart; error?: string }> {
  const coupon = coupons.get(code.toUpperCase());

  if (!coupon) {
    return { success: false, cart, error: "Invalid coupon code" };
  }

  if (!coupon.active) {
    return { success: false, cart, error: "This coupon is no longer active" };
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return { success: false, cart, error: "This coupon has expired" };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { success: false, cart, error: "This coupon has reached its usage limit" };
  }

  if (coupon.minOrderAmount && cart.subtotal < coupon.minOrderAmount) {
    return {
      success: false,
      cart,
      error: `Minimum order amount of $${coupon.minOrderAmount.toFixed(2)} required`,
    };
  }

  // Check category restrictions
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const hasApplicableItem = cart.items.some(item =>
      coupon.applicableCategories!.includes(item.product.category)
    );
    if (!hasApplicableItem) {
      return {
        success: false,
        cart,
        error: "This coupon is not applicable to items in your cart",
      };
    }
  }

  const newCart = recalculateCart({ ...cart, couponCode: code.toUpperCase() });
  return { success: true, cart: newCart };
}

// Remove coupon
export function removeCoupon(cart: Cart): Cart {
  return recalculateCart({ ...cart, couponCode: undefined });
}

// Recalculate cart totals
export function recalculateCart(cart: Cart): Cart {
  // Calculate subtotal
  const subtotal = cart.items.reduce((sum, item) => {
    const basePrice = item.product.price;
    const variantModifier = item.selectedVariant?.priceModifier || 0;
    return sum + (basePrice + variantModifier) * item.quantity;
  }, 0);

  // Calculate shipping
  let shipping = 0;
  if (subtotal > 0) {
    if (subtotal >= 100) {
      shipping = 0; // Free shipping over $100
    } else if (subtotal >= 50) {
      shipping = 5.99;
    } else {
      shipping = 9.99;
    }
  }

  // Calculate discount
  let discount = 0;
  if (cart.couponCode) {
    const coupon = coupons.get(cart.couponCode);
    if (coupon) {
      switch (coupon.type) {
        case "percentage":
          discount = subtotal * (coupon.value / 100);
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
          break;
        case "fixed":
          discount = Math.min(coupon.value, subtotal);
          break;
        case "free_shipping":
          shipping = 0;
          break;
      }
    }
  }

  // Calculate tax (8% of subtotal after discount)
  const taxableAmount = subtotal - discount;
  const taxRate = 0.08;
  const tax = taxableAmount * taxRate;

  // Calculate total
  const total = subtotal + tax + shipping - discount;

  return {
    ...cart,
    subtotal: roundToTwo(subtotal),
    tax: roundToTwo(tax),
    shipping: roundToTwo(shipping),
    discount: roundToTwo(discount),
    total: roundToTwo(Math.max(0, total)),
    updatedAt: new Date(),
  };
}

// Helper to round to 2 decimal places
function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100;
}

// Cart persistence functions
export function saveCartToStorage(cart: Cart): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }
}

export function loadCartFromStorage(): Cart | null {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const cart = JSON.parse(stored);
        // Rehydrate dates
        cart.createdAt = new Date(cart.createdAt);
        cart.updatedAt = new Date(cart.updatedAt);
        cart.items = cart.items.map((item: CartItem) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        return cart;
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
    }
  }
  return null;
}

export function clearCartStorage(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart storage:", error);
    }
  }
}

// Merge guest cart with user cart
export function mergeCarts(guestCart: Cart, userCart: Cart): Cart {
  let mergedCart = { ...userCart };

  // Add guest cart items to user cart
  for (const guestItem of guestCart.items) {
    mergedCart = addToCart(
      mergedCart,
      guestItem.product,
      guestItem.quantity,
      guestItem.selectedVariant
    );
  }

  return mergedCart;
}

// Validate cart (check stock, prices)
export function validateCart(cart: Cart): {
  valid: boolean;
  issues: CartIssue[];
  updatedCart: Cart;
} {
  const issues: CartIssue[] = [];
  let updatedItems = [...cart.items];

  for (const item of updatedItems) {
    // Check stock
    const availableStock = item.product.stock + (item.selectedVariant?.stockModifier || 0);
    if (item.quantity > availableStock) {
      if (availableStock === 0) {
        issues.push({
          type: "out_of_stock",
          productId: item.productId,
          message: `${item.product.name} is out of stock`,
        });
        updatedItems = updatedItems.filter(i => i.productId !== item.productId);
      } else {
        issues.push({
          type: "quantity_adjusted",
          productId: item.productId,
          message: `${item.product.name} quantity reduced to ${availableStock} (max available)`,
        });
        updatedItems = updatedItems.map(i =>
          i.productId === item.productId ? { ...i, quantity: availableStock } : i
        );
      }
    }

    // Check price changes
    // In real app, would fetch current price from server
  }

  const updatedCart = recalculateCart({ ...cart, items: updatedItems });

  return {
    valid: issues.length === 0,
    issues,
    updatedCart,
  };
}

interface CartIssue {
  type: "out_of_stock" | "quantity_adjusted" | "price_changed" | "item_unavailable";
  productId: string;
  message: string;
}

// Get cart summary
export function getCartSummary(cart: Cart): CartSummary {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItemCount = cart.items.length;
  const savings = cart.items.reduce((sum, item) => {
    if (item.product.originalPrice) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0) + cart.discount;

  return {
    itemCount,
    uniqueItemCount,
    subtotal: cart.subtotal,
    tax: cart.tax,
    shipping: cart.shipping,
    discount: cart.discount,
    total: cart.total,
    savings: roundToTwo(savings),
    freeShippingThreshold: 100,
    amountToFreeShipping: Math.max(0, 100 - cart.subtotal),
    hasCoupon: !!cart.couponCode,
    couponCode: cart.couponCode,
  };
}

interface CartSummary {
  itemCount: number;
  uniqueItemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  savings: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  hasCoupon: boolean;
  couponCode?: string;
}

// Estimate delivery
export function estimateDelivery(cart: Cart, postalCode: string): DeliveryEstimate {
  // Mock delivery estimation based on postal code
  const baseDeliveryDays = 5;
  const expressDays = 2;
  const overnightDays = 1;

  const now = new Date();
  
  const addBusinessDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        added++;
      }
    }
    return result;
  };

  return {
    standard: {
      estimatedDate: addBusinessDays(now, baseDeliveryDays),
      price: cart.shipping,
      name: "Standard Shipping",
    },
    express: {
      estimatedDate: addBusinessDays(now, expressDays),
      price: 14.99,
      name: "Express Shipping",
    },
    overnight: {
      estimatedDate: addBusinessDays(now, overnightDays),
      price: 29.99,
      name: "Overnight Shipping",
    },
  };
}

interface DeliveryOption {
  estimatedDate: Date;
  price: number;
  name: string;
}

interface DeliveryEstimate {
  standard: DeliveryOption;
  express: DeliveryOption;
  overnight: DeliveryOption;
}
