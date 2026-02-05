"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Button, Badge } from "./ui";
import { getProductById } from "@/lib/products";

interface ProductComparisonProps {
  productIds: string[];
  onRemoveProduct?: (productId: string) => void;
  maxProducts?: number;
}

export function ProductComparison({
  productIds,
  onRemoveProduct,
  maxProducts = 4,
}: ProductComparisonProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const products = productIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">
          No products selected for comparison
        </p>
      </div>
    );
  }

  // Get all unique specification keys across products
  const allSpecKeys = new Set<string>();
  products.forEach((product) => {
    Object.keys(product.specifications).forEach((key) => allSpecKeys.add(key));
  });

  // Calculate comparison stats
  const comparisonStats = calculateComparisonStats(products);

  // Find best value product
  const bestValueProduct = findBestValue(products);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Product Comparison
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Comparing {products.length} products
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded border-zinc-300"
            />
            Highlight differences
          </label>
          <Button variant="outline" size="sm">
            Share comparison
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <th className="p-4 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Feature
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-4 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-zinc-500">{product.category}</p>
                    </div>
                    {onRemoveProduct && (
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="text-zinc-400 hover:text-zinc-600"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  {bestValueProduct?.id === product.id && (
                    <Badge variant="success" className="mt-2">
                      Best Value
                    </Badge>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Price
              </td>
              {products.map((product) => (
                <td
                  key={product.id}
                  className={`p-4 ${
                    highlightDifferences && product.price === comparisonStats.lowestPrice
                      ? "bg-green-50 dark:bg-green-900/20"
                      : ""
                  }`}
                >
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-zinc-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Rating
              </td>
              {products.map((product) => (
                <td
                  key={product.id}
                  className={`p-4 ${
                    highlightDifferences && product.rating === comparisonStats.highestRating
                      ? "bg-green-50 dark:bg-green-900/20"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-zinc-500">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Stock Row */}
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Availability
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  {product.stock > 0 ? (
                    <Badge variant={product.stock > 10 ? "success" : "warning"}>
                      {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
                    </Badge>
                  ) : (
                    <Badge variant="danger">Out of Stock</Badge>
                  )}
                </td>
              ))}
            </tr>

            {/* Specification Rows */}
            {Array.from(allSpecKeys).map((specKey) => (
              <tr key={specKey} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {specKey}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-sm text-zinc-900 dark:text-white">
                    {product.specifications[specKey] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="font-medium text-zinc-900 dark:text-white">Comparison Summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-zinc-500">Price Range</p>
            <p className="font-medium text-zinc-900 dark:text-white">
              ${comparisonStats.lowestPrice.toFixed(2)} - ${comparisonStats.highestPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Average Rating</p>
            <p className="font-medium text-zinc-900 dark:text-white">
              {comparisonStats.averageRating.toFixed(1)} / 5
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Total Reviews</p>
            <p className="font-medium text-zinc-900 dark:text-white">
              {comparisonStats.totalReviews.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function with type error - missing return type and wrong parameter type
function calculateComparisonStats(products: Product[]) {
  const prices = products.map((p) => p.price);
  const ratings = products.map((p) => p.rating);
  const reviews = products.map((p) => p.reviewCount);

  return {
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    highestRating: Math.max(...ratings),
    totalReviews: reviews.reduce((a, b) => a + b, 0),
  };
}

// Function with obvious type error - returns wrong type
function findBestValue(products: Product[]): Product | undefined {
  if (products.length === 0) return undefined;

  // Calculate value score (rating / price * 100)
  const scored = products.map((p) => ({
    product: p,
    score: (p.rating / p.price) * 100,
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0].product;
}

// Export a hook with obvious error - using undefined variable
export function useProductComparison(initialIds: string[] = []) {
  const [comparedIds, setComparedIds] = useState<string[]>(initialIds);

  const addProduct = (productId: string) => {
    if (!comparedIds.includes(productId) && comparedIds.length < MAX_COMPARISON_ITEMS) {
      setComparedIds([...comparedIds, productId]);
    }
  };

  const removeProduct = (productId: string) => {
    setComparedIds(comparedIds.filter((id) => id !== productId));
  };

  const clearAll = () => {
    setComparedIds([]);
  };

  const isComparing = (productId: string) => comparedIds.includes(productId);

  return {
    comparedIds,
    addProduct,
    removeProduct,
    clearAll,
    isComparing,
    canAddMore: comparedIds.length < MAX_COMPARISON_ITEMS,
  };
}
