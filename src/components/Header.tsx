import Link from "next/link";
import { CartBadge } from "./CartBadge";

interface HeaderProps {
  cartItemCount: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Acme Store
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Products
          </Link>
          <div className="relative">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Cart
            </button>
            <CartBadge count={cartItemCount} />
          </div>
        </nav>
      </div>
    </header>
  );
}
