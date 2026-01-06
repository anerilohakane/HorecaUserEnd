'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Heart, Trash2, ArrowLeft, ShoppingCart, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConfirmationModal from '@/components/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function WishlistPage() {
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id;

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    interface WishlistItem {
        productId: string;
        name: string;
        price: number;
        image: string;
        unit?: string;
        badge?: string;
        inStock?: boolean;
    }

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

            // Extract IDs
            const itemsWithDetails = await Promise.all(
                rawItems.map(async (item: any) => {
                    // Normalize ID
                    const productId = item.product?._id || item.product?.id || item.product || item.productId;

                    if (!productId) return null;

                    try {
                        // Fetch full product details
                        const prodRes = await fetch(`${API_BASE}/api/products/${productId}`);
                        const prodJson = await prodRes.json();
                        const productData = prodJson.data || prodJson.product || prodJson;

                        if (!productData) return null;

                        // Map to WishlistItem
                        const image =
                            productData.image ||
                            (productData.images && productData.images.length > 0 ? (productData.images[0].url || productData.images[0]) : null) ||
                            item.thumbnail ||
                            "/images/placeholder.png";

                        return {
                            productId: String(productData.id || productData._id || productId),
                            name: productData.name || item.name || "Unknown Product",
                            price: Number(productData.price || item.price || 0),
                            image: (image && !image.startsWith('http') && !image.startsWith('/')) ? `/images/products/${image}` : image,
                            unit: productData.unit || productData.uom || item.unit || 'pcs',
                            badge: productData.badge,
                            inStock: productData.inStock
                        } as WishlistItem;
                    } catch (e) {
                        console.error(`Failed to fetch details for ${productId}`, e);
                        return {
                            productId: String(productId),
                            name: item.name || "Unknown",
                            price: Number(item.price || 0),
                            image: "/images/placeholder.png",
                            unit: "pcs",
                        } as WishlistItem;
                    }
                })
            );

            setWishlistItems(itemsWithDetails.filter((i): i is WishlistItem => i !== null));
        } catch (err) {
            console.error("Wishlist fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = (productId: string) => {
        setItemToDelete(productId);
    };

    const confirmRemove = async () => {
        if (!itemToDelete) return;

        const productId = itemToDelete;
        setRemoving(productId);
        try {
            const token = localStorage.getItem("unifoods_token");
            if (!token || !userId) return;

            const res = await fetch(
                `${API_BASE}/api/wishlist?userId=${userId}&productId=${productId}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.ok) {
                setWishlistItems((prev) => prev.filter((it) => it.productId !== productId));
            }
        } catch (err) {
            console.error("Remove failed", err);
        } finally {
            setRemoving(null);
            setItemToDelete(null);
        }
    };

    const handleAddToCart = async (productId: string, quantity = 1) => {
        setAddingToCart(productId);
        try {
            const token = localStorage.getItem("unifoods_token");
            if (!token) return alert("Please login");

            const res = await fetch(`${API_BASE}/api/cart`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                    userId: userId,
                }),
            });

            const json = await res.json();
            if (!res.ok) return alert(json.message || "Failed");
            alert("Added to cart!");
        } catch (e) {
            console.error(e);
        } finally {
            setAddingToCart(null);
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
                        >
                            <AnimatePresence>
                                {wishlistItems.map((item) => (
                                    <motion.div
                                        key={item.productId}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                            <Link href={`/products/${item.productId}`}>
                                                <Image
                                                    src={item.image || "/images/placeholder.png"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized={Boolean(item.image && item.image.startsWith('http'))}
                                                />
                                                {item.badge && (
                                                    <span className="absolute top-3 left-3 bg-[#D97706] text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                disabled={removing === item.productId}
                                                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-white transition-all disabled:opacity-50 z-10"
                                                title="Remove from wishlist"
                                            >
                                                {removing === item.productId ? (
                                                    <Loader2 size={16} className="animate-spin text-gray-500" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <Link href={`/products/${item.productId}`} className="flex-grow">
                                                <h3 className="font-medium text-gray-900 group-hover:text-[#D97706] transition-colors line-clamp-2 mb-2 text-sm md:text-base">
                                                    {item.name}
                                                </h3>
                                            </Link>

                                            <div className="pt-2 border-t border-gray-50 mt-auto">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ₹{item.price.toLocaleString()}
                                                    </span>
                                                    {item.unit && <span className="text-xs text-gray-500 font-medium">/ {item.unit}</span>}
                                                </div>

                                                <button
                                                    onClick={() => handleAddToCart(item.productId)}
                                                    disabled={addingToCart === item.productId}
                                                    className="w-full bg-[#D97706] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[#D97706] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                                                >
                                                    {addingToCart === item.productId ? (
                                                        <>
                                                            <Loader2 size={16} className="animate-spin" />
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingBag size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmRemove}
                title="Remove Item?"
                message="Are you sure you want to remove this item from your wishlist? This action cannot be undone."
                confirmText="Remove"
                variant="danger"
            />
            <Footer />
        </div>
    );
}
