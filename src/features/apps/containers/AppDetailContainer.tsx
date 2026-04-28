'use client';

import React from 'react';
import { useAppBySlug } from '@/features/apps/hooks/use-app-by-slug';
import { useApplicationFavoritesCountQuery } from '../queries/apps.queries';
import { AppDetail } from '../components/AppDetail';
import { RatingsContainer } from '@/features/ratings/containers/RatingsContainer';
import { useFavoriteToggle } from '@/features/favorites/hooks/useFavoriteToggle';
import { useApplicationRatingsQuery } from '@/features/ratings/queries/ratings.queries';
import { notFound } from 'next/navigation';

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
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
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
