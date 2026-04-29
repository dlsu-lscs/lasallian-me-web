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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-5 w-1/3 mb-8" />
          <Skeleton className="w-full h-64 rounded-xl mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6 mb-8" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
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
