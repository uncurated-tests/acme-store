"use client";

import { useState, useEffect, useMemo } from "react";
import { products, filterProducts, categories } from "@/lib/products";
import type { Product, ProductCategory, ProductFilter } from "@/lib/types";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button, Input, Select, Badge } from "@/components/ui";

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProductFilter>({
    sortBy: "popular",
  });
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return filterProducts({
      ...filter,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      priceRange: priceRange || undefined,
      searchQuery: searchQuery || undefined,
    });
  }, [filter, selectedCategories, priceRange, searchQuery]);

  const handleCategoryToggle = (category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product.id);
    // Would dispatch to cart store
  };

  const handleAddToWishlist = (product: Product) => {
    console.log("Add to wishlist:", product.id);
    // Would dispatch to wishlist store
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(null);
    setSearchQuery("");
    setFilter({ sortBy: "popular" });
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange || searchQuery || filter.onSale || filter.rating;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">All Products</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Browse our collection of {products.length} products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white">
                  Search
                </label>
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="sm"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-white">
                  Categories
                </h3>
                <div className="space-y-2">
                  {(Object.keys(categories) as ProductCategory[]).map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700"
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {categories[category].name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-white">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Under $50", min: 0, max: 50 },
                    { label: "$50 - $100", min: 50, max: 100 },
                    { label: "$100 - $200", min: 100, max: 200 },
                    { label: "Over $200", min: 200, max: Infinity },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange?.min === range.min && priceRange?.max === range.max}
                        onChange={() => setPriceRange({ min: range.min, max: range.max })}
                        className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700"
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-white">
                  More Filters
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filter.onSale || false}
                      onChange={(e) => setFilter((f) => ({ ...f, onSale: e.target.checked || undefined }))}
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">On Sale</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filter.inStock || false}
                      onChange={(e) => setFilter((f) => ({ ...f, inStock: e.target.checked || undefined }))}
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filter.rating === 4}
                      onChange={(e) => setFilter((f) => ({ ...f, rating: e.target.checked ? 4 : undefined }))}
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">4+ Stars</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="outline" size="sm" fullWidth onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </Button>

                {/* Active Filter Tags */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary" rounded>
                        {categories[category].name}
                        <button
                          onClick={() => handleCategoryToggle(category)}
                          className="ml-1 hover:text-zinc-900"
                        >
                          &times;
                        </button>
                      </Badge>
                    ))}
                    {filter.onSale && (
                      <Badge variant="danger" rounded>
                        On Sale
                        <button
                          onClick={() => setFilter((f) => ({ ...f, onSale: undefined }))}
                          className="ml-1"
                        >
                          &times;
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {filteredProducts.length} products
                </span>
              </div>

              {/* Sort */}
              <Select
                options={[
                  { value: "popular", label: "Most Popular" },
                  { value: "newest", label: "Newest" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "rating", label: "Highest Rated" },
                ]}
                value={filter.sortBy}
                onChange={(e) => setFilter((f) => ({ ...f, sortBy: e.target.value as ProductFilter["sortBy"] }))}
                fullWidth={false}
                size="sm"
              />
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <svg
                  className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
                  No products found
                </h3>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  Try adjusting your filters or search query
                </p>
                <Button variant="primary" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
