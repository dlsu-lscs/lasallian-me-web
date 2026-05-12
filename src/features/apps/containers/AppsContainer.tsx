'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { AppCard } from '../components/AppCard';
import { useAppsContainer } from '@/features/apps/hooks/useAppsContainer';
import { Pagination } from '@/components/molecules/Pagination';
import { AppCardSkeleton } from '@/components/molecules/AppCardSkeleton';
import { motion } from 'motion/react';
import { authClient } from '@/lib/auth-client';
import { UserProfileCard } from '../components/UserProfileCard';
import { FavoritesPreviewContainer } from '@/features/favorites/containers/FavoritesPreviewContainer';

export default function AppsContainer() {
  const [hasMounted, setHasMounted] = useState(false);
  const { data: session } = authClient.useSession();

  const {
    apps,
    meta,
    page,
    setPage,
    filters,
    uniqueTags,
    toggleTag,
    clearFilters,
    hasActiveFilters,
    isLoading,
    isError,
  } = useAppsContainer();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60 text-sm">Loading apps...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* User profile + favorites panel */}
      {session?.user && (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
            <UserProfileCard name={session.user.name} image={session.user.image} email={session.user.email} />
            <FavoritesPreviewContainer userId={session.user.id} />
          </div>
        </div>
      )}

      {/* Filter / search panel — glass card */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-3">
        <div className="bg-black/60 backdrop-blur-lg border border-white/10 shadow-[var(--shadow-glass)] rounded-xl px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 pt-0.5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide leading-none">Filter</p>
              <p className="text-xs text-white/25 mt-0.5 whitespace-nowrap">by tag</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {uniqueTags.map((tag) => {
                const isActive = filters.selectedTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-black'
                        : 'bg-white/8 text-white/50 border border-white/10 hover:bg-white/12 hover:text-white/80'
                    }`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {tag}
                  </motion.button>
                );
              })}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apps grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <AppCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-white/70 text-sm">
              Unable to load apps right now. Please try again later.
            </p>
          </div>
        ) : apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-2">
            <svg
              className="h-10 w-10 text-white/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <div>
              <h3 className="text-base font-semibold text-white/80 mb-1">No apps found</h3>
              <p className="text-sm text-white/50">Try adjusting your search or filter criteria.</p>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {meta && (
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
