'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiBookmark, FiMoreHorizontal, FiMinus } from 'react-icons/fi';
import { useUserFavoritesQuery, useRemoveFavoriteMutation } from '../queries/favorites.queries';
import { useApplicationsQuery } from '@/features/apps/queries/apps.queries';
import { imgSrc } from '@/lib/img-src';

interface FavoritesPreviewContainerProps {
  userId: string;
}

function getIconClasses(count: number): { icon: string; label: string; gap: string } {
  if (count <= 2) return { icon: 'w-28 h-28', label: 'w-28', gap: 'gap-8' };
  if (count <= 4) return { icon: 'w-24 h-24', label: 'w-24', gap: 'gap-7' };
  if (count <= 8) return { icon: 'w-20 h-20', label: 'w-20', gap: 'gap-6' };
  return         { icon: 'w-16 h-16', label: 'w-16', gap: 'gap-x-5 gap-y-4' };
}

export function FavoritesPreviewContainer({ userId }: FavoritesPreviewContainerProps) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: favoritesData, isLoading: favLoading } = useUserFavoritesQuery(userId);
  const { data: appsData, isLoading: appsLoading } = useApplicationsQuery();
  const removeMutation = useRemoveFavoriteMutation(userId);

  const isLoading = favLoading || appsLoading;

  const favoriteApps = (appsData?.data ?? []).filter((app) =>
    (favoritesData?.applicationIds ?? []).includes(app.id),
  );

  const { icon: iconClass, label: labelClass, gap: gapClass } = getIconClasses(favoriteApps.length);

  /* Exit delete mode automatically when the last favorite is removed */
  useEffect(() => {
    if (isDeleteMode && favoriteApps.length === 0) setIsDeleteMode(false);
  }, [favoriteApps.length, isDeleteMode]);

  /* Dismiss delete mode and dropdown on outside click */
  useEffect(() => {
    if (!isDeleteMode && !isDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDeleteMode(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDeleteMode, isDropdownOpen]);

  const handlePanelClick = () => {
    if (isDeleteMode) setIsDeleteMode(false);
  };

  const handleThreeDots = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  const handleModify = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteMode(true);
    setIsDropdownOpen(false);
  };

  const handleRemove = (e: React.MouseEvent, appId: number) => {
    e.stopPropagation();
    removeMutation.mutate(appId);
  };

  const handleIconClick = (e: React.MouseEvent, url?: string | null) => {
    if (isDeleteMode) { e.stopPropagation(); return; }
    if (url) window.open(url, '_blank');
  };

  return (
    <div
      ref={containerRef}
      onClick={handlePanelClick}
      className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-xl flex-1 px-5 py-4 lg:px-8 lg:py-7 flex flex-col min-w-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          {isDeleteMode ? 'Editing — tap outside to finish' : 'Favorites'}
        </p>
        <div className="relative">
            <button
              onClick={handleThreeDots}
              className={`text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors p-2 rounded-sm focus:outline-none cursor-pointer ${!isLoading && favoriteApps.length > 0 ? '' : 'invisible pointer-events-none'}`}
            >
              <FiMoreHorizontal className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="absolute right-0 top-7 z-20 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-[var(--shadow-modal)] overflow-hidden min-w-28"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={handleModify}
                    className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/8 transition-colors font-medium"
                  >
                    Modify
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/25 text-sm">Loading...</p>
        </div>
      ) : favoriteApps.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center max-w-48">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
              <FiBookmark className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-white/50 text-sm font-semibold leading-snug">Your saved apps live here</p>
            <p className="text-white/25 text-xs leading-snug">
              Hit <span className="text-white/40 font-semibold">Save</span> on any application to pin it to this panel. Bookmark <span className="text-white/40 font-semibold">pana.tools</span> to go back to this anytime!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className={`flex flex-wrap justify-center ${gapClass} w-full`}>
            {favoriteApps.map((app, index) => (
              <motion.div
                key={app.id}
                role="button"
                tabIndex={0}
                onClick={(e) => handleIconClick(e, app.url)}
                className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer"
                animate={isDeleteMode
                  ? { rotate: [-2, 2] }
                  : { rotate: 0 }
                }
                transition={isDeleteMode
                  ? { repeat: Infinity, repeatType: 'mirror', duration: 0.15, delay: (index % 5) * 0.03 }
                  : { type: 'spring', stiffness: 300, damping: 20 }
                }
                whileHover={isDeleteMode ? {} : { scale: 1.05 }}
                whileTap={isDeleteMode ? {} : { scale: 0.95 }}
              >
                {/* Icon wrapper — relative so the "-" badge can be positioned */}
                <div className="relative">
                  <div className={`${iconClass} rounded-xl overflow-hidden bg-black/50 shadow-md`}>
                    {app.previewImages?.[0] ? (
                      <img
                        src={imgSrc(app.previewImages[0])}
                        alt={app.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/50 text-xl font-bold font-display select-none">
                          {app.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {isDeleteMode && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        onClick={(e) => handleRemove(e, app.id)}
                        className="cursor-pointer absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center shadow-lg border border-red-400 z-10 focus:outline-none"
                      >
                        <FiMinus className="w-3 h-3 text-white" strokeWidth={4} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <span className={`text-white/80 font-semibold text-xs truncate ${labelClass} text-center leading-tight`}>
                  {app.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
