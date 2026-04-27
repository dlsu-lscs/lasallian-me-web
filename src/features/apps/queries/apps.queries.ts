import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getApplications,
  getApplicationBySlug,
  getApplicationFavoritesCount,
  updateApplication,
  deleteApplication,
} from '../services/apps.service';
import { AppFilters, Application } from '../types/app.types';

export const applicationsQueryKey = (filters: Partial<AppFilters>) => [
  'applications',
  filters.userId ?? '',
  filters.searchQuery ?? '',
  filters.selectedTags ?? [],
];

export function useApplicationsQuery(filters: Partial<AppFilters> = {}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: applicationsQueryKey(filters),
    queryFn: () =>
      getApplications({
        search: filters.searchQuery || undefined,
        tags: filters.selectedTags && filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
        userId: filters.userId || undefined,
      }),
    retry: 1,
    enabled: options?.enabled ?? true,
  });
}

export function useApplicationBySlugQuery(slug: string) {
  return useQuery({
    queryKey: ['application', slug],
    queryFn: () => getApplicationBySlug(slug),
    enabled: !!slug,
  });
}

export function useApplicationFavoritesCountQuery(applicationId: number | undefined) {
  return useQuery({
    queryKey: ['application-favorites-count', applicationId],
    queryFn: () => getApplicationFavoritesCount(applicationId!),
    enabled: applicationId !== undefined,
  });
}

export function useUpdateApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Application> }) =>
      updateApplication(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useDeleteApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteApplication(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}
