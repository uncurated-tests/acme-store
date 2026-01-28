export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Acme Rocket",
    price: 999.99,
    description: "The classic ACME rocket. Guaranteed to get you there fast.",
    image: "/products/rocket.svg",
  },
  {
    id: "2",
    name: "Acme Anvil",
    price: 149.99,
    description: "Heavy-duty anvil for all your coyote needs.",
    image: "/products/anvil.svg",
  },
  {
    id: "3",
    name: "Acme TNT",
    price: 29.99,
    description: "Explosive results every time. Handle with care.",
    image: "/products/tnt.svg",
  },
  {
    id: "4",
    name: "Acme Giant Magnet",
    price: 499.99,
    description: "Attracts anything metal within a 50-mile radius.",
    image: "/products/magnet.svg",
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
