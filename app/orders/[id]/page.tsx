'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Package, Clock, MapPin, Phone } from 'lucide-react';
import OrderTrackingMap from '@/components/orders/OrderTrackingMap';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://horeca-backend-six.vercel.app";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-10 text-center">Loading order details...</div>;
    if (!order) return <div className="p-10 text-center">Order not found</div>;

    const isTrackingAvailable = ['out_for_delivery', 'shipped', 'delivered'].includes(order.status);

    // Fallback coordinates if order doesn't have them (Default to New Delhi)
    const destination = {
        lat: order.shippingAddress?.lat || 28.6139,
        lng: order.shippingAddress?.lng || 77.2090,
        address: order.shippingAddress?.addressLine1
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-20 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="font-bold text-lg">Order #{order.orderNumber}</h1>
                    <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-6">

                {/* TRACKING MAP */}
                {isTrackingAvailable && order.status !== 'delivered' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-[#D97706]/5">
                            <h2 className="font-bold text-[#D97706] flex items-center gap-2">
                                <Clock size={18} /> Real-time Tracking
                            </h2>
                        </div>
                        <OrderTrackingMap
                            destination={destination}
                            status={order.status}
                        />
                    </div>
                )}

                {/* Status Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <Package className="text-gray-400" size={20} /> Order Status
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'}`}>
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>

                    {/* Stepper (Simplified) */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="w-0.5 h-full bg-gray-200"></div>
                            </div>
                            <div className="pb-4">
                                <p className="font-semibold text-sm">Order Placed</p>
                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        {order.status === 'out_for_delivery' && (
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-[#D97706] rounded-full animate-pulse"></div>
                                    <div className="w-0.5 h-full bg-gray-200"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="font-semibold text-sm text-[#D97706]">Out for Delivery</p>
                                    <p className="text-xs text-gray-500">Approaching your location</p>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            </div>
                            <div>
                                <p className={`font-semibold text-sm ${order.status === 'delivered' ? 'text-green-700' : 'text-gray-400'}`}>Delivered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="font-bold mb-4">Items</h3>
                    <div className="space-y-4">
                        {order.items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">📦</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm line-clamp-2">{item.productName || item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="font-bold mb-4">Delivery Address</h3>
                    <div className="flex gap-3">
                        <MapPin className="text-gray-400 flex-shrink-0" size={20} />
                        <div className="text-sm text-gray-600">
                            <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.addressLine1}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Phone size={14} /> {order.shippingAddress?.phone}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderDetailsPage;
