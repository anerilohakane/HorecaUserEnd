'use client';

import { Star, ThumbsUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Review } from '@/lib/types/product';
import ReviewFormModal from './ReviewFormModal';

interface ProductReviewsProps {
  reviews: Review[];
  totalReviews: number;
  averageRating: number; // passed from parent based on product data often, or calculated
  onWriteReview: () => void;
}

export default function ProductReviews({
  reviews = [],
  totalReviews = 0,
  averageRating = 0,
  onWriteReview
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  // Calculate distribution from actual reviews if available, otherwise mock or use what we have
  // Since the API doesn't return distribution, we calculate it from the list if the list is full.
  // However, often the list is paginated. For now, we will calculate based on what we have or just mock it relative to the count 
  // if the list is small. Better to calculate from the current list for correctness on what's visible.

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0, 0]; // 0-5 index, we use 1-5
    reviews.forEach(r => {
      const rt = Math.round(r.rating);
      if (rt >= 1 && rt <= 5) dist[rt]++;
    });



    // If we have no reviews but a count, we can't really cheat the distribution accurately without data.
    // So we just show based on loaded reviews.
    const total = reviews.length || 1;

    return [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: dist[stars],
      percentage: Math.round((dist[stars] / total) * 100)
    }));
  }, [reviews]);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-white rounded-2xl soft-shadow p-8">
        <h3 className="text-2xl font-medium text-[#111827] mb-6">
          Customer Reviews
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-[#111827]">
                {(averageRating || 0).toFixed(1)}
              </span>
              <span className="text-xl text-gray-500">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${i < Math.floor(averageRating || 0)
                    ? 'fill-[#FFB800] text-[#FFB800]'
                    : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600">{item.stars}</span>
                  <Star size={14} className="fill-[#FFB800] text-[#FFB800]" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D97706] transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {/* Sort Controls */}
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-[#111827]">
            All Reviews ({reviews.length})
          </h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#D97706] transition-colors"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {sortedReviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No reviews yet. Be the first to review!
            </div>
          ) : (
            sortedReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl soft-shadow p-6"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#111827]">
                        {/* {review.author || 'Marmik User'} */}

                        {review.user?.name || 'Verified User'}

                      </span>
                      {review.order && (
                        <span className="text-xs bg-[#E8F5E9] text-[#D97706] px-2 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${i < review.rating
                              ? 'fill-[#FFB800] text-[#FFB800]'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Write Review Button */}
        {/* <div className="text-center pt-4">
          <button
            onClick={onWriteReview}
            className="bg-[#D97706] text-white px-8 py-3 rounded-full hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg font-medium"
          >
            Write a Review
          </button>
        </div> */}
      </div>
    </div>
  );
}