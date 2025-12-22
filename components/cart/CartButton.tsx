'use client';

import { useCart } from '@/lib/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart">
      <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
        <ShoppingCart size={20} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D97706] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>
    </Link>
  );
}