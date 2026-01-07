// "use client";
// import { featuredProducts } from '@/lib/data';
// import { ArrowRight, Plus } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function FeaturedProducts() {
//   const getBadgeColor = (badge: string) => {
//     switch (badge) {
//       case 'Bestseller':
//       case 'New':
//         return 'bg-[#D97706] text-white';
//       case 'In Stock':
//         return 'bg-emerald-500 text-white';
//       case 'Premium':
//         return 'bg-purple-500 text-white';
//       default:
//         return 'bg-gray-500 text-white';
//     }
//   };

//   return (
//     <section className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header with View All */}
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <h2 className="text-3xl lg:text-4xl font-light text-[#111827] mb-2">
//               Most Popular
//             </h2>
//             <p className="text-base text-gray-600">
//               Handpicked products trusted by professionals
//             </p>
//           </div>

//           {/* Desktop View All Button */}
//           <Link
//             href="/products"
//             className="hidden lg:flex items-center gap-2 bg-[#D97706] text-white px-6 py-3 rounded-full hover:bg-[#d48021] transition-all shadow-md hover:shadow-lg text-sm font-medium group"
//           >
//             View All
//             <ArrowRight
//               size={18}
//               className="group-hover:translate-x-1 transition-transform"
//             />
//           </Link>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {featuredProducts.map((product) => (
//             <Link
//               key={product.id}
//               href={`/products/${product.id}`}
//               className="group block cursor-pointer"
//             >
//               {/* Product Image */}
//               <div className="relative aspect-square bg-[#F5F5F5] rounded-3xl overflow-hidden mb-4 soft-shadow group-hover:elegant-shadow transition-all">
//                 <Image
//                   src={`/images/products/${product.image}`}
//                   alt={product.name}
//                   fill
//                   className="object-cover group-hover:scale-105 transition-transform duration-500"
//                 />

//                 {/* Badge */}
//                 {product.badge && (
//                   <div className="absolute top-4 left-4">
//                     <span className={`${getBadgeColor(product.badge)} px-3 py-1 rounded-full text-xs font-medium`}>
//                       {product.badge}
//                     </span>
//                   </div>
//                 )}

//                 {/* Add to Cart Button - Appears on Hover */}
//                 <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault(); // Prevent navigation when clicking "Add to Cart"
//                       e.stopPropagation();
//                       // TODO: Add to cart logic here
//                       console.log('Add to cart:', product.name);
//                     }}
//                     className="bg-white p-3 rounded-full shadow-lg hover:bg-[#D97706] hover:text-white transition-all"
//                   >
//                     <Plus size={20} strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="text-center">
//                 <h3 className="font-medium text-gray-800 mb-2 text-sm group-hover:text-[#D97706] transition-colors line-clamp-2">
//                   {product.name}
//                 </h3>
//                 <div className="flex items-center justify-center gap-2">
//                   <span className="text-lg font-semibold text-[#111827]">
//                     {product.price}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     / {product.unit}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Mobile View All Button */}
//         <div className="text-center mt-12 lg:hidden">
//           <Link
//             href="/products"
//             className="inline-flex items-center gap-2 bg-[#D97706] text-white px-8 py-4 rounded-full hover:bg-[#B45309] transition-all shadow-lg hover:shadow-xl font-medium group"
//           >
//             View All Products
//             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import { featuredProducts as fallbackFeatured } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './products/ProductCard';

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ----------------------------------
// 🔧 Utility Functions
// ----------------------------------

function buildApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://horeca-backend-six.vercel.app";
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`.replace(/([^:]\/)\/+/g, "$1");
}

function normalizeImageSrc(img: any) {
  if (!img) return "/images/placeholder.png";
  const s = String(img).trim();
  if (!s) return "/images/placeholder.png";
  if (s.startsWith("http") || s.startsWith("//")) return s;
  return `/images/products/${s}`;
}

function mapRawToCard(raw: any) {
  if (!raw) return null;

  const id = raw._id ?? raw.id ?? raw.productId ?? null;
  const name = raw.name ?? "Unnamed product";
  const price = typeof raw.price === "number" ? raw.price : Number(raw.price ?? 0);

  let imageCandidate = "";
  if (Array.isArray(raw.images) && raw.images.length)
    imageCandidate = raw.images[0].url ?? raw.images[0];
  else if (typeof raw.image === "string") imageCandidate = raw.image;

  return {
    id: id ? String(id) : null,
    name,
    price,
    unit: raw.unit ?? "pcs",
    badge: raw.badge ?? (raw.isFeatured ? "Featured" : null),
    image: normalizeImageSrc(imageCandidate),
    inStock: typeof raw.inStock === 'boolean' ? raw.inStock : (typeof raw.stockQuantity === 'number' ? raw.stockQuantity > 0 : true),
    ...raw,
  };
}

// ----------------------------------
// ⭐ FEATURED PRODUCTS COMPONENT
// ----------------------------------

export default function FeaturedProducts() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // 📌 LOAD FEATURED PRODUCTS
  // -------------------------------

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const url = buildApiUrl("api/products?featured=true&limit=8");
        const res = await fetch(url, { headers: { Accept: "application/json" } });

        if (!res.ok) throw new Error("Failed to load");

        const json = await res.json();
        let list: any[] = [];

        if (Array.isArray(json?.data?.items)) list = json.data.items;
        else if (Array.isArray(json?.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        else list = [];

        const mapped = list.map(mapRawToCard).filter(Boolean);

        if (mounted) setItems(mapped.length > 0 ? mapped : fallbackFeatured);
      } catch (err) {
        console.error("Featured fetch error", err);
        if (mounted) setItems(fallbackFeatured);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const displayed = items ?? [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#111827]">Trending Near You</h2>
            <p className="text-gray-500 mt-1">Best deals on highly demanded products</p>
          </div>

          <Link
            href="/products"
            className="hidden lg:flex items-center gap-2 text-[#D97706] font-bold hover:text-[#B45309] transition-colors"
          >
            View All <ArrowRight size={20} />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
            ))
            : displayed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-12 lg:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#D97706] text-white px-8 py-4 rounded-full font-medium shadow-lg"
          >
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
