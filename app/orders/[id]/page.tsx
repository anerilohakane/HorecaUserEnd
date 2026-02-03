'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Package, Clock, MapPin, Phone, Star, ShieldCheck, Truck, Maximize2, Minimize2 } from 'lucide-react';
import OrderTrackingMap from '@/components/orders/OrderTrackingMap';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://horeca-backend-six.vercel.app";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Trigger resize event when toggling full screen to ensure map renders correctly
    useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event('resize'));
        };
        // Small delay to allow transition to start/finish
        const timeout = setTimeout(handleResize, 100);
        const timeout2 = setTimeout(handleResize, 550); // After transition
        return () => {
            clearTimeout(timeout);
            clearTimeout(timeout2);
        };
    }, [isFullScreen]);

    useEffect(() => {
        if (!id || !token) return;

        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/order?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setOrder(data.order);
                }
            } catch (err) {
                console.error("Failed to fetch order", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, token]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
            />
        </div>
    );

    if (!order) return <div className="p-10 text-center text-gray-500">Order not found</div>;

    const isTrackingAvailable = ['out_for_delivery', 'shipped', 'delivered'].includes(order.status);

    const destination = {
        lat: order.shippingAddress?.lat || 28.6139,
        lng: order.shippingAddress?.lng || 77.2090,
        address: order.shippingAddress?.addressLine1
    };

    const steps = [
        { key: 'placed', label: 'Placed', icon: Package },
        { key: 'shipped', label: 'Shipped', icon: Truck },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: Clock },
        { key: 'delivered', label: 'Delivered', icon: ShieldCheck },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === order.status) !== -1
        ? steps.findIndex(s => s.key === order.status)
        : order.status === 'cancelled' ? -1 : 0;



    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {!isFullScreen && (
                <div className="fixed top-0 left-0 right-0 z-30">
                    <Header />
                </div>
            )}

            {/* IMMERSIVE MAP BACKGROUND */}
            <div
                className={`transition-all duration-500 ease-in-out z-0 ${isFullScreen
                    ? 'fixed inset-0 h-[100dvh] w-screen'
                    : 'absolute top-0 left-0 right-0 h-[55vh]'
                    }`}
            >
                {isTrackingAvailable ? (
                    <OrderTrackingMap destination={destination} status={order.status} />
                ) : (
                    <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                        <div className="text-center opacity-50">
                            <Package size={64} className="mx-auto mb-2 text-orange-300" />
                            <p className="font-medium text-orange-800">Map view unavailable for this status</p>
                        </div>
                    </div>
                )}
            </div>

            {/* HEADER CONTROLS */}
            <div className={`fixed left-0 right-0 z-20 p-4 flex items-center justify-between pointer-events-none transition-all duration-300 ${isFullScreen ? 'top-0' : 'top-36'}`}>
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/50 text-gray-700 hover:bg-white pointer-events-auto transition-colors"
                >
                    <ChevronLeft size={24} />
                </motion.button>
                <div className="flex gap-3">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/50 text-xs font-bold text-gray-800 pointer-events-auto"
                    >
                        Order #{order.orderNumber}
                    </motion.div>

                    {/* Full Screen Toggle */}
                    {isTrackingAvailable && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/50 text-gray-700 hover:bg-white pointer-events-auto transition-colors"
                        >
                            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </motion.button>
                    )}
                </div>
            </div>

            {/* FLOATING CONTENT SHEET */}
            <AnimatePresence>
                {!isFullScreen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="absolute top-[45vh] left-0 right-0 bottom-0 z-10 flex flex-col items-center pointer-events-none"
                    >
                        <div className="w-full max-w-2xl h-full flex flex-col pointer-events-auto">
                            <div className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] overflow-y-auto relative no-scrollbar">

                                {/* Floating Status Icon */}
                                <div className="sticky top-0 z-20 mt-10">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                            className="bg-orange-500 text-white p-4 rounded-full shadow-xl shadow-orange-500/30 border-4 border-white"
                                        >
                                            {order.status === 'delivered' ? <ShieldCheck size={32} /> :
                                                order.status === 'out_for_delivery' ? <Truck size={32} /> :
                                                    <Clock size={32} />}
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="pt-12 pb-20 px-6 sm:px-8 space-y-8">

                                    {/* Status Headline */}
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {order.status === 'out_for_delivery' ? 'Arriving Soon!' :
                                                order.status === 'delivered' ? 'Order Delivered' :
                                                    order.status.replace(/_/g, ' ')}
                                        </h2>
                                        <p className="text-gray-500 mt-1">
                                            {order.status === 'out_for_delivery' ? 'Your order is on the way to your location.' :
                                                `Updated on ${new Date(order.updatedAt).toLocaleTimeString()}`}
                                        </p>
                                    </div>

                                    {/* Progress Stepper */}
                                    <div className="flex justify-between items-center relative px-2">
                                        {/* Connecting Line */}
                                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10 rounded-full mx-4" />
                                        <div
                                            className="absolute left-0 h-1 bg-orange-500 -z-10 rounded-full mx-4 transition-all duration-1000"
                                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                        />

                                        {steps.map((step, idx) => {
                                            const isCompleted = idx <= currentStepIndex;
                                            const isCurrent = idx === currentStepIndex;
                                            const Icon = step.icon;

                                            return (
                                                <div key={step.key} className="flex flex-col items-center gap-2">
                                                    <motion.div
                                                        initial={false}
                                                        animate={{
                                                            scale: isCurrent ? 1.2 : 1,
                                                            backgroundColor: isCompleted ? '#F97316' : '#F3F4F6'
                                                        }}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors duration-300`}
                                                    >
                                                        <Icon size={16} className={isCompleted ? 'text-white' : 'text-gray-400'} />
                                                    </motion.div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-orange-600' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Driver Info Card (Only if out_for_delivery) */}
                                    {order.status === 'out_for_delivery' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-orange-50 p-4 rounded-2xl flex items-center justify-between border border-orange-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
                                                    <span className="text-xl">👨‍✈️</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">John Delivery</h3>
                                                    <div className="flex items-center gap-1 text-xs text-orange-700 font-medium">
                                                        <Star size={12} className="fill-orange-500 stroke-orange-500" /> 4.8 Rating
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 hover:bg-green-600 transition-colors">
                                                <Phone size={18} />
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Package size={18} className="text-orange-500" /> Order Items
                                        </h3>
                                        <div className="space-y-4">
                                            {order.items.map((item: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                                    className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 relative overflow-hidden shadow-sm border border-gray-200">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-400">📦</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <p className="font-bold text-gray-800 line-clamp-1">{item.productName || item.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded-md inline-block w-fit mt-1 border border-gray-200">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col justify-center text-right">
                                                        <p className="font-bold text-gray-900">₹{((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex justify-between items-center p-4 bg-gray-900 text-white rounded-xl shadow-lg">
                                            <span className="font-medium text-gray-300">Total Amount</span>
                                            <span className="font-bold text-lg">₹{order.total}</span>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="bg-white rounded-2xl">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin size={18} className="text-orange-500" /> Delivery Address
                                        </h3>
                                        <div className="pl-2 border-l-2 border-dashed border-gray-200 ml-2">
                                            <div className="ml-4">
                                                <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
                                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                                                    <br />
                                                    {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                                </p>
                                                <div className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-600 bg-gray-50 w-fit px-3 py-1.5 rounded-lg">
                                                    <Phone size={14} /> {order.shippingAddress?.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetailsPage;
