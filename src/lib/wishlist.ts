/**
 * Wishlist Management Module
 * 
 * Handles wishlists, sharing, and notifications
 */

import type { Wishlist, WishlistItem, Product } from "./types";

// Mock wishlist storage
const wishlists: Map<string, Wishlist> = new Map();

// Storage key for guest wishlists
const WISHLIST_STORAGE_KEY = "acme_store_wishlist";

// Create a new wishlist
export function createWishlist(
  userId: string,
  name: string = "My Wishlist",
  isPublic: boolean = false
): Wishlist {
  const wishlist: Wishlist = {
    id: `wishlist_${Date.now()}`,
    userId,
    name,
    items: [],
    isPublic,
    shareToken: isPublic ? generateShareToken() : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  wishlists.set(wishlist.id, wishlist);
  return wishlist;
}

// Generate share token
function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get user's wishlists
export async function getUserWishlists(userId: string): Promise<Wishlist[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const userWishlists: Wishlist[] = [];
  for (const wishlist of wishlists.values()) {
    if (wishlist.userId === userId) {
      userWishlists.push(wishlist);
    }
  }
  
  return userWishlists.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

// Get wishlist by ID
export async function getWishlist(wishlistId: string): Promise<Wishlist | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return wishlists.get(wishlistId) || null;
}

// Get wishlist by share token
export async function getWishlistByShareToken(token: string): Promise<Wishlist | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  for (const wishlist of wishlists.values()) {
    if (wishlist.shareToken === token && wishlist.isPublic) {
      return wishlist;
    }
  }
  return null;
}

// Add item to wishlist
export async function addToWishlist(
  wishlistId: string,
  product: Product,
  options?: {
    notifyOnSale?: boolean;
    notifyOnRestock?: boolean;
  }
): Promise<{ success: boolean; wishlist?: Wishlist; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const wishlist = wishlists.get(wishlistId);
  if (!wishlist) {
    return { success: false, error: "Wishlist not found" };
  }
  
  // Check if item already exists
  if (wishlist.items.some(item => item.productId === product.id)) {
    return { success: false, error: "Item already in wishlist" };
  }
  
  const newItem: WishlistItem = {
    id: `wi_${Date.now()}`,
    productId: product.id,
    product,
    addedAt: new Date(),
    notifyOnSale: options?.notifyOnSale ?? false,
    notifyOnRestock: options?.notifyOnRestock ?? false,
    priceAtAdd: product.price,
  };
  
  wishlist.items.push(newItem);
  wishlist.updatedAt = new Date();
  
  return { success: true, wishlist };
}

// Remove item from wishlist
export async function removeFromWishlist(
  wishlistId: string,
  itemId: string
): Promise<{ success: boolean; wishlist?: Wishlist; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const wishlist = wishlists.get(wishlistId);
  if (!wishlist) {
    return { success: false, error: "Wishlist not found" };
  }
  
  const initialLength = wishlist.items.length;
  wishlist.items = wishlist.items.filter(item => item.id !== itemId);
  
  if (wishlist.items.length === initialLength) {
    return { success: false, error: "Item not found in wishlist" };
  }
  
  wishlist.updatedAt = new Date();
  return { success: true, wishlist };
}

// Update wishlist item notifications
export async function updateWishlistItemNotifications(
  wishlistId: string,
  itemId: string,
  notifications: { notifyOnSale?: boolean; notifyOnRestock?: boolean }
): Promise<{ success: boolean; wishlist?: Wishlist; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const wishlist = wishlists.get(wishlistId);
  if (!wishlist) {
    return { success: false, error: "Wishlist not found" };
  }
  
  const item = wishlist.items.find(i => i.id === itemId);
  if (!item) {
    return { success: false, error: "Item not found in wishlist" };
  }
  
  if (notifications.notifyOnSale !== undefined) {
    item.notifyOnSale = notifications.notifyOnSale;
  }
  if (notifications.notifyOnRestock !== undefined) {
    item.notifyOnRestock = notifications.notifyOnRestock;
  }
  
  wishlist.updatedAt = new Date();
  return { success: true, wishlist };
}

// Update wishlist details
export async function updateWishlist(
  wishlistId: string,
  updates: { name?: string; isPublic?: boolean }
): Promise<{ success: boolean; wishlist?: Wishlist; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const wishlist = wishlists.get(wishlistId);
  if (!wishlist) {
    return { success: false, error: "Wishlist not found" };
  }
  
  if (updates.name !== undefined) {
    wishlist.name = updates.name;
  }
  
  if (updates.isPublic !== undefined) {
    wishlist.isPublic = updates.isPublic;
    if (updates.isPublic && !wishlist.shareToken) {
      wishlist.shareToken = generateShareToken();
    }
  }
  
  wishlist.updatedAt = new Date();
  return { success: true, wishlist };
}

// Delete wishlist
export async function deleteWishlist(
  wishlistId: string
): Promise<{ success: boolean; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!wishlists.has(wishlistId)) {
    return { success: false, error: "Wishlist not found" };
  }
  
  wishlists.delete(wishlistId);
  return { success: true };
}

