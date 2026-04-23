import { useApplicationBySlugQuery } from '../queries/apps.queries';

export function useAppBySlug(slug: string) {
  return useApplicationBySlugQuery(slug);
}
