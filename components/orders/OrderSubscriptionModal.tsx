'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, RotateCw, CheckCircle, Plus, Minus, Package } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { sileo } from 'sileo';
import Image from 'next/image';

interface Item {
    product: any; // Can be string ID or object
    productId?: string;
    productName?: string;
    name?: string;
    quantity: number;
    unitPrice?: number;
    price?: number;
    image?: string;
}

interface OrderSubscriptionModalProps {
    orderId: string;
    items: Item[];
    fees?: { shipping: number; platform: number; gst: number };
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://horeca-backend-six.vercel.app';

export default function OrderSubscriptionModal({ orderId, items: initialItems, fees, isOpen, onClose, onSuccess }: OrderSubscriptionModalProps) {
    const { user, token } = useAuth();

    const [frequency, setFrequency] = useState('Daily');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        if (isOpen) {
            setItems(initialItems.map(it => ({
                ...it,
                // Ensure we have a price for calculation
                displayPrice: it.unitPrice || it.price || 0
            })));
        }
    }, [isOpen, initialItems]);

    if (!isOpen) return null;

    const updateQuantity = (index: number, delta: number) => {
        setItems(prev => {
            const next = [...prev];
            const newQty = Math.max(1, (next[index].quantity || 1) + delta);
            next[index] = { ...next[index], quantity: newQty };
            return next;
        });
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + ((item as any).displayPrice * item.quantity), 0);
    };

    const calculateTotal = () => {
        const sub = calculateSubtotal();
        const totalFees = (fees?.shipping || 0) + (fees?.platform || 0) + (fees?.gst || 0);
        return sub + totalFees;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userId = user?.id || (user as any)?._id;

        if (!token || !userId) {
            sileo.error({ title: "Please login to enable auto-reorder" });
            return;
        }

        if (!startDate || !preferredTime) {
            sileo.error({ title: "Please select both a start date and time." });
            return;
        }

        setIsSubmitting(true);
        setCompletedCount(0);
        const totalItems = items.length;
        let successCount = 0;

        try {
            for (const item of items) {
                try {
                    const p = item.product;
                    const productId = item.productId || p?._id || p?.id || (typeof p === 'string' ? p : null);

                    if (!productId) {
                        console.error("Skipping item due to missing Product ID:", item);
                        continue;
                    }

                    const timezoneOffset = new Date().getTimezoneOffset();

                    const payload = {
                        userId: userId,
                        productId: productId,
                        quantity: item.quantity,
                        frequency,
                        startDate: startDate,
                        endDate: endDate || undefined,
                        preferredTime,
                        timezoneOffset,
                        metadata: {
                            originalOrderId: orderId,
                            shippingCharges: fees?.shipping,
                            platformFee: fees?.platform,
                            gstAmount: fees?.gst
                        }
                    };

                    console.log("Submitting Subscription Payload:", payload);

                    const res = await fetch(`${API_BASE}/api/subscriptions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });

                    const json = await res.json();

                    if (!res.ok) throw new Error(json.error || "Failed");

                    if (json.success) {
                        successCount++;
                        setCompletedCount((prev) => prev + 1);
                    }

                } catch (err) {
                    console.error("Failed to subscribe item:", item, err);
                }
            }

            if (successCount === totalItems) {
                sileo.success({ title: `Generated ${successCount} subscriptions successfully!` });
                if (onSuccess) onSuccess();
                onClose();
            } else if (successCount > 0) {
                sileo.warning({ title: `Created ${successCount} of ${totalItems} subscriptions.` });
                if (onSuccess) onSuccess();
                onClose();
            } else {
                sileo.error({ title: "Failed to create subscriptions." });
            }

        } catch (err: any) {
            sileo.error({ title: err.message || "Something went wrong" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto py-10 md:py-20 lg:items-center">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">

                {/* Header */}
                <div className="bg-amber-50 p-6 border-b border-amber-100 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-3 text-amber-700">
                        <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm">
                            <RotateCw size={20} className="animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg">Repeat Order</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">#{orderId.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-100/50 text-gray-400 hover:text-amber-600 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Items to verify ({items.length})</p>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                        {item.image ? (
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-slate-300" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                            {item.productName || item.name || "Product"}
                                        </p>
                                        <p className="text-[10px] font-black text-amber-600">₹{(item as any).displayPrice.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                                        <button 
                                            type="button"
                                            onClick={() => updateQuantity(idx, -1)}
                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                                        >
                                            <Minus size={12} className="text-slate-500" />
                                        </button>
                                        <span className="w-6 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                                        <button 
                                            type="button"
                                            onClick={() => updateQuantity(idx, 1)}
                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                                        >
                                            <Plus size={12} className="text-slate-500" />
                                        </button>
                                    </div>
                                    {isSubmitting && completedCount > idx && (
                                        <CheckCircle size={16} className="text-green-500 animate-bounce" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Frequency</label>
                        <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                            {['Daily', 'Weekly', 'Monthly'].map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFrequency(f)}
                                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${frequency === f
                                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-200'
                                        : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Next Order Date</label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-3 text-amber-600" />
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-9 p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none text-xs font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                            <div className="relative">
                                <Clock size={14} className="absolute left-3 top-3 text-amber-600" />
                                <input
                                    type="time"
                                    value={preferredTime}
                                    onChange={(e) => setPreferredTime(e.target.value)}
                                    className="w-full pl-9 p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none text-xs font-bold transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                            End Date <span className="opacity-40 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="date"
                                min={startDate || new Date().toISOString().split('T')[0]}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-9 p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none text-xs font-bold transition-all"
                            />
                        </div>
                    </div>

                    {/* Summary & Totals */}
                    <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-200">
                        <div className="space-y-2 mb-4 border-b border-white/10 pb-4">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>₹{calculateSubtotal().toLocaleString()}</span>
                            </div>
                            {fees && (fees.shipping > 0 || fees.platform > 0 || fees.gst > 0) && (
                                <>
                                    {fees.shipping > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Shipping</span>
                                            <span>₹{fees.shipping.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {fees.platform > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Platform Fee</span>
                                            <span>₹{fees.platform.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {fees.gst > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>GST</span>
                                            <span>₹{fees.gst.toLocaleString()}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                            <p className="text-xl font-black font-mono tracking-tighter">₹{calculateTotal().toLocaleString()}</p>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg mt-4">
                            <CheckCircle size={10} className="text-green-500" />
                            <span>Repeats {frequency.toLowerCase()} with chosen quantities.</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>Confirm & Schedule Subscription</>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
