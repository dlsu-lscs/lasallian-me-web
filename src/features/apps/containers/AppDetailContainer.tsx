'use client';

import React from 'react';
import { useAppBySlug } from '@/features/apps/hooks/use-app-by-slug';
import { useApplicationFavoritesCountQuery } from '../queries/apps.queries';
import { AppDetail } from '../components/AppDetail';
import { RatingsContainer } from '@/features/ratings/containers/RatingsContainer';
import { useFavoriteToggle } from '@/features/favorites/hooks/useFavoriteToggle';
import { useApplicationRatingsQuery } from '@/features/ratings/queries/ratings.queries';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/atoms/Skeleton';

export interface AppDetailContainerProps {
  slug: string;
}

export function AppDetailContainer({ slug }: AppDetailContainerProps) {
  const { data: app, isLoading, isError } = useAppBySlug(slug);
  const { data: favoritesData } = useApplicationFavoritesCountQuery(app?.id);
  const { data: ratingsData } = useApplicationRatingsQuery(slug);
  const { isFavorited, toggle, isPending: isFavoritePending, isLoggedIn } = useFavoriteToggle(app?.id ?? 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !app) {
    notFound();
  }

  

  return (
    
    <AppDetail
      app={app}
      favoritesCount={favoritesData?.count}
      isFavorited={isFavorited}
      onToggleFavorite={toggle}
      isFavoritePending={isFavoritePending}
      isLoggedIn={isLoggedIn}
      averageScore={ratingsData?.averageScore}
      totalRatings={ratingsData?.total}
      ratingsSection={<RatingsContainer slug={slug} />}
    />
  );
}
