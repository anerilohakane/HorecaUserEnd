// 'use client';

// import { useState } from 'react';
// import { ChevronDown, X } from 'lucide-react';
// import { categories, priceRanges } from '@/lib/productsData';

// interface ProductFiltersProps {
//   selectedCategory: string;
//   selectedPriceRange: string;
//   selectedRating: number;
//   onCategoryChange: (category: string) => void;
//   onPriceRangeChange: (range: string) => void;
//   onRatingChange: (rating: number) => void;
//   onClearFilters: () => void;
// }

// export default function ProductFilters({
//   selectedCategory,
//   selectedPriceRange,
//   selectedRating,
//   onCategoryChange,
//   onPriceRangeChange,
//   onRatingChange,
//   onClearFilters
// }: ProductFiltersProps) {
//   const [openSections, setOpenSections] = useState({
//     category: true,
//     price: true,
//     rating: true,
//   });

//   const toggleSection = (section: keyof typeof openSections) => {
//     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const hasActiveFilters = selectedCategory !== 'all' ||
//     selectedPriceRange !== 'all' ||
//     selectedRating > 0;

//   return (
//     <div className="bg-white rounded-2xl soft-shadow p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-[#111827]">Filters</h3>
//         {hasActiveFilters && (
//           <button
//             onClick={onClearFilters}
//             className="text-sm text-[#D97706] hover:text-[#B45309] font-medium flex items-center gap-1"
//           >
//             <X size={16} />
//             Clear All
//           </button>
//         )}
//       </div>

//       {/* Category Filter */}
//       <div className="mb-6">
//         <button
//           onClick={() => toggleSection('category')}
//           className="flex items-center justify-between w-full mb-3"
//         >
//           <h4 className="font-medium text-[#111827]">Category</h4>
//           <ChevronDown
//             size={18}
//             className={`transition-transform ${openSections.category ? 'rotate-180' : ''}`}
//           />
//         </button>

//         {openSections.category && (
//           <div className="space-y-2">
//             {categories.map((cat) => (
//               <label
//                 key={cat.id}
//                 className="flex items-center justify-between cursor-pointer group"
//               >
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="category"
//                     value={cat.id}
//                     checked={selectedCategory === cat.id}
//                     onChange={(e) => onCategoryChange(e.target.value)}
//                     className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//                   />
//                   <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">
//                     {cat.name}
//                   </span>
//                 </div>
//                 <span className="text-xs text-gray-400">({cat.count})</span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Price Range Filter */}
//       <div className="mb-6 pb-6 border-b border-gray-100">
//         <button
//           onClick={() => toggleSection('price')}
//           className="flex items-center justify-between w-full mb-3"
//         >
//           <h4 className="font-medium text-[#111827]">Price Range</h4>
//           <ChevronDown
//             size={18}
//             className={`transition-transform ${openSections.price ? 'rotate-180' : ''}`}
//           />
//         </button>

//         {openSections.price && (
//           <div className="space-y-2">
//             {priceRanges.map((range) => (
//               <label
//                 key={range.id}
//                 className="flex items-center gap-2 cursor-pointer group"
//               >
//                 <input
//                   type="radio"
//                   name="priceRange"
//                   value={range.id}
//                   checked={selectedPriceRange === range.id}
//                   onChange={(e) => onPriceRangeChange(e.target.value)}
//                   className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//                 />
//                 <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">
//                   {range.label}
//                 </span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Rating Filter */}
//       <div>
//         <button
//           onClick={() => toggleSection('rating')}
//           className="flex items-center justify-between w-full mb-3"
//         >
//           <h4 className="font-medium text-[#111827]">Minimum Rating</h4>
//           <ChevronDown
//             size={18}
//             className={`transition-transform ${openSections.rating ? 'rotate-180' : ''}`}
//           />
//         </button>

