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

type UserFavorites = { userId: string; applicationIds: number[] };

export function useAddFavoriteMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => addFavorite(applicationId),
    onMutate: async (applicationId) => {
      await queryClient.cancelQueries({ queryKey: userFavoritesKey(userId) });
      const previous = queryClient.getQueryData<UserFavorites>(userFavoritesKey(userId));
      queryClient.setQueryData<UserFavorites>(userFavoritesKey(userId), (old) => ({
        userId,
        applicationIds: [...(old?.applicationIds ?? []), applicationId],
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(userFavoritesKey(userId), context?.previous);
    },
    onSettled: (_, _err, applicationId) => {
      queryClient.invalidateQueries({ queryKey: userFavoritesKey(userId) });
      queryClient.invalidateQueries({ queryKey: ['application-favorites-count', applicationId] });
    },
  });
}

export function useRemoveFavoriteMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => removeFavorite(applicationId),
    onMutate: async (applicationId) => {
      await queryClient.cancelQueries({ queryKey: userFavoritesKey(userId) });
      const previous = queryClient.getQueryData<UserFavorites>(userFavoritesKey(userId));
      queryClient.setQueryData<UserFavorites>(userFavoritesKey(userId), (old) => ({
        userId,
        applicationIds: (old?.applicationIds ?? []).filter((id) => id !== applicationId),
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(userFavoritesKey(userId), context?.previous);
    },
    onSettled: (_, _err, applicationId) => {
      queryClient.invalidateQueries({ queryKey: userFavoritesKey(userId) });
      queryClient.invalidateQueries({ queryKey: ['application-favorites-count', applicationId] });
    },
  });
}
