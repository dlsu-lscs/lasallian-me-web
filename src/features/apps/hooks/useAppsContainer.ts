'use client';

import { useState, useMemo, useCallback } from 'react';
import { App } from '../types/app.types';
import { useAppsFilters } from './use-apps-filters';
import { mockApps } from '../data/mock-apps';
import { useUIStore } from '@/store/uiStore';

export function useAppsContainer() {
  const apps = mockApps;

  // Get unique tags
  const [uniqueTags] = useState<string[]>(() => {
    const tags = new Set<string>();
    apps.forEach((app) => app.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  });

  // Use the filtering logic
  const { filters, handleSearchChange, toggleTag, clearFilters, filteredApps } =
    useAppsFilters(apps);

  // UI store values
  const { showSearch, showFilters } = useUIStore();

  // Derived states
  const hasActiveFilters =
    filters.searchQuery !== '' || filters.selectedTags.length > 0;

  // Event handlers
  const handleAppClick = useCallback((app: App) => {
    window.open(app.url, '_blank');
  }, []);

  return {
    apps,
    filters,
    filteredApps,
    uniqueTags,
    handleSearchChange,
    toggleTag,
    clearFilters,
    handleAppClick,
    showSearch,
    showFilters,
    hasActiveFilters,
  };
}
