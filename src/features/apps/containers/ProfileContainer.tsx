'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { FiMinus } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import { Badge } from '@/components/atoms/Badge';
import { AppCard } from '../components/AppCard';
import { EditModal } from '@/features/admin/components/EditModal';
import { useApplicationsQuery, useUpdateApplicationMutation, useDeleteApplicationMutation } from '../queries/apps.queries';
import { Application } from '../types/app.types';
import { FavoritesContainer } from '@/features/favorites/containers/FavoritesContainer';
import { useUserRatingsQuery } from '@/features/ratings/queries/ratings.queries';
import { UserReviewItem } from '@/features/ratings/components/UserReviewItem';

interface ProfileContainerProps {
  slug: string;
  onClose?: () => void;
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const TABS = ['Apps', 'My Reviews', 'Favorites'];

const STATUS_BADGE: Record<
  Application['isApproved'],
  { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }
> = {
  APPROVED: { label: 'Approved', variant: 'success' },
  PENDING:  { label: 'Pending review', variant: 'warning' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
  REMOVED:  { label: 'Removed', variant: 'danger' },
};

export default function ProfileContainer({ slug: _slug, onClose }: ProfileContainerProps) {
  const [activeTab, setActiveTab] = useState('apps');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; application: Application | null }>({
    isOpen: false,
    application: null,
  });

  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!onClose) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const { data, isLoading, isError } = useApplicationsQuery(
    { userId: session?.user?.id, searchQuery: debouncedSearch, selectedTags },
    { enabled: !sessionPending && !!session?.user?.id },
  );

  const apps = useMemo(() => data?.data ?? [], [data]);

  const { data: userRatings, isLoading: ratingsLoading } = useUserRatingsQuery(
    !sessionPending && !!session,
  );

  const updateMutation = useUpdateApplicationMutation();
  const deleteMutation = useDeleteApplicationMutation();

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
  }, []);

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

  const inner = (
    <div className="flex flex-col h-full">
      {/* macOS-style close button */}
      {onClose && (
        <div
          className="group absolute top-4 right-4 z-10 w-3 h-3 bg-red-500 rounded-full cursor-pointer flex items-center justify-center hover:bg-red-400 transition-colors"
          onClick={onClose}
        >
          <FiMinus className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={4} />
        </div>
      )}

      {/* Profile header */}
      <div className="relative overflow-hidden px-8 pt-8 pb-6 shrink-0">
        <img
          src="/bow-arrow.svg"
          alt=""
          aria-hidden="true"
          className="absolute -bottom-6 -right-6 w-40 h-40 opacity-[0.04] pointer-events-none"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <div className="flex items-center gap-5 relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-white/15 shadow-lg shrink-0 bg-white/10 flex items-center justify-center">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white/70 text-xl font-bold font-display select-none">
                {getInitials(session?.user?.name)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h2 className="text-white font-bold text-xl truncate">{session?.user?.name ?? 'Unknown User'}</h2>
            {session?.user?.email && (
              <p className="text-white/45 text-sm truncate">{session.user.email}</p>
            )}
            <p className="text-white/60 text-sm font-semibold">Lasallian</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-8 border-t border-white/8 shrink-0" />

      {/* Tabs */}
      <div className="px-8 pt-4 pb-3 shrink-0 flex gap-1">
        {TABS.map((tab) => {
          const key = tab.toLowerCase();
          const isActive = activeTab === key;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
        {activeTab === 'apps' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-white/30 text-sm">Loading...</p>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-white/50 text-sm">Unable to load apps right now. Please try again later.</p>
              </div>
            ) : apps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {apps.map((app) => {
                  const status = STATUS_BADGE[app.isApproved] ?? STATUS_BADGE.PENDING;
                  return (
                    <div
                      key={app.id}
                      className="flex flex-col bg-white/4 border border-white/8 rounded-xl overflow-hidden"
                    >
                      <AppCard app={app} showTags={false} className="border-0 shadow-none rounded-none flex-1" />
                      <div className="flex items-center justify-between px-3 py-2 border-t border-white/8">
                        <div className="flex flex-col gap-0.5">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          {(app.isApproved === 'REJECTED' || app.isApproved === 'REMOVED') &&
                            app.rejectionReason && (
                              <p className="text-xs text-red-400">{app.rejectionReason}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditModal({ isOpen: true, application: app })}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-white/8 text-white/70 hover:bg-white/12 hover:text-white transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            disabled={deleteMutation.isPending && deleteMutation.variables === app.id}
                            onClick={() => handleDelete(app.id)}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-40"
                          >
                            {deleteMutation.isPending && deleteMutation.variables === app.id
                              ? 'Deleting…'
                              : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="text-white/40 text-sm">No apps submitted yet.</p>
                <button
                  onClick={clearFilters}
                  className="mt-2 px-4 py-1.5 text-sm font-semibold rounded-full bg-white/8 text-white/60 hover:bg-white/12 transition-colors cursor-pointer"
                >
                  Reset search
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'my reviews' && (
          <>
            {ratingsLoading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-white/30 text-sm">Loading...</p>
              </div>
            ) : !userRatings || userRatings.ratings.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="text-white/40 text-sm">No reviews yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
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
  );

  if (onClose) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-4xl h-[85vh] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[var(--shadow-modal)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {inner}
          </motion.div>
        </motion.div>
        <EditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, application: null })}
          application={editModal.application}
          onSave={handleSaveEdit}
          isSubmitting={updateMutation.isPending}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl shadow-[var(--shadow-glass)] overflow-hidden min-h-screen relative">
          {inner}
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
