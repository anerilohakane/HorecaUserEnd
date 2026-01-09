"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Download, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    onDownloadInvoice: () => void;
}

export default function OrderSuccessModal({ isOpen, onClose, orderId, onDownloadInvoice }: OrderSuccessModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500 z-10"
                            >
                                <X size={18} />
                            </button>

                            <div className="p-8 text-center">
                                {/* Success Animation */}
                                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                                    >
                                        <Check size={40} className="text-[#D97706] stroke-[3px]" />
                                    </motion.div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                                <p className="text-gray-500 mb-6 font-medium">
                                    Thank you for your purchase. <br />
                                    Your order ID is <span className="text-gray-900 font-bold">#{orderId}</span>
                                </p>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <button
                                        onClick={onDownloadInvoice}
                                        className="w-full flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                                    >
                                        <Download size={20} />
                                        Download Invoice
                                    </button>

                                    <Link href="/products" onClick={onClose} className="block w-full">
                                        <button className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold transition-all active:scale-95">
                                            <ShoppingBag size={20} />
                                            Continue Shopping
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Secure Footer */}
                            {/* <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-xs text-center text-gray-500">
                                You will receive an email confirmation shortly.
                            </div> */}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
