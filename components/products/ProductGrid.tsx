// 'use client';

// import { useState, useMemo } from 'react';
// import { Product, SortOption } from '@/lib/types/product';
// import { allProducts, sortOptions } from '@/lib/productsData';
// import ProductCard from './ProductCard';
// import ProductFilters from './ProductFilters';
// import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

// export default function ProductGrid() {
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedPriceRange, setSelectedPriceRange] = useState('all');
//   const [selectedRating, setSelectedRating] = useState(0);
//   const [sortBy, setSortBy] = useState<SortOption>('popular');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [showFilters, setShowFilters] = useState(false);

//   // Filter products
//   const filteredProducts = useMemo(() => {
//     return allProducts.filter((product) => {
//       // Category filter
//       if (selectedCategory !== 'all') {
//         const categoryMatch = product.category.toLowerCase().replace(/\s+/g, '-');
//         if (categoryMatch !== selectedCategory) return false;
//       }

//       // Price range filter
//       if (selectedPriceRange !== 'all') {
//         const ranges: Record<string, { min: number; max: number }> = {
//           'under-100': { min: 0, max: 100 },
//           '100-200': { min: 100, max: 200 },
//           '200-300': { min: 200, max: 300 },
//           '300-400': { min: 300, max: 400 },
//           'above-400': { min: 400, max: Infinity },
//         };
//         const range = ranges[selectedPriceRange];
//         if (product.price < range.min || product.price > range.max) return false;
//       }

//       // Rating filter
//       if (selectedRating > 0 && product.rating < selectedRating) {
//         return false;
//       }

//       return true;
//     });
//   }, [selectedCategory, selectedPriceRange, selectedRating]);

//   // Sort products
//   const sortedProducts = useMemo(() => {
//     const sorted = [...filteredProducts];

//     switch (sortBy) {
//       case 'price-low':
//         return sorted.sort((a, b) => a.price - b.price);
//       case 'price-high':
//         return sorted.sort((a, b) => b.price - a.price);
//       case 'rating':
//         return sorted.sort((a, b) => b.rating - a.rating);
//       case 'newest':
//         return sorted.sort((a, b) => b.id - a.id);
//       case 'name-az':
//         return sorted.sort((a, b) => a.name.localeCompare(b.name));
//       case 'name-za':
//         return sorted.sort((a, b) => b.name.localeCompare(a.name));
//       case 'popular':
//       default:
//         return sorted.sort((a, b) => b.reviews - a.reviews);
//     }
//   }, [filteredProducts, sortBy]);

//   const clearFilters = () => {
//     setSelectedCategory('all');
//     setSelectedPriceRange('all');
//     setSelectedRating(0);
//   };

//   return (
//     <div className="min-h-screen bg-[#FAFAF7] py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Breadcrumb */}
//         <div className="mb-6">
//           <nav className="flex items-center gap-2 text-sm text-gray-600">
//             <a href="/" className="hover:text-[#D97706] transition-colors">Home</a>
//             <span>/</span>
//             <span className="text-[#111827]">Products</span>
//           </nav>
//         </div>

//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-light text-[#111827] mb-2">
//             All Products
//           </h1>
//           <p className="text-gray-600">
//             Discover our complete range of bakery supplies and ingredients
//           </p>
//         </div>

//         {/* Toolbar */}
//         <div className="bg-white rounded-2xl soft-shadow p-4 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             {/* Results Count */}
//             <div className="text-sm text-gray-600">
//               Showing <span className="font-semibold text-[#111827]">{sortedProducts.length}</span> products
//             </div>

//             {/* Controls */}
//             <div className="flex items-center gap-4">
//               {/* Mobile Filter Toggle */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:border-[#D97706] transition-colors"
//               >
//                 <SlidersHorizontal size={18} />
//                 <span className="text-sm">Filters</span>
//               </button>

//               {/* Sort Dropdown */}
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as SortOption)}
//                 className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#D97706] transition-colors"
//               >
//                 {sortOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>

