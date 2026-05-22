'use client';

import { useState } from 'react';
import { ClaimRequestCard } from '../components/ClaimRequestCard';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import {
  useAdminClaimRequestsQuery,
  useReviewClaimRequestMutation,
} from '../queries/admin.queries';
import { useToastStore } from '@/store/toast.store';
import type { ClaimRequestStatus, DeclineClaimModalState } from '../types/admin.types';

const STATUS_TABS: { label: string; value: ClaimRequestStatus | undefined; activeClass: string; inactiveClass: string }[] = [
  {
    label: 'Pending', value: 'PENDING',
    activeClass: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    inactiveClass: 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'Approved', value: 'APPROVED',
    activeClass: 'bg-green-600/20 text-green-400 border border-green-500/30',
    inactiveClass: 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'Declined', value: 'DECLINED',
    activeClass: 'bg-white/10 text-white/80 border border-white/20',
    inactiveClass: 'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
];

function DeclineModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  isSubmitting: boolean;
}) {
  const [note, setNote] = useState('');

  const handleClose = () => { setNote(''); onClose(); };
  const handleConfirm = () => { onConfirm(note.trim()); setNote(''); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Decline Claim Request">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">
            Admin Note <span className="text-white/30">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Reason for declining…"
            className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors resize-none"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-red-600/60 hover:bg-red-600/80 border border-red-500/30"
          >
            {isSubmitting ? 'Declining…' : 'Decline'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function ClaimApprovalContainer() {
  const [status, setStatus] = useState<ClaimRequestStatus>('PENDING');
  const [page, setPage] = useState(1);
  const [declineModal, setDeclineModal] = useState<DeclineClaimModalState>({
    isOpen: false,
    claimId: null,
  });

  const { data, isLoading, isError } = useAdminClaimRequestsQuery(page, status);

  const { data: pendingMeta }  = useAdminClaimRequestsQuery(1, 'PENDING',  1);
  const { data: approvedMeta } = useAdminClaimRequestsQuery(1, 'APPROVED', 1);
  const { data: declinedMeta } = useAdminClaimRequestsQuery(1, 'DECLINED', 1);

  const statusCounts: Record<ClaimRequestStatus, number | undefined> = {
    PENDING:  pendingMeta?.meta.total,
    APPROVED: approvedMeta?.meta.total,
    DECLINED: declinedMeta?.meta.total,
  };

  const reviewMutation = useReviewClaimRequestMutation();
  const { addToast } = useToastStore();

  const claims = data?.data ?? [];
  const meta = data?.meta;

  const handleApprove = (id: number) => {
    reviewMutation.mutate(
      { id, status: 'APPROVED' },
      {
        onSuccess: () => addToast('Claim approved — ownership transferred', 'success'),
        onError: () => addToast('Failed to approve claim', 'error'),
      },
    );
  };

  const handleOpenDecline = (id: number) => {
    setDeclineModal({ isOpen: true, claimId: id });
  };

  const handleConfirmDecline = (adminNote: string) => {
    if (declineModal.claimId == null) return;
    reviewMutation.mutate(
      { id: declineModal.claimId, status: 'DECLINED', adminNote: adminNote || undefined },
      {
        onSuccess: () => {
          setDeclineModal({ isOpen: false, claimId: null });
          addToast('Claim declined', 'success');
        },
        onError: () => addToast('Failed to decline claim', 'error'),
      },
    );
  };

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value as ClaimRequestStatus); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              status === tab.value ? tab.activeClass : tab.inactiveClass
            }`}
          >
            {tab.label}
            {statusCounts[tab.value as ClaimRequestStatus] != null && (
              <span className="text-xs font-semibold opacity-70">
                {statusCounts[tab.value as ClaimRequestStatus]}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-white/40">Loading claim requests…</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-400">
          Unable to load claim requests. The admin endpoint may be unavailable.
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-white/20 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-white/80">No {status.toLowerCase()} claims</p>
          <p className="text-white/40 mt-1">Claim requests will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {claims.map((claim) => (
            <ClaimRequestCard
              key={claim.id}
              claim={claim}
              onApprove={handleApprove}
              onDecline={handleOpenDecline}
              isApproving={reviewMutation.isPending && reviewMutation.variables?.id === claim.id && reviewMutation.variables?.status === 'APPROVED'}
              isDeclining={reviewMutation.isPending && reviewMutation.variables?.id === claim.id && reviewMutation.variables?.status === 'DECLINED'}
            />
          ))}
        </div>
      )}

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

      <DeclineModal
        isOpen={declineModal.isOpen}
        onClose={() => setDeclineModal({ isOpen: false, claimId: null })}
        onConfirm={handleConfirmDecline}
        isSubmitting={reviewMutation.isPending}
      />
    </div>
  );
}
