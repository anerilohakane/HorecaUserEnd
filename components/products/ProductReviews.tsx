'use client';

import { Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({ 
  reviews, 
  averageRating, 
  totalReviews 
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  const ratingDistribution = [
    { stars: 5, count: Math.floor(totalReviews * 0.6), percentage: 60 },
    { stars: 4, count: Math.floor(totalReviews * 0.25), percentage: 25 },
    { stars: 3, count: Math.floor(totalReviews * 0.1), percentage: 10 },
    { stars: 2, count: Math.floor(totalReviews * 0.03), percentage: 3 },
    { stars: 1, count: Math.floor(totalReviews * 0.02), percentage: 2 },
  ];

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
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
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xl text-gray-500">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(averageRating)
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
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl soft-shadow p-6"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#111827]">
                      {review.author}
                    </span>
                    {review.verified && (
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
                          className={`${
                            i < review.rating
                              ? 'fill-[#FFB800] text-[#FFB800]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h5 className="font-medium text-[#111827] mb-2">
                  {review.title}
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#D97706] transition-colors">
                  <ThumbsUp size={16} />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <div className="text-center pt-4">
          <button className="bg-[#D97706] text-white px-8 py-3 rounded-full hover:bg-[#7CB342] transition-all shadow-md hover:shadow-lg font-medium">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
}