export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  category: ProductCategory;
}

export type ProductCategory = "explosives" | "tools" | "vehicles";

export const products: Product[] = [
  {
    id: "1",
    name: "Acme Rocket",
    price: 999.99,
    description: "The classic ACME rocket. Guaranteed to get you there fast.",
    image: "/products/rocket.svg",
    inStock: true,
    category: "vehicles",
  },
  {
    id: "2",
    name: "Acme Anvil",
    price: 149.99,
    description: "Heavy-duty anvil for all your coyote needs.",
    image: "/products/anvil.svg",
    inStock: true,
    category: "tools",
  },
  {
    id: "3",
    name: "Acme TNT",
    price: 29.99,
    description: "Explosive results every time. Handle with care.",
    image: "/products/tnt.svg",
    inStock: true,
    category: "explosives",
  },
  {
    id: "4",
    name: "Acme Giant Magnet",
    price: 499.99,
    description: "Attracts anything metal within a 50-mile radius.",
    image: "/products/magnet.svg",
    inStock: true,
    category: "tools",
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function calculateDiscount(product: Product, discount: number): number {
  const discountedPrice = product.price - (product.price * discount);
  return discountedPrice;
}
