'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useApplicationsQuery } from '../queries/apps.queries';
import { Application } from '../types/app.types';

export function useAppsContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const query = useApplicationsQuery({ searchQuery: debouncedSearch, selectedTags });

  const apps = query.data?.data ?? [];

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    apps.forEach((app) => app.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [apps]);

  const { showSearch, showFilters } = useUIStore();

  const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
  }, []);

  const handleAppClick = useCallback((app: Application) => {
    window.open(app.url, '_blank');
  }, []);

  return {
    apps,
    filters: { searchQuery, selectedTags },
    uniqueTags,
    handleSearchChange,
    toggleTag,
    clearFilters,
    handleAppClick,
    showSearch,
    showFilters,
    hasActiveFilters,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
