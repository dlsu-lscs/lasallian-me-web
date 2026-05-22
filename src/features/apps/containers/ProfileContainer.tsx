'use client';

import Image from 'next/image';
import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { FiX, FiGrid, FiStar, FiBookmark } from 'react-icons/fi';
import { LuSquarePen } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { AppCard } from '../components/AppCard';
import { SidebarLayout } from '@/components/organisms/SidebarLayout';
import { useMyApplicationsQuery, useUpdateApplicationMutation } from '../queries/apps.queries';
import { Application } from '../types/app.types';
import { EditModal } from '@/features/admin/components/EditModal';
import { FavoritesContainer } from '@/features/favorites/containers/FavoritesContainer';
import { useUserRatingsQuery } from '@/features/ratings/queries/ratings.queries';
import { UserReviewItem } from '@/features/ratings/components/UserReviewItem';

type ProfileTab = 'apps' | 'my-reviews' | 'favorites';

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

const STATUS_DOT: Record<Application['status'], { label: string; color: string }> = {
  APPROVED:           { label: 'Approved',           color: 'bg-green-400' },
  PENDING:            { label: 'In review',           color: 'bg-yellow-400' },
  CHANGES_REQUESTED:  { label: 'Changes requested',  color: 'bg-amber-400' },
  REMOVED:            { label: 'Removed',             color: 'bg-white/40' },
};

const SIDEBAR_SECTIONS = [
  {
    label: 'Profile',
    items: [
      { id: 'apps' as ProfileTab,       label: 'My Apps',   icon: <FiGrid /> },
      { id: 'my-reviews' as ProfileTab, label: 'Reviews',   icon: <FiStar /> },
      { id: 'favorites' as ProfileTab,  label: 'Favorites', icon: <FiBookmark /> },
    ],
  },
];

export default function ProfileContainer({ onClose }: ProfileContainerProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('apps');
  const router = useRouter();

  const { data: session, isPending: sessionPending } = authClient.useSession();

  const { data, isLoading, isError } = useMyApplicationsQuery(
    { enabled: !sessionPending && !!session?.user?.id },
  );

  const apps = useMemo(() => data?.data ?? [], [data]);

  const { data: userRatings, isLoading: ratingsLoading } = useUserRatingsQuery(
    !sessionPending && !!session,
  );

  const updateMutation = useUpdateApplicationMutation();

  const [editModal, setEditModal] = useState<{ isOpen: boolean; application: Application | null }>({
    isOpen: false,
    application: null,
  });

  const handleSaveEdit = useCallback(
    (id: number, updates: Partial<Application>) => {
      updateMutation.mutate(
        { id, updates },
        { onSuccess: () => setEditModal({ isOpen: false, application: null }) },
      );
    },
    [updateMutation],
  );


  const sidebarHeader = (
    <div className="px-3 pb-4 border-b border-white/8">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/15 bg-white/10 shrink-0 flex items-center justify-center">
          {session?.user?.image ? (
            <Image
              fill
              unoptimized
              src={session.user.image}
              alt={session.user.name ?? 'Profile'}
              className="object-cover"
            />
          ) : (
            <span className="text-white/70 text-sm font-bold font-display select-none">
              {getInitials(session?.user?.name)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{session?.user?.name ?? 'Unknown'}</p>
          <p className="text-white/40 text-xs truncate">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );

  const content = (
    <>
      {activeTab === 'apps' && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-white/30 text-sm">Loading...</p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-white/50 text-sm">Unable to load apps. Please try again.</p>
            </div>
          ) : apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {apps.map((app) => {
                const status = STATUS_DOT[app.status] ?? STATUS_DOT.PENDING;
                return (
                  <AppCard
                    key={app.id}
                    app={app}
                    showTags={false}
                    variant="compact"
                    onClick={(a) => {
                      onClose?.();
                      router.push(
                        (a.status === 'PENDING' || a.status === 'CHANGES_REQUESTED')
                          ? `/${encodeURIComponent(a.slug)}/edit`
                          : `/${encodeURIComponent(a.slug)}?from=profile`,
                      );
                    }}
                    iconOverlay={
                      <div className="group/dot relative">
                        <span className={`w-2.5 h-2.5 rounded-full ${status.color} block ring-[1.5px] ring-black/80`} />
                        <span className="absolute bottom-full right-0 mb-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black text-white whitespace-nowrap border border-white/10 opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none z-20">
                          {status.label}
                        </span>
                      </div>
                    }
                    action={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose?.();
                          router.push(`/${encodeURIComponent(app.slug)}/edit`);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors shrink-0"
                      >
                        <LuSquarePen className="w-4 h-4" />
                      </button>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <p className="text-white/40 text-sm">No apps submitted yet.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'my-reviews' && (
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
    </>
  );

  const layout = (
    <SidebarLayout
      sections={SIDEBAR_SECTIONS}
      activeId={activeTab}
      onSelect={setActiveTab}
      sidebarHeader={sidebarHeader}
      sidebarWidth="w-56"
    >
      {content}
    </SidebarLayout>
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
            className="relative w-[92vw] h-[85vh] sm:w-[60vw] sm:h-auto sm:aspect-[4/3] sm:max-h-[90vh] glass-lg rounded-2xl shadow-[var(--shadow-modal)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
            {layout}
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
    <div className="min-h-screen flex items-start justify-center px-4 py-10">
      <div
        className="glass-lg rounded-2xl overflow-hidden w-full max-w-4xl"
        style={{ minHeight: 'calc(100vh - 5rem)' }}
      >
        {layout}
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