//         {openSections.rating && (
//           <div className="space-y-2">
//             {[4.5, 4.0, 3.5, 3.0].map((rating) => (
//               <label
//                 key={rating}
//                 className="flex items-center gap-2 cursor-pointer group"
//               >
//                 <input
//                   type="radio"
//                   name="rating"
//                   value={rating}
//                   checked={selectedRating === rating}
//                   onChange={(e) => onRatingChange(parseFloat(e.target.value))}
//                   className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//                 />
//                 <div className="flex items-center gap-1">
//                   <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">
//                     {rating}
//                   </span>
//                   <span className="text-[#FFB800]">★</span>
//                   <span className="text-sm text-gray-500">& above</span>
//                 </div>
//               </label>
//             ))}
//             <label className="flex items-center gap-2 cursor-pointer group">
//               <input
//                 type="radio"
//                 name="rating"
//                 value={0}
//                 checked={selectedRating === 0}
//                 onChange={() => onRatingChange(0)}
//                 className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//               />
//               <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">
//                 All Ratings
//               </span>
//             </label>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// 'use client';

// import React, { useEffect, useState } from 'react';
// import { ChevronDown, X } from 'lucide-react';

// export interface CategoryItem {
//   id: string;
//   name: string;
//   count?: number;
// }

// interface ProductFiltersProps {
//   selectedCategory: string;
//   selectedPriceRange: string;
//   selectedRating: number;
//   onCategoryChange: (category: string) => void;
//   onPriceRangeChange: (range: string) => void;
//   onRatingChange: (rating: number) => void;
//   onClearFilters: () => void;
// }

// const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();

// export default function ProductFilters({
//   selectedCategory,
//   selectedPriceRange,
//   selectedRating,
//   onCategoryChange,
//   onPriceRangeChange,
//   onRatingChange,
//   onClearFilters,
// }: ProductFiltersProps) {
//   const [openSections, setOpenSections] = useState({
//     category: true,
//     price: true,
//     rating: true,
//   });

//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Utility: build URL safely (handles empty API_BASE)
//   const buildUrl = (path: string) => {
//     const base = API_BASE.replace(/\/+$/, '');
//     const raw = base ? `${base}/${path.replace(/^\/+/, '')}` : `/${path.replace(/^\/+/, '')}`;
//     return raw.replace(/([^:]\/)\/+/g, '$1');
//   };

//   // Utility: try to find any array inside common response shapes
//   const findArrayInResponse = (obj: any): any[] => {
//     if (!obj) return [];
//     if (Array.isArray(obj)) return obj;

//     // common top-level fields
//     const candidates = [
//       'data',
//       'items',
//       'results',
//       'categories',
//       'docs',
//       'payload',
//       'rows',
//       'list',
//       'body',
//       'results',
//     ];

//     // if data itself is an array
//     if (Array.isArray(obj.data)) return obj.data;

//     for (const key of candidates) {
//       const v = obj[key];
//       if (Array.isArray(v)) return v;
//       // nested like data.docs or data.categories
//       if (v && typeof v === 'object') {
//         for (const subKey of Object.keys(v)) {
//           if (Array.isArray(v[subKey])) return v[subKey];
//         }
//       }
//     }

//     // last resort: deep search first-level nested arrays
//     for (const k of Object.keys(obj)) {
//       try {
//         const val = obj[k];
//         if (Array.isArray(val)) return val;
//         if (val && typeof val === 'object') {
//           for (const kk of Object.keys(val)) {
//             if (Array.isArray(val[kk])) return val[kk];
//           }
//         }
//       } catch {
//         /* ignore */
//       }
//     }

//     return [];
//   };

//   useEffect(() => {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000);

//     const fetchCategories = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const url = buildUrl('api/categories');
//         console.debug('[ProductFilters] fetching categories from', url);

//         const res = await fetch(url, {
//           signal: controller.signal,
//           headers: { Accept: 'application/json' },
//         });

//         if (!res.ok) {
//           let bodyMsg = '';
//           try {
//             const b = await res.json();
//             bodyMsg = b?.message ? ` — ${b.message}` : JSON.stringify(b);
//           } catch (e) {
//             /* ignore parse errors */
//           }
//           throw new Error(`Failed to fetch categories (status ${res.status})${bodyMsg}`);
//         }

