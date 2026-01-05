import React, { useState } from 'react';
import { X, Upload, Loader2, AlertCircle, CheckSquare, Square } from 'lucide-react';

interface ReturnOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { selectedItems: any[], reason: string; comment: string; images: string[] }) => Promise<void>;
    orderItems: any[];
    orderId: string;
}

const ReturnOrderModal: React.FC<ReturnOrderModalProps> = ({ isOpen, onClose, onSubmit, orderItems, orderId }) => {
    const [reason, setReason] = useState<string>('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // Array of product IDs

    // Initialize/Reset
    React.useEffect(() => {
        if (isOpen) {
            setReason('');
            setComment('');
            setError(null);
            // Default select all? Or none? Let's select all for convenience.
            setSelectedItems(orderItems.map(item => item.product?._id || item.product?.id || item.productId || item.product));
        }
    }, [isOpen, orderItems]);

    if (!isOpen) return null;

    const toggleItem = (pId: string) => {
        setSelectedItems(prev => {
            if (prev.includes(pId)) {
                return prev.filter(id => id !== pId);
            } else {
                return [...prev, pId];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            setError("Please select a reason for return");
            return;
        }
        if (selectedItems.length === 0) {
            setError("Please select at least one item to return");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            // Filter original items based on selection to pass back full objects
            const itemsToReturn = orderItems.filter(item => {
                const pId = item.product?._id || item.product?.id || item.productId || item.product;
                return selectedItems.includes(pId);
            });

            await onSubmit({ selectedItems: itemsToReturn, reason, comment, images: [] });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit return request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const reasons = [
        "Defective/Damaged Product",
        "Wrong Item Received",
        "Item Not as Described",
        "Size/Fit Issues",
        "No Longer Needed",
        "Other"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Return Order</h3>
                        <p className="text-sm text-gray-500 mt-1">Order #{orderId.slice(-6).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-6">

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Item Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Select Items to Return ({selectedItems.length})</label>
                        <div className="border rounded-xl divide-y">
                            {orderItems.map((item) => {
                                const pId = item.product?._id || item.product?.id || item.productId || item.product;
                                const isSelected = selectedItems.includes(pId);
                                return (
                                    <div
                                        key={pId}
                                        onClick={() => toggleItem(pId)}
                                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${isSelected ? 'bg-amber-50/50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-300 text-transparent'}`}>
                                            <CheckSquare size={14} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{item.productName || item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} • ₹{item.unitPrice}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reason Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Reason for Return *</label>
                        <div className="space-y-2">
                            {reasons.map((r) => (
                                <label key={r} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="returnReason"
                                        value={r}
                                        checked={reason === r}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                                    />
                                    <span className="text-gray-700 text-sm">{r}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none h-24 text-sm"
                            placeholder="Please provide more details about the issue..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason || selectedItems.length === 0}
                        className="w-full bg-[#D97706] text-white py-4 rounded-xl font-medium hover:bg-[#B45309] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Submitting Request...
                            </>
                        ) : (
                            `Return ${selectedItems.length} Item${selectedItems.length !== 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnOrderModal;
