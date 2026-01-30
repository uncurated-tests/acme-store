/**
 * Global State Management Store
 * 
 * Zustand-like state management with React context
 * Provides centralized state for cart, user, and UI
 */

import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import type { Cart, CartItem, User, Product, Wishlist, WishlistItem, Notification } from "./types";

// State Shape
export interface AppState {
  // Cart State
  cart: Cart | null;
  cartLoading: boolean;
  cartError: string | null;
  
  // User State
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  
  // Wishlist State
  wishlists: Wishlist[];
  activeWishlistId: string | null;
  wishlistLoading: boolean;
  
  // UI State
  sidebarOpen: boolean;
  cartDrawerOpen: boolean;
  searchModalOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Recently Viewed
  recentlyViewed: Product[];
  
  // Compare Products
  compareList: Product[];
  
  // Search State
  searchQuery: string;
  searchHistory: string[];
}

// Action Types
export type AppAction =
  // Cart Actions
  | { type: "SET_CART"; payload: Cart }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "REMOVE_COUPON" }
  | { type: "SET_CART_LOADING"; payload: boolean }
  | { type: "SET_CART_ERROR"; payload: string | null }
  
  // User Actions
  | { type: "SET_USER"; payload: User | null }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "SET_AUTH_LOADING"; payload: boolean }
  | { type: "SET_AUTH_ERROR"; payload: string | null }
  | { type: "LOGOUT" }
  
  // Wishlist Actions
  | { type: "SET_WISHLISTS"; payload: Wishlist[] }
  | { type: "ADD_WISHLIST"; payload: Wishlist }
  | { type: "REMOVE_WISHLIST"; payload: string }
  | { type: "ADD_TO_WISHLIST"; payload: { wishlistId: string; item: WishlistItem } }
  | { type: "REMOVE_FROM_WISHLIST"; payload: { wishlistId: string; itemId: string } }
  | { type: "SET_ACTIVE_WISHLIST"; payload: string | null }
  | { type: "SET_WISHLIST_LOADING"; payload: boolean }
  
  // UI Actions
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "TOGGLE_CART_DRAWER" }
  | { type: "SET_CART_DRAWER_OPEN"; payload: boolean }
  | { type: "TOGGLE_SEARCH_MODAL" }
  | { type: "SET_SEARCH_MODAL_OPEN"; payload: boolean }
  | { type: "TOGGLE_MOBILE_MENU" }
  | { type: "SET_MOBILE_MENU_OPEN"; payload: boolean }
  
  // Notification Actions
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  
  // Recently Viewed Actions
  | { type: "ADD_RECENTLY_VIEWED"; payload: Product }
  | { type: "CLEAR_RECENTLY_VIEWED" }
  
  // Compare Actions
  | { type: "ADD_TO_COMPARE"; payload: Product }
  | { type: "REMOVE_FROM_COMPARE"; payload: string }
  | { type: "CLEAR_COMPARE" }
  
  // Search Actions
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "ADD_SEARCH_HISTORY"; payload: string }
  | { type: "CLEAR_SEARCH_HISTORY" };