//         const json = await res.json();
//         console.debug('[ProductFilters] raw response', json);

//         const list = findArrayInResponse(json);
//         console.debug('[ProductFilters] resolved categories list length', list.length);

//         const mapped = list
//           .map((c: any) => {
//             if (!c) return null;
//             const id = c._id ?? c.id ?? (c.name ? String(c.name) : undefined);
//             if (!id) return null;
//             return {
//               id: String(id),
//               name: c.name ?? c.title ?? 'Unnamed',
//               count: typeof c.count === 'number' ? c.count : undefined,
//             };
//           })
//           .filter(Boolean) as CategoryItem[];

//         setCategories(mapped);
//       } catch (err: any) {
//         if (err?.name === 'AbortError') {
//           console.debug('[ProductFilters] fetch aborted');
//         } else {
//           console.error('[ProductFilters] fetchCategories', err);
//           setError(err?.message ?? 'Failed to load categories');
//         }
//       } finally {
//         clearTimeout(timeout);
//         setLoading(false);
//       }
//     };

//     fetchCategories();

//     return () => {
//       controller.abort();
//       clearTimeout(timeout);
//     };
//     // intentionally empty deps -- if you want to refetch when API_BASE changes add it here
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const toggleSection = (s: keyof typeof openSections) => setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));

//   const hasActiveFilters = selectedCategory !== 'all' || selectedPriceRange !== 'all' || selectedRating > 0;

//   const priceRanges = [
//     { id: 'all', label: 'All' },
//     { id: 'under-100', label: 'Under ₹100' },
//     { id: '100-200', label: '₹100 - ₹200' },
//     { id: '200-300', label: '₹200 - ₹300' },
//     { id: '300-400', label: '₹300 - ₹400' },
//     { id: 'above-400', label: 'Above ₹400' },
//   ];

//   return (
//     <div className="bg-white rounded-2xl soft-shadow p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-[#111827]">Filters</h3>
//         {hasActiveFilters && (
//           <button onClick={onClearFilters} className="text-sm text-[#D97706] hover:text-[#B45309] font-medium flex items-center gap-1">
//             <X size={16} />
//             Clear All
//           </button>
//         )}
//       </div>

//       {/* Category */}
//       <div className="mb-6">
//         <button onClick={() => toggleSection('category')} className="flex items-center justify-between w-full mb-3">
//           <h4 className="font-medium text-[#111827]">Category</h4>
//           <ChevronDown size={18} className={`transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
//         </button>

//         {openSections.category && (
//           <div className="space-y-2" aria-busy={loading}>
//             {loading ? (
//               <div className="text-sm text-gray-500">Loading categories...</div>
//             ) : error ? (
//               <div className="text-sm text-red-500">{error}</div>
//             ) : categories.length === 0 ? (
//               <div className="text-sm text-gray-500">No categories</div>
//             ) : (
//               categories.map(cat => (
//                 <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="category"
//                       value={cat.id}
//                       checked={selectedCategory === cat.id}
//                       onChange={(e) => onCategoryChange(e.target.value)}
//                       className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//                     />
//                     <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">{cat.name}</span>
//                   </div>
//                   <span className="text-xs text-gray-400">({cat.count ?? '—'})</span>
//                 </label>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {/* Price */}
//       <div className="mb-6 pb-6 border-b border-gray-100">
//         <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full mb-3">
//           <h4 className="font-medium text-[#111827]">Price Range</h4>
//           <ChevronDown size={18} className={`transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
//         </button>

//         {openSections.price && (
//           <div className="space-y-2">
//             {priceRanges.map(range => (
//               <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
//                 <input
//                   type="radio"
//                   name="priceRange"
//                   value={range.id}
//                   checked={selectedPriceRange === range.id}
//                   onChange={(e) => onPriceRangeChange(e.target.value)}
//                   className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//                 />
//                 <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">{range.label}</span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Rating */}
//       <div>
//         <button onClick={() => toggleSection('rating')} className="flex items-center justify-between w-full mb-3">
//           <h4 className="font-medium text-[#111827]">Minimum Rating</h4>
//           <ChevronDown size={18} className={`transition-transform ${openSections.rating ? 'rotate-180' : ''}`} />
//         </button>

