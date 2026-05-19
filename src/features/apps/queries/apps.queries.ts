import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getApplications,
  getMyApplications,
  getApplicationBySlug,
  getOwnApplicationBySlug,
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

export function useApplicationsQuery(filters: Partial<AppFilters> = {}, options?: { enabled?: boolean; page?: number; limit?: number }) {
  const page = options?.page ?? 1;
  const limit = options?.limit;
  return useQuery({
    queryKey: [...applicationsQueryKey(filters), page, limit],
    queryFn: () =>
      getApplications({
        search: filters.searchQuery || undefined,
        tags: filters.selectedTags && filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
        userId: filters.userId || undefined,
        page,
        limit,
      }),
    retry: 1,
    enabled: options?.enabled ?? true,
  });
}

export function useMyApplicationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
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

export function useOwnApplicationBySlugQuery(slug: string) {
  return useQuery({
    queryKey: ['own-application', slug],
    queryFn: () => getOwnApplicationBySlug(slug),
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['application'] });
    },
  });
}

export function useDeleteApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteApplication(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}
