import { useQuery } from '@tanstack/react-query';
import { getApplications, getApplicationBySlug, getApplicationFavoritesCount } from '../services/apps.service';
import { AppFilters } from '../types/app.types';

export const applicationsQueryKey = (filters: Partial<AppFilters>) => [
  'applications',
  filters.searchQuery ?? '',
  filters.selectedTags ?? [],
];

export function useApplicationsQuery(filters: Partial<AppFilters> = {}) {
  return useQuery({
    queryKey: applicationsQueryKey(filters),
    queryFn: () =>
      getApplications({
        search: filters.searchQuery || undefined,
        tags: filters.selectedTags && filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
      }),
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
