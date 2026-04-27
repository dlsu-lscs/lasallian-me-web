'use client';

import { useState } from 'react';
import { Application } from '@/features/apps/types/app.types';
import { PendingAppCard } from '../components/PendingAppCard';
import { RejectModal } from '../components/RejectModal';
import { EditModal } from '../components/EditModal';
import {
  useAdminApplicationsQuery,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  useRemoveApplicationMutation,
  useEditApplicationMutation,
} from '../queries/admin.queries';
import type { RejectModalState, RemoveModalState, EditModalState } from '../types/admin.types';
import type { AdminApplicationStatus } from '../services/admin.service';
import { Button } from '@/components/atoms/Button';

const STATUS_TABS: { label: string; value: AdminApplicationStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Removed', value: 'REMOVED' },
];

export function ApprovalContainer() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AdminApplicationStatus>('PENDING');

  const { data, isLoading, isError } = useAdminApplicationsQuery(page, status);
  const apps = data?.data ?? [];
  const meta = data?.meta;

  const approveMutation = useApproveApplicationMutation();
  const rejectMutation = useRejectApplicationMutation();
  const removeMutation = useRemoveApplicationMutation();
  const editMutation = useEditApplicationMutation();

  const [rejectModal, setRejectModal] = useState<RejectModalState>({
    isOpen: false,
    applicationId: null,
    reason: '',
  });

  const [removeModal, setRemoveModal] = useState<RemoveModalState>({
    isOpen: false,
    applicationId: null,
    reason: '',
  });

  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    application: null,
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleOpenReject = (id: number) => {
    setRejectModal({ isOpen: true, applicationId: id, reason: '' });
  };

  const handleConfirmReject = (reason: string) => {
    if (rejectModal.applicationId == null) return;
    rejectMutation.mutate(
      { id: rejectModal.applicationId, reason },
      { onSuccess: () => setRejectModal({ isOpen: false, applicationId: null, reason: '' }) },
    );
  };

  const handleOpenRemove = (id: number) => {
    setRemoveModal({ isOpen: true, applicationId: id, reason: '' });
  };

  const handleConfirmRemove = (reason: string) => {
    if (removeModal.applicationId == null) return;
    removeMutation.mutate(
      { id: removeModal.applicationId, reason },
      { onSuccess: () => setRemoveModal({ isOpen: false, applicationId: null, reason: '' }) },
    );
  };

  const handleOpenEdit = (app: Application) => {
    setEditModal({ isOpen: true, application: app });
  };

  const handleSaveEdit = (id: number, updates: Partial<Application>) => {
    editMutation.mutate(
      { id, updates },
      { onSuccess: () => setEditModal({ isOpen: false, application: null }) },
    );
  };

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === tab.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading applications…</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">
          Failed to load applications. Please check that the API is running.
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">No {status.toLowerCase()} apps</p>
          <p className="text-gray-500 mt-1">New submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <PendingAppCard
              key={app.id}
              app={app}
              onApprove={handleApprove}
              onReject={handleOpenReject}
              onRemove={handleOpenRemove}
              onEdit={handleOpenEdit}
              isApproving={approveMutation.isPending && approveMutation.variables === app.id}
              isRejecting={rejectMutation.isPending && rejectMutation.variables?.id === app.id}
              isRemoving={removeMutation.isPending && removeMutation.variables?.id === app.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, applicationId: null, reason: '' })}
        onConfirm={handleConfirmReject}
        isSubmitting={rejectMutation.isPending}
      />

      {/* Remove modal reuses the same RejectModal UI */}
      <RejectModal
        isOpen={removeModal.isOpen}
        onClose={() => setRemoveModal({ isOpen: false, applicationId: null, reason: '' })}
        onConfirm={handleConfirmRemove}
        isSubmitting={removeMutation.isPending}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, application: null })}
        application={editModal.application}
        onSave={handleSaveEdit}
        isSubmitting={editMutation.isPending}
      />
    </div>
  );
}
