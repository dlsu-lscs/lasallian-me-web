'use client';

import { useUserFavoritesQuery } from '../queries/favorites.queries';
import { useApplicationsQuery } from '@/features/apps/queries/apps.queries';
import { AppCard } from '@/features/apps/components/AppCard';
import { FiBookmark } from 'react-icons/fi';

interface FavoritesContainerProps {
  userId: string;
}

// For count >= 8, prefer the largest column count [4, 3, 2] that divides
// evenly (no partial last row). If none divide evenly, pick the one whose
// last row is fullest (highest ratio of remainder/cols).
function getGridCols(count: number): 2 | 3 | 4 {
  if (count < 8) return 2;
  const candidates: (2 | 3 | 4)[] = [4, 3, 2];
  const perfect = candidates.find((c) => count % c === 0);
  if (perfect) return perfect;
  return candidates.reduce((best, c) =>
    (count % c) / c > (count % best) / best ? c : best
  );
}

const colsClass: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};

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

  const cols = getGridCols(favoriteApps.length);

  return (
    <div className={`grid ${colsClass[cols]} gap-3`}>
      {favoriteApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
