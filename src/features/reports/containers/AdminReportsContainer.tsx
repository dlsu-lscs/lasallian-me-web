'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { ReportCard } from '../components/ReportCard';
import {
  useAdminReportsQuery,
  useUpdateAdminReportMutation,
} from '../queries/reports.queries';
import { ReportStatus, ReportTargetType } from '../types/report.types';
import { useToastStore } from '@/store/toast.store';
import { FiFlag, FiLayers } from 'react-icons/fi';

const STATUS_TABS: {
  label: string;
  value: ReportStatus | undefined;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    label: 'Pending',
    value: 'PENDING',
    activeClass: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    inactiveClass:
      'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'Resolved',
    value: 'RESOLVED',
    activeClass: 'bg-green-600/20 text-green-400 border border-green-500/30',
    inactiveClass:
      'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'Dismissed',
    value: 'DISMISSED',
    activeClass: 'bg-white/10 text-white/80 border border-white/20',
    inactiveClass:
      'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
  {
    label: 'All',
    value: undefined,
    activeClass: 'bg-white/12 text-white border border-white/25',
    inactiveClass:
      'bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/65 hover:bg-white/[0.07]',
  },
];

const TARGET_FILTERS: { label: string; value: ReportTargetType | undefined }[] = [
  { label: 'All Targets', value: undefined },
  { label: 'Apps', value: 'APPLICATION' },
  { label: 'Reviews', value: 'REVIEW' },
];

export function AdminReportsContainer() {
  const [status, setStatus] = useState<ReportStatus | undefined>('PENDING');
  const [targetType, setTargetType] = useState<ReportTargetType | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminReportsQuery({
    page,
    status,
    targetType,
    limit: 20,
  });

  const { data: pendingMeta } = useAdminReportsQuery({ status: 'PENDING', limit: 1 });
  const { data: resolvedMeta } = useAdminReportsQuery({ status: 'RESOLVED', limit: 1 });
  const { data: dismissedMeta } = useAdminReportsQuery({ status: 'DISMISSED', limit: 1 });
  const { data: totalMeta } = useAdminReportsQuery({ limit: 1 });

  const statusCounts: Record<string, number | undefined> = {
    PENDING: pendingMeta?.meta.total,
    RESOLVED: resolvedMeta?.meta.total,
    DISMISSED: dismissedMeta?.meta.total,
    ALL: totalMeta?.meta.total,
  };

  const updateMutation = useUpdateAdminReportMutation();
  const { addToast } = useToastStore();

  const reports = data?.data ?? [];
  const meta = data?.meta;

  const handleUpdateStatus = (id: number, newStatus: ReportStatus) => {
    updateMutation.mutate(
      { id, payload: { status: newStatus } },
      {
        onSuccess: () => addToast(`Report marked as ${newStatus.toLowerCase()}`, 'success'),
        onError: (err) => addToast(err.message || 'Failed to update report status', 'error'),
      },
    );
  };

  const handleUpdateNote = (id: number, adminNotes: string) => {
    updateMutation.mutate(
      { id, payload: { adminNotes } },
      {
        onSuccess: () => addToast('Admin note saved', 'success'),
        onError: (err) => addToast(err.message || 'Failed to save admin note', 'error'),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const countKey = tab.value ?? 'ALL';
            return (
              <button
                key={tab.label}
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  status === tab.value ? tab.activeClass : tab.inactiveClass
                }`}
              >
                {tab.label}
                {statusCounts[countKey] !== undefined && (
                  <span className="text-[11px] font-semibold opacity-70">
                    {statusCounts[countKey]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Target Type Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <FiLayers className="w-3.5 h-3.5 text-white/30 ml-1 mr-0.5" />
          {TARGET_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => {
                setTargetType(f.value);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                targetType === f.value
                  ? 'bg-white/12 text-white border border-white/20'
                  : 'text-white/40 border border-white/10 hover:text-white/60 hover:bg-white/[0.06]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="text-center py-16 text-white/40 text-sm">Loading reports…</div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400 text-sm">
          Unable to load reports. The reports endpoint may be unavailable.
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-white/20 mb-3 flex justify-center">
            <FiFlag className="w-10 h-10" />
          </div>
          <p className="text-base font-semibold text-white/80">
            No {status ? status.toLowerCase() : ''} reports found
          </p>
          <p className="text-xs text-white/40 mt-1">
            User-submitted flags for apps and reviews will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onUpdateStatus={handleUpdateStatus}
              onUpdateNote={handleUpdateNote}
              isUpdating={updateMutation.isPending && updateMutation.variables?.id === report.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-white/50">
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
    </div>
  );
}