
import { useMemo } from 'react';
import { mockApps } from '../data/mock-apps';
import { App } from '../types/app.types';

export function useAppBySlug(slug: string): App | undefined {
  const app = useMemo(() => {
    return mockApps.find((app) => app.slug === slug);
  }, [slug]);

  return app;
}