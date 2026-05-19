'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Application } from '../types/app.types';
import { Badge } from '@/components/atoms/Badge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useFavoriteToggle } from '@/features/favorites/hooks/useFavoriteToggle';
import { imgSrc } from '@/lib/img-src';

export interface AppCardProps {
  app: Application;
  onClick?: (app: Application) => void;
  showTags?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
  action?: React.ReactNode;
  badge?: React.ReactNode;
  iconOverlay?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function AppCard({ app, onClick, showTags = true, className, variant = 'default', action, badge, iconOverlay, subtitle }: AppCardProps) {
  const router = useRouter();
  const { isFavorited, toggle, isPending, isLoggedIn } = useFavoriteToggle(app.id);
  const [localCount, setLocalCount] = useState(app.favoritesCount);

  const handleCardClick = () => onClick ? onClick(app) : router.push(`/${app.slug}`);

  const handleSaveClick = (e: React.MouseEvent) => {
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

  const defaultAction = (
    <button
      onClick={handleSaveClick}
      disabled={isPending || !isLoggedIn}
      className={`px-3 py-1 cursor-pointer rounded-full text-base font-semibold transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
        isFavorited
          ? 'bg-black/50 text-white hover:bg-white/10'
          : 'bg-white text-black hover:bg-white/80'
      }`}
    >
      {isFavorited ? 'Saved' : 'Save'}
    </button>
  );

  if (variant === 'compact') {
    const bgImage = app.previewImages?.[0] ? imgSrc(app.previewImages[0]) : null;
    const iconImage = app.icon ? imgSrc(app.icon) : bgImage;

    return (
      <motion.div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className={`app-card-compact relative rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/40 ${className ?? ''}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Background layer — overflow-hidden lives here to clip the image to rounded corners */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          {bgImage && (
            <Image
              fill
              unoptimized
              src={bgImage}
              alt=""
              className="object-cover opacity-[0.18] select-none"
            />
          )}
          {/* Gradient overlay — lighter to let the image breathe */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        </div>

        {/* Content row */}
        <div className="relative flex items-center gap-3 p-3">
          {/* App icon — wrapper is relative so iconOverlay can escape overflow-hidden */}
          <div className="relative shrink-0">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/50 border border-white/10">
              {iconImage ? (
                <Image fill unoptimized src={iconImage} alt={app.title} className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/40 text-base font-bold font-display select-none">
                    {app.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {iconOverlay && (
              <div className="absolute -bottom-0.5 -right-0.5 z-10">{iconOverlay}</div>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <p className="font-display text-sm font-bold text-white/90 truncate">{app.title}</p>
              {badge}
            </div>
            {subtitle ?? <p className="text-white/50 text-xs truncate">{app.description}</p>}
          </div>

          {/* Action */}
          {action ?? defaultAction}
        </div>
      </motion.div>
    );
  }

  const visibleTags = app.tags?.slice(0, 2) ?? [];
  const extraTagCount = (app.tags?.length ?? 0) - visibleTags.length;

  return (
    <motion.div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`bg-black/60 backdrop-blur-lg shadow-[var(--shadow-lifted)] rounded-md overflow-hidden h-full flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/40 ${className ?? ''}`}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Preview image — edge-to-edge, tags overlaid top-left */}
      <div className="relative w-full h-44 bg-white/10 shrink-0">
        {app.previewImages?.[0] ? (
          <Image
            fill
            unoptimized
            src={imgSrc(app.previewImages[0])}
            alt={`${app.title} preview`}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/25 text-3xl font-bold font-display select-none">
              {app.title.charAt(0)}
            </span>
          </div>
        )}

        {showTags && visibleTags.length > 0 && (
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

      {/* Info section — icon + text + save button */}
      <div className="p-3 flex items-center gap-3">
        {/* App icon */}
        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-black/50 border border-white/8 shrink-0">
          {(app.icon ?? app.previewImages?.[0]) ? (
            <Image
              fill
              unoptimized
              src={imgSrc((app.icon ?? app.previewImages![0])!)}
              alt={app.title}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/40 text-lg font-bold font-display select-none">
                {app.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Title row with inline stats + description */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-display text-base font-bold text-white/90 truncate">
              {app.title}
            </p>
            {app.ratingCount != null && app.ratingCount > 0 && app.averageRating != null && (
              <span className="flex items-center gap-1 text-white/50 shrink-0">
                <FaStar className="w-3 h-3 text-white/50" />
                <span className="text-xs font-medium">{app.averageRating.toFixed(1)}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-white/40 shrink-0">
              <FiBookmark className="w-3.5 h-3.5" />
              {localCount !== undefined && (
                <span className="text-xs font-semibold">{localCount}</span>
              )}
            </span>
          </div>
          <p className="text-white/60 text-sm font-semibold leading-relaxed truncate">
            {app.description}
          </p>
        </div>

        {/* Action */}
        {action ?? defaultAction}
      </div>
    </motion.div>
  );
}
