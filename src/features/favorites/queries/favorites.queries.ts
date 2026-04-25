import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavorite, getUserFavorites, removeFavorite } from '../services/favorites.service';

const userFavoritesKey = (userId: string) => ['user-favorites', userId];

export function useUserFavoritesQuery(userId: string | undefined) {
  return useQuery({
    queryKey: userFavoritesKey(userId ?? ''),
    queryFn: () => getUserFavorites(userId!),
    enabled: !!userId,
  });
}

export function useAddFavoriteMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => addFavorite(applicationId),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: userFavoritesKey(userId) });
      queryClient.invalidateQueries({ queryKey: ['application-favorites-count', applicationId] });
    },
  });
}

export function useRemoveFavoriteMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => removeFavorite(applicationId),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: userFavoritesKey(userId) });
      queryClient.invalidateQueries({ queryKey: ['application-favorites-count', applicationId] });
    },
  });
}
