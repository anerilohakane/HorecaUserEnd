import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function EmptyCart() {
  return (
    <div className="bg-white rounded-2xl soft-shadow p-12 text-center">
      {/* Icon */}
      <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingCart size={48} className="text-gray-400" />
      </div>

      {/* Message */}
      <h2 className="text-2xl font-semibold text-[#111827] mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
      </p>

      {/* CTA Button */}
      <Link href="/products">
        <button className="bg-[#D97706] text-white px-8 py-4 rounded-full hover:bg-[#B45309] transition-all font-semibold shadow-md hover:shadow-lg">
          Start Shopping
        </button>
      </Link>

      {/* Popular Categories */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-4">Popular Categories</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/products?category=ingredients">
            <span className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm text-gray-700 hover:bg-[#D97706] hover:text-white transition-all cursor-pointer">
              Ingredients
            </span>
          </Link>
          <Link href="/products?category=dairy-fats">
            <span className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm text-gray-700 hover:bg-[#D97706] hover:text-white transition-all cursor-pointer">
              Dairy & Fats
            </span>
          </Link>
          <Link href="/products?category=packaging">
            <span className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm text-gray-700 hover:bg-[#D97706] hover:text-white transition-all cursor-pointer">
              Packaging
            </span>
          </Link>
          <Link href="/products?category=decorations">
            <span className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm text-gray-700 hover:bg-[#D97706] hover:text-white transition-all cursor-pointer">
              Decorations
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}