'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { ProfileHeader } from '../../../components/organisms/ProfileHeader';
import { ProfileTabs } from '../../../components/molecules/ProfileTabs';
import { AppCard } from '../components/AppCard';
import { useAppsContainer } from '@/features/apps/hooks/useAppsContainer'; 
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterButton } from '@/components/molecules/FilterButton';
import { Button } from '@/components/atoms/Button';

interface ProfileContainerProps {
  slug: string;
}

export default function ProfileContainer({ slug: _slug }: ProfileContainerProps) {
  // Logic: Manage active tab state (Profile-specific) 
  const [activeTab, setActiveTab] = useState('apps');
  const { data: session } = authClient.useSession();

  // Logic: Integrate the apps container hook 
  const {
    apps,
    filters,
    uniqueTags,
    handleSearchChange,
    toggleTag,
    clearFilters,
    handleAppClick,
    showSearch,
    showFilters,
    hasActiveFilters,
    isLoading,
    isError,
  } = useAppsContainer();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Presentational: Profile Header */}
        <ProfileHeader
          name={session?.user.name}
          email={session?.user.email}
          image={session?.user.image ?? undefined}
        />
        
        {/* Presentational: Segmented control for tabs */}
        <div className="mb-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Conditional Search and Filters: Mirroring AppsContainer logic */}
        {activeTab === 'apps' && (showSearch || showFilters || hasActiveFilters) && (
          <div className="mb-8 p-4 border border-gray-200 rounded-xl bg-gray-50">
            {showSearch && (
              <div className="mb-4">
                <SearchBar
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search user's apps..."
                />
              </div>
            )}
            {showFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                {uniqueTags.map((tag) => (
                  <FilterButton
                    key={tag}
                    label={tag}
                    isActive={filters.selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Section: Conditioned by activeTab and filteredApps */}
        <div className="py-4">
          {activeTab === 'apps' && (
            <>
              {isLoading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : isError ? (
                <div className="text-center py-12 text-red-500">Failed to load apps.</div>
              ) : apps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {apps.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onClick={handleAppClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No apps found matching your criteria.</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Reset Search
                  </Button>
                </div>
              )}
            </>
          )}

          {activeTab === 'my reviews' && (
            <div className="text-center py-12 text-gray-500">
              No reviews available for this profile yet.
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="text-center py-12 text-gray-500">
              No favorite apps selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}