// Initial State
const initialState: AppState = {
  cart: null,
  cartLoading: false,
  cartError: null,
  
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,
  
  wishlists: [],
  activeWishlistId: null,
  wishlistLoading: false,
  
  sidebarOpen: false,
  cartDrawerOpen: false,
  searchModalOpen: false,
  mobileMenuOpen: false,
  
  notifications: [],
  unreadCount: 0,
  
  recentlyViewed: [],
  
  compareList: [],
  
  searchQuery: "",
  searchHistory: [],
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Cart Reducers
    case "SET_CART":
      return { ...state, cart: action.payload, cartLoading: false, cartError: null };
    
    case "ADD_TO_CART": {
      if (!state.cart) return state;
      const existingIndex = state.cart.items.findIndex(
        item => item.productId === action.payload.productId
      );
      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.cart.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.cart.items, action.payload];
      }
      const newCart = calculateCartTotals({ ...state.cart, items: newItems });
      return { ...state, cart: newCart };
    }
    
    case "REMOVE_FROM_CART": {
      if (!state.cart) return state;
      const newItems = state.cart.items.filter(item => item.productId !== action.payload);
      const newCart = calculateCartTotals({ ...state.cart, items: newItems });
      return { ...state, cart: newCart };
    }
    
    case "UPDATE_CART_QUANTITY": {
      if (!state.cart) return state;
      const newItems = state.cart.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      const newCart = calculateCartTotals({ ...state.cart, items: newItems });
      return { ...state, cart: newCart };
    }
    
    case "CLEAR_CART": {
      if (!state.cart) return state;
      const emptyCart = calculateCartTotals({ ...state.cart, items: [], couponCode: undefined });
      return { ...state, cart: emptyCart };
    }
    
    case "APPLY_COUPON": {
      if (!state.cart) return state;
      const cartWithCoupon = { ...state.cart, couponCode: action.payload };
      return { ...state, cart: calculateCartTotals(cartWithCoupon) };
    }
    
    case "REMOVE_COUPON": {
      if (!state.cart) return state;
      const cartWithoutCoupon = { ...state.cart, couponCode: undefined, discount: 0 };
      return { ...state, cart: calculateCartTotals(cartWithoutCoupon) };
    }
    
    case "SET_CART_LOADING":
      return { ...state, cartLoading: action.payload };
    
    case "SET_CART_ERROR":
      return { ...state, cartError: action.payload, cartLoading: false };
    
    // User Reducers
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        authLoading: false,
        authError: null,
      };
    
    case "UPDATE_USER":
      if (!state.user) return state;
      return { ...state, user: { ...state.user, ...action.payload } };
    
    case "SET_AUTH_LOADING":
      return { ...state, authLoading: action.payload };
    
    case "SET_AUTH_ERROR":
      return { ...state, authError: action.payload, authLoading: false };
    
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        wishlists: [],
        notifications: [],
        unreadCount: 0,
      };
    
    // Wishlist Reducers
    case "SET_WISHLISTS":
      return { ...state, wishlists: action.payload, wishlistLoading: false };
    
    case "ADD_WISHLIST":
      return { ...state, wishlists: [...state.wishlists, action.payload] };
    
    case "REMOVE_WISHLIST":
      return {
        ...state,
        wishlists: state.wishlists.filter(w => w.id !== action.payload),
        activeWishlistId: state.activeWishlistId === action.payload ? null : state.activeWishlistId,
      };
    
    case "ADD_TO_WISHLIST": {
      return {
        ...state,
        wishlists: state.wishlists.map(wishlist =>
          wishlist.id === action.payload.wishlistId
            ? { ...wishlist, items: [...wishlist.items, action.payload.item] }
            : wishlist
        ),
      };
    }
    
    case "REMOVE_FROM_WISHLIST": {
      return {
        ...state,
        wishlists: state.wishlists.map(wishlist =>
          wishlist.id === action.payload.wishlistId
            ? { ...wishlist, items: wishlist.items.filter(item => item.id !== action.payload.itemId) }
            : wishlist
        ),
      };
    }
    
    case "SET_ACTIVE_WISHLIST":
      return { ...state, activeWishlistId: action.payload };
    
    case "SET_WISHLIST_LOADING":
      return { ...state, wishlistLoading: action.payload };
    
    // UI Reducers
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload };
    
    case "TOGGLE_CART_DRAWER":
      return { ...state, cartDrawerOpen: !state.cartDrawerOpen };
    
    case "SET_CART_DRAWER_OPEN":
      return { ...state, cartDrawerOpen: action.payload };
    
    case "TOGGLE_SEARCH_MODAL":
      return { ...state, searchModalOpen: !state.searchModalOpen };
    
    case "SET_SEARCH_MODAL_OPEN":
      return { ...state, searchModalOpen: action.payload };
    
    case "TOGGLE_MOBILE_MENU":
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    
    case "SET_MOBILE_MENU_OPEN":
      return { ...state, mobileMenuOpen: action.payload };
    
    // Notification Reducers
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      };
    
    case "REMOVE_NOTIFICATION":
      const notif = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: notif && !notif.read ? state.unreadCount - 1 : state.unreadCount,
      };
    
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [], unreadCount: 0 };
    
    // Recently Viewed Reducers
    case "ADD_RECENTLY_VIEWED": {
      const filtered = state.recentlyViewed.filter(p => p.id !== action.payload.id);
      const newList = [action.payload, ...filtered].slice(0, 20);
      return { ...state, recentlyViewed: newList };
    }
    
    case "CLEAR_RECENTLY_VIEWED":
      return { ...state, recentlyViewed: [] };
    
    // Compare Reducers
    case "ADD_TO_COMPARE": {
      if (state.compareList.length >= 4) return state;
      if (state.compareList.some(p => p.id === action.payload.id)) return state;
      return { ...state, compareList: [...state.compareList, action.payload] };
    }
    
    case "REMOVE_FROM_COMPARE":
      return {
        ...state,
        compareList: state.compareList.filter(p => p.id !== action.payload),
      };
    
    case "CLEAR_COMPARE":
      return { ...state, compareList: [] };
    
    // Search Reducers
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    
    case "ADD_SEARCH_HISTORY": {
      const filtered = state.searchHistory.filter(q => q !== action.payload);
      const newHistory = [action.payload, ...filtered].slice(0, 10);
      return { ...state, searchHistory: newHistory };
    }
    
    case "CLEAR_SEARCH_HISTORY":
      return { ...state, searchHistory: [] };
    
    default:
      return state;
  }
}

// Helper Functions
function calculateCartTotals(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => {
    const variantModifier = item.selectedVariant?.priceModifier || 0;
    return sum + (item.product.price + variantModifier) * item.quantity;
  }, 0);
  
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  
  const shipping = subtotal > 100 ? 0 : 9.99;
  
  // Simple discount calculation (would be more complex with real coupons)
  const discount = cart.couponCode ? subtotal * 0.1 : 0;
  
  const total = subtotal + tax + shipping - discount;
  
  return {
    ...cart,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    updatedAt: new Date(),
  };
}

// Context
interface StoreContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// Provider Component
interface StoreProviderProps {
  children: ReactNode;
  initialState?: Partial<AppState>;
}

export function StoreProvider({ children, initialState: customInitialState }: StoreProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    ...customInitialState,
  });

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// Hook
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

// Selector Hooks
export function useCart() {
  const { state, dispatch } = useStore();
  return {
    cart: state.cart,
    loading: state.cartLoading,
    error: state.cartError,
    itemCount: state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    dispatch,
  };
}

export function useUser() {
  const { state, dispatch } = useStore();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.authLoading,
    error: state.authError,
    dispatch,
  };
}

export function useWishlists() {
  const { state, dispatch } = useStore();
  return {
    wishlists: state.wishlists,
    activeWishlist: state.wishlists.find(w => w.id === state.activeWishlistId) || null,
    loading: state.wishlistLoading,
    dispatch,
  };
}

export function useUI() {
  const { state, dispatch } = useStore();
  return {
    sidebarOpen: state.sidebarOpen,
    cartDrawerOpen: state.cartDrawerOpen,
    searchModalOpen: state.searchModalOpen,
    mobileMenuOpen: state.mobileMenuOpen,
    dispatch,
  };
}

export function useNotifications() {
  const { state, dispatch } = useStore();
  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    dispatch,
  };
}

export function useRecentlyViewed() {
  const { state, dispatch } = useStore();
  return {
    products: state.recentlyViewed,
    dispatch,
  };
}

export function useCompare() {
  const { state, dispatch } = useStore();
  return {
    products: state.compareList,
    canAdd: state.compareList.length < 4,
    dispatch,
  };
}

export function useSearch() {
  const { state, dispatch } = useStore();
  return {
    query: state.searchQuery,
    history: state.searchHistory,
    dispatch,
  };
}
