'use client';

import { useState } from 'react';
import { Star, X, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; comment: string; images: string[] }) => Promise<void>;
    productName: string;
}

export default function ReviewFormModal({
    isOpen,
    onClose,
    onSubmit,
    productName
}: ReviewFormModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ rating, comment, images: [] });
            onClose();
            // Reset form
            setRating(0);
            setComment('');
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-semibold text-[#111827]">Write a Review</h3>
                        <p className="text-sm text-gray-500 mt-1">{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Rating */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#111827]">
                            Overall Rating
                        </label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={32}
                                        className={`${star <= (hoverRating || rating)
                                                ? 'fill-[#FFB800] text-[#FFB800]'
                                                : 'text-gray-200'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-[#D97706] font-medium">
                                {rating === 5 ? 'Excellent!' :
                                    rating === 4 ? 'Good' :
                                        rating === 3 ? 'Average' :
                                            rating === 2 ? 'Fair' : 'Poor'}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label htmlFor="comment" className="block text-sm font-medium text-[#111827]">
                            Your Review
                        </label>
                        <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike? How was the quality?"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={rating === 0 || isSubmitting}
                            className="flex-1 px-6 py-3 rounded-xl bg-[#D97706] text-white font-medium hover:bg-[#b56305] transition-colors shadow-lg shadow-[#D97706]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
