'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterButton } from '@/components/molecules/FilterButton';
import { Button } from '@/components/atoms/Button';
import { AppCard } from '../components/AppCard';
import { useAppsContainer } from '@/features/apps/hooks/useAppsContainer';
import { Pagination } from '@/components/molecules/Pagination';
import { AppCardSkeleton } from '@/components/molecules/AppCardSkeleton';

export default function AppsContainer() {
  const [hasMounted, setHasMounted] = useState(false);

  const {
    apps,
    meta,
    page,
    setPage,
    filters,
    uniqueTags,
    handleSearchChange,
    toggleTag,
    clearFilters,
    showSearch,
    showFilters,
    hasActiveFilters,
    isLoading,
    isError,
  } = useAppsContainer();

  // Triggered only on the client after the first render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12 text-gray-500">Loading apps...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters and Search Section */}
      {(showSearch || showFilters || hasActiveFilters) && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="mb-4">
                <SearchBar
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search apps..."
                />
              </div>
            )}

            {/* Filter Tags */}
            {showFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Filter by tags:
                </span>
                {uniqueTags.map((tag) => (
                  <FilterButton
                    key={tag}
                    label={tag}
                    isActive={filters.selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="ml-auto"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-lime-800 pl-4">
            {isLoading ? 'Loading...' : `Showing ${apps.length} apps`}
          </p>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <AppCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Unable to load apps right now. Please try again later.
          </div>
        ) : apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No apps found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {meta && (
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}