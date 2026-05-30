import { useState, useMemo, useCallback } from 'react';
import { AppFilters, Application } from '../types/app.types';

export function useAppsFilters(apps: Application[]) {
  const [filters, setFilters] = useState<AppFilters & { category?: string }>({
    searchQuery: '',
    selectedTags: [],
    category: undefined,
  });

  const handleSearchChange = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedTags: [],
      category: undefined,
    });
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Search filter
      const matchesSearch =
        filters.searchQuery === '' ||
        app.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        app.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Tag filter
      const matchesTags =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.some((tag) => app.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [apps, filters]);

  return {
    filters,
    handleSearchChange,
    toggleTag,
    clearFilters,
    filteredApps,
  };
}


