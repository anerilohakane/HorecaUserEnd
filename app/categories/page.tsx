'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Loader2 } from 'lucide-react';
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

export default function CategoriesPage() {
    const [cats, setCats] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fallback
    const mappedFallback = fallbackCategories.map((c: any) => ({
        id: String(c.id ?? c._id ?? c.name),
        name: c.name ?? c.title ?? 'Unnamed',
        image: c.image ?? c.imageUrl ?? `/images/categories/${c.id}.jpg`,
    }));

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const url = buildApiUrl('api/categories');
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();

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

                const mapped = (list || []).map(mapCategory).filter(Boolean);
                if (active) {
                    // correct: if empty, try fallback?
                    if (mapped.length > 0) {
                        setCats(mapped);
                    } else {
                        console.warn("Categories API returned empty list, using fallback.");
                        setCats(mappedFallback);
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (active) {
                    setCats(mappedFallback); // Use fallback on error
                    setLoading(false);
                }
            }
        })();
        return () => { active = false; };
    }, []);

    const displayCats = cats || mappedFallback;
    const filteredCats = displayCats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            {/* Hero Section */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111827] mb-4">
                        Explore Categories
                    </h1>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
                        Find everything you need for your bakery, from premium ingredients to essential tools, organized for your convenience.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 outline-none shadow-sm transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-[#D97706] animate-spin mb-4" />
                            <p className="text-gray-500">Loading categories...</p>
                        </div>
                    ) : filteredCats.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-600">No categories found matching "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-[#D97706] font-medium hover:underline"
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                            {filteredCats.map((category) => (
                                <a
                                    key={category.id}
                                    href={`/products?category=${encodeURIComponent(category.name)}`}
                                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <Image
                                            src={category.image || '/images/placeholder.png'}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            unoptimized={Boolean(category.image && typeof category.image === 'string' && category.image.startsWith('http'))}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-medium text-gray-900 group-hover:text-[#D97706] transition-colors line-clamp-2">
                                            {category.name}
                                        </h3>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
