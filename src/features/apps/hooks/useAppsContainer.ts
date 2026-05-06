'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useApplicationsQuery } from '../queries/apps.queries';
import { Application } from '../types/app.types';

export function useAppsContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

   const query = useApplicationsQuery({ searchQuery: debouncedSearch, selectedTags }, { page });

  const apps = useMemo(() => query.data?.data ?? [], [query.data]);
  const meta = query.data?.meta;

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    apps.forEach((app) => app.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [apps]);

  const { showSearch, showFilters } = useUIStore();

  const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
    setPage(1);
  }, []);

  const handleAppClick = useCallback((app: Application) => {
    if (app.url) {
      window.open(app.url, '_blank');
    }
  }, []);

  return {
    apps,
    meta,
    page,
    setPage,
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