// Move item between wishlists
export async function moveWishlistItem(
  sourceWishlistId: string,
  targetWishlistId: string,
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sourceWishlist = wishlists.get(sourceWishlistId);
  const targetWishlist = wishlists.get(targetWishlistId);
  
  if (!sourceWishlist || !targetWishlist) {
    return { success: false, error: "Wishlist not found" };
  }
  
  const itemIndex = sourceWishlist.items.findIndex(i => i.id === itemId);
  if (itemIndex === -1) {
    return { success: false, error: "Item not found in source wishlist" };
  }
  
  // Check if item already exists in target
  const item = sourceWishlist.items[itemIndex];
  if (targetWishlist.items.some(i => i.productId === item.productId)) {
    return { success: false, error: "Item already exists in target wishlist" };
  }
  
  // Move item
  sourceWishlist.items.splice(itemIndex, 1);
  targetWishlist.items.push({ ...item, id: `wi_${Date.now()}` });
  
  sourceWishlist.updatedAt = new Date();
  targetWishlist.updatedAt = new Date();
  
  return { success: true };
}

// Copy item to another wishlist
export async function copyWishlistItem(
  sourceWishlistId: string,
  targetWishlistId: string,
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sourceWishlist = wishlists.get(sourceWishlistId);
  const targetWishlist = wishlists.get(targetWishlistId);
  
  if (!sourceWishlist || !targetWishlist) {
    return { success: false, error: "Wishlist not found" };
  }
  
  const item = sourceWishlist.items.find(i => i.id === itemId);
  if (!item) {
    return { success: false, error: "Item not found in source wishlist" };
  }
  
  // Check if item already exists in target
  if (targetWishlist.items.some(i => i.productId === item.productId)) {
    return { success: false, error: "Item already exists in target wishlist" };
  }
  
  // Copy item
  targetWishlist.items.push({
    ...item,
    id: `wi_${Date.now()}`,
    addedAt: new Date(),
  });
  
  targetWishlist.updatedAt = new Date();
  
  return { success: true };
}

// Check price changes for wishlist items
export function checkPriceChanges(wishlist: Wishlist): WishlistPriceChange[] {
  const changes: WishlistPriceChange[] = [];
  
  for (const item of wishlist.items) {
    const currentPrice = item.product.price;
    const addedPrice = item.priceAtAdd;
    
    if (currentPrice !== addedPrice) {
      const priceDiff = currentPrice - addedPrice;
      const percentChange = (priceDiff / addedPrice) * 100;
      
      changes.push({
        itemId: item.id,
        productId: item.productId,
        productName: item.product.name,
        oldPrice: addedPrice,
        newPrice: currentPrice,
        priceDifference: priceDiff,
        percentChange,
        direction: priceDiff > 0 ? "increased" : "decreased",
      });
    }
  }
  
  return changes;
}

interface WishlistPriceChange {
  itemId: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  priceDifference: number;
  percentChange: number;
  direction: "increased" | "decreased";
}

// Get wishlist statistics
export function getWishlistStats(wishlist: Wishlist): WishlistStats {
  const itemCount = wishlist.items.length;
  const totalValue = wishlist.items.reduce((sum, item) => sum + item.product.price, 0);
  const averagePrice = itemCount > 0 ? totalValue / itemCount : 0;
  
  const outOfStockCount = wishlist.items.filter(item => item.product.stock === 0).length;
  const onSaleCount = wishlist.items.filter(item => item.product.onSale).length;
  
  const potentialSavings = wishlist.items.reduce((sum, item) => {
    if (item.product.originalPrice) {
      return sum + (item.product.originalPrice - item.product.price);
    }
    return sum;
  }, 0);
  
  const categoryCounts: Record<string, number> = {};
  wishlist.items.forEach(item => {
    const category = item.product.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  return {
    itemCount,
    totalValue,
    averagePrice,
    outOfStockCount,
    onSaleCount,
    potentialSavings,
    categoryCounts,
    oldestItem: wishlist.items.length > 0
      ? wishlist.items.reduce((oldest, item) =>
          item.addedAt < oldest.addedAt ? item : oldest
        )
      : null,
    newestItem: wishlist.items.length > 0
      ? wishlist.items.reduce((newest, item) =>
          item.addedAt > newest.addedAt ? item : newest
        )
      : null,
  };
}

interface WishlistStats {
  itemCount: number;
  totalValue: number;
  averagePrice: number;
  outOfStockCount: number;
  onSaleCount: number;
  potentialSavings: number;
  categoryCounts: Record<string, number>;
  oldestItem: WishlistItem | null;
  newestItem: WishlistItem | null;
}

// Local storage functions for guest wishlists
export function saveWishlistToStorage(items: WishlistItem[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist to storage:", error);
    }
  }
}

export function loadWishlistFromStorage(): WishlistItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        return items.map((item: WishlistItem) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
      }
    } catch (error) {
      console.error("Failed to load wishlist from storage:", error);
    }
  }
  return [];
}

export function clearWishlistStorage(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear wishlist storage:", error);
    }
  }
}

// Initialize demo wishlist
export function initializeDemoWishlist(userId: string): void {
  const demoWishlist = createWishlist(userId, "My Wishlist", false);
  wishlists.set(demoWishlist.id, demoWishlist);
}
