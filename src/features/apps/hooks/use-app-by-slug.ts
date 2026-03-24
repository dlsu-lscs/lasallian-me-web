

import { mockApps } from '../data/mock-apps';
import { App } from '../types/app.types';

export function useAppBySlug(slug: string): App | undefined {
  return mockApps.find((app) => app.slug === slug);
}