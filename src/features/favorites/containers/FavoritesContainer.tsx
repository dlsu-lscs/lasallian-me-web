'use client';

import { useUserFavoritesQuery } from '../queries/favorites.queries';
import { useApplicationsQuery } from '@/features/apps/queries/apps.queries';
import { AppCard } from '@/features/apps/components/AppCard';
import { FiBookmark } from 'react-icons/fi';

interface FavoritesContainerProps {
  userId: string;
}

export function FavoritesContainer({ userId }: FavoritesContainerProps) {
  const { data: favoritesData, isLoading: favLoading } = useUserFavoritesQuery(userId);
  const { data: appsData, isLoading: appsLoading } = useApplicationsQuery();

  const isLoading = favLoading || appsLoading;

  const favoriteApps = (appsData?.data ?? []).filter((app) =>
    (favoritesData?.applicationIds ?? []).includes(app.id),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-white/30 text-sm">Loading favorites...</p>
      </div>
    );
  }

  if (favoriteApps.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
          <FiBookmark className="w-4 h-4 text-white/30" />
        </div>
        <p className="text-white/50 text-sm font-semibold">No saved apps yet</p>
        <p className="text-white/25 text-xs max-w-48 leading-snug">
          Hit <span className="text-white/40 font-semibold">Save</span> on any application to pin it here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {favoriteApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
