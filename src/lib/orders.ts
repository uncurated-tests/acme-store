/**
 * Order Management Module
 * 
 * Handles order creation, tracking, and history
 */

import type { Order, OrderItem, OrderStatus, OrderTimelineEvent, Cart, Address, PaymentMethod } from "./types";

// Mock order storage
const orders: Map<string, Order> = new Map();

// Helper to generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Helper to generate tracking number
function generateTrackingNumber(): string {
  const carriers = ["1Z", "94", "92", "420"];
  const prefix = carriers[Math.floor(Math.random() * carriers.length)];
  const numbers = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
  return `${prefix}${numbers}`;
}

// Create order from cart
export async function createOrder(
  cart: Cart,
  shippingAddress: Address,
  billingAddress: Address,
  paymentMethod: PaymentMethod
): Promise<{ success: boolean; order?: Order; error?: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!cart.userId) {
    return { success: false, error: "User must be logged in to place an order" };
  }
  
  if (cart.items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }
  
  // Create order items
  const orderItems: OrderItem[] = cart.items.map((item, index) => ({
    id: `oi_${Date.now()}_${index}`,
    productId: item.productId,
    productName: item.product.name,
    productImage: item.product.thumbnail,
    quantity: item.quantity,
    unitPrice: item.product.price + (item.selectedVariant?.priceModifier || 0),
    totalPrice: (item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity,
    variant: item.selectedVariant,
  }));
  
  // Create timeline
  const timeline: OrderTimelineEvent[] = [
    {
      id: `ote_${Date.now()}`,
      status: "pending",
      description: "Order placed successfully",
      timestamp: new Date(),
    },
  ];
  
  // Calculate estimated delivery (5-7 business days)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5 + Math.floor(Math.random() * 3));
  
  const order: Order = {
    id: `order_${Date.now()}`,
    orderNumber: generateOrderNumber(),
    userId: cart.userId,
    items: orderItems,
    status: "pending",
    shippingAddress,
    billingAddress,
    paymentMethod,
    subtotal: cart.subtotal,
    tax: cart.tax,
    shipping: cart.shipping,
    discount: cart.discount,
    total: cart.total,
    couponCode: cart.couponCode,
    estimatedDelivery,
    createdAt: new Date(),
    updatedAt: new Date(),
    timeline,
  };
  
  // Store order
  orders.set(order.id, order);
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update status to confirmed
  order.status = "confirmed";
  order.paidAt = new Date();
  order.timeline.push({
    id: `ote_${Date.now()}`,
    status: "confirmed",
    description: "Payment confirmed",
    timestamp: new Date(),
  });
  
  return { success: true, order };
}

// Get order by ID
export async function getOrder(orderId: string): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return orders.get(orderId) || null;
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  for (const order of orders.values()) {
    if (order.orderNumber === orderNumber) {
      return order;
    }
  }
  return null;
}

