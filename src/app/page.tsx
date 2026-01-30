import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Acme Store
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop shop for all things ACME
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
