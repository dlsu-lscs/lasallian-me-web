'use client';

import { Application } from '../types/app.types';
import { Badge } from '@/components/atoms/Badge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { useFavoriteToggle } from '@/features/favorites/hooks/useFavoriteToggle';
import { useApplicationRatingsQuery } from '@/features/ratings/queries/ratings.queries';
import { FaStar } from 'react-icons/fa';

export interface AppCardProps {
  app: Application;
  onClick?: (app: Application) => void;
  showTags?: boolean;
  className?: string;
}

export function AppCard({ app, showTags = true, className }: AppCardProps) {
  const router = useRouter();
  const { isFavorited, toggle, isPending, isLoggedIn } = useFavoriteToggle(app.id);
  const { data: ratingsData } = useApplicationRatingsQuery(app.slug);
  const [localCount, setLocalCount] = useState(app.favoritesCount);

  const handleCardClick = () => {
    router.push(`/${app.slug}`);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localCount !== undefined) setLocalCount(isFavorited ? localCount - 1 : localCount + 1);
    toggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all p-3 h-full flex flex-col text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${className ?? ''}`}
    >
      {/* App Photo */}
      <div className="w-full h-45 mb-4 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
        {app.previewImages?.[0] ? (
          <img
            src={app.previewImages[0]}
            alt={`${app.title} photo header`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300 text-4xl font-bold">Photo</span>
        )}
      </div>

      {/* App Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 flex-1 justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {app.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {ratingsData && ratingsData.total > 0 && (
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <FaStar className="text-yellow-400"/>
                <span className="text-xs">{ratingsData.averageScore.toFixed(1)}</span>
              </span>
            )}

            <button
              onClick={handleBookmarkClick}
              disabled={isPending || !isLoggedIn}
              title={isLoggedIn ? (isFavorited ? 'Remove from favorites' : 'Add to favorites') : 'Sign in to favorite'}
              className="flex items-center gap-1 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:text-yellow-500 transition-colors z-10"
            >
              {isFavorited ? (
                <FaBookmark className="w-4 h-4 text-yellow-500" />
              ) : (
                <FiBookmark className="w-4 h-4" />
              )}
              {localCount !== undefined && (
                <span className="text-sm font-semibold">{localCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

       {/* Description */}
      <p className="text-gray-600 text-sm mb-2 line-clamp-3 flex-grow">
        {app.description}
      </p>

      {/* Tags */}
      {showTags && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {app.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-green-700 text-white px-2.5 py-0.5 rounded-sm text-xs font-medium shadow-lg truncate text-center"
            >
              {tag.replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          ))}
          {app.tags?.length > 3 && (
            <Badge variant="default">+{app.tags.length - 3}</Badge>
          )}
        </div>
      )}


     
    </div>
  );
}