'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Heart, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function WishlistPage() {
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id;

    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && isAuthenticated && userId) {
            fetchWishlist();
        } else if (mounted) {
            setLoading(false);
        }
    }, [mounted, isAuthenticated, userId]);

    const fetchWishlist = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("unifoods_token");
            if (!token) {
                setLoading(false);
                return;
            }
            const res = await fetch(`${API_BASE}/api/wishlist?userId=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            const rawItems = json?.data?.items || [];

            // Extract IDs and map to Product
            const itemsWithDetails = await Promise.all(
                rawItems.map(async (item: any) => {
                    const productId = item.product?._id || item.product?.id || item.product || item.productId;

                    if (!productId) return null;

                    try {
                        // Fetch full product details
                        const prodRes = await fetch(`${API_BASE}/api/products/${productId}`);
                        const prodJson = await prodRes.json();
                        const productData = prodJson.data || prodJson.product || prodJson;

                        if (!productData) return null;

                        const image =
                            productData.image ||
                            (productData.images && productData.images.length > 0 ? (productData.images[0].url || productData.images[0]) : null) ||
                            item.thumbnail ||
                            "/images/placeholder.png";

                        return {
                            id: String(productData.id || productData._id || productId),
                            name: productData.name || item.name || "Unknown Product",
                            price: Number(productData.price || item.price || 0),
                            image: (image && !image.startsWith('http') && !image.startsWith('/')) ? `/images/products/${image}` : image,
                            unit: productData.unit || productData.uom || item.unit || 'pcs',
                            badge: productData.badge,
                            inStock: typeof productData.inStock === 'boolean' ? productData.inStock : (productData.stockQuantity > 0),
                            stockQuantity: productData.stockQuantity,
                            rating: productData.rating || productData.averageRating || 0,
                            reviews: productData.reviews || productData.totalReviews || 0,
                            description: productData.description || '',
                            category: productData.category || '',
                            minOrder: productData.minOrder || 1,
                            discount: productData.discount || productData.offerPercentage || 0,
                        } as Product;
                    } catch (e) {
                        // Fallback if product fetch fails
                        return {
                            id: String(productId),
                            name: item.name || "Unknown",
                            price: Number(item.price || 0),
                            image: "/images/placeholder.png",
                            unit: "pcs",
                            inStock: true,
                            rating: 0,
                            reviews: 0,
                            description: '',
                            category: '',
                            minOrder: 1,
                        } as Product;
                    }
                })
            );

            setWishlistItems(itemsWithDetails.filter((i): i is Product => i !== null));
        } catch (err) {
            console.error("Wishlist fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };


    if (!mounted) return null;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#F0F4E8] flex flex-col items-center justify-center p-4">
                <Header />
                <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg mt-20">
                    <div className="w-16 h-16 bg-[#D97706]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-8 h-8 text-[#D97706]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h1>
                    <p className="text-gray-600 mb-8">Login to view and manage your wishlist items.</p>
                    <Link
                        href="/login"
                        className="block w-full bg-[#D97706] text-white py-3 rounded-full font-medium hover:bg-[#B45309] transition-colors"
                    >
                        Login Now
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            {/* Hero Section */}
            <div className="py-12">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111827] flex items-center gap-3">
                        <Heart className="text-[#D97706] fill-[#D97706]" size={32} />
                        My Wishlist
                    </h1>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-[#D97706] font-medium hover:text-[#B45309] transition-colors"
                    >
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow py-8 bg-[#FAFAF7]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-[#D97706] animate-spin mb-4" />
                            <p className="text-gray-500">Loading your favorites...</p>
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={40} className="text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't saved any items yet. Browse our products to find your essentials.</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 bg-[#D97706] text-white px-8 py-3 rounded-full font-medium hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Browse Products <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex overflow-x-auto pb-8 gap-4 px-1 snap-x scrollbar-hide"
                        >
                            <AnimatePresence>
                                {wishlistItems.map((item) => (
                                    <div key={item.id} className="min-w-[260px] md:min-w-[280px] snap-start">
                                        <ProductCard
                                            product={item}
                                            initialWishlistState={true}
                                            onRemove={(id) => setWishlistItems(prev => prev.filter(p => p.id !== id))}
                                        />
                                    </div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
