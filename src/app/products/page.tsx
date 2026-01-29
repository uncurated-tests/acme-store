import { getProducts, getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function ProductsPage() {
  const products = getProducts();
  
  // Type error: passing number instead of string
  const toolProducts = getProductsByCategory(123);

  const handleAddToCart = (id: number, qty: string) => {
    // Type error: function signature doesn't match ProductCard's expected props
    console.log(`Adding ${qty} of product ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Acme Products</h1>
          <p className="text-gray-600 mt-2">
            Quality products for all your cartoon needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
              showDiscount={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
