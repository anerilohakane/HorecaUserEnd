import React from 'react';

const SkeletonCard = () => (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
        <div className="relative aspect-[4/3] bg-gray-200" />
        <div className="p-3 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="flex items-center justify-between mt-4">
                <div className="h-6 bg-gray-300 rounded w-20" />
                <div className="h-8 bg-gray-200 rounded w-20" />
            </div>
        </div>
    </div>
);

export default SkeletonCard;
