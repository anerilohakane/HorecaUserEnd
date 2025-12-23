'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Bell,
    Lock,
    CreditCard,
    Package,
    Star,
    Edit2,
    Camera,
    CheckCircle,
    XCircle,
    ChevronRight,
    ShoppingBag,
    Heart,
    MessageSquare,
    Settings,
    LogOut,
} from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/lib/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const ProfilePage = () => {
    const { user: authUser, isAuthenticated, token } = useAuth();

    // const [user, setUser] = useState(null);
    const [user, setUser] = useState<any | null>(null);

    // const [orders, setOrders] = useState([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [savedItemsCount, setSavedItemsCount] = useState(0);

    const getInitials = (name?: string) => {
        if (!name) return "";

        const words = name.trim().split(" ").filter(Boolean);

        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }

        return (
            words[0][0].toUpperCase() +
            words[words.length - 1][0].toUpperCase()
        );
    };

    /* ------------------------------------------------------------
       🔥 FETCH PRODUCT IMAGE
    ------------------------------------------------------------- */
    const fetchProductImage = async (productId: string) => {
        console.log("🖼 Fetching image for product:", productId);

        try {
            const API_URL = `${API_BASE}/api/products/${productId}`;
            const res = await fetch(API_URL);

            console.log("🖼 RAW PRODUCT RESPONSE:", res);

            const text = await res.text();
            console.log("🖼 RAW PRODUCT TEXT:", text);

            let json = null;
            try {
                json = JSON.parse(text);
            } catch (e) {
                console.error("❌ Image JSON Parse Failed:", e);
                return "/images/placeholder.png";
            }

            if (json?.success && json.data?.image) {
                console.log("🖼 Product Image Found:", json.data.image);
                return json.data.image;
            } else {
                console.warn("⚠ No image field in product:", json);
                return "/images/placeholder.png";
            }
        } catch (err) {
            console.error("🔥 Error fetching product image:", err);
            return "/images/placeholder.png";
        }
    };

    /* ------------------------------------------------------------
   🔥 FETCH SAVED ITEMS COUNT (WISHLIST)
------------------------------------------------------------- */
    const fetchSavedItemsCount = async () => {
        if (!authUser?.id || !token) return;

        try {
            const res = await fetch(
                `${API_BASE}/api/wishlist?userId=${authUser.id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const data = await res.json();

            let count = 0;
            if (data?.data?.items) {
                count = data.data.items.length;
            } else if (data?.items) {
                count = data.items.length;
            }

            setSavedItemsCount(count);
        } catch (err) {
            console.error("🔥 Failed to fetch saved items count:", err);
            setSavedItemsCount(0);
        }
    };


    /* ------------------------------------------------------------
       🔥 FETCH PROFILE
    ------------------------------------------------------------- */
    useEffect(() => {
        const loadProfile = async () => {
            console.log("🔵 ProfilePage MOUNTED");

            if (!isAuthenticated || !authUser?.id) {
                console.log("❌ Not authenticated or missing userId");
                setLoading(false);
                return;
            }

            const userId = authUser.id;
            const API_URL = `${API_BASE}/api/customers/${userId}`;

            console.log("🌍 Fetching customer:", API_URL);
            setLoading(true);

            try {
                const res = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                console.log("📥 RAW FETCH RESPONSE:", res);
                console.log("📊 Status:", res.status);

                const text = await res.text();
                console.log("📄 RAW RESPONSE TEXT:", text);

                let json;
                try {
                    json = JSON.parse(text);
                } catch (err) {
                    console.error("❌ JSON PARSE ERROR:", err);
                    setLoading(false);
                    return;
                }

                console.log("✅ Parsed JSON:", json);

                if (json?.success && json.data) {
                    console.log("🟢 Setting user:", json.data);
                    setUser(json.data);
                    await fetchSavedItemsCount()
                } else {
                    console.error("❌ Unexpected format:", json);
                }
            } catch (error) {
                console.error("🔥 Error fetching customer:", error);
            }

            setLoading(false);
        };

        loadProfile();

    }, [isAuthenticated, authUser?.id, token]);

    /* ------------------------------------------------------------
       🔥 FETCH ORDERS + PRODUCT IMAGES
    ------------------------------------------------------------- */
    const fetchOrders = async () => {
        console.log("📦 fetchOrders() CALLED");

        if (!authUser?.id) {
            console.log("❌ Missing userId for fetching orders");
            return;
        }

        const API_URL = `${API_BASE}/api/order?userId=${authUser.id}`;
        console.log("🌍 Fetching Orders:", API_URL);

        setOrdersLoading(true);

        try {
            const res = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            console.log("📥 RAW ORDER RESPONSE:", res);
            console.log("📊 Order Status:", res.status);

            const text = await res.text();
            console.log("📄 RAW ORDER RESPONSE TEXT:", text);

            let json;
            try {
                json = JSON.parse(text);
            } catch (err) {
                console.error("❌ ORDER JSON PARSE ERROR:", err);
                setOrdersLoading(false);
                return;
            }

            console.log("📦 Parsed ORDER JSON:", json);

            if (json?.success && Array.isArray(json.orders)) {
                console.log("🟢 Orders received:", json.orders.length);

                const ordersWithImages = await Promise.all(
                    json.orders.map(async (ord: any) => {

                        // 🔥 FETCH FULL ORDER (to get shippingAddress)
                        let fullOrder = ord;
                        try {
                            const orderRes = await fetch(
                                `${API_BASE}/api/order?id=${ord.id}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        Accept: "application/json",
                                    },
                                }
                            );

                            const orderJson = await orderRes.json();
                            if (orderJson?.success && orderJson.order) {
                                fullOrder = orderJson.order;
                            }
                        } catch (err) {
                            console.error("❌ Failed to fetch full order:", ord.id, err);
                        }

                        // ⭐ ATTACH PRODUCT IMAGES (same as before)
                        const updatedItems = await Promise.all(
                            fullOrder.items.map(async (it: any) => {
                                const productId = it.product?.id || it.productId;
                                const image = await fetchProductImage(productId);

                                return {
                                    ...it,
                                    image,
                                    productName: it.product?.name || it.name,
                                    price: it.product?.price || it.unitPrice || 0,
                                };
                            })
                        );

                        return {
                            ...fullOrder,
                            items: updatedItems,
                        };
                    })
                );


                setOrders(ordersWithImages);
            } else {
                console.warn("⚠ Unexpected ORDER format:", json);
                setOrders([]);
            }

        } catch (error) {
            console.error("🔥 Error fetching orders:", error);
            setOrders([]);
        }

        setOrdersLoading(false);
    };

    useEffect(() => {
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [activeTab]);

    /* ------------------------------------------------------------
       UI RENDER: KEEP EVERYTHING SAME
    ------------------------------------------------------------- */

    if (loading) {
        console.log("⏳ Loading profile...");
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        console.log("❌ No user returned from backend");
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg">Unable to load profile.</p>
            </div>
        );
    }

    return (
        <>
            <Header />

            {/* Toasts — SAME */}
            {toast.show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-xl border border-gray-200"
                >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">{toast.message}</span>
                    <button
                        onClick={() => setToast({ ...toast, show: false })}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </motion.div>
            )}

            {/* UI BELOW UNCHANGED — ONLY ORDERS LIST ITEMS UPDATED TO SHOW IMAGE */}
            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* PROFILE HEADER (same) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8"
                    >
                        <div className="h-32 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500" />
                        <div className="relative px-8 pb-8 -mt-16">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">

                                {/* Avatar */}
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                                    <span className="text-4xl font-bold text-amber-600 tracking-wide">
                                        {getInitials(user.name)}
                                    </span>
                                </div>


                                {/* User Info */}
                                <div className="flex-1 pt-4 sm:pt-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                            <p className="text-gray-900 flex items-center gap-2 mt-1">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-4 py-2 bg-amber-100 text-amber-800 font-semibold text-sm rounded-full border border-amber-200">
                                                Gold Member
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                                            <p className="text-sm text-gray-600">Orders</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">1250</p>
                                            <p className="text-sm text-gray-600">Loyalty Points</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {savedItemsCount}
                                            </p>
                                            <p className="text-sm text-gray-600">Saved Items</p>
                                        </div>

                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">8</p>
                                            <p className="text-sm text-gray-600">Reviews</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>

                    {/* QUICK STATS (same) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                        {[
                            { icon: ShoppingBag, label: "Recent Orders", value: orders.length },
                            { icon: Heart, label: "Saved Items", value: savedItemsCount },
                            { icon: Star, label: "Reviews Given", value: 8 },
                            { icon: MessageSquare, label: "Coupon", value: 0 },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <stat.icon className="w-6 h-6 text-amber-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* SIDEBAR + CONTENT */}
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* SIDEBAR (same) */}
                        <aside className="lg:w-80">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                                </div>
                                <nav className="p-3">
                                    {[
                                        { id: "personal", label: "Personal Info", icon: User },
                                        { id: "orders", label: "My Orders", icon: Package },
                                        { id: "addresses", label: "Addresses", icon: MapPin },
                                        { id: "security", label: "Security", icon: Shield },
                                        { id: "preferences", label: "Preferences", icon: Settings },
                                    ].map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl mb-1 transition-all ${isActive
                                                    ? "bg-amber-600 text-white shadow-sm"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{tab.label}</span>
                                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                            </button>
                                        );
                                    })}
                                </nav>
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <button className="w-full flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 py-3 rounded-xl font-medium transition-colors">
                                        <LogOut className="w-5 h-5" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* MAIN CONTENT */}
                        <main className="flex-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                                {/* PERSONAL INFO (same) */}
                                {activeTab === "personal" && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                                            <button className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-2">
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">

                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center">
                                                        <User className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Full Name</p>
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center">
                                                        <Mail className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="font-medium text-gray-900">{user.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center">
                                                        <Phone className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Phone</p>
                                                        <p className="font-medium text-gray-900">{user.phone}</p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="space-y-6">

                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center">
                                                        <Calendar className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Member Since</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                                month: "long",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center">
                                                        <Star className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Loyalty Points</p>
                                                        <p className="font-medium text-gray-900">1250</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ADDRESSES (same) */}
                                {activeTab === "addresses" && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                                            <button className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-amber-700 transition">
                                                + Add New Address
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div className="rounded-xl border-2 border-amber-500 bg-amber-50/50 p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="w-5 h-5 text-amber-600" />
                                                        <span className="font-semibold text-amber-900">Home</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 text-sm">
                                                    {user.address}, {user.city}
                                                </p>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {user.state} - {user.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SECURITY (same) */}
                                {activeTab === "security" && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>

                                        <div className="space-y-4">
                                            {[
                                                { icon: Lock, title: "Password", desc: "Last changed 30 days ago", action: "Change" },
                                                { icon: CreditCard, title: "Payment Methods", desc: "Manage saved cards & UPI", action: "Manage" },
                                                { icon: Bell, title: "Notifications", desc: "Order updates & promotions", action: "Configure" },
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-amber-200 transition"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center">
                                                            <item.icon className="w-5 h-5 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.title}</p>
                                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                                                        {item.action} →
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ---------------------------- ORDERS TAB (NOW WITH IMAGES) ---------------------------- */}
                                {activeTab === "orders" && (
                                    <div className="space-y-8">
                                        {/* Header Section */}
                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
                                            <p className="text-gray-600">Track and manage your purchases</p>
                                        </div>

                                        {/* Loading State */}
                                        {ordersLoading && (
                                            <div className="flex flex-col items-center justify-center py-16">
                                                <div className="relative">
                                                    <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full" />
                                                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0" />
                                                </div>
                                                <p className="text-gray-600 mt-4 font-medium">Loading your orders...</p>
                                                <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {!ordersLoading && orders.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                                <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                                                    <Package className="w-12 h-12 text-amber-500" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                                                <p className="text-gray-600 text-center max-w-md">
                                                    You haven't placed any orders. Start shopping to see your orders here.
                                                </p>
                                                <button className="mt-6 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
                                                    Start Shopping
                                                </button>
                                            </div>
                                        )}

                                        {/* Orders List */}
                                        {!ordersLoading && orders.length > 0 && (
                                            <div className="space-y-6">
                                                {orders.map((ord, index) => (
                                                    <div
                                                        key={ord.id || index}
                                                        className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                                    >
                                                        {/* Order Header */}
                                                        <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 border-b">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                                <div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                                            {/* Order #{ord?.id.slice(-8).toUpperCase()} */}
                                                                            Order #{String(ord?.id ?? ord?._id ?? ord?.orderId ?? "")
                                                                                .slice(-8)
                                                                                .toUpperCase()}
                                                                        </h3>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', {
                                                                            weekday: 'long',
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center gap-4">
                                                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${ord.status === "Delivered"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : ord.status === "Cancelled"
                                                                            ? "bg-red-100 text-red-800"
                                                                            : "bg-amber-100 text-amber-800"
                                                                        }`}>
                                                                        {ord.status || "Processing"}
                                                                    </span>
                                                                    <span className="text-lg font-bold text-gray-900">
                                                                        ₹{ord.total.toLocaleString('en-IN')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Shipping Address */}
                                                        {ord.shippingAddress && (
                                                            <div className="px-6 py-4 border-b border-gray-100">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                                                            Shipping Address
                                                                        </p>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                            <div>
                                                                                <p className="text-sm text-gray-900 font-medium">
                                                                                    {ord.shippingAddress.fullName}
                                                                                </p>
                                                                                <p className="text-sm text-gray-600">
                                                                                    {ord.shippingAddress.addressLine1}
                                                                                    {ord.shippingAddress.addressLine2 && `, ${ord.shippingAddress.addressLine2}`}
                                                                                </p>
                                                                                <p className="text-sm text-gray-600">
                                                                                    {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex items-center text-sm text-gray-600">
                                                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                                </svg>
                                                                                {ord.shippingAddress.phone}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Order Items */}
                                                        <div className="px-6 py-4">
                                                            <p className="text-sm font-semibold text-gray-700 mb-4">Order Items ({ord.items?.length || 0})</p>
                                                            <div className="space-y-4">
                                                                {ord.items?.map((item: any, i: number) => (
                                                                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                                                            <Image
                                                                                src={item?.image || "/images/placeholder.png"}
                                                                                alt={item?.name}
                                                                                width={64}
                                                                                height={64}
                                                                                className="object-cover w-full h-full"
                                                                                unoptimized
                                                                            />
                                                                            <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs px-2 py-1 rounded-bl-lg">
                                                                                {item.quantity}x
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-gray-900 truncate">
                                                                                {item.productName}
                                                                            </p>
                                                                            <div className="flex items-center gap-4 mt-1">
                                                                                <p className="text-sm text-gray-600">
                                                                                    Unit Price: <span className="font-medium">₹{item.unitPrice.toLocaleString('en-IN')}</span>
                                                                                </p>
                                                                                <p className="text-sm text-gray-600">
                                                                                    Total: <span className="font-medium">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* Order Footer */}
                                                            {/* <div className="mt-6 pt-4 border-t border-gray-100">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                                    <div className="text-sm text-gray-600">
                                                                        Need help with this order?
                                                                        <button className="ml-2 text-amber-600 hover:text-amber-700 font-medium">
                                                                            Contact Support
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex gap-3">
                                                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                                            View Details
                                                                        </button>
                                                                        <button className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                                                                            Track Order
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* PREFERENCES (unchanged) */}
                                {activeTab === "preferences" && (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Settings className="w-10 h-10 text-amber-600" />
                                        </div>

                                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                            Preferences
                                        </h3>

                                        <p className="text-gray-600 max-w-md mx-auto mb-8">
                                            Customize notifications, language, and shopping preferences
                                        </p>

                                        <button className="bg-amber-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-700 transition">
                                            Manage Preferences
                                        </button>
                                    </div>
                                )}

                            </div>
                        </main>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProfilePage;