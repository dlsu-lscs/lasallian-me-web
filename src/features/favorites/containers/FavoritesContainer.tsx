'use client';

import { useUserFavoritesQuery } from '../queries/favorites.queries';
import { useApplicationsQuery } from '@/features/apps/queries/apps.queries';
import { AppCard } from '@/features/apps/components/AppCard';

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
    return <div className="text-center py-12 text-gray-500">Loading favorites...</div>;
  }

  if (favoriteApps.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No favorite apps yet. Browse apps and click the bookmark to save them here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {favoriteApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
