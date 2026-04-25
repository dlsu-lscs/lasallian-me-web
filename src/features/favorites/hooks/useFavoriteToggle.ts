'use client';

import { authClient } from '@/lib/auth-client';
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useUserFavoritesQuery,
} from '../queries/favorites.queries';

export function useFavoriteToggle(applicationId: number) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const { data: userFavoritesData } = useUserFavoritesQuery(userId);
  const isFavorited = userFavoritesData?.applicationIds.includes(applicationId) ?? false;

  const addMutation = useAddFavoriteMutation(userId ?? '');
  const removeMutation = useRemoveFavoriteMutation(userId ?? '');

  const toggle = () => {
    if (!userId) return;
    if (isFavorited) {
      removeMutation.mutate(applicationId);
    } else {
      addMutation.mutate(applicationId);
    }
  };

  return {
    isFavorited,
    toggle,
    isPending: addMutation.isPending || removeMutation.isPending,
    isLoggedIn: !!userId,
  };
}
