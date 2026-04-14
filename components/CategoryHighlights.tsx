'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { categories as fallbackCategories } from '@/lib/data';

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://horeca-backend-six.vercel.app').trim();

function buildApiUrl(path: string) {
  const base = API_BASE.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}

function mapCategory(raw: any) {
  if (!raw) return null;
  const id = raw._id ?? raw.id ?? raw.categoryId ?? raw.name ?? raw.title;
  const name = raw.name ?? raw.categoryName ?? raw.title ?? raw.category ?? 'Unnamed';
  const image =
    (typeof raw?.image === 'string' && raw.image) ||
    (raw?.image?.url && String(raw.image.url)) ||
    raw?.imageUrl || raw?.thumbnail || raw?.photo || null;
  return { id: String(id ?? name), name, image };
}

// Subtle gradient accent per card index
const GRADIENTS = [
  'from-black/75 via-black/30 to-transparent',
  'from-black/70 via-black/25 to-transparent',
  'from-black/65 via-black/20 to-transparent',
  'from-black/72 via-black/28 to-transparent',
  'from-black/68 via-black/22 to-transparent',
  'from-black/70 via-black/25 to-transparent',
  'from-black/65 via-black/20 to-transparent',
];

interface CatCardProps {
  cat: { id: string; name: string; image: string | null };
  index: number;
  className?: string;
  large?: boolean;
}

function CatCard({ cat, index, className = '', large = false }: CatCardProps) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(cat.name)}`}
      className={`group relative overflow-hidden rounded-2xl block ${className}`}
      style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)' }}
    >
      {/* Image */}
      <Image
        src={cat.image || '/images/placeholder.png'}
        alt={cat.name}
        fill
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        unoptimized={Boolean(cat.image?.startsWith?.('http'))}
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${GRADIENTS[index % GRADIENTS.length]} transition-opacity duration-300 group-hover:opacity-90`} />

      {/* Amber accent glow border on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-[#D97706]/0 group-hover:border-[#D97706]/70 transition-all duration-300" />

      {/* Amber left strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706] rounded-l-2xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        {/* Category name */}
        <h3 className={`font-bold text-white leading-tight drop-shadow-md ${large ? 'text-xl sm:text-2xl mb-1' : 'text-sm sm:text-base'}`}>
          {cat.name}
        </h3>
        {/* Explore label — appears on hover */}
        <div className="overflow-hidden h-0 group-hover:h-6 transition-all duration-300 ease-out">
          <span className="inline-flex items-center gap-1 text-[#D97706] text-xs font-bold tracking-wide">
            Explore <ArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Corner badge for large card */}
      {large && (
        <div className="absolute top-4 left-4 bg-[#D97706] text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
          Featured
        </div>
      )}
    </Link>
  );
}

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-gray-200 animate-pulse ${className}`} />
  );
}

export default function CategoryHighlights() {
  const [cats, setCats] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

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
        const res = await fetch(buildApiUrl('api/categories'), {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json().catch(() => null);

        let list: any[] = [];
        if (Array.isArray(json)) list = json;
        else if (Array.isArray(json?.data)) list = json.data;
        else if (Array.isArray(json?.categories)) list = json.categories;
        else if (Array.isArray(json?.results)) list = json.results;
        else if (Array.isArray(json?.data?.items)) list = json.data.items;
        else {
          const arr = Object.values(json || {}).find((v: any) => Array.isArray(v));
          if (Array.isArray(arr)) list = arr;
        }

        const mapped = (list || []).map(mapCategory).filter(Boolean);
        if (active) setCats(mapped);
      } catch {
        if (active) setCats(mappedFallback);
      } finally {
        if (active) setLoading(false);
        clearTimeout(timeoutId);
      }
    })();

    return () => { active = false; controller.abort(); clearTimeout(timeoutId); };
  }, []);

  const displayCats = (cats === null ? mappedFallback : cats).slice(0, 7);

  return (
    <section className="py-12 lg:py-20 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>

            <h2 className="text-3xl lg:text-4xl font-semibold text-[#111827] tracking-tight leading-tight">
              Shop by Category
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              Everything your bakery &amp; restaurant needs — all in one place
            </p>
          </div>

          <Link
            href="/categories"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-[#D97706] text-gray-700 hover:text-[#D97706] px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow group"
          >
            All Categories
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── Bento Grid Layout ── */}
        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            <SkeletonCard className="col-span-2 row-span-2 h-72 sm:h-80 lg:h-96" />
            <SkeletonCard className="h-36 sm:h-40 lg:h-[180px]" />
            <SkeletonCard className="h-36 sm:h-40 lg:h-[180px]" />
            <SkeletonCard className="h-36 sm:h-40 lg:h-[180px]" />
            <SkeletonCard className="h-36 sm:h-40 lg:h-[180px]" />
            <SkeletonCard className="h-36 sm:h-40 lg:h-[180px]" />
            <SkeletonCard className="h-36 sm:h-40 lg:h-[180px]" />
          </div>
        ) : (
          <div
            className="grid gap-3 lg:gap-4"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'auto',
            }}
          >
            {/* Featured card — spans 2 cols × 2 rows */}
            {displayCats[0] && (
              <div style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}>
                <CatCard
                  cat={displayCats[0]}
                  index={0}
                  large
                  className="h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[400px]"
                />
              </div>
            )}

            {/* Smaller cards — fill remaining 3 cols × 2 rows = 6 slots */}
            {displayCats.slice(1).map((cat, i) => (
              <CatCard
                key={cat.id}
                cat={cat}
                index={i + 1}
                className="min-h-[130px] sm:min-h-[170px] lg:min-h-[190px]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
