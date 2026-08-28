'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useQueryString } from '@/hooks/useQueryString';
import { useInfiniteApplicationsQuery } from '../queries/apps.queries';
import { Application, SortByOptions } from '../types/app.types';

export function useAppsContainer() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useQueryString<SortByOptions>('sortBy', 'createdAt');

  const { searchQuery } = useUIStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const query = useInfiniteApplicationsQuery({
    searchQuery: debouncedSearch,
    selectedTags,
    sortBy,
  });

  const apps = useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    apps.forEach((app) => app.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [apps]);

  const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0;

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const handleAppClick = useCallback((app: Application) => {
    if (app.url) {
      window.open(app.url, '_blank');
    }
  }, []);


  return {
    apps,
    filters: { searchQuery, selectedTags, sortBy },
    uniqueTags,
    toggleTag,
    clearFilters,
    handleAppClick,
    hasActiveFilters,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    setSortBy,
  };
}
