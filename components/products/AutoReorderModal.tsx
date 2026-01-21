
'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, RotateCw } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';

interface AutoReorderModalProps {
    product: {
        id: string;
        name: string;
        image?: string;
        minOrder: number;
    };
    isOpen: boolean;
    onClose: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function AutoReorderModal({ product, isOpen, onClose }: AutoReorderModalProps) {
    const { user, token } = useAuth();

    const [quantity, setQuantity] = useState(product.minOrder || 1);
    const [frequency, setFrequency] = useState('Monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [preferredTime, setPreferredTime] = useState('09:00');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Please login to enable auto-reorder");
            return;
        }

        setIsSubmitting(true);

        try {
            const timezoneOffset = new Date().getTimezoneOffset();

            const payload = {
                userId: user?.id,
                productId: product.id,
                quantity,
                frequency,
                startDate: startDate, // Already YYYY-MM-DD
                preferredTime,
                timezoneOffset,
            };

            const res = await fetch(`${API_BASE}/api/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // If backend required auth header
                },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (json.success) {
                toast.success("Auto-reorder enabled successfully!");
                onClose();
            } else {
                toast.error(json.error || "Failed to enable auto-reorder");
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
                <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-orange-700">
                        <RotateCw size={20} />
                        <h3 className="font-bold">Auto Reorder</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    <div className="flex items-center gap-3 mb-4">
                        {product.image && (
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md border" />
                        )}
                        <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">Subscribe & Save time</p>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                        />
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Frequency</label>
                        <div className="flex gap-2">
                            {['Weekly', 'Monthly'].map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFrequency(f)}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${frequency === f
                                        ? 'bg-orange-600 text-white border-orange-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Start Date
                            </label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
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
                                    className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Text */}
                    <div className="text-[10px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                        First order on <strong className="text-gray-700">{new Date(startDate).toLocaleDateString()}</strong> at <strong className="text-gray-700">{preferredTime}</strong>.
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>Enable Auto Reorder</>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
