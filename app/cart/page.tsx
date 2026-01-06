"use client";

import { useCart } from '@/lib/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import ProductCard from '@/components/products/ProductCard';
import { Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types/product';

// Safe API Base URL retrieval
const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
  return "https://horeca-backend-six.vercel.app"; // Fallback to known backend
};

function mapRawToProduct(raw: any): Product | null {
  if (!raw) return null;
  const id = raw._id ?? raw.id ?? raw.productId;
  if (!id) return null;

  return {
    id: String(id),
    name: raw.name ?? raw.title ?? 'Unnamed product',
    description: raw.description ?? raw.desc ?? '',
    price: typeof raw.price === 'number' ? raw.price : Number(raw.price ?? 0),
    discount: typeof raw.discount === 'number' ? raw.discount : (typeof raw.offerPercentage === 'number' ? raw.offerPercentage : 0),
    image:
      typeof raw.image === 'string'
        ? raw.image
        : Array.isArray(raw.images) && raw.images.length
          ? (raw.images[0].url ?? raw.images[0])
          : '',
    unit: raw.unit ?? 'pcs',
    minOrder: typeof raw.minOrder === 'number' ? raw.minOrder : (raw.minOrder ?? 1),
    rating: typeof raw.rating === 'number' ? raw.rating : (raw.averageRating ?? 0),
    reviews: typeof raw.reviews === 'number' ? raw.reviews : (raw.totalReviews ?? 0),
    category: raw.category ?? raw.categoryName ?? raw.categoryId ?? '',
    badge: raw.badge ?? (raw.isFeatured ? 'Featured' : undefined),
    inStock: typeof raw.inStock === 'boolean' ? raw.inStock : (typeof raw.stockQuantity === 'number' ? raw.stockQuantity > 0 : true),
    ...(raw as any),
  } as Product;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, itemCount, subtotal } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [apiBase, setApiBase] = useState("");

  useEffect(() => {
    setApiBase(getApiBase());
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const BaseURL = getApiBase();

      // Strict check: If cart is empty, do NOT show recommendations
      if (items.length === 0) {
        setRecommendations([]);
        return;
      }

      setLoadingRecs(true);
      try {
        console.log("🛠️ Starting Recommendation Fetch...");

        // Extract unique categories from cart items safely handling object/string
        const names = items.map(item => {
          const cat = item.product.category as any;
          if (!cat) return null;
          if (typeof cat === 'string') return cat;
          if (typeof cat === 'object' && cat.name) return cat.name;
          return null;
        }).filter(Boolean);

        const categories = [...new Set(names)];
        console.log("📂 Extracted Categories:", categories);

        // 1. Fetch products for each category
        let promises: Promise<any>[] = [];
        if (categories.length > 0) {
          promises = categories.map(async (category) => {
            try {
              const url = `${BaseURL}/api/products?category=${encodeURIComponent(String(category))}&limit=4`;
              const res = await fetch(url);
              if (!res.ok) return [];
              const json = await res.json();
              const list = json.products || json.data?.items || json.data || [];
              return Array.isArray(list) ? list : [];
            } catch (e) {
              return [];
            }
          });
        }

        const results = await Promise.all(promises);

        // IMPORTANT: Map raw data to Product objects to ensure `id` exists before filtering
        let fetchedProducts = results.flat().map(mapRawToProduct).filter((p): p is Product => p !== null);

        // 2. Filter out products that are already in the cart
        const cartProductIds = new Set(items.map(item => item.product?.id).filter(Boolean));
        let filtered = fetchedProducts
          .filter((p) => !cartProductIds.has(p.id))
          .filter((p, index, self) =>
            index === self.findIndex((t) => t.id === p.id)
          );

        // 3. Fallback: If we have fewer than 4 items, fetch general products (ONLY if cart is not empty)
        if (filtered.length < 4) {
          console.log("🔄 Triggering Fallback Recommendation...");
          try {
            const url = `${BaseURL}/api/products?limit=12`;
            const res = await fetch(url);
            if (res.ok) {
              const json = await res.json();
              const rawGeneral = (json.products || json.data?.items || json.data || []);

              if (Array.isArray(rawGeneral)) {
                const mappedGeneral = rawGeneral.map(mapRawToProduct).filter((p): p is Product => p !== null);

                const existingRecIds = new Set(filtered.map(p => p.id));
                const additional = mappedGeneral.filter((p) =>
                  !cartProductIds.has(p.id) && !existingRecIds.has(p.id)
                );

                filtered = [...filtered, ...additional];
                console.log("✅ Fallback added items:", additional.length);
              }
            }
          } catch (e) {
            console.error("❌ Failed to fetch fallback products", e);
          }
        }

        // 4. Final slice to 4 items
        const finalRecs = filtered.slice(0, 4);
        console.log("🏁 Final Recommendations:", finalRecs);
        setRecommendations(finalRecs);

      } catch (err) {
        console.error("🔥 Critical Error in Recommendation Logic", err);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-[#FAFAF7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#111827] font-medium">Shopping Cart</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-[#111827] mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart` : 'Your cart is empty'}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-all text-sm font-medium"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}

                {/* Mobile Summary */}
                <div className="lg:hidden mt-6">
                  <CartSummary subtotal={subtotal} itemCount={itemCount} />
                </div>
              </div>

              {/* Desktop Summary */}
              <div className="hidden lg:block">
                <CartSummary subtotal={subtotal} itemCount={itemCount} />
              </div>
            </div>
          )}

          {/* Recommendation Section - Only visible if items exist */}
          {items.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-light text-[#111827]">You might also like</h3>
                <Link href="/products" className="text-[#D97706] hover:text-[#7CB342] font-medium transition-colors">
                  Browse all products →
                </Link>
              </div>

              {loadingRecs ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendations.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-500 soft-shadow">
                  No specific recommendations found.
                  <Link href="/products" className="text-[#D97706] ml-1 hover:underline">
                    Continue shopping
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
