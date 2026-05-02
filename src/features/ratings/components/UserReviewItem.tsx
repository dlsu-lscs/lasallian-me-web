import Link from 'next/link';
import type { UserRatingItem } from '../types/rating.types';
import { StarRating } from './StarRating';

interface UserReviewItemProps {
  rating: UserRatingItem;
}

export function UserReviewItem({ rating }: UserReviewItemProps) {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/${rating.application.slug}`}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            {rating.application.title}
          </Link>
          <div className="mt-1">
            <StarRating value={rating.score} size="sm" />
          </div>
        </div>
        {rating.isAnonymous && (
          <span className="text-xs text-gray-400 shrink-0">Anonymous</span>
        )}
      </div>
      {rating.comment && (
        <p className="text-gray-700 text-sm mt-2">{rating.comment}</p>
      )}
    </div>
  );
}
