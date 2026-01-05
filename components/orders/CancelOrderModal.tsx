import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { reason: string; comment: string }) => Promise<void>;
    orderId: string;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ isOpen, onClose, onSubmit, orderId }) => {
    const [reason, setReason] = useState<string>('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            setReason('');
            setComment('');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            setError("Please select a reason for cancellation");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({ reason, comment });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit cancellation request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const reasons = [
        "Ordered by mistake",
        "Found a better price",
        "Item not arriving on time",
        "Need to change shipping address",
        "Need to change payment method",
        "Other"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                        <p className="text-sm text-gray-500 mt-1">Order #{orderId?.slice(-8).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Reason Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Reason for Cancellation *</label>
                        <div className="space-y-2">
                            {reasons.map((r) => (
                                <label key={r} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="cancelReason"
                                        value={r}
                                        checked={reason === r}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                                    />
                                    <span className="text-gray-700">{r}</span>
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
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none h-24"
                            placeholder="Please provide more details..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !reason}
                        className="w-full bg-red-600 text-white py-4 rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Cancelling Order...
                            </>
                        ) : (
                            'Confirm Cancellation'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CancelOrderModal;