//               {/* View Mode Toggle */}
//               <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-full transition-colors ${
//                     viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
//                   }`}
//                 >
//                   <LayoutGrid size={18} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-full transition-colors ${
//                     viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
//                   }`}
//                 >
//                   <List size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid lg:grid-cols-4 gap-6">
//           {/* Filters Sidebar - Desktop */}
//           <div className="hidden lg:block">
//             <ProductFilters
//               selectedCategory={selectedCategory}
//               selectedPriceRange={selectedPriceRange}
//               selectedRating={selectedRating}
//               onCategoryChange={setSelectedCategory}
//               onPriceRangeChange={setSelectedPriceRange}
//               onRatingChange={setSelectedRating}
//               onClearFilters={clearFilters}
//             />
//           </div>

//           {/* Mobile Filters */}
//           {showFilters && (
//             <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
//               <div className="bg-white h-full w-80 max-w-full p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                 <ProductFilters
//                   selectedCategory={selectedCategory}
//                   selectedPriceRange={selectedPriceRange}
//                   selectedRating={selectedRating}
//                   onCategoryChange={setSelectedCategory}
//                   onPriceRangeChange={setSelectedPriceRange}
//                   onRatingChange={setSelectedRating}
//                   onClearFilters={clearFilters}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Products Grid */}
//           <div className="lg:col-span-3">
//             {sortedProducts.length > 0 ? (
//               <div className={`grid gap-6 ${
//                 viewMode === 'grid' 
//                   ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
//                   : 'grid-cols-1'
//               }`}>
//                 {sortedProducts.map((product) => (
//                   <ProductCard key={product.id} product={product} />
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl soft-shadow p-12 text-center">
//                 <div className="text-6xl mb-4">🔍</div>
//                 <h3 className="text-xl font-medium text-[#111827] mb-2">
//                   No products found
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   Try adjusting your filters to see more results
//                 </p>
//                 <button
//                   onClick={clearFilters}
//                   className="bg-[#D97706] text-white px-6 py-3 rounded-full hover:bg-[#B45309] transition-all"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// components/products/ProductGrid.tsx
// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import ProductFilters from './ProductFilters';
// import ProductCard from './ProductCard';
// import type { Product } from '@/lib/types/product';

// interface ProductGridProps {
//   initialProducts?: Product[];
// }

// // Skeleton Card Component (matches your ProductCard design exactly)
// const SkeletonCard = () => (
//   <div className="group bg-white rounded-2xl overflow-hidden soft-shadow animate-pulse">
//     <div className="relative aspect-square bg-gray-200" />
//     <div className="p-4 space-y-3">
//       <div className="h-3 bg-gray-200 rounded w-24" />
//       <div className="h-5 bg-gray-300 rounded w-full" />
//       <div className="h-4 bg-gray-200 rounded w-3/4" />
//       <div className="flex items-center gap-2">
//         <div className="h-4 bg-gray-200 rounded w-12" />
//         <div className="h-3 bg-gray-200 rounded w-16" />
//       </div>
//       <div className="h-7 bg-gray-300 rounded w-28" />
//       <div className="h-4 bg-gray-200 rounded w-32" />
//       <div className="h-10 bg-gray-300 rounded-full mt-4" />
//     </div>
//   </div>
// );

// export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
//   const [products, setProducts] = useState<Product[]>(initialProducts);
//   const [loading, setLoading] = useState<boolean>(initialProducts.length === 0);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
//   const [selectedRating, setSelectedRating] = useState<number>(0);

//   // Fetch products only if not provided via SSR
//   useEffect(() => {
//     if (initialProducts.length > 0) {
//       setLoading(false);
//       return;
//     }

//     const controller = new AbortController();

//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();
//         const base = API_BASE.replace(/\/+$/, '');
//         const url = base ? `${base}/api/products` : '/api/products';

//         const res = await fetch(url, {
//           signal: controller.signal,
//           headers: { Accept: 'application/json' },
//           cache: 'no-store',
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
//         }

//         const json = await res.json();
//         const productList = json?.data?.items ?? json?.data ?? json?.products ?? [];

//         if (!Array.isArray(productList) || productList.length === 0) {
//           setError('No products available at the moment');
//           setProducts([]);
//         } else {
//           setProducts(productList as Product[]);
//         }
//       } catch (err: any) {
//         if (err.name === 'AbortError') return;
//         console.error('Error fetching products:', err);
//         setError(err.message || 'Failed to load products');
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => controller.abort();
//   }, [initialProducts]);

