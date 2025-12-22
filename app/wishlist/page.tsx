'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Heart, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';

export default function WishlistPage() {
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id;
    
const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  thumbnail?: string;
}


    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && isAuthenticated && userId) {
            fetchWishlist();
        } else if (mounted) {
            setLoading(false);
        }
    }, [mounted, isAuthenticated, userId]);


    // ---------------------------------------
    // FETCH WISHLIST
    // ---------------------------------------
    const fetchWishlist = async () => {
        console.log("🔄 fetchWishlist triggered...");
        console.log("👤 User ID:", user?.id);

        if (!user?.id) {
            console.log("⛔ No user found, skipping wishlist fetch");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("unifoods_token");
            console.log("🔑 Token:", token);

            if (!token) {
                console.log("⛔ No token found");
                setLoading(false);
                return;
            }

            const url = `http://localhost:3000/api/wishlist?userId=${user.id}`;
            console.log("🌐 Fetch URL:", url);

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("📥 Raw Response:", res);

            const json = await res.json();
            console.log("📦 Wishlist JSON:", json);

            const newItems = json?.data?.items || [];
            console.log("🟩 Extracted Items:", newItems);

            setWishlistItems(newItems);
            console.log("🟢 Final wishlistItems state:", newItems);

        } catch (err) {
            console.error("🔥 Wishlist fetch failed:", err);
        } finally {
            setLoading(false);
            console.log("⏹ fetchWishlist finished");
        }
    };


    // ---------------------------------------
    // REMOVE ITEM
    // ---------------------------------------
    const handleRemoveItem = async (productId: string) => {
        setRemoving(productId);

        try {
            const token = localStorage.getItem("unifoods_token");
            if (!token) return;

            if (!userId) return;

            const res = await fetch(
                `http://localhost:3000/api/wishlist?userId=${userId}&productId=${productId}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );


            if (res.ok) {
                setWishlistItems((prev) => prev.filter((it) => it.productId !== productId));
            }
        } catch (err) {
            console.error("Remove failed", err);
        } finally {
            setRemoving(null);
        }
    };

    // ---------------------------------------
    // ADD TO CART
    // ---------------------------------------
    const handleAddToCart = async (productId: string, quantity = 1) => {
        setAddingToCart(productId);

        try {
            const token = localStorage.getItem("unifoods_token");
            if (!token) return alert("Please login");

            const res = await fetch("http://localhost:3000/api/cart", {
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

    // ---------------------------------------
    // MOVE ALL TO CART
    // ---------------------------------------
    const handleMoveAllToCart = async () => {
        for (const item of wishlistItems) {
            await handleAddToCart(item.productId, 1);
        }
    };

    // ---------------------------------------
    // UI
    // ---------------------------------------

    if (!mounted) return null;

    if (!isAuthenticated)
        return (
            <div className="min-h-screen pt-24 text-center">
                <h1>Please Login</h1>
            </div>
        );

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-50 pt-10">
                <div className="max-w-7xl mx-auto px-4">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Heart className="text-red-500" /> My Wishlist
                        </h1>

                        <Link href="/products" className="flex items-center gap-2 text-gray-600">
                            <ArrowLeft size={18} /> Back to Shop
                        </Link>
                    </div>

                    {/* LOADING */}
                    {loading && <div className="text-center py-20">Loading...</div>}

                    {/* EMPTY */}
                    {!loading && wishlistItems.length === 0 && (
                        <div className="text-center p-12 bg-white rounded-xl shadow">
                            <Heart size={80} className="text-gray-300 mx-auto mb-6" />
                            <h2>Your wishlist is empty</h2>
                        </div>
                    )}

                    {/* LIST */}
                    {!loading && wishlistItems.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                            {wishlistItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="bg-white rounded-xl shadow group overflow-hidden"
                                >

                                    {/* IMAGE */}
                                    <div className="relative aspect-square bg-gray-100 p-4">
                                        <Link href={`/products/${item.productId}`}>
                                            <Image
                                                src={item.thumbnail || "/images/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                className="object-co transition-transform group-hover:scale-105"
                                                unoptimized
                                            />
                                        </Link>

                                        <button
                                            onClick={() => handleRemoveItem(item.productId)}
                                            disabled={removing === item.productId}
                                            className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow text-gray-600 hover:bg-red-50"
                                        >
                                            {removing === item.productId ? "…" : <Trash2 size={16} />}
                                        </button>
                                    </div>

                                    {/* INFO */}
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>

                                        <p className="text-lg font-semibold text-[#D97706] mt-1">
                                            ₹{item.price}
                                        </p>

                                        <button
                                            onClick={() => handleAddToCart(item.productId)}
                                            disabled={addingToCart === item.productId}
                                            className="w-full mt-2 bg-[#D97706] text-white py-1.5 text-sm rounded-full"
                                        >
                                            {addingToCart === item.productId ? "Adding..." : "Add"}
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
