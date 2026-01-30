/**
 * Product Data and Utilities
 * 
 * Mock product data and helper functions for product management
 */

import type { Product, ProductCategory, ProductFilter, SearchResult, SearchFacets } from "./types";

// Mock Product Data
export const products: Product[] = [
  {
    id: "prod_001",
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Features adaptive sound control and multipoint connection.",
    price: 299.99,
    originalPrice: 349.99,
    category: "electronics",
    subcategory: "audio",
    images: ["/products/headphones-1.jpg", "/products/headphones-2.jpg", "/products/headphones-3.jpg"],
    thumbnail: "/products/headphones-thumb.jpg",
    rating: 4.8,
    reviewCount: 1247,
    stock: 45,
    sku: "WH-NC-001",
    tags: ["wireless", "noise-canceling", "bluetooth", "premium"],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "4Hz-40kHz",
      "Battery Life": "30 hours",
      "Bluetooth Version": "5.2",
      "Weight": "250g",
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-01"),
    featured: true,
    onSale: true,
  },
  {
    id: "prod_002",
    name: "Ultra-Slim Laptop Stand",
    description: "Ergonomic aluminum laptop stand with adjustable height settings. Compatible with laptops up to 17 inches. Foldable design for portability.",
    price: 79.99,
    category: "electronics",
    subcategory: "accessories",
    images: ["/products/stand-1.jpg", "/products/stand-2.jpg"],
    thumbnail: "/products/stand-thumb.jpg",
    rating: 4.5,
    reviewCount: 532,
    stock: 120,
    sku: "LS-AL-002",
    tags: ["ergonomic", "aluminum", "portable", "adjustable"],
    specifications: {
      "Material": "Aluminum Alloy",
      "Max Laptop Size": "17 inches",
      "Height Adjustment": "6 levels",
      "Weight": "280g",
      "Load Capacity": "15kg",
    },
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-05-15"),
    featured: false,
    onSale: false,
  },
  {
    id: "prod_003",
    name: "Organic Cotton T-Shirt",
    description: "Sustainably sourced 100% organic cotton t-shirt. Pre-shrunk, comfortable fit with reinforced seams for durability.",
    price: 34.99,
    category: "clothing",
    subcategory: "tops",
    images: ["/products/tshirt-1.jpg", "/products/tshirt-2.jpg", "/products/tshirt-3.jpg"],
    thumbnail: "/products/tshirt-thumb.jpg",
    rating: 4.6,
    reviewCount: 892,
    stock: 250,
    sku: "TS-OC-003",
    tags: ["organic", "sustainable", "cotton", "casual"],
    specifications: {
      "Material": "100% Organic Cotton",
      "Weight": "180 GSM",
      "Care": "Machine washable",
      "Fit": "Regular",
      "Origin": "Fair Trade Certified",
    },
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-06-01"),
    featured: true,
    onSale: false,
  },
  {
    id: "prod_004",
    name: "Smart Home Hub Pro",
    description: "Central smart home controller with voice assistant integration. Controls lights, thermostats, locks, and more. Works with Alexa, Google Home, and HomeKit.",
    price: 149.99,
    originalPrice: 199.99,
    category: "electronics",
    subcategory: "smart-home",
    images: ["/products/hub-1.jpg", "/products/hub-2.jpg"],
    thumbnail: "/products/hub-thumb.jpg",
    rating: 4.3,
    reviewCount: 678,
    stock: 75,
    sku: "SH-HP-004",
    tags: ["smart-home", "voice-control", "automation", "iot"],
    specifications: {
      "Connectivity": "WiFi, Zigbee, Z-Wave, Bluetooth",
      "Voice Assistants": "Alexa, Google, Siri",
      "Display": "7-inch touchscreen",
      "Power": "AC adapter included",
      "Dimensions": "180 x 120 x 25mm",
    },
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-05-20"),
    featured: true,
    onSale: true,
  },
  {
    id: "prod_005",
    name: "Ceramic Pour-Over Coffee Set",
    description: "Handcrafted ceramic pour-over coffee maker with matching carafe and two cups. Perfect for coffee enthusiasts who appreciate the art of manual brewing.",
    price: 89.99,
    category: "home",
    subcategory: "kitchen",
    images: ["/products/coffee-1.jpg", "/products/coffee-2.jpg", "/products/coffee-3.jpg"],
    thumbnail: "/products/coffee-thumb.jpg",
    rating: 4.9,
    reviewCount: 324,
    stock: 40,
    sku: "HM-CS-005",
    tags: ["ceramic", "handcrafted", "coffee", "artisan"],
    specifications: {
      "Material": "High-fired ceramic",
      "Carafe Capacity": "600ml",
      "Cup Capacity": "250ml each",
      "Dishwasher Safe": "Yes",
      "Includes": "Dripper, carafe, 2 cups, filters",
    },
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-06-01"),
    featured: false,
    onSale: false,
  },
  {
    id: "prod_006",
    name: "Running Performance Shoes",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for neutral runners seeking speed and comfort.",
    price: 159.99,
    originalPrice: 179.99,
    category: "sports",
    subcategory: "footwear",
    images: ["/products/shoes-1.jpg", "/products/shoes-2.jpg", "/products/shoes-3.jpg"],
    thumbnail: "/products/shoes-thumb.jpg",
    rating: 4.7,
    reviewCount: 1563,
    stock: 85,
    sku: "SP-RS-006",
    tags: ["running", "performance", "lightweight", "breathable"],
    specifications: {
      "Upper": "Engineered mesh",
      "Midsole": "Responsive foam",
      "Outsole": "Rubber with traction pattern",
      "Drop": "8mm",
      "Weight": "245g (size 9)",
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-05-25"),
    featured: true,
    onSale: true,
  },
  {
    id: "prod_007",
    name: "Bestselling Fiction Novel Collection",
    description: "Curated collection of five bestselling contemporary fiction novels. Includes hardcover editions with exclusive artwork and author notes.",
    price: 89.99,
    category: "books",
    subcategory: "fiction",
    images: ["/products/books-1.jpg", "/products/books-2.jpg"],
    thumbnail: "/products/books-thumb.jpg",
    rating: 4.8,
    reviewCount: 256,
    stock: 60,
    sku: "BK-FC-007",
    tags: ["fiction", "bestseller", "collection", "hardcover"],
    specifications: {
      "Format": "Hardcover",
      "Books Included": "5",
      "Total Pages": "~2000",
      "Language": "English",
      "Edition": "Collector's Edition",
    },
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-05-10"),
    featured: false,
    onSale: false,
  },
  {
    id: "prod_008",
    name: "Premium Skincare Gift Set",
    description: "Luxury skincare set featuring cleanser, toner, serum, and moisturizer. Formulated with natural ingredients for all skin types.",
    price: 129.99,
    originalPrice: 159.99,
    category: "beauty",
    subcategory: "skincare",
    images: ["/products/skincare-1.jpg", "/products/skincare-2.jpg", "/products/skincare-3.jpg"],
    thumbnail: "/products/skincare-thumb.jpg",
    rating: 4.6,
    reviewCount: 445,
    stock: 35,
    sku: "BT-SS-008",
    tags: ["skincare", "natural", "luxury", "gift-set"],
    specifications: {
      "Products Included": "4",
      "Skin Type": "All types",
      "Key Ingredients": "Hyaluronic acid, Vitamin C, Niacinamide",
      "Cruelty-Free": "Yes",
      "Paraben-Free": "Yes",
    },
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-06-01"),
    featured: true,
    onSale: true,
  },
  {
    id: "prod_009",
    name: "Building Blocks Mega Set",
    description: "1500-piece building blocks set compatible with major brands. Includes variety of colors and special pieces for endless creativity.",
    price: 69.99,
    category: "toys",
    subcategory: "building",
    images: ["/products/blocks-1.jpg", "/products/blocks-2.jpg"],
    thumbnail: "/products/blocks-thumb.jpg",
    rating: 4.7,
    reviewCount: 789,
    stock: 150,
    sku: "TY-BB-009",
    tags: ["building", "creative", "educational", "kids"],
    specifications: {
      "Pieces": "1500",
      "Age Range": "6+",
      "Material": "ABS Plastic",
      "Storage": "Container included",
      "Compatibility": "Major brands",
    },
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-05-01"),
    featured: false,
    onSale: false,
  },
  {
    id: "prod_010",
    name: "Car Emergency Kit Deluxe",
    description: "Comprehensive car emergency kit with jumper cables, first aid supplies, flashlight, tools, and safety equipment. Essential for every vehicle.",
    price: 79.99,
    category: "automotive",
    subcategory: "safety",
    images: ["/products/carkit-1.jpg", "/products/carkit-2.jpg"],
    thumbnail: "/products/carkit-thumb.jpg",
    rating: 4.5,
    reviewCount: 334,
    stock: 90,
    sku: "AU-EK-010",
    tags: ["emergency", "safety", "car", "essential"],
    specifications: {
      "Items Included": "65+",
      "Bag Type": "Durable nylon",
      "Jumper Cables": "12ft, 8 gauge",
      "First Aid Items": "35+",
      "Tools": "Screwdrivers, pliers, tape",
    },
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-04-15"),
    featured: false,
    onSale: false,
  },
  {
    id: "prod_011",
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with hot-swappable switches, programmable keys, and aircraft-grade aluminum frame. Cherry MX compatible.",
    price: 149.99,
    category: "electronics",
    subcategory: "gaming",
    images: ["/products/keyboard-1.jpg", "/products/keyboard-2.jpg"],
    thumbnail: "/products/keyboard-thumb.jpg",
    rating: 4.8,
    reviewCount: 923,
    stock: 65,
    sku: "EL-GK-011",
    tags: ["gaming", "mechanical", "rgb", "keyboard"],
    specifications: {
      "Switch Type": "Hot-swappable",
      "Keycaps": "PBT Double-shot",
      "Backlighting": "Per-key RGB",
      "Connection": "USB-C, Wireless",
      "Battery": "4000mAh",
    },
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-06-01"),
    featured: true,
    onSale: false,
  },
  {
    id: "prod_012",
    name: "Wool Blend Winter Coat",
    description: "Classic wool blend coat with quilted lining. Features notch lapels, double-breasted closure, and deep pockets. Timeless style for cold weather.",
    price: 249.99,
    originalPrice: 299.99,
    category: "clothing",
    subcategory: "outerwear",
    images: ["/products/coat-1.jpg", "/products/coat-2.jpg", "/products/coat-3.jpg"],
    thumbnail: "/products/coat-thumb.jpg",
    rating: 4.6,
    reviewCount: 412,
    stock: 30,
    sku: "CL-WC-012",
    tags: ["wool", "winter", "classic", "warm"],
    specifications: {
      "Material": "60% Wool, 40% Polyester",
      "Lining": "Quilted polyester",
      "Closure": "Double-breasted buttons",
      "Care": "Dry clean only",
      "Length": "Mid-thigh",
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-05-20"),
    featured: false,
    onSale: true,
  },
];

// Product Utility Functions
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function getProductsOnSale(): Product[] {
  return products.filter(p => p.onSale);
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

export function filterProducts(filter: ProductFilter): Product[] {
  let filtered = [...products];
  
  if (filter.categories && filter.categories.length > 0) {
    filtered = filtered.filter(p => filter.categories!.includes(p.category));
  }
  
  if (filter.priceRange) {
    filtered = filtered.filter(
      p => p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max
    );
  }
  
  if (filter.rating) {
    filtered = filtered.filter(p => p.rating >= filter.rating!);
  }
  
  if (filter.inStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }
  
  if (filter.onSale) {
    filtered = filtered.filter(p => p.onSale);
  }
  
  if (filter.tags && filter.tags.length > 0) {
    filtered = filtered.filter(p =>
      filter.tags!.some(tag => p.tags.includes(tag))
    );
  }
  
  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Sorting
  if (filter.sortBy) {
    switch (filter.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  }
  
  return filtered;
}

export function searchProducts(query: string, filter?: Partial<ProductFilter>): SearchResult {
  const searchFilter: ProductFilter = {
    ...filter,
    searchQuery: query,
  };
  
  const filteredProducts = filterProducts(searchFilter);
  
  // Generate facets
  const facets: SearchFacets = {
    categories: generateCategoryFacets(filteredProducts, filter?.categories),
    priceRanges: generatePriceRangeFacets(filteredProducts, filter?.priceRange),
    ratings: generateRatingFacets(filteredProducts, filter?.rating),
    tags: generateTagFacets(filteredProducts, filter?.tags),
  };
  
  // Generate suggestions
  const suggestions = generateSearchSuggestions(query);
  
  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    facets,
    suggestions,
    correctedQuery: undefined,
  };
}

function generateCategoryFacets(
  filteredProducts: Product[],
  selectedCategories?: ProductCategory[]
): { value: string; count: number; selected: boolean }[] {
  const categoryCounts = new Map<ProductCategory, number>();
  
  products.forEach(p => {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
  });
  
  return Array.from(categoryCounts.entries()).map(([category, count]) => ({
    value: category,
    count,
    selected: selectedCategories?.includes(category) || false,
  }));
}

function generatePriceRangeFacets(
  filteredProducts: Product[],
  selectedRange?: { min: number; max: number }
): { value: string; count: number; selected: boolean }[] {
  const ranges = [
    { min: 0, max: 50, label: "Under $50" },
    { min: 50, max: 100, label: "$50 - $100" },
    { min: 100, max: 200, label: "$100 - $200" },
    { min: 200, max: 500, label: "$200 - $500" },
    { min: 500, max: Infinity, label: "Over $500" },
  ];
  
  return ranges.map(range => {
    const count = products.filter(
      p => p.price >= range.min && p.price < range.max
    ).length;
    
    const selected = selectedRange
      ? selectedRange.min === range.min && selectedRange.max === range.max
      : false;
    
    return { value: range.label, count, selected };
  });
}

function generateRatingFacets(
  filteredProducts: Product[],
  selectedRating?: number
): { value: string; count: number; selected: boolean }[] {
  const ratings = [4, 3, 2, 1];
  
  return ratings.map(rating => {
    const count = products.filter(p => p.rating >= rating).length;
    return {
      value: `${rating}+ Stars`,
      count,
      selected: selectedRating === rating,
    };
  });
}

function generateTagFacets(
  filteredProducts: Product[],
  selectedTags?: string[]
): { value: string; count: number; selected: boolean }[] {
  const tagCounts = new Map<string, number>();
  
  products.forEach(p => {
    p.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({
      value: tag,
      count,
      selected: selectedTags?.includes(tag) || false,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function generateSearchSuggestions(query: string): string[] {
  const allTags = new Set<string>();
  const allNames = new Set<string>();
  
  products.forEach(p => {
    p.tags.forEach(tag => allTags.add(tag));
    allNames.add(p.name.toLowerCase());
  });
  
  const suggestions: string[] = [];
  const queryLower = query.toLowerCase();
  
  allTags.forEach(tag => {
    if (tag.includes(queryLower) && tag !== queryLower) {
      suggestions.push(tag);
    }
  });
  
  return suggestions.slice(0, 5);
}

// Category metadata
export const categories: Record<ProductCategory, { name: string; description: string; icon: string }> = {
  electronics: {
    name: "Electronics",
    description: "Gadgets, devices, and tech accessories",
    icon: "laptop",
  },
  clothing: {
    name: "Clothing",
    description: "Apparel for all occasions",
    icon: "shirt",
  },
  home: {
    name: "Home & Living",
    description: "Furniture, decor, and kitchenware",
    icon: "home",
  },
  sports: {
    name: "Sports & Outdoors",
    description: "Athletic gear and outdoor equipment",
    icon: "dumbbell",
  },
  books: {
    name: "Books",
    description: "Fiction, non-fiction, and more",
    icon: "book",
  },
  beauty: {
    name: "Beauty",
    description: "Skincare, makeup, and personal care",
    icon: "sparkles",
  },
  toys: {
    name: "Toys & Games",
    description: "Fun for all ages",
    icon: "gamepad",
  },
  automotive: {
    name: "Automotive",
    description: "Car accessories and parts",
    icon: "car",
  },
};