//   // Filter handlers
//   const onCategoryChange = (category: string) => setSelectedCategory(category);
//   const onPriceRangeChange = (range: string) => setSelectedPriceRange(range);
//   const onRatingChange = (rating: number) => setSelectedRating(rating);
//   const onClearFilters = () => {
//     setSelectedCategory('all');
//     setSelectedPriceRange('all');
//     setSelectedRating(0);
//   };

//   // Safe field accessors
//   const getCategoryId = (p: any): string => {
//     if (typeof p.category === 'string') return p.category;
//     if (p.category?._id) return p.category._id;
//     if (p.category?.id) return p.category.id;
//     if (p.category?.slug) return p.category.slug;
//     if (p.categoryId) return p.categoryId;
//     return '';
//   };

//   const getPrice = (p: any): number => Number(p.price ?? p.price?.amount ?? 0);
//   const getRating = (p: any): number => Number(p.rating ?? p.averageRating ?? 0);
//   const getStableId = (p: any): string => p._id || p.id || p.sku || String(p.name);

//   // Filtered products with useMemo
//   const filtered = useMemo(() => {
//     return products.filter((p: any) => {
//       if (selectedCategory !== 'all') {
//         const catId = getCategoryId(p).toLowerCase();
//         if (!catId.includes(selectedCategory.toLowerCase())) return false;
//       }

//       if (selectedRating > 0 && getRating(p) < selectedRating) return false;

//       if (selectedPriceRange !== 'all') {
//         const price = getPrice(p);
//         switch (selectedPriceRange) {
//           case 'under-100': return price < 100;
//           case '100-200': return price >= 100 && price <= 200;
//           case '200-300': return price >= 200 && price <= 300;
//           case '300-400': return price >= 300 && price <= 400;
//           case 'above-400': return price > 400;
//           default: return true;
//         }
//       }

//       return true;
//     });
//   }, [products, selectedCategory, selectedPriceRange, selectedRating]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="grid grid-cols-12 gap-8">
//         {/* Filters Sidebar */}
//         <aside className="col-span-12 md:col-span-3 lg:col-span-3">
//           <ProductFilters
//             selectedCategory={selectedCategory}
//             selectedPriceRange={selectedPriceRange}
//             selectedRating={selectedRating}
//             onCategoryChange={onCategoryChange}
//             onPriceRangeChange={onPriceRangeChange}
//             onRatingChange={onRatingChange}
//             onClearFilters={onClearFilters}
//           />
//         </aside>