// Get user's orders
export async function getUserOrders(
  userId: string,
  options?: {
    status?: OrderStatus;
    limit?: number;
    offset?: number;
    sortBy?: "date" | "total";
    sortOrder?: "asc" | "desc";
  }
): Promise<{ orders: Order[]; total: number }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let userOrders = Array.from(orders.values()).filter(o => o.userId === userId);
  
  // Filter by status
  if (options?.status) {
    userOrders = userOrders.filter(o => o.status === options.status);
  }
  
  // Sort
  const sortBy = options?.sortBy || "date";
  const sortOrder = options?.sortOrder || "desc";
  
  userOrders.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = a.createdAt.getTime() - b.createdAt.getTime();
    } else if (sortBy === "total") {
      comparison = a.total - b.total;
    }
    return sortOrder === "desc" ? -comparison : comparison;
  });
  
  const total = userOrders.length;
  
  // Paginate
  const offset = options?.offset || 0;
  const limit = options?.limit || 10;
  userOrders = userOrders.slice(offset, offset + limit);
  
  return { orders: userOrders, total };
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  details?: { description?: string; location?: string; trackingNumber?: string; carrier?: string }
): Promise<{ success: boolean; order?: Order; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const order = orders.get(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  // Validate status transition
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["out_for_delivery", "delivered"],
    out_for_delivery: ["delivered"],
    delivered: ["returned"],
    cancelled: [],
    refunded: [],
    returned: ["refunded"],
  };
  
  if (!validTransitions[order.status].includes(status)) {
    return {
      success: false,
      error: `Cannot transition from ${order.status} to ${status}`,
    };
  }
  
  // Update order
  order.status = status;
  order.updatedAt = new Date();
  
  // Add timeline event
  const timelineEvent: OrderTimelineEvent = {
    id: `ote_${Date.now()}`,
    status,
    description: details?.description || getDefaultStatusDescription(status),
    timestamp: new Date(),
    location: details?.location,
  };
  order.timeline.push(timelineEvent);
  
  // Update specific fields based on status
  switch (status) {
    case "shipped":
      order.shippedAt = new Date();
      order.trackingNumber = details?.trackingNumber || generateTrackingNumber();
      order.carrier = details?.carrier || "UPS";
      break;
    case "delivered":
      order.deliveredAt = new Date();
      break;
    case "cancelled":
      order.cancelledAt = new Date();
      break;
  }
  
  return { success: true, order };
}

function getDefaultStatusDescription(status: OrderStatus): string {
  const descriptions: Record<OrderStatus, string> = {
    pending: "Order is being processed",
    confirmed: "Order has been confirmed",
    processing: "Order is being prepared for shipment",
    shipped: "Order has been shipped",
    out_for_delivery: "Order is out for delivery",
    delivered: "Order has been delivered",
    cancelled: "Order has been cancelled",
    refunded: "Order has been refunded",
    returned: "Order has been returned",
  };
  return descriptions[status];
}

// Cancel order
export async function cancelOrder(
  orderId: string,
  reason?: string
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const order = orders.get(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  // Can only cancel pending, confirmed, or processing orders
  if (!["pending", "confirmed", "processing"].includes(order.status)) {
    return {
      success: false,
      error: "Order cannot be cancelled at this stage",
    };
  }
  
  return updateOrderStatus(orderId, "cancelled", {
    description: reason ? `Cancelled: ${reason}` : "Order cancelled by customer",
  });
}

// Request return
export async function requestReturn(
  orderId: string,
  itemIds: string[],
  reason: string
): Promise<{ success: boolean; returnId?: string; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const order = orders.get(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  if (order.status !== "delivered") {
    return { success: false, error: "Order must be delivered to request a return" };
  }
  
  // Check if within return window (30 days)
  const returnWindow = 30 * 24 * 60 * 60 * 1000;
  if (order.deliveredAt && Date.now() - order.deliveredAt.getTime() > returnWindow) {
    return { success: false, error: "Return window has expired (30 days)" };
  }
  
  // Generate return ID
  const returnId = `ret_${Date.now()}`;
  
  // In real implementation, would create a return request record
  
  return { success: true, returnId };
}

// Track shipment
export async function trackShipment(
  trackingNumber: string
): Promise<{ success: boolean; events?: TrackingEvent[]; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find order with this tracking number
  let foundOrder: Order | null = null;
  for (const order of orders.values()) {
    if (order.trackingNumber === trackingNumber) {
      foundOrder = order;
      break;
    }
  }
  
  if (!foundOrder) {
    return { success: false, error: "Tracking number not found" };
  }
  
  // Generate mock tracking events based on order status
  const events: TrackingEvent[] = [];
  
  if (foundOrder.shippedAt) {
    events.push({
      timestamp: foundOrder.shippedAt,
      status: "Package picked up",
      location: "Distribution Center, CA",
    });
    
    // Add intermediate events if delivered or out for delivery
    if (foundOrder.status === "out_for_delivery" || foundOrder.status === "delivered") {
      const transitDate = new Date(foundOrder.shippedAt);
      transitDate.setDate(transitDate.getDate() + 1);
      events.push({
        timestamp: transitDate,
        status: "In transit",
        location: "Regional Hub, NV",
      });
      
      const arrivalDate = new Date(foundOrder.shippedAt);
      arrivalDate.setDate(arrivalDate.getDate() + 2);
      events.push({
        timestamp: arrivalDate,
        status: "Arrived at local facility",
        location: foundOrder.shippingAddress.city,
      });
    }
    
    if (foundOrder.status === "out_for_delivery") {
      events.push({
        timestamp: new Date(),
        status: "Out for delivery",
        location: foundOrder.shippingAddress.city,
      });
    }
    
    if (foundOrder.deliveredAt) {
      events.push({
        timestamp: foundOrder.deliveredAt,
        status: "Delivered",
        location: foundOrder.shippingAddress.city,
      });
    }
  }
  
  return { success: true, events: events.reverse() };
}

interface TrackingEvent {
  timestamp: Date;
  status: string;
  location: string;
}

// Calculate order statistics
export async function getOrderStatistics(userId: string): Promise<OrderStatistics> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userOrders = Array.from(orders.values()).filter(o => o.userId === userId);
  
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  
  const statusCounts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
    returned: 0,
  };
  
  userOrders.forEach(o => {
    statusCounts[o.status]++;
  });
  
  return {
    totalOrders,
    totalSpent,
    averageOrderValue,
    statusCounts,
    lastOrderDate: userOrders.length > 0
      ? userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
      : null,
  };
}

interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  statusCounts: Record<OrderStatus, number>;
  lastOrderDate: Date | null;
}

// Reorder - create new order from previous order
export async function reorder(
  orderId: string
): Promise<{ success: boolean; cartItems?: Array<{ productId: string; quantity: number }>; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const order = orders.get(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  const cartItems = order.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
  
  return { success: true, cartItems };
}

// Add mock orders for demo
export function initializeMockOrders(userId: string): void {
  const mockOrder: Order = {
    id: "order_demo_001",
    orderNumber: "ORD-ABC123-XYZ",
    userId,
    items: [
      {
        id: "oi_001",
        productId: "prod_001",
        productName: "Wireless Noise-Canceling Headphones",
        productImage: "/products/headphones-thumb.jpg",
        quantity: 1,
        unitPrice: 299.99,
        totalPrice: 299.99,
      },
      {
        id: "oi_002",
        productId: "prod_002",
        productName: "Ultra-Slim Laptop Stand",
        productImage: "/products/stand-thumb.jpg",
        quantity: 2,
        unitPrice: 79.99,
        totalPrice: 159.98,
      },
    ],
    status: "delivered",
    shippingAddress: {
      id: "addr_001",
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      street1: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      postalCode: "94102",
      country: "US",
      isDefault: true,
      type: "shipping",
    },
    billingAddress: {
      id: "addr_001",
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      street1: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      postalCode: "94102",
      country: "US",
      isDefault: true,
      type: "billing",
    },
    paymentMethod: {
      id: "pm_001",
      type: "credit_card",
      last4: "4242",
      brand: "Visa",
      isDefault: true,
    },
    subtotal: 459.97,
    tax: 36.80,
    shipping: 0,
    discount: 0,
    total: 496.77,
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    timeline: [
      {
        id: "ote_001",
        status: "pending",
        description: "Order placed",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ote_002",
        status: "confirmed",
        description: "Payment confirmed",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ote_003",
        status: "processing",
        description: "Order is being prepared",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ote_004",
        status: "shipped",
        description: "Package shipped via UPS",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        location: "San Francisco, CA",
      },
      {
        id: "ote_005",
        status: "delivered",
        description: "Package delivered",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        location: "San Francisco, CA",
      },
    ],
  };
  
  orders.set(mockOrder.id, mockOrder);
}
