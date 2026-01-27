'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, RotateCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';

interface Item {
    product: any; // Can be string ID or object
    productId?: string;
    productName?: string;
    name?: string;
    quantity: number;
    image?: string;
}

interface OrderSubscriptionModalProps {
    orderId: string;
    items: Item[];
    isOpen: boolean;
    onClose: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function OrderSubscriptionModal({ orderId, items, isOpen, onClose }: OrderSubscriptionModalProps) {
    const { user, token } = useAuth();

    const [frequency, setFrequency] = useState('Monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Robust User ID check
        const userId = user?.id || (user as any)?._id;

        if (!token || !userId) {
            toast.error("Please login to enable auto-reorder");
            return;
        }

        if (!startDate || !preferredTime) {
            toast.error("Please select both a start date and time.");
            return;
        }

        setIsSubmitting(true);
        setCompletedCount(0);
        const totalItems = items.length;
        let successCount = 0;

        try {
            // Loop creates separate subscriptions, but backend cron will consolidate them based on time!
            for (const item of items) {
                try {
                    // Robust Product ID Extraction
                    // 1. item.productId (if flattened)
                    // 2. item.product._id or item.product.id (if object)
                    // 3. item.product (if string)
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
                        startDate: startDate, // Already 'YYYY-MM-DD' from input type='date'
                        endDate: frequency !== 'Once' && endDate ? endDate : undefined,
                        preferredTime,
                        timezoneOffset,
                    };

                    console.log("Submitting Subscription Payload:", payload);

                    const res = await fetch(`${API_BASE}/api/subscriptions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    });

                    const json = await res.json();

                    if (!res.ok) {
                        console.error("Subscription API Error:", json);
                        throw new Error(json.error || "Failed");
                    }

                    if (json.success) {
                        successCount++;
                        setCompletedCount((prev) => prev + 1);
                    }

                } catch (err) {
                    console.error("Failed to subscribe item:", item, err);
                }
            }

            if (successCount === totalItems) {
                toast.success(`Generated ${successCount} subscriptions successfully!`);
                onClose();
            } else if (successCount > 0) {
                toast.warning(`Created ${successCount} of ${totalItems} subscriptions.`);
                onClose();
            } else {
                toast.error("Failed to create subscriptions. Check console for details.");
            }

        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-amber-700">
                        <RotateCw size={20} />
                        <h3 className="font-bold">Repeat Order #{orderId.slice(-8)}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Items to verify ({items.length}):</p>
                        <div className="max-h-32 overflow-y-auto space-y-2 scrollbar-thin">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="truncate flex-1 font-medium text-gray-700 pr-2">
                                        {item.productName || item.name || "Product"}
                                    </span>
                                    <span className="text-gray-500 whitespace-nowrap">x {item.quantity}</span>
                                    {isSubmitting && completedCount > idx ? (
                                        <CheckCircle size={14} className="ml-1 text-green-500" />
                                    ) : (
                                        isSubmitting && <span className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin ml-1" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Frequency</label>
                        <div className="flex gap-2">
                            {['One-time', 'Weekly', 'Monthly'].map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFrequency(f === 'One-time' ? 'Once' : f)}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${frequency === (f === 'One-time' ? 'Once' : f)
                                        ? 'bg-amber-600 text-white border-amber-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    {frequency === 'Once' ? 'Schedule Date' : 'Next Order Date'}
                                </label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Time</label>
                                <div className="relative">
                                    <Clock size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                    <input
                                        type="time"
                                        value={preferredTime}
                                        onChange={(e) => setPreferredTime(e.target.value)}
                                        className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* End Date (Only for Recurring) */}
                        {frequency !== 'Once' && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    End Date <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                    <input
                                        type="date"
                                        min={startDate}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info Text */}
                    <div className="text-[10px] text-gray-500 bg-amber-50/50 p-2 rounded border border-amber-100">
                        {frequency === 'Once' ? (
                            <>One-time order scheduled for <strong className="text-amber-800">{startDate ? new Date(startDate).toLocaleDateString() : '...'}</strong> at <strong className="text-amber-800">{preferredTime || '...'}</strong>.</>
                        ) : (
                            <>First order on <strong className="text-amber-800">{startDate ? new Date(startDate).toLocaleDateString() : '...'}</strong> at <strong className="text-amber-800">{preferredTime || '...'}</strong>, then repeats {frequency.toLowerCase()}.</>
                        )}
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>Confirm & Schedule</>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
