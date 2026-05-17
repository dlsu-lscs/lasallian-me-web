import React from 'react';
import type { Rating } from '../types/rating.types';
import { StarRating } from './StarRating';

interface ReviewItemProps {
  rating: Rating;
}

export function ReviewItem({ rating }: ReviewItemProps) {
  const displayName = rating.isAnonymous || !rating.userEmail ? 'Anonymous' : rating.userEmail;

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 text-sm font-semibold shrink-0">
          {displayName[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-white/70 truncate max-w-[180px]">{displayName}</p>
          <StarRating value={rating.score} size="sm" />
        </div>
      </div>
      {rating.comment && (
        <p className="text-white/50 text-sm mt-1 ml-11 leading-relaxed">{rating.comment}</p>
      )}
    </div>
  );
}
