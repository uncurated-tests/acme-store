import { Product, calculateDiscount } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
  showDiscount?: boolean;
}

export function ProductCard({ product, onAddToCart, showDiscount }: ProductCardProps) {
  const handleAddToCart = () => {
    // Type error: passing number instead of string for productId
    onAddToCart(product.id, "1");  // Type error: quantity should be number
  };

  const discountedPrice: number = showDiscount 
    ? calculateDiscount(product, 0.1)  // Type error: calculateDiscount returns string
    : product.price;

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
        <span className="text-4xl">
          {product.name.includes("Rocket") && "🚀"}
          {product.name.includes("Anvil") && "🔨"}
          {product.name.includes("TNT") && "💥"}
          {product.name.includes("Magnet") && "🧲"}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">
          ${discountedPrice.toFixed(2)}
        </span>
        <button 
          onClick={handleAddToCart}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Add to Cart
        </button>
      </div>
      {product.inStock === false && (
        <span className="text-red-500 text-sm">Out of Stock</span>
      )}
    </div>
  );
}
