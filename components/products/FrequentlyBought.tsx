
'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { Product } from '@/lib/types/product';
import { useAuth } from '@/lib/context/AuthContext';
import { Sparkles, Loader } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_HORECA_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://horeca-backend-six.vercel.app';

export default function FrequentlyBought() {
    const { user, isAuthenticated } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // If we wanted to hide this section if the user isn't logged in, we could return null early.
    // But maybe we want to show generic "Bestsellers" instead?
    // For this task, we'll focus on the user's frequent items as requested.

    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            setLoading(false);
            return;
        }

        const fetchFrequentItems = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/analytics/frequent-items?userId=${user.id}`);
                const contentType = res.headers.get("content-type");

                if (res.ok && contentType && contentType.includes("application/json")) {
                    const json = await res.json();
                    if (json.success && Array.isArray(json.data)) {
                        const uniqueMap = new Map();
                        json.data.forEach((p: any) => {
                            if (p) {
                                const pid = String(p._id || p.id || p.productId);
                                if (pid && !uniqueMap.has(pid)) {
                                    uniqueMap.set(pid, p);
                                }
                            }
                        });
                        setProducts(Array.from(uniqueMap.values()));
                    }
                } else if (!res.ok) {
                    // Suppress error in UI, just log silently
                    console.log("Failed to fetch frequent items, status:", res.status);
                }
            } catch (err: any) {
                // Use console.log instead of console.error so Next.js doesn't capture it in the dev overlay
                console.log("Failed to fetch frequent items:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFrequentItems();
    }, [user?.id, isAuthenticated]);

    if (!isAuthenticated) return null;
    if (!loading && products.length === 0) return null;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                    <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Regulars</h2>
            </div>

            <p className="text-sm text-gray-500 mb-4 -mt-2">Items you buy frequently. Subscribe to save time!</p>

            {loading ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[200px] w-[200px] snap-start">
                            <SkeletonCard />
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? null : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {products.map((product, i) => (
                        <div key={`${product._id || product.id || 'prod'}-${i}`} className="min-w-[200px] w-[200px] snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
