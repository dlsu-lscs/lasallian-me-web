import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRating,
  deleteRating,
  getApplicationRatings,
  getUserRatings,
  patchRating,
} from '../services/ratings.service';
import type { CreateRatingPayload } from '../types/rating.types';

const ratingsKey = (slug: string) => ['application-ratings', slug];

export function useApplicationRatingsQuery(slug: string) {
  return useQuery({
    queryKey: ratingsKey(slug),
    queryFn: () => getApplicationRatings(slug),
    enabled: !!slug,
  });
}

export function useCreateRatingMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRatingPayload) => createRating(slug, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ratingsKey(slug) }),
  });
}

export function usePatchRatingMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateRatingPayload>) => patchRating(slug, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ratingsKey(slug) }),
  });
}

export function useDeleteRatingMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRating(slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ratingsKey(slug) }),
  });
}

const userRatingsKey = () => ['user-ratings'];

export function useUserRatingsQuery(enabled: boolean) {
  return useQuery({
    queryKey: userRatingsKey(),
    queryFn: getUserRatings,
    enabled,
  });
}
