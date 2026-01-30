"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { Badge, Button } from "./ui";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  showQuickView?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  showQuickView = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-t-xl">
        <div className="relative h-full w-full bg-zinc-100 dark:bg-zinc-800">
          {!imageError ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.onSale && discountPercentage > 0 && (
            <Badge variant="danger" rounded>
              -{discountPercentage}%
            </Badge>
          )}
          {product.featured && (
            <Badge variant="primary" rounded>
              Featured
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary" rounded>
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="warning" rounded>
              Only {product.stock} left
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToWishlist?.(product);
          }}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 opacity-0 shadow-sm transition-all hover:bg-white group-hover:opacity-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800"
          aria-label="Add to wishlist"
        >
          <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {product.category}
        </span>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : i < product.rating
                    ? "text-yellow-400/50"
                    : "text-zinc-300 dark:text-zinc-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-zinc-500 line-through dark:text-zinc-400">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={product.stock === 0}
            onClick={() => onAddToCart?.(product)}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Product Card Skeleton for loading states
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="aspect-square rounded-t-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-4">
        <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-1 h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 h-9 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