//         {openSections.rating && (
//           <div className="space-y-2">
//             {[4.5, 4.0, 3.5, 3.0].map(r => (
//               <label key={r} className="flex items-center gap-2 cursor-pointer group">
//                 <input
//                   type="radio"
//                   name="rating"
//                   value={r}
//                   checked={selectedRating === r}
//                   onChange={(e) => onRatingChange(parseFloat(e.target.value))}
//                   className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//                 />
//                 <div className="flex items-center gap-1">
//                   <span className="text-sm text-gray-700 group-hover:text-[#D97706]">{r}</span>
//                   <span className="text-[#FFB800]">★</span>
//                   <span className="text-sm text-gray-500">& above</span>
//                 </div>
//               </label>
//             ))}
//             <label className="flex items-center gap-2 cursor-pointer group">
//               <input
//                 type="radio"
//                 name="rating"
//                 value={0}
//                 checked={selectedRating === 0}
//                 onChange={() => onRatingChange(0)}
//                 className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
//               />
//               <span className="text-sm text-gray-700 group-hover:text-[#D97706]">All Ratings</span>
//             </label>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  children?: CategoryItem[];
}

interface ProductFiltersProps {
  selectedCategory: string;
  selectedPriceRange: string;
  selectedRating: number;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: string) => void;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim();
const buildUrl = (path: string) => {
  const base = API_BASE.replace(/\/+$/, '');
  const raw = base ? `${base}/${path.replace(/^\/+/, '')}` : `/${path.replace(/^\/+/, '')}`;
  return raw.replace(/([^:]\/)\/+/g, '$1');
};

/**
 * Resolve common response shapes into an array of categories.
 * Accepts:
 *  - { data: { items: [...] } }
 *  - { data: [...] }
 *  - { items: [...] }
 *  - [ ... ]
 */
const resolveCategoriesList = (json: any): any[] => {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.items)) return json.items;
  if (Array.isArray(json.categories)) return json.categories;
  // nested common shapes
  if (json?.data?.items && Array.isArray(json.data.items)) return json.data.items;
  // try to find first array property
  const arr = Object.values(json).find((v: any) => Array.isArray(v));
  if (Array.isArray(arr)) return arr;
  return [];
};

