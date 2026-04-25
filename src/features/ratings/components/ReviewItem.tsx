import React from 'react';
import type { Rating } from '../types/rating.types';
import { StarRating } from './StarRating';

interface ReviewItemProps {
  rating: Rating;
}

export function ReviewItem({ rating }: ReviewItemProps) {
  const displayName = rating.isAnonymous || !rating.userEmail ? 'Anonymous' : rating.userEmail;

  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium shrink-0">
          {displayName[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{displayName}</p>
          <StarRating value={rating.score} size="sm" />
        </div>
      </div>
      {rating.comment && (
        <p className="text-gray-700 text-sm mt-1 ml-12">{rating.comment}</p>
      )}
    </div>
  );
}
