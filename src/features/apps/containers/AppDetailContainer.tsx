'use client';

import React, { useState } from 'react';
import { useAppBySlug } from '@/features/apps/hooks/use-app-by-slug';
import { useApplicationFavoritesCountQuery } from '../queries/apps.queries';
import { AppDetail } from '../components/AppDetail';
import { ClaimModal } from '../components/ClaimModal';
import { RatingsContainer } from '@/features/ratings/containers/RatingsContainer';
import { useFavoriteToggle } from '@/features/favorites/hooks/useFavoriteToggle';
import { useApplicationRatingsQuery } from '@/features/ratings/queries/ratings.queries';
import { authClient } from '@/lib/auth-client';
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
  const { data: session } = authClient.useSession();

  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const handleClaim = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setClaimModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-52" />
          <div className="p-6 flex flex-col gap-4">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 flex-1 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !app) {
    notFound();
  }

  return (
    <>
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
        onClaim={app.unclaimed ? handleClaim : undefined}
      />

      {session?.user && app.unclaimed && (
        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          applicationId={app.id}
          applicationTitle={app.title}
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        />
      )}
    </>
  );
}
