'use client';

import { useState } from 'react';
import { Application } from '@/features/apps/types/app.types';
import { PendingAppCard } from '../components/PendingAppCard';
import { RejectModal } from '../components/RejectModal';
import { EditModal } from '../components/EditModal';
import {
  usePendingApplicationsQuery,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  useEditApplicationMutation,
} from '../queries/admin.queries';
import type { RejectModalState, EditModalState } from '../types/admin.types';

export function ApprovalContainer() {
  const { data, isLoading, isError } = usePendingApplicationsQuery();

  const approveMutation = useApproveApplicationMutation();
  const rejectMutation = useRejectApplicationMutation();
  const editMutation = useEditApplicationMutation();

  const [rejectModal, setRejectModal] = useState<RejectModalState>({
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

  const handleOpenEdit = (app: Application) => {
    setEditModal({ isOpen: true, application: app });
  };

  const handleSaveEdit = (id: number, updates: Partial<Application>) => {
    editMutation.mutate(
      { id, updates },
      { onSuccess: () => setEditModal({ isOpen: false, application: null }) },
    );
  };

  const apps = data?.data ?? [];

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading pending apps…</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">
          Failed to load pending apps. Please check that the API is running.
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">No apps awaiting approval</p>
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
              onEdit={handleOpenEdit}
              isApproving={
                approveMutation.isPending && approveMutation.variables === app.id
              }
              isRejecting={
                rejectMutation.isPending &&
                rejectMutation.variables?.id === app.id
              }
            />
          ))}
        </div>
      )}

      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, applicationId: null, reason: '' })}
        onConfirm={handleConfirmReject}
        isSubmitting={rejectMutation.isPending}
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
