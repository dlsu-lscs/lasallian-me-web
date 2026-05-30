import Link from 'next/link';
import type { UserRatingItem } from '../types/rating.types';
import { StarRating } from './StarRating';

interface UserReviewItemProps {
  rating: UserRatingItem;
}

export function UserReviewItem({ rating }: UserReviewItemProps) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/${rating.application.slug}`}
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            {rating.application.title}
          </Link>
          <div className="mt-1">
            <StarRating value={rating.score} size="sm" />
          </div>
        </div>
        {rating.isAnonymous && (
          <span className="text-xs text-white/30 shrink-0">Anonymous</span>
        )}
      </div>
      {rating.comment && (
        <p className="text-white/50 text-sm mt-2 leading-relaxed">{rating.comment}</p>
      )}
    </div>
  );
}
