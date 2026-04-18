import { useQuery } from '@tanstack/react-query';
import { getApplications } from '../services/apps.service';
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
