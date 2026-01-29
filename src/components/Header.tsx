import Link from "next/link";
import { CartBadge } from "./CartBadge";

interface HeaderProps {
  cartItemCount: number;
  userName?: string;
  onLogout: () => Promise<void>;
}

export function Header({ cartItemCount, userName, onLogout }: HeaderProps) {
  const handleLogout = async () => {
    await onLogout();
  };

  // Type error: assigning string to number
  const displayCount: number = cartItemCount > 99 ? "99+" : cartItemCount;

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
          {userName && (
            <span className="text-gray-600">
              Welcome, {userName.toUpperCase()}
            </span>
          )}
          <div className="relative">
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cart
            </button>
            <CartBadge count={displayCount} />
          </div>
        </nav>
      </div>
    </header>
  );
}
