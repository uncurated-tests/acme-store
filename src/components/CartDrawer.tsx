"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Cart, CartItem } from "@/lib/types";
import { Button, Input } from "./ui";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  onRemoveCoupon: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponError(null);

    const result = await onApplyCoupon(couponCode.trim());
    if (!result.success) {
      setCouponError(result.error || "Invalid coupon code");
    } else {
      setCouponCode("");
    }

    setApplyingCoupon(false);
  };

  if (!isOpen) return null;

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="h-16 w-16 text-zinc-300 dark:text-zinc-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400">Your cart is empty</p>
              <Button variant="primary" className="mt-4" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.selectedVariant?.id || "default"}`}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            {/* Coupon */}
            <div className="mb-4">
              {cart.couponCode ? (
                <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      {cart.couponCode} applied
                    </span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-sm text-green-600 hover:text-green-700 dark:text-green-400"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={couponError || undefined}
                    size="sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    loading={applyingCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-${cart.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span>{cart.shipping === 0 ? "Free" : `$${cart.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Tax</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold text-zinc-900 dark:border-zinc-800 dark:text-white">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Free Shipping Progress */}
            {cart.shipping > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Free shipping on orders over $100</span>
                  <span>${(100 - cart.subtotal).toFixed(2)} away</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-900 transition-all dark:bg-white"
                    style={{ width: `${Math.min(100, (cart.subtotal / 100) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <div className="mt-4 space-y-2">
              <Link href="/checkout" onClick={onClose}>
                <Button variant="primary" fullWidth size="lg">
                  Checkout - ${cart.total.toFixed(2)}
                </Button>
              </Link>
              <Button variant="ghost" fullWidth onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const [imageError, setImageError] = useState(false);
  const variantPrice = item.selectedVariant?.priceModifier || 0;
  const itemPrice = item.product.price + variantPrice;
  const itemTotal = itemPrice * item.quantity;

  return (
    <div className="flex gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {!imageError ? (
          <Image
            src={item.product.thumbnail}
            alt={item.product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/products/${item.productId}`}
              className="line-clamp-1 text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-white"
            >
              {item.product.name}
            </Link>
            {item.selectedVariant && (
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {item.selectedVariant.name}: {item.selectedVariant.value}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="text-zinc-400 hover:text-red-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              className="px-2 py-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              disabled={item.quantity <= 1}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="px-2 py-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              disabled={item.quantity >= item.product.stock}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Price */}
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            ${itemTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