export default function ProductFilters({
  selectedCategory,
  selectedPriceRange,
  selectedRating,
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
  });

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // track which parent id is expanded (accordion)
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        // include children so the API returns { children: [...] } per category
        const url = buildUrl('api/categories?include=children');
        const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText} ${text}`);
        }
        const json = await res.json();
        const list = resolveCategoriesList(json);

        // map to CategoryItem (prefer children array from API)
        const mapped: CategoryItem[] = list.map((c: any) => {
          const id = c._id ?? c.id ?? String(c.name ?? '');
          const name = c.name ?? c.title ?? 'Unnamed';
          const childrenFromApi = c.children ?? c.subcategories ?? [];
          const children = Array.isArray(childrenFromApi)
            ? childrenFromApi.map((ch: any) => ({
              id: ch._id ?? ch.id ?? String(ch.name ?? ''),
              name: ch.name ?? ch.title ?? 'Unnamed',
              count: typeof ch.productCount === 'number' ? ch.productCount : undefined,
            }))
            : [];
          return {
            id: String(id),
            name,
            count: typeof c.productCount === 'number' ? c.productCount : undefined,
            children,
          };
        });

        setCategories(mapped);
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          console.debug('[ProductFilters] fetch aborted');
        } else {
          console.error('[ProductFilters] fetchCategories', err);
          setError(err?.message ?? 'Failed to load categories');
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const toggleSection = (s: keyof typeof openSections) => setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));
  const toggleParent = (id: string) => setExpandedParents(prev => ({ ...prev, [id]: !prev[id] }));

  const hasActiveFilters = selectedCategory !== 'all' || selectedPriceRange !== 'all' || selectedRating > 0;

  const priceRanges = [
    { id: 'all', label: 'All' },
    { id: 'under-100', label: 'Under ₹100' },
    { id: '100-200', label: '₹100 - ₹200' },
    { id: '200-300', label: '₹200 - ₹300' },
    { id: '300-400', label: '₹300 - ₹400' },
    { id: 'above-400', label: 'Above ₹400' },
  ];

  return (
    <div className="bg-white rounded-2xl soft-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#111827]">Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-sm text-[#D97706] hover:text-[#B45309] font-medium flex items-center gap-1">
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-6">
        <button onClick={() => toggleSection('category')} className="flex items-center justify-between w-full mb-3">
          <h4 className="font-medium text-[#111827]">Category</h4>
          <ChevronDown size={18} className={`transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
        </button>

        {openSections.category && (
          <div className="space-y-2" aria-busy={loading}>
            {loading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : categories.length === 0 ? (
              <div className="text-sm text-gray-500">No categories</div>
            ) : (
              // Render parent categories with toggle & nested subcategories
              <div className="space-y-3">
                {/* 'All' option */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={() => onCategoryChange('all')}
                      className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">All Categories</span>
                  </div>
                  <span className="text-xs text-gray-400">({categories.reduce((s, c) => s + (c.count ?? 0), 0) || '—'})</span>
                </label>

                {categories.map((cat) => (
                  <div key={cat.id} className="border border-transparent rounded-lg p-2 group hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          value={cat.id}
                          checked={selectedCategory === cat.id}
                          onChange={() => {
                            onCategoryChange(cat.id);
                            // auto-expand when parent selected
                            setExpandedParents(prev => ({ ...prev, [cat.id]: true }));
                          }}
                          className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
                        />
                        <div>
                          <div className="text-sm text-gray-800">{cat.name}</div>
                          {typeof cat.count === 'number' && (
                            <div className="text-xs text-gray-400">({cat.count} products)</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {Array.isArray(cat.children) && cat.children.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleParent(cat.id)}
                            aria-expanded={!!expandedParents[cat.id]}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <ChevronDown size={16} className={`transition-transform ${expandedParents[cat.id] ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subcategories */}
                    {Array.isArray(cat.children) && cat.children.length > 0 && expandedParents[cat.id] && (
                      <div className="mt-3 ml-7 space-y-2">
                        {cat.children.map((sub) => (
                          <label key={sub.id} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="category"
                                value={sub.id}
                                checked={selectedCategory === sub.id}
                                onChange={() => onCategoryChange(sub.id)}
                                className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">{sub.name}</span>
                            </div>
                            <span className="text-xs text-gray-400">({sub.count ?? '—'})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full mb-3">
          <h4 className="font-medium text-[#111827]">Price Range</h4>
          <ChevronDown size={18} className={`transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
        </button>

        {openSections.price && (
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.id}
                  checked={selectedPriceRange === range.id}
                  onChange={(e) => onPriceRangeChange(e.target.value)}
                  className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#D97706] transition-colors">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <button onClick={() => toggleSection('rating')} className="flex items-center justify-between w-full mb-3">
          <h4 className="font-medium text-[#111827]">Minimum Rating</h4>
          <ChevronDown size={18} className={`transition-transform ${openSections.rating ? 'rotate-180' : ''}`} />
        </button>

        {openSections.rating && (
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map(r => (
              <label key={r} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  value={r}
                  checked={selectedRating === r}
                  onChange={(e) => onRatingChange(parseFloat(e.target.value))}
                  className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-700 group-hover:text-[#D97706]">{r}</span>
                  <span className="text-[#FFB800]">★</span>
                  <span className="text-sm text-gray-500">& above</span>
                </div>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                value={0}
                checked={selectedRating === 0}
                onChange={() => onRatingChange(0)}
                className="w-4 h-4 text-[#D97706] focus:ring-[#D97706]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#D97706]">All Ratings</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