//         {/* Products Grid */}
//         <section className="col-span-12 md:col-span-9 lg:col-span-9">
//           {loading ? (
//             // 12 skeleton cards — matches your grid layout
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 12 }).map((_, i) => (
//                 <SkeletonCard key={`skeleton-${i}`} />
//               ))}
//             </div>
//           ) : error ? (
//             <div className="text-red-600 bg-red-50 p-8 rounded-lg text-center text-lg">
//               <strong>Error:</strong> {error}
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="text-center py-20 text-gray-500">
//               <p className="text-lg mb-4">
//                 {products.length === 0
//                   ? 'No products available from the server.'
//                   : 'No products match your current filters.'}
//               </p>
//               {products.length > 0 && (
//                 <button
//                   onClick={onClearFilters}
//                   className="text-[#D97706] font-medium underline hover:no-underline"
//                 >
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {filtered.map((product) => (
//                 <ProductCard
//                   key={getStableId(product)}
//                   product={product as Product}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Optional Debug Info */}
//           {process.env.NODE_ENV === 'development' && (
//             <div className="mt-12 text-xs text-gray-500 border-t pt-6 text-center">
//               Debug: Loaded {products.length} products → Showing {filtered.length} after filters
//               {loading && ' (loading...)'}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types/product';

interface ProductGridProps {
  initialProducts?: Product[];
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();
const buildApiUrl = (path: string) => {
  const base = API_BASE.replace(/\/+$/, '');
  const raw = base ? `${base}/${path.replace(/^\/+/, '')}` : `/${path.replace(/^\/+/, '')}`;
  return raw.replace(/([^:]\/)\/+/g, '$1');
};

// Skeleton Card Component (kept similar to your original)
const SkeletonCard = () => (
  <div className="group bg-white rounded-2xl overflow-hidden soft-shadow animate-pulse">
    <div className="relative aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="h-5 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-7 bg-gray-300 rounded w-28" />
      <div className="h-4 bg-gray-200 rounded w-32" />
      <div className="h-10 bg-gray-300 rounded-full mt-4" />
    </div>
  </div>
);

export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(initialProducts.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Filters moved into grid so we can drive fetching when category changes
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // category id or 'all'
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // Fetch products whenever selectedCategory / other filters change (or on mount if no initialProducts)
  useEffect(() => {
    // If SSR provided products and nothing changed, skip fetch
    if (initialProducts.length > 0 && selectedCategory === 'all' && selectedPriceRange === 'all' && selectedRating === 0) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(buildApiUrl('api/products'), typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
        // include server-side query for categoryId if a specific category is chosen
        if (selectedCategory && selectedCategory !== 'all') {
          url.searchParams.set('categoryId', selectedCategory);
        }
        // basic pagination defaults (you can expand this later)
        url.searchParams.set('page', '1');
        url.searchParams.set('limit', '48');

        const res = await fetch(String(url), {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText} ${text}`);
        }

        const json = await res.json();
        // tolerate multiple shapes
        const productList = json?.data?.items ?? json?.data ?? json?.products ?? json?.items ?? json ?? [];
        if (!Array.isArray(productList) || productList.length === 0) {
          setProducts([]);
          // show message only when server returned [] explicitly (not on first load)
          if (initialProducts.length === 0) {
            setError('No products available at the moment');
          } else {
            setError(null);
          }
        } else {
          setProducts(productList as Product[]);
          setError(null);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching products:', err);
        setError(err.message ?? 'Failed to load products');
        setProducts([]);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPriceRange, selectedRating, initialProducts]);

  // Filter handlers for UI controls
  const onCategoryChange = (categoryId: string) => setSelectedCategory(categoryId);
  const onPriceRangeChange = (range: string) => setSelectedPriceRange(range);
  const onRatingChange = (rating: number) => setSelectedRating(rating);
  const onClearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedRating(0);
  };

  // Local helpers (same as your existing code)
  const getPrice = (p: any): number => Number(p.price ?? p.price?.amount ?? p.discountedPrice ?? 0);
  const getRating = (p: any): number => Number(p.rating ?? p.averageRating ?? 0);
  const getStableId = (p: any): string => p._id || p.id || p.sku || String(p.name);

  // Client-side narrowing (for price & rating) - still apply after server fetch
  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      if (selectedRating > 0 && getRating(p) < selectedRating) return false;

      if (selectedPriceRange !== 'all') {
        const price = getPrice(p);
        switch (selectedPriceRange) {
          case 'under-100': return price < 100;
          case '100-200': return price >= 100 && price <= 200;
          case '200-300': return price >= 200 && price <= 300;
          case '300-400': return price >= 300 && price <= 400;
          case 'above-400': return price > 400;
          default: return true;
        }
      }

      return true;
    });
  }, [products, selectedPriceRange, selectedRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <ProductFilters
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
            selectedRating={selectedRating}
            onCategoryChange={onCategoryChange}
            onPriceRangeChange={onPriceRangeChange}
            onRatingChange={onRatingChange}
            onClearFilters={onClearFilters}
          />
        </aside>

        {/* Products Grid */}
        <section className="col-span-12 md:col-span-9 lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-600 bg-red-50 p-8 rounded-lg text-center text-lg">
              <strong>Error:</strong> {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg mb-4">
                {products.length === 0
                  ? 'No products available for the selected category.'
                  : 'No products match your current filters.'}
              </p>
              {products.length > 0 && (
                <button
                  onClick={onClearFilters}
                  className="text-[#D97706] font-medium underline hover:no-underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard
                  key={getStableId(product)}
                  product={product as Product}
                />
              ))}
            </div>
          )}

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 text-xs text-gray-500 border-t pt-6 text-center">
              Debug: Loaded {products.length} products → Showing {filtered.length} after filters
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
