import { useState, useMemo, useCallback } from 'react';
import { App, AppFilters } from '../types/app.types';

export function useAppsFilters(apps: App[]) {
  const [filters, setFilters] = useState<AppFilters>({
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
        app.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Tag filter
      const matchesTags =
        filters.selectedTags.length === 0 ||
        filters.selectedTags.some((tag) => app.tags.includes(tag));

      // Category filter
      const matchesCategory =
        !filters.category || app.category === filters.category;

      return matchesSearch && matchesTags && matchesCategory;
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


