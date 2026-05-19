'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { PendingAppCard } from '../components/PendingAppCard';
import { RemoveModal } from '../components/RemoveModal';
import {
  useAdminApplicationsQuery,
  useApproveApplicationMutation,
  useRequestChangesMutation,
  useRemoveApplicationMutation,
} from '../queries/admin.queries';
import type { RemoveModalState } from '../types/admin.types';
import type { AdminApplicationStatus } from '../services/admin.service';
import { Button } from '@/components/atoms/Button';
import { useToastStore } from '@/store/toast.store';
import { Application } from '@/features/apps/types/app.types';
import { AppEditPreviewPanel } from '@/features/apps/components/AppEditPreviewPanel';
import { useUpdateApplicationMutation } from '@/features/apps/queries/apps.queries';
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';

const STATUS_TABS: { label: string; value: AdminApplicationStatus; activeClass: string; inactiveClass: string }[] = [
  {
    label: 'Approved', value: 'APPROVED',
    activeClass: 'bg-green-600/20 text-green-400 border border-green-500/30',
    inactiveClass: 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'Pending', value: 'PENDING',
    activeClass: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    inactiveClass: 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'Changes Requested', value: 'CHANGES_REQUESTED',
    activeClass: 'bg-amber-600/15 text-amber-400 border border-amber-500/30',
    inactiveClass: 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'Removed', value: 'REMOVED',
    activeClass: 'bg-white/10 text-white/80 border border-white/20',
    inactiveClass: 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
];

// ── Sidebar slot components ──────────────────────────────────────────────────

function ReasonBanner({
  status,
  reason,
  title,
}: {
  status: 'CHANGES_REQUESTED' | 'REMOVED';
  reason: string | null | undefined;
  title?: string;
}) {
  const isChanges = status === 'CHANGES_REQUESTED';
  return (
    <div className={`rounded-xl border p-3 flex gap-2.5 ${
      isChanges ? 'bg-amber-500/8 border-amber-500/20' : 'bg-white/5 border-white/10'
    }`}>
      <FiAlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isChanges ? 'text-amber-400' : 'text-white/40'}`} />
      <div>
        <p className={`text-xs font-semibold mb-0.5 ${isChanges ? 'text-amber-400' : 'text-white/60'}`}>
          {title ?? (isChanges ? 'Changes Requested' : 'Removed')}
        </p>
        <p className={`text-xs leading-snug ${isChanges ? 'text-amber-300/70' : 'text-white/40'}`}>
          {reason || 'No reason provided.'}
        </p>
      </div>
    </div>
  );
}

function ChangesRequestedActionsCard({
  appId,
  currentReason,
  onApprove,
  onRequestChanges,
  isApproving,
  isRequestingChanges,
}: {
  appId: number;
  currentReason: string | null | undefined;
  onApprove: (id: number) => void;
  onRequestChanges: (id: number, reason: string) => void;
  isApproving: boolean;
  isRequestingChanges: boolean;
}) {
  const [reason, setReason] = useState(currentReason ?? '');
  const isBusy = isApproving || isRequestingChanges;
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 flex flex-col gap-2.5">
      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Actions</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for requesting changes…"
        rows={2}
        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors resize-none"
      />
      <div className="flex gap-2">
        <button
          disabled={isBusy || !reason.trim()}
          onClick={() => onRequestChanges(appId, reason.trim())}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/20 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {isRequestingChanges ? 'Updating…' : 'Update Reason'}
        </button>
        <button
          disabled={isBusy}
          onClick={() => onApprove(appId)}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/20 transition-colors disabled:opacity-40 cursor-pointer"
        >
          {isApproving ? 'Approving…' : 'Approve'}
        </button>
      </div>
    </div>
  );
}

function PendingReviewCard({
  appId,
  previousReason,
  onApprove,
  onRequestChanges,
  isApproving,
  isRequestingChanges,
}: {
  appId: number;
  previousReason?: string | null;
  onApprove: (id: number) => void;
  onRequestChanges: (id: number, reason: string) => void;
  isApproving: boolean;
  isRequestingChanges: boolean;
}) {
  const [comment, setComment] = useState('');
  const isBusy = isApproving || isRequestingChanges;

  return (
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <FiInfo className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
        <p className="text-xs font-semibold text-yellow-400">
          {previousReason ? 'Re-submission' : 'Pending Review'}
        </p>
      </div>
      {previousReason && (
        <p className="text-[11px] text-amber-300/60 leading-snug">
          Previously requested: <span className="italic">{previousReason}</span>
        </p>
      )}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Reason for requesting changes (optional)"
        rows={2}
        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors resize-none"
      />
      <div className="flex gap-2">
        <button
          disabled={isBusy}
          onClick={() => onRequestChanges(appId, comment)}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/20 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {isRequestingChanges ? 'Sending…' : 'Request Changes'}
        </button>
        <button
          disabled={isBusy}
          onClick={() => onApprove(appId)}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/20 transition-colors disabled:opacity-40 cursor-pointer"
        >
          {isApproving ? 'Approving…' : 'Approve'}
        </button>
      </div>
    </div>
  );
}

function ApprovedActionsCard({
  appId,
  onRemove,
  isRemoving,
}: {
  appId: number;
  onRemove: (id: number) => void;
  isRemoving: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Actions</p>
      <button
        disabled={isRemoving}
        onClick={() => onRemove(appId)}
        className="w-full py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-red-500/15 text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/20 transition-colors disabled:opacity-40 cursor-pointer"
      >
        {isRemoving ? 'Removing…' : 'Remove App'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function ApprovalContainer() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AdminApplicationStatus>('APPROVED');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const { data, isLoading, isError } = useAdminApplicationsQuery(page, status);

  const { data: approvedMeta } = useAdminApplicationsQuery(1, 'APPROVED', 1);
  const { data: pendingMeta }  = useAdminApplicationsQuery(1, 'PENDING',  1);
  const { data: changesRequestedMeta } = useAdminApplicationsQuery(1, 'CHANGES_REQUESTED', 1);
  const { data: removedMeta }          = useAdminApplicationsQuery(1, 'REMOVED',            1);

  const statusCounts: Record<AdminApplicationStatus, number | undefined> = {
    APPROVED:           approvedMeta?.meta.total,
    PENDING:            pendingMeta?.meta.total,
    CHANGES_REQUESTED:  changesRequestedMeta?.meta.total,
    REMOVED:            removedMeta?.meta.total,
  };

  const apps = data?.data ?? [];
  const meta = data?.meta;

  const approveMutation        = useApproveApplicationMutation();
  const requestChangesMutation = useRequestChangesMutation();
  const removeMutation         = useRemoveApplicationMutation();
  const updateMutation         = useUpdateApplicationMutation();

  const { addToast } = useToastStore();

  const [removeModal, setRemoveModal] = useState<RemoveModalState>({
    isOpen: false,
    applicationId: null,
    reason: '',
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate(id, {
      onSuccess: () => { addToast('Application approved', 'success'); setSelectedApp(null); },
      onError: () => addToast('Failed to approve application', 'error'),
    });
  };

  const handleRequestChanges = (id: number, reason: string) => {
    requestChangesMutation.mutate(
      { id, reason },
      {
        onSuccess: () => { addToast('Changes requested', 'success'); setSelectedApp(null); },
        onError: () => addToast('Failed to request changes', 'error'),
      },
    );
  };

  const handleOpenRemove = (id: number) => {
    setRemoveModal({ isOpen: true, applicationId: id, reason: '' });
  };

  const handleConfirmRemove = (reason: string) => {
    if (removeModal.applicationId == null) return;
    removeMutation.mutate(
      { id: removeModal.applicationId, reason },
      {
        onSuccess: () => {
          setRemoveModal({ isOpen: false, applicationId: null, reason: '' });
          addToast('Application removed', 'success');
          setSelectedApp(null);
        },
        onError: () => addToast('Failed to remove application', 'error'),
      },
    );
  };

  const handleSaveEdit = (updates: Partial<Application>) => {
    if (!selectedApp) return;
    updateMutation.mutate(
      { id: selectedApp.id, updates },
      {
        onSuccess: () => addToast('Application updated', 'success'),
        onError: () => addToast('Failed to update application', 'error'),
      },
    );
  };

  const buildSidebarTop = (app: Application) => {
    const isApproving         = approveMutation.isPending && approveMutation.variables === app.id;
    const isRequestingChanges = requestChangesMutation.isPending && requestChangesMutation.variables?.id === app.id;
    const isRemoving          = removeMutation.isPending && removeMutation.variables?.id === app.id;

    if (status === 'PENDING') {
      return (
        <PendingReviewCard
          key={app.id}
          appId={app.id}
          previousReason={app.rejectionReason}
          onApprove={handleApprove}
          onRequestChanges={handleRequestChanges}
          isApproving={isApproving}
          isRequestingChanges={isRequestingChanges}
        />
      );
    }
    if (status === 'CHANGES_REQUESTED') {
      return (
        <div className="flex flex-col gap-2">
          <ReasonBanner status="CHANGES_REQUESTED" reason={app.rejectionReason} />
          <ChangesRequestedActionsCard
            key={app.id}
            appId={app.id}
            currentReason={app.rejectionReason}
            onApprove={handleApprove}
            onRequestChanges={handleRequestChanges}
            isApproving={isApproving}
            isRequestingChanges={isRequestingChanges}
          />
        </div>
      );
    }
    if (status === 'REMOVED') {
      return <ReasonBanner status="REMOVED" reason={app.rejectionReason} />;
    }
    if (status === 'APPROVED') {
      return (
        <ApprovedActionsCard
          key={app.id}
          appId={app.id}
          onRemove={handleOpenRemove}
          isRemoving={isRemoving}
        />
      );
    }
    return null;
  };

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              status === tab.value ? tab.activeClass : tab.inactiveClass
            }`}
          >
            {tab.label}
            {statusCounts[tab.value] != null && (
              <span className="text-xs font-semibold opacity-70">{statusCounts[tab.value]}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-white/40">Loading applications…</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-400">
          Unable to load applications right now. The admin endpoint may be unavailable.
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-white/20 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-white/80">No {status.toLowerCase()} apps</p>
          <p className="text-white/40 mt-1">New submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apps.map((app) => (
            <PendingAppCard
              key={app.id}
              app={app}
              tab={status}
              onClick={(a) => setSelectedApp(a)}
              onApprove={handleApprove}
              onRequestChanges={(id) => handleRequestChanges(id, '')}
              onRemove={handleOpenRemove}
              isApproving={approveMutation.isPending && approveMutation.variables === app.id}
              isRequestingChanges={requestChangesMutation.isPending && requestChangesMutation.variables?.id === app.id}
              isRemoving={removeMutation.isPending && removeMutation.variables?.id === app.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-white/50">Page {meta.page} of {meta.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* App edit + preview panel */}
      <AnimatePresence>
        {selectedApp && (
          <AppEditPreviewPanel
            key={selectedApp.id}
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onSave={handleSaveEdit}
            isSaving={updateMutation.isPending}
            saveError={updateMutation.isError ? updateMutation.error?.message : null}
            sidebarTop={buildSidebarTop(selectedApp)}
          />
        )}
      </AnimatePresence>

      <RemoveModal
        isOpen={removeModal.isOpen}
        onClose={() => setRemoveModal({ isOpen: false, applicationId: null, reason: '' })}
        onConfirm={handleConfirmRemove}
        isSubmitting={removeMutation.isPending}
      />
    </div>
  );
}
