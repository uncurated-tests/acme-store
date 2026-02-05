"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header, Footer, ProductCard, SearchModal } from "@/components";
import { categories, getFeaturedProducts, products } from "@/lib/products";
import type { ProductCategory, Product } from "@/lib/types";
import { Button, Input, Badge } from "@/components/ui";

const categoryOrder: ProductCategory[] = [
  "electronics",
  "clothing",
  "home",
  "sports",
  "beauty",
  "books",
];

const perkCards = [
  {
    title: "Fast fulfillment",
    description: "Same-day dispatch on 3,000+ items with live tracking updates.",
  },
  {
    title: "Curated drops",
    description: "Weekly product edits from the Acme Lab team, no fluff included.",
  },
  {
    title: "Member pricing",
    description: "Unlock private deals and early access across top categories.",
  },
];

const stats = [
  { label: "Products in stock", value: "12.4k" },
  { label: "Same-day deliveries", value: "1,860" },
  { label: "Average rating", value: "4.8/5" },
];

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const featuredProducts = useMemo(() => getFeaturedProducts().slice(0, 6), []);
  const newArrivals = useMemo(() => [...products].slice(0, 4), []);

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product.id);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log("Add to wishlist:", product.id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header cartItemCount={3} onSearchClick={() => setIsSearchOpen(true)} />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.12),_transparent_55%),radial-gradient(circle_at_30%_20%,_rgba(14,165,233,0.18),_transparent_45%),linear-gradient(180deg,_rgba(9,9,11,0.9),_rgba(24,24,27,0.98))]" />
          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pt-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Winter archive drop
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  An editorial storefront for your next everyday obsession.
                </h1>
                <p className="mt-6 max-w-xl text-lg text-zinc-200">
                  Shop new arrivals, cult favorites, and curated bundles designed by the Acme Lab team.
                  Every collection is styled, tested, and ready to ship.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="primary" size="lg">
                    Explore collection
                  </Button>
                  <Button variant="outline" size="lg">
                    View deals
                  </Button>
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-transparent p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Smart search</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Find the exact fit in seconds.</h2>
                  <p className="mt-2 text-sm text-emerald-100/80">
                    Start typing and we will surface products, categories, and live inventory in real time.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Search for anything"
                      onFocus={() => setIsSearchOpen(true)}
                    />
                    <Button variant="primary">Search</Button>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">New arrivals</p>
                    <Link className="text-xs text-white/70 hover:text-white" href="/products">
                      View all
                    </Link>
                  </div>
                  <div className="mt-4 space-y-3">
                    {newArrivals.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          <p className="text-xs text-white/60">{item.category}</p>
                        </div>
                        <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 text-zinc-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Shop by category</p>
                <h2 className="mt-2 text-3xl font-semibold">Curated by lifestyle, not by shelf.</h2>
              </div>
              <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Browse everything
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryOrder.map((category) => (
                <div
                  key={category}
                  className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-6 transition hover:border-zinc-300 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-zinc-900 px-3 py-2 text-xs uppercase tracking-[0.25em] text-white">
                      {categories[category].name}
                    </div>
                    <span className="text-xs text-zinc-400">{categories[category].description}</span>
                  </div>
                  <p className="mt-4 text-sm text-zinc-600">
                    Shop {categories[category].name.toLowerCase()} essentials handpicked for form and function.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-zinc-900">
                    View {categories[category].name}
                    <span className="transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-16 text-zinc-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Featured now</p>
                <h2 className="mt-2 text-3xl font-semibold">Bestsellers for the season.</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsSearchOpen(true)}>
                Find more
              </Button>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 text-zinc-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Acme Lab</p>
                <h2 className="mt-2 text-3xl font-semibold">We design the cart for you.</h2>
                <p className="mt-4 text-base text-zinc-600">
                  Every collection is tested by real customers before it lands in the store. We benchmark quality,
                  comfort, and utility so your next favorite product feels inevitable.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {perkCards.map((perk) => (
                    <div key={perk.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-sm font-semibold text-zinc-900">{perk.title}</p>
                      <p className="mt-2 text-sm text-zinc-600">{perk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-900 p-8 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Member perks</p>
                <h3 className="mt-4 text-2xl font-semibold">Priority access to private drops.</h3>
                <p className="mt-3 text-sm text-white/70">
                  Join Acme Collective for early access, free shipping, and dedicated styling notes.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Button variant="primary" size="lg">
                    Join the collective
                  </Button>
                  <Button variant="ghost" size="lg">
                    Learn more
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
