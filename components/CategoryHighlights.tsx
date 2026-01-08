// import { categories } from '@/lib/data';
// import Image from 'next/image';

// export default function CategoryHighlights() {
//   return (
//     <section className="py-20 bg-[#FAFAF7]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-4xl lg:text-5xl font-light text-[#111827] mb-4">
//             Browse your Essentials
//           </h2>
//           <p className="text-base text-gray-600 max-w-2xl mx-auto">
//             Discover the perfect products for your bakery needs
//           </p>
//         </div>

//         {/* Categories Grid */}
//         <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
//           {categories.map((category) => (
//             <div
//               key={category.id}
//               className="group cursor-pointer flex flex-col items-center"
//             >
//               <div className="relative mb-4">
//                 {/* Circle Container */}
//                 <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-white soft-shadow group-hover:elegant-shadow transition-all duration-300 group-hover:scale-105">
//                   <div className="relative w-full h-full">
//                     <Image
//                       src={`/images/categories/${category.id}.jpg`}
//                       alt={category.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Category Name */}
//               <p className="text-center text-sm font-medium text-gray-800 group-hover:text-[#D97706] transition-colors">
//                 {category.name}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { categories as fallbackCategories } from '@/lib/data';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();

function buildApiUrl(path: string) {
  if (API_BASE) {
    const base = API_BASE.replace(/\/+$/, '');
    return `${base}/${path.replace(/^\/+/, '')}`;
  }
  return `/${path.replace(/^\/+/, '')}`;
}

function mapCategory(raw: any) {
  if (!raw) return null;
  const id = raw._id ?? raw.id ?? raw.categoryId ?? raw.name ?? raw.title;
  const name = raw.name ?? raw.categoryName ?? raw.title ?? raw.category ?? 'Unnamed';
  const image =
    (typeof raw?.image === 'string' && raw.image) ||
    (raw?.image?.url && String(raw.image.url)) ||
    raw?.imageUrl ||
    raw?.thumbnail ||
    raw?.photo ||
    null;
  return { id: String(id ?? name), name, image };
}

export default function CategoryHighlights() {
  const [cats, setCats] = useState<any[] | null>(null); // null = not loaded / error fallback
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // normalized fallback (same shape as fetched categories)
  const mappedFallback = fallbackCategories.map((c: any) => ({
    id: String(c.id ?? c._id ?? c.name),
    name: c.name ?? c.title ?? 'Unnamed',
    image: c.image ?? c.imageUrl ?? `/images/categories/${c.id}.jpg`,
  }));

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    (async () => {
      try {
        const url = buildApiUrl('api/categories');
        console.debug('[CategoryHighlights] fetching', url);
        const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });

        // if non-2xx -> throw to use fallback
        if (!res.ok) {
          const bodyText = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} ${res.statusText} ${bodyText ? `: ${bodyText}` : ''}`);
        }

        const json = await res.json().catch(() => null);
        console.debug('[CategoryHighlights] fetched json:', json);

        // Try many shapes, but be explicit: prefer json.data (array) -> json.categories -> json
        let list: any[] = [];
        if (Array.isArray(json)) list = json;
        else if (Array.isArray(json?.data)) list = json.data;
        else if (Array.isArray(json?.categories)) list = json.categories;
        else if (Array.isArray(json?.results)) list = json.results;
        else if (Array.isArray(json?.data?.items)) list = json.data.items;
        else {
          // attempt to find first array in object
          const arr = Object.values(json || {}).find((v: any) => Array.isArray(v));
          if (Array.isArray(arr)) list = arr;
        }

        // map whatever we found (could be empty array)
        const mapped = (list || []).map(mapCategory).filter(Boolean);

        if (!active) return;

        // IMPORTANT: use fetched result even if empty (don't replace with fallback)
        setCats(mapped); // mapped may be []
        setFetchError(null);
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          console.debug('[CategoryHighlights] fetch aborted');
          setFetchError('Request aborted');
        } else {
          console.error('[CategoryHighlights] fetch error:', err);
          setFetchError(String(err?.message ?? err));
        }
        // On error -> set cats to fallback so UI isn't empty
        if (active) setCats(mappedFallback);
      } finally {
        if (active) setLoading(false);
        clearTimeout(timeoutId);
      }
    })();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // decide what to display: if cats === null then still loading/initial; when fetch error we already set fallback
  const displayCats = cats === null ? mappedFallback : cats;

  return (
    <section className="py-10 lg:py-16 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111827] mb-2 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-500">
              Everything you need for your bakery
            </p>
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 text-center text-sm text-red-600">
            Failed to load categories: {fetchError}. Showing fallback categories.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* if loading and cats are empty, you can show skeletons here */}
          {displayCats.length === 0 && !loading ? (
            <div className="col-span-full text-center text-gray-500">No categories available.</div>
          ) : (
            displayCats.map((category) => (
              <a
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group cursor-pointer flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full bg-gray-50">
                  <Image
                    src={category.image || '/images/placeholder.png'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl"
                    unoptimized={Boolean(category.image && typeof category.image === 'string' && category.image.startsWith('http'))}
                  />
                </div>

                <div className="p-4 border-t border-gray-50 bg-white">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#D97706] transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
