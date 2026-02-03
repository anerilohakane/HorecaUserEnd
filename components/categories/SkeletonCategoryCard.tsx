import React from 'react';

const SkeletonCategoryCard = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="relative aspect-square bg-gray-200" />
            <div className="p-4 flex justify-center">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
        </div>
    );
};

export default SkeletonCategoryCard;
