'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { ProfileHeader } from '../../../components/organisms/ProfileHeader';
import { ProfileTabs } from '../../../components/molecules/ProfileTabs';
import { AppCard } from '../components/AppCard';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterButton } from '@/components/molecules/FilterButton';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { EditModal } from '@/features/admin/components/EditModal';
import { useApplicationsQuery, useUpdateApplicationMutation, useDeleteApplicationMutation } from '../queries/apps.queries';
import { useUIStore } from '@/store/uiStore';
import { Application } from '../types/app.types';
import { useMemo, useEffect, useCallback } from 'react';
import { FavoritesContainer } from '@/features/favorites/containers/FavoritesContainer';
import { useUserRatingsQuery } from '@/features/ratings/queries/ratings.queries';
import { UserReviewItem } from '@/features/ratings/components/UserReviewItem';

interface ProfileContainerProps {
  slug: string;
}

const STATUS_BADGE: Record<
  Application['isApproved'],
  { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }
> = {
  APPROVED: { label: 'Approved', variant: 'success' },
  PENDING:  { label: 'Pending review', variant: 'warning' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
  REMOVED:  { label: 'Removed', variant: 'danger' },
};

export default function ProfileContainer({ slug: _slug }: ProfileContainerProps) {
  const [activeTab, setActiveTab] = useState('apps');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; application: Application | null }>({
    isOpen: false,
    application: null,
  });

  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { showSearch, showFilters } = useUIStore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useApplicationsQuery(
    { userId: session?.user?.id, searchQuery: debouncedSearch, selectedTags },
    { enabled: !sessionPending && !!session?.user?.id },
  );

  const apps = useMemo(() => data?.data ?? [], [data]);

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
    setSearchQuery('');
    setSelectedTags([]);
  }, []);

  const { data: userRatings, isLoading: ratingsLoading } = useUserRatingsQuery(
    !sessionPending && !!session,
  );

  const updateMutation = useUpdateApplicationMutation();
  const deleteMutation = useDeleteApplicationMutation();

  const handleDelete = (id: number) => {
    if (!confirm('Delete this app? This cannot be undone.')) return;
    deleteMutation.mutate(id);
  };

  const handleSaveEdit = (id: number, updates: Partial<Application>) => {
    updateMutation.mutate(
      { id, updates },
      { onSuccess: () => setEditModal({ isOpen: false, application: null }) },
    );
  };

  if (!sessionPending && !session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <ProfileHeader
          name={session?.user.name}
          email={session?.user.email}
          image={session?.user.image ?? undefined}
        />

        <div className="mb-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'apps' && (showSearch || showFilters || hasActiveFilters) && (
          <div className="mb-8 p-4 border border-gray-200 rounded-xl bg-gray-50">
            {showSearch && (
              <div className="mb-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search your apps..."
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
                    isActive={selectedTags.includes(tag)}
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

        <div className="py-4">
          {activeTab === 'apps' && (
            <>
              {isLoading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : isError ? (
                <div className="text-center py-12 text-red-500">Unable to load apps right now. Please try again later.</div>
              ) : apps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {apps.map((app) => {
                    const status = STATUS_BADGE[app.isApproved] ?? STATUS_BADGE.PENDING;
                    return (
                      <div key={app.id} className="flex flex-col border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <AppCard app={app} showTags={false} className="border-0 shadow-none rounded-none flex-1" onClick={() => window.open(app.url, '_blank')} />
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
                          <div className="flex flex-col gap-0.5">
                            <Badge variant={status.variant}>{status.label}</Badge>
                            {(app.isApproved === 'REJECTED' || app.isApproved === 'REMOVED') &&
                              app.rejectionReason && (
                                <p className="text-xs text-red-600">{app.rejectionReason}</p>
                              )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditModal({ isOpen: true, application: app })}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={deleteMutation.isPending && deleteMutation.variables === app.id}
                              onClick={() => handleDelete(app.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              {deleteMutation.isPending && deleteMutation.variables === app.id
                                ? 'Deleting…'
                                : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No apps submitted yet.</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Reset Search
                  </Button>
                </div>
              )}
            </>
          )}

          {activeTab === 'my reviews' && (
            <>
              {ratingsLoading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : !userRatings || userRatings.ratings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No reviews yet.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {userRatings.ratings.map((rating) => (
                    <UserReviewItem key={rating.applicationId} rating={rating} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'favorites' && session?.user?.id && (
            <FavoritesContainer userId={session.user.id} />
          )}
        </div>
      </div>

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, application: null })}
        application={editModal.application}
        onSave={handleSaveEdit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
