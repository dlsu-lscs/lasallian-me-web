'use client';

import { Application } from '../types/app.types';
import { Badge } from '@/components/atoms/Badge';
import { useRouter } from 'next/navigation';
import { FiBookmark } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useFavoriteToggle } from '@/features/favorites/hooks/useFavoriteToggle';
import { useApplicationRatingsQuery } from '@/features/ratings/queries/ratings.queries';

export interface AppCardProps {
  app: Application;
  onClick?: (app: Application) => void;
}

export function AppCard({ app }: AppCardProps) {
  const router = useRouter();
  const { isFavorited, toggle, isPending, isLoggedIn } = useFavoriteToggle(app.id);
  const { data: ratingsData } = useApplicationRatingsQuery(app.slug);

  const handleCardClick = () => router.push(`/${app.slug}`);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const visibleTags = app.tags?.slice(0, 2) ?? [];
  const extraTagCount = (app.tags?.length ?? 0) - visibleTags.length;

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="bg-black/60 backdrop-blur-lg shadow-[var(--shadow-lifted)] rounded-md overflow-hidden h-full flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/40 hover:shadow-[var(--shadow-lifted)] hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Preview image — edge-to-edge, tags overlaid top-left */}
      <div className="relative w-full h-44 bg-white/10 shrink-0">
        {app.previewImages?.[0] ? (
          <img
            src={app.previewImages[0]}
            alt={`${app.title} preview`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/25 text-3xl font-bold font-display select-none">
              {app.title.charAt(0)}
            </span>
          </div>
        )}

        {visibleTags.length > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {visibleTags.map((tag, index) => (
              <Badge key={index} variant="default">{tag}</Badge>
            ))}
            {extraTagCount > 0 && (
              <span className="text-xs font-medium text-white/70">+{extraTagCount}</span>
            )}
          </div>
        )}
      </div>

      {/* Info section — text left, Launch button right */}
      <div className="p-3 flex items-center gap-3">
        {/* Left: title row with inline stats + description */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-display text-base font-bold text-white/90 truncate">
              {app.title}
            </h3>
            {ratingsData && ratingsData.total > 0 && (
              <span className="flex items-center gap-1 text-white/50 shrink-0">
                <FaStar className="w-3 h-3 text-white/50" />
                <span className="text-xs font-medium">{ratingsData.averageScore.toFixed(1)}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-white/40 shrink-0">
              <FiBookmark className="w-3.5 h-3.5" />
              {app.favoritesCount !== undefined && (
                <span className="text-xs font-semibold">{app.favoritesCount}</span>
              )}
            </span>
          </div>
          <h3 className="text-white/60 text-sm font-semibold leading-relaxed truncate">
            {app.description}
          </h3>
        </div>

        {/* Right: Save button */}
        <button
          onClick={handleSaveClick}
          disabled={isPending || !isLoggedIn}
          className={`px-3 py-1 rounded-full text-base font-semibold transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
            isFavorited
              ? 'bg-black/50 text-white hover:bg-white/10'
              : 'bg-white text-black hover:bg-white/80'
          }`}
        >
          {isFavorited ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
