"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { searchProducts } from "@/lib/products";
import type { Product, SearchResult } from "@/lib/types";
import { Input, Badge } from "./ui";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchHistory?: string[];
  onSearch?: (query: string) => void;
}

export function SearchModal({ isOpen, onClose, searchHistory = [], onSearch }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(searchHistory);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = ["headphones", "laptop", "shoes", "skincare", "gaming"];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const searchResults = searchProducts(searchQuery);
      setResults(searchResults);
      setLoading(false);

      // Add to recent searches
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev].slice(0, 5));
      }

      onSearch?.(searchQuery);
    },
    [onSearch, recentSearches]
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, handleSearch]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 sm:inset-x-auto">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <svg
            className="h-5 w-5 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <kbd className="hidden rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800 sm:block">
            ESC
          </kbd>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
            </div>
          ) : results ? (
            <div>
              {/* Suggestions */}
              {results.suggestions.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {results.products.length > 0 ? (
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Products ({results.totalCount})
                  </p>
                  <div className="space-y-2">
                    {results.products.slice(0, 6).map((product) => (
                      <SearchResultItem
                        key={product.id}
                        product={product}
                        onClick={onClose}
                      />
                    ))}
                  </div>
                  {results.totalCount > 6 && (
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="mt-4 block text-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      View all {results.totalCount} results
                    </Link>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
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
                  <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                    No results found for "{query}"
                  </p>
                  <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Recent Searches
                    </p>
                    <button
                      onClick={() => setRecentSearches([])}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        <svg
                          className="h-4 w-4 text-zinc-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface SearchResultItemProps {
  product: Product;
  onClick?: () => void;
}

function SearchResultItem({ product, onClick }: SearchResultItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/products/${product.id}`}
      onClick={onClick}
      className="flex items-center gap-4 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {!imageError ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-zinc-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.onSale && (
            <Badge variant="danger" size="sm">
              Sale
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
