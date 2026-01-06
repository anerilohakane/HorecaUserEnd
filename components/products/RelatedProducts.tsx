import { Product } from '@/lib/types/product';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export default function RelatedProducts({
  products,
  title = "You May Also Like"
}: RelatedProductsProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-light text-[#111827]">
          {title}
        </h2>
        <Link
          href="/products"
          className="flex items-center gap-1 text-[#D97706] hover:text-[#B45309] font-medium transition-colors group"
        >
          <span>View All</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}