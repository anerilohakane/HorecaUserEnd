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
    Clock,
} from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/lib/context/AuthContext';
import ShippingAddressSelector from '@/components/checkout/ShippingForm';
import { useRouter } from "next/navigation";
import ReviewFormModal from '@/components/products/ReviewFormModal';
import ReturnOrderModal from '@/components/orders/ReturnOrderModal';
import CancelOrderModal from '@/components/orders/CancelOrderModal';
import OrderSubscriptionModal from '@/components/orders/OrderSubscriptionModal';
import CancelSubscriptionModal from '@/components/orders/CancelSubscriptionModal';
import { RotateCw } from 'lucide-react';

const formatToIST = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://horeca-backend-six.vercel.app";

const ProfilePage = () => {
    const { user: authUser, isAuthenticated, token, logout } = useAuth();

    // const [user, setUser] = useState(null);
    const [user, setUser] = useState<any | null>(null);

    // const [orders, setOrders] = useState([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [savedItemsCount, setSavedItemsCount] = useState(0);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [savingProfile, setSavingProfile] = useState(false);

    // Review State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewProduct, setReviewProduct] = useState<{ id: string, name: string } | null>(null);
    const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);

    const handleWriteReview = (orderId: string, product: { id: string, name: string }) => {
        console.log("Opening Review Modal with:", { orderId, product });
        if (!orderId) console.error("❌ Order ID is missing!");
        if (!product?.id) console.error("❌ Product ID is missing!");

        setReviewOrderId(orderId);
        setReviewProduct(product);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = async (data: { rating: number; comment: string; images: string[] }) => {
        if (!reviewProduct || !reviewOrderId || !token || !authUser) return;

        try {
            const rawUserId = authUser.id || (authUser as any)._id; // Handle both structures

            const payload = {
                userId: rawUserId,
                user: rawUserId,
                productId: reviewProduct.id,
                product: reviewProduct.id,
                orderId: reviewOrderId,
                order: reviewOrderId,
                rating: data.rating,
                comment: data.comment,
                images: data.images
            };

            console.log("Submitting Review Payload:", payload);

            const res = await fetch(`${API_BASE}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Review Submission Error Response:", text);
                try {
                    const err = JSON.parse(text);
                    throw new Error(err.message || err.error || "Failed to submit review");
                } catch (e) {
                    throw new Error(text || "Failed to submit review");
                }
            }

            setToast({ show: true, message: "Review submitted successfully!", type: "success" });
            setIsReviewModalOpen(false);

        } catch (error: any) {
            console.error("Review submission failed:", error);
            alert(error.message || "Failed to submit review");
        }
    };

    // Return Order State
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnOrderItems, setReturnOrderItems] = useState<any[]>([]);
    const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
    const [returnAddress, setReturnAddress] = useState<any>(null);

    // Cancel Order State
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

    // Order Subscription State
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [subModalOrderId, setSubModalOrderId] = useState<string>("");
    const [subModalItems, setSubModalItems] = useState<any[]>([]);

    // Cancel Subscription State
    const [isCancelSubModalOpen, setIsCancelSubModalOpen] = useState(false);
    const [cancelSubId, setCancelSubId] = useState<string | null>(null);

    const handleCancelSubscription = (subId: string) => {
        setCancelSubId(subId);
        setIsCancelSubModalOpen(true);
    };

    const handleCancelSubscriptionSubmit = async (data: { reason: string, comment: string }) => {
        if (!cancelSubId) return;

        try {
            const res = await fetch(`${API_BASE}/api/subscriptions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subscriptionId: cancelSubId,
                    status: 'Cancelled',
                    cancellationReason: data.reason,
                    cancellationComment: data.comment
                })
            });

            const json = await res.json();
            if (json.success) {
                setToast({ show: true, message: "Subscription cancelled successfully", type: "success" });
                // Refresh subscriptions
                fetchSubscriptions();
            } else {
                throw new Error(json.error || "Failed to cancel subscription");
            }
        } catch (error: any) {
            console.error(error);
            setToast({ show: true, message: error.message, type: "error" });
        }
    };

    const handleScheduleRepeat = (orderId: string, items: any[]) => {
        setSubModalOrderId(orderId);
        setSubModalItems(items);
        setIsSubModalOpen(true);
    };

    const handleReturnOrder = (orderId: string, items: any[], address: any) => {
        setReturnOrderId(orderId);
        setReturnOrderItems(items);
        setReturnAddress(address);
        setIsReturnModalOpen(true);
    };

    const handleReturnSubmit = async (data: { selectedItems: any[]; reason: string; comment: string; images: string[] }) => {
        if (!returnOrderId || !token || !authUser) return;

        try {
            const rawUserId = authUser.id || (authUser as any)._id;

            // Calculate total refund amount from selected items
            const totalRefundAmount = data.selectedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

            // Map selected items to the schema format
            const formattedItems = data.selectedItems.map(item => ({
                product: item.product?._id || item.product?.id || item.productId || item.product,
                productId: item.product?._id || item.product?.id || item.productId || item.product,
                quantity: item.quantity,
                price: item.unitPrice,
                reason: data.reason // Apply global reason to all items for now
            }));

            const payload = {
                userId: rawUserId,
                user: rawUserId,
                customerId: rawUserId, // Alias
                orderId: returnOrderId,
                order: returnOrderId,

                // Top-Level Product ID (Required by some backend logic? use first item's ID as fallback)
                productId: formattedItems[0]?.productId,
                product: formattedItems[0]?.productId,

                reason: data.reason,
                comment: data.comment,
                images: data.images || [],
                quantity: formattedItems.length, // Number of unique items returned? Or total qty?

                // Refund Amount
                amount: totalRefundAmount,
                refundAmount: totalRefundAmount,

                // Flattened Address
                addressLine1: returnAddress?.addressLine1 || "",
                addressLine2: returnAddress?.addressLine2 || "",
                city: returnAddress?.city || "",
                state: returnAddress?.state || "",
                pincode: returnAddress?.pincode || "",
                phone: returnAddress?.phone || "",

                // Address Objects
                pickupAddress: returnAddress,
                address: returnAddress,

                // Refund Method
                refundMode: 'Source',
                refundMethod: 'Source',

                // Bank Details (Mock)
                bankDetails: {
                    accountHolderName: authUser.name || "Test User",
                    bankName: "Test Bank",
                    accountNumber: "1234567890",
                    ifscCode: "TEST0000001"
                },

                // Resolution
                resolution: 'Refund',
                action: 'Refund',
                type: 'refund',
                condition: 'Unopened',

                // Items Arrays
                items: formattedItems,
                products: formattedItems
            };

            console.log("Submitting Return Payload:", payload);

            const res = await fetch(`${API_BASE}/api/return-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const text = await res.text();
            console.log("Return Order Response Text:", text);

            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                throw new Error(text || "Failed to submit return request");
            }

            if (!res.ok || !json.success) {
                throw new Error(json.message || json.error || "Failed to submit return request");
            }

            setToast({ show: true, message: "Return request submitted successfully!", type: "success" });
            setIsReturnModalOpen(false);

            // Refresh orders to show updated status
            fetchOrders();

        } catch (error: any) {
            console.error("Return submission failed:", error);
            alert(error.message || "Failed to submit return request");
            throw error; // Re-throw to show error in modal
        }
    };

    // Cancel Order Handler - OPEN MODAL
    const handleCancelOrder = (orderId: string) => {
        setCancelOrderId(orderId);
        setIsCancelModalOpen(true);
    };

    // Cancel Submit Handler
    const handleCancelSubmit = async (data: { reason: string, comment: string }) => {
        if (!cancelOrderId) return;

        try {
            // Backend expects PATCH request with ID in query params
            const res = await fetch(`${API_BASE}/api/order?id=${cancelOrderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'cancelled',
                    cancellationReason: data.reason,
                    notes: data.comment // Using notes for comment
                })
            });

            const resData = await res.json();

            if (!res.ok || !resData.success) {
                throw new Error(resData.message || resData.error || "Failed to cancel order");
            }

            setToast({ show: true, message: "Order cancelled successfully", type: "success" });
            fetchOrders();
            setIsCancelModalOpen(false);

        } catch (error: any) {
            console.error("Cancel order failed:", error);
            throw error; // Propagate to modal to show error
        }
    };




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

            // console.log("🖼 RAW PRODUCT RESPONSE:", res);

            const text = await res.text();
            // console.log("🖼 RAW PRODUCT TEXT:", text);

            let json = null;
            try {
                json = JSON.parse(text);
            } catch (e) {
                console.error("❌ Image JSON Parse Failed:", e);
                return "/images/placeholder.png";
            }

            if (json?.success && json.data?.image) {
                const rawImage = json.data.image.trim();
                console.log("🖼 Product Image Found:", rawImage);

                if (rawImage.startsWith('http://') || rawImage.startsWith('https://') || rawImage.startsWith('//')) {
                    return rawImage;
                } else {
                    // Match ProductCard logic: assume local path in /images/products/
                    const filename = rawImage.replace(/^\/+/, '');
                    return `/images/products/${filename}`;
                }
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

            fetchReviewsCount();

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

                    // 1️⃣ Set user
                    setUser(json.data);

                    // 2️⃣ Initialize edit form
                    setProfileForm({
                        name: json.data.name || "",
                        email: json.data.email || "",
                        address: json.data.address || "",
                        city: json.data.city || "",
                        state: json.data.state || "",
                        pincode: json.data.pincode || "",
                    });

                    // 3️⃣ Load wishlist count
                    await fetchSavedItemsCount();
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

    const updateCustomerProfile = async () => {
        if (!authUser?.id) return;

        setSavingProfile(true);

        try {
            const res = await fetch(`${API_BASE}/api/customers/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: authUser.id,
                    ...profileForm,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Update failed");
            }

            // ✅ Update UI instantly
            setUser(data.data);
            setIsEditingProfile(false);

            setToast({
                show: true,
                message: "Profile updated successfully",
                type: "success",
            });
        } catch (err: any) {
            setToast({
                show: true,
                message: err.message || "Failed to update profile",
                type: "error",
            });
        } finally {
            setSavingProfile(false);
        }
    };


    const [reviewsCount, setReviewsCount] = useState(0);

    /* ------------------------------------------------------------
       🔥 FETCH REVIEWS COUNT
    ------------------------------------------------------------- */
    const fetchReviewsCount = async () => {
        if (!authUser) return;
        const userId = authUser.id || (authUser as any)._id;
        if (!userId) return;

        try {
            // Assuming endpoint supports filtering by userId to get all reviews by user
            const res = await fetch(`${API_BASE}/api/reviews?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    // If data.total exists, use it. Otherwise count the array.
                    setReviewsCount(data.total || data.reviews?.length || 0);
                }
            }
        } catch (e) {
            console.error("Failed to fetch reviews count", e);
        }
    };

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
                        const orderId = ord.id || ord._id;
                        try {
                            if (orderId) {
                                const orderRes = await fetch(
                                    `${API_BASE}/api/order?id=${orderId}`,
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
                            }
                        } catch (err) {
                            console.error("❌ Failed to fetch full order:", orderId, err);
                        }

                        // ⭐ ATTACH PRODUCT IMAGES
                        const updatedItems = await Promise.all(
                            fullOrder.items.map(async (it: any) => {
                                // 1. Try to get image from the order item directly (if saved)
                                if (it.image) return { ...it, productName: it.product?.name || it.name || it.productName };

                                // 2. Fallback: Fetch from product ID
                                const productId = it.product?._id || it.product?.id || it.productId || it.product;

                                // robust check: if productId is an object (unexpected), try to extract id
                                const validProductId = typeof productId === 'object' ? (productId._id || productId.id) : productId;

                                let image = "/images/placeholder.png";

                                if (validProductId) {
                                    image = await fetchProductImage(validProductId);
                                }

                                return {
                                    ...it,
                                    image,
                                    productName: it.product?.name || it.name || it.productName,
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

    /* ------------------------------------------------------------
       🔄 FETCH SUBSCRIPTIONS
    ------------------------------------------------------------- */
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [subsLoading, setSubsLoading] = useState(false);

    const fetchSubscriptions = async () => {
        if (!authUser?.id) return;
        setSubsLoading(true);
        try {
            // Need to pass userId. 
            // Validating if authUser.id is the correct field, seems to be standard in this file.
            const userId = authUser.id || (authUser as any)._id;
            const res = await fetch(`${API_BASE}/api/subscriptions?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                console.log("Subscriptions Data:", data.data);
                setSubscriptions(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch subscriptions", err);
        } finally {
            setSubsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'subscriptions') {
            fetchSubscriptions();
        }
    }, [activeTab, authUser]);




    const fetchAddresses = async () => {
        if (!authUser?.id) return;

        setAddressesLoading(true);

        try {
            const res = await fetch(
                `${API_BASE}/api/order?userId=${authUser.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const data = await res.json();

            if (!data?.success || !Array.isArray(data.orders)) {
                setAddresses([]);
                return;
            }

            // 🔥 Extract shipping addresses
            const rawAddresses = data.orders
                .map((o: any) => o.shippingAddress)
                .filter(Boolean);

            // 🔥 Deduplicate by full address
            const uniqueMap = new Map();
            rawAddresses.forEach((addr: any) => {
                const key = `${addr.fullName}-${addr.phone}-${addr.addressLine1}-${addr.pincode}`;
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, addr);
                }
            });

            setAddresses(Array.from(uniqueMap.values()));
        } catch (err) {
            console.error("❌ Failed to fetch addresses:", err);
            setAddresses([]);
        } finally {
            setAddressesLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "addresses") {
            fetchAddresses();
        }
    }, [activeTab]);


    useEffect(() => {
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [activeTab]);

    const router = useRouter();

    const handleLogout = () => {
        logout(); // 🔥 clears auth state

        // optional cleanup
        localStorage.removeItem("lastOrder");
        localStorage.removeItem("lastOrderId");

        router.push("/"); // or "/" if you prefer home
    };

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
                                            <p className="text-2xl font-bold text-gray-900">{reviewsCount}</p>
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
                            { icon: Star, label: "Reviews Given", value: reviewsCount },
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
                                        { id: "subscriptions", label: "My Subscriptions", icon: RotateCw },
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
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 py-3 rounded-xl font-medium transition-colors"
                                    >
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
                                        {/* HEADER */}
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Personal Information
                                            </h2>

                                            {!isEditingProfile && (
                                                <button
                                                    className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-2"
                                                    onClick={() => setIsEditingProfile(true)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {/* EDIT MODE */}
                                        {isEditingProfile ? (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {[
                                                    { label: "Name", key: "name" },
                                                    { label: "Email", key: "email" },
                                                    { label: "Address", key: "address" },
                                                    { label: "City", key: "city" },
                                                    { label: "State", key: "state" },
                                                    { label: "Pincode", key: "pincode" },
                                                ].map((field) => (
                                                    <div key={field.key}>
                                                        <label className="text-sm font-medium text-gray-700">
                                                            {field.label}
                                                        </label>
                                                        <input
                                                            value={(profileForm as any)[field.key]}
                                                            onChange={(e) =>
                                                                setProfileForm((prev) => ({
                                                                    ...prev,
                                                                    [field.key]: e.target.value,
                                                                }))
                                                            }
                                                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                                        />
                                                    </div>
                                                ))}

                                                <div className="md:col-span-2 flex gap-3 mt-4">
                                                    <button
                                                        onClick={updateCustomerProfile}
                                                        disabled={savingProfile}
                                                        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
                                                    >
                                                        {savingProfile ? "Saving..." : "Save Changes"}
                                                    </button>


                                                    <button
                                                        onClick={() => setIsEditingProfile(false)}
                                                        className="px-6 py-2 border rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* READ-ONLY VIEW */
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
                                        )}
                                    </div>
                                )}


                                {/* ADDRESSES (same) */}
                                {activeTab === "addresses" && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                                            {/* <button
                                                onClick={() => setShowAddressForm(true)}
                                                className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-amber-700 transition"
                                            >
                                                + Add New Address
                                            </button> */}

                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            {/* ADDRESSES LIST */}
                                            {addressesLoading && (
                                                <p className="text-gray-500">Loading addresses…</p>
                                            )}

                                            {!addressesLoading && addresses.length === 0 && (
                                                <p className="text-gray-500">No saved addresses yet.</p>
                                            )}

                                            <div className="grid md:grid-cols-2 gap-5">
                                                {addresses.map((addr, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                                                    >
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <MapPin className="w-5 h-5 text-amber-600 mt-1" />
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{addr.fullName}</p>
                                                                <p className="text-sm text-gray-700">{addr.addressLine1}</p>
                                                                {addr.addressLine2 && (
                                                                    <p className="text-sm text-gray-700">{addr.addressLine2}</p>
                                                                )}
                                                                <p className="text-sm text-gray-600">
                                                                    {addr.city}, {addr.state} - {addr.pincode}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mt-1">📞 {addr.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                        {/* ADD NEW ADDRESS FORM */}
                                        {showAddressForm && (
                                            <div className="mt-6">
                                                <ShippingAddressSelector
                                                    onSubmit={(address: any) => {
                                                        console.log("✅ Address received:", address);

                                                        setToast({
                                                            show: true,
                                                            message: "Address added successfully",
                                                            type: "success",
                                                        });

                                                        setShowAddressForm(false);
                                                    }}
                                                />

                                                <button
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}

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
                                                                        Placed on {formatToIST(ord.createdAt)}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center gap-4">
                                                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${ord.status === "Delivered"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : ord.status === "Cancelled"
                                                                            ? "bg-red-100 text-red-800"
                                                                            : ord.status === "return_requested"
                                                                                ? "bg-orange-100 text-orange-800"
                                                                                : "bg-amber-100 text-amber-800"
                                                                        }`}>
                                                                        {ord.status === "return_requested" ? "Return Requested" : (ord.status || "Processing")}
                                                                    </span>
                                                                    <span className="text-lg font-bold text-gray-900">
                                                                        ₹{ord.total.toLocaleString('en-IN')}
                                                                    </span>

                                                                    {/* Return Order Button - Visible if Delivered and Not already returned */}
                                                                    {/* Return Order Button - Visible if Delivered and Not already returned */}
                                                                    {/* Removed from header */}

                                                                    {['out_for_delivery', 'shipped', 'confirmed', 'processing'].includes(ord.status?.toLowerCase()) && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                // Use window.location or router if available, but safe to assume router from context
                                                                                window.location.href = `/orders/${ord.id || ord._id || ord.orderId}`;
                                                                            }}
                                                                            className="ml-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition shadow-sm flex items-center gap-2"
                                                                        >
                                                                            <MapPin size={16} /> Track
                                                                        </button>
                                                                    )}
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

                                                                        <div className="flex gap-2">
                                                                            {/* Write Review Button */}
                                                                            <button
                                                                                onClick={() => {
                                                                                    // robustly find product ID
                                                                                    const pId = item.product?._id || item.product?.id || item.productId || (typeof item.product === 'string' ? item.product : null);
                                                                                    handleWriteReview(ord.id || ord._id, { id: pId, name: item.productName || item.name });
                                                                                }}
                                                                                className="px-4 py-2 text-sm font-medium text-white bg-[#D97706] rounded-full hover:bg-[#B45309] transition-colors shadow-sm"
                                                                            >
                                                                                Write Review
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Order Footer - Return Action */}
                                                        {(() => {
                                                            if (ord.status?.toLowerCase() !== 'delivered') return null;

                                                            // Calculate Return Window (7 Days)
                                                            // Prefer deliveredAt, fallback to updatedAt (when status became delivered), fallback to createdAt + shipping time?
                                                            // Using updatedAt as proxy for delivery time if deliveredAt is missing
                                                            const promptDeliveryDate = ord.deliveredAt || ord.updatedAt || ord.createdAt;
                                                            const deliveryDate = new Date(promptDeliveryDate);
                                                            const currentDate = new Date();

                                                            const diffTime = Math.abs(currentDate.getTime() - deliveryDate.getTime());
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                            const daysLeft = 7 - diffDays;

                                                            const isReturnable = daysLeft >= 0;

                                                            return (
                                                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                                                    {/* Return Window Message */}
                                                                    <div className="text-sm">
                                                                        {isReturnable ? (
                                                                            <span className="text-amber-600 font-medium">
                                                                                Return available for {daysLeft} more day{daysLeft !== 1 ? 's' : ''}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-gray-500 font-medium">
                                                                                Return window closed
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {isReturnable && (
                                                                        <button
                                                                            onClick={() => handleReturnOrder(ord.id || ord._id, ord.items, ord.shippingAddress)}
                                                                            className="px-6 py-2.5 text-sm font-medium text-red-600 border border-red-200 bg-white rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center gap-2"
                                                                        >
                                                                            Return Order
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}

                                                        {/* Schedule Repeat Action */}
                                                        {ord.status?.toLowerCase() === 'delivered' && (
                                                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                                                <button
                                                                    onClick={() => handleScheduleRepeat(ord.id || ord._id, ord.items)}
                                                                    className="px-6 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 bg-white rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm flex items-center gap-2"
                                                                >
                                                                    <RotateCw size={16} />
                                                                    Schedule Repeat Order
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Cancel Action - Pending/Confirmed */}
                                                        {['pending', 'confirmed'].includes(ord.status?.toLowerCase()) && (
                                                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                                                <button
                                                                    onClick={() => handleCancelOrder(ord.id || ord._id)}
                                                                    className="px-6 py-2.5 text-sm font-medium text-red-600 border border-red-200 bg-white rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center gap-2"
                                                                >
                                                                    Cancel Order
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SUBSCRIPTIONS TAB */}
                                {activeTab === "subscriptions" && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Subscriptions</h2>
                                            <p className="text-gray-600">Manage your recurring orders</p>

                                            {/* Debug Button */}
                                            <button
                                                onClick={async () => {
                                                    const res = await fetch(`${API_BASE}/api/cron/process-subscriptions`);
                                                    const json = await res.json();
                                                    alert(JSON.stringify(json, null, 2));
                                                    fetchSubscriptions(); // Refresh list
                                                }}
                                                className="mt-2 text-xs text-blue-500 underline"
                                            >
                                                {/* [Dev] Test Scheduler Now */}
                                            </button>
                                        </div>

                                        {subsLoading && (
                                            <div className="flex flex-col items-center justify-center py-10">
                                                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
                                                <p className="text-gray-500">Loading subscriptions...</p>
                                            </div>
                                        )}

                                        {!subsLoading && subscriptions.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                                <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                                                    <RotateCw className="w-12 h-12 text-amber-500" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No active subscriptions</h3>
                                                <p className="text-gray-600 text-center max-w-md">
                                                    Start a recurring order from your Order History to see it here.
                                                </p>
                                            </div>
                                        )}

                                        {!subsLoading && subscriptions.length > 0 && (
                                            <div className="grid gap-4">
                                                {subscriptions.map(sub => (
                                                    <div key={sub._id} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col md:flex-row gap-4 items-center hover:shadow-md transition-shadow relative">
                                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                            {sub.productImage ? (
                                                                <Image src={sub.productImage} alt={sub.productName || "Product"} width={64} height={64} className="object-cover w-full h-full" unoptimized />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 text-center md:text-left">
                                                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                                                <h4 className="font-semibold text-gray-900 text-lg">{sub.productName || "Unknown Product"}</h4>
                                                                {/* Out of Stock Tag */}
                                                                {sub.product?.stockQuantity <= 0 && (
                                                                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                                                                        Out of Stock
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                                                                <span className="flex items-center gap-1">
                                                                    <RotateCw size={14} className="text-amber-600" />
                                                                    {sub.frequency}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={14} className="text-amber-600" />
                                                                    Next: {formatToIST(sub.nextOrderDate)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {sub.status === 'Paused' && sub.lockedPrice && Math.abs(sub.product?.price - sub.lockedPrice) >= 1 ? (
                                                                <div className="flex flex-col items-end gap-1">
                                                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                                                        Price Changed
                                                                    </span>
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (!confirm(`Price changed from ₹${sub.lockedPrice} to ₹${sub.product.price}. Approve new price?`)) return;
                                                                            try {
                                                                                const res = await fetch(`${API_BASE}/api/subscriptions`, {
                                                                                    method: 'PATCH',
                                                                                    headers: {
                                                                                        'Content-Type': 'application/json',
                                                                                        'Authorization': `Bearer ${token}`
                                                                                    },
                                                                                    body: JSON.stringify({
                                                                                        subscriptionId: sub._id,
                                                                                        status: 'Active',
                                                                                        lockedPrice: sub.product.price // Update to new price
                                                                                    })
                                                                                });
                                                                                const data = await res.json();
                                                                                if (data.success) {
                                                                                    setToast({ show: true, message: "Price approved! Subscription active.", type: "success" });
                                                                                    fetchSubscriptions();
                                                                                } else {
                                                                                    alert(data.error || "Failed");
                                                                                }
                                                                            } catch (e) {
                                                                                console.error(e);
                                                                                alert("Failed to update");
                                                                            }
                                                                        }}
                                                                        className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition"
                                                                    >
                                                                        Approve ₹{sub.product?.price}
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                    {sub.status}
                                                                </span>
                                                            )}

                                                            {sub.status === 'Active' && (
                                                                <button
                                                                    onClick={() => handleCancelSubscription(sub._id)}
                                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                                    title="Cancel Auto-reorder"
                                                                >
                                                                    <XCircle size={20} />
                                                                </button>
                                                            )}
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

            {/* Review Modal */}
            <ReviewFormModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                productName={reviewProduct?.name || 'Product'}
            />

            {/* Return Modal */}
            <ReturnOrderModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                onSubmit={handleReturnSubmit}
                orderItems={returnOrderItems}
                orderId={returnOrderId!}
            />

            <OrderSubscriptionModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                orderId={subModalOrderId}
                items={subModalItems}
            />
            {/* Cancel Order Modal */}
            <CancelOrderModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onSubmit={handleCancelSubmit}
                orderId={cancelOrderId || ''}
            />

            {/* Cancel Subscription Modal */}
            <CancelSubscriptionModal
                isOpen={isCancelSubModalOpen}
                onClose={() => setIsCancelSubModalOpen(false)}
                onSubmit={handleCancelSubscriptionSubmit}
                subscriptionId={cancelSubId || ''}
            />
        </>
    );
};

export default ProfilePage;