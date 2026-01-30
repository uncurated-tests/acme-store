/**
 * Core Type Definitions
 * 
 * Centralized type definitions for the entire application
 */

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  subcategory: string;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  tags: string[];
  specifications: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  onSale: boolean;
}

export type ProductCategory = 
  | "electronics"
  | "clothing"
  | "home"
  | "sports"
  | "books"
  | "beauty"
  | "toys"
  | "automotive";

export interface ProductFilter {
  categories?: ProductCategory[];
  priceRange?: { min: number; max: number };
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  tags?: string[];
  searchQuery?: string;
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "popular";
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: "color" | "size" | "material" | "style";
  value: string;
  priceModifier: number;
  stockModifier: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  preferences: UserPreferences;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  emailVerified: boolean;
  role: UserRole;
}

export type UserRole = "customer" | "admin" | "moderator";

export interface UserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  currency: string;
  language: string;
  theme: "light" | "dark" | "system";
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  type: "shipping" | "billing" | "both";
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "paypal" | "apple_pay" | "google_pay";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  billingAddressId?: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  timeline: OrderTimelineEvent[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant?: ProductVariant;
}

export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "returned";

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  description: string;
  timestamp: Date;
  location?: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: Date;
  notifyOnSale: boolean;
  notifyOnRestock: boolean;
  priceAtAdd: number;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  items: WishlistItem[];
  isPublic: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  response?: ReviewResponse;
}

export interface ReviewResponse {
  content: string;
  respondedBy: string;
  respondedAt: Date;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  applicableCategories?: ProductCategory[];
  applicableProducts?: string[];
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom: Date;
  validUntil: Date;
  active: boolean;
}

// Search Types
export interface SearchResult {
  products: Product[];
  totalCount: number;
  facets: SearchFacets;
  suggestions: string[];
  correctedQuery?: string;
}

export interface SearchFacets {
  categories: FacetItem[];
  priceRanges: FacetItem[];
  ratings: FacetItem[];
  tags: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
  selected: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | "order_update"
  | "price_drop"
  | "back_in_stock"
  | "review_response"
  | "promotion"
  | "system";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

// Form Types
export interface ValidationRule {
  type: "required" | "email" | "phone" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: string | number | RegExp;
  message: string;
  validator?: (value: unknown) => boolean;
}

export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};
