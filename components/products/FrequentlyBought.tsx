
'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/types/product';
import { useAuth } from '@/lib/context/AuthContext';
import { Sparkles, Loader } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

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
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && Array.isArray(json.data)) {
                        setProducts(json.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch frequent items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFrequentItems();
    }, [user?.id, isAuthenticated]);

    if (!isAuthenticated || (!loading && products.length === 0)) return null;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                    <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Regulars</h2>
                {loading && <Loader size={16} className="animate-spin text-gray-400" />}
            </div>

            <p className="text-sm text-gray-500 mb-4 -mt-2">Items you buy frequently. Subscribe to save time!</p>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {products.map(product => (
                    <div key={product.id} className="min-w-[200px] w-[200px] snap-start">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
