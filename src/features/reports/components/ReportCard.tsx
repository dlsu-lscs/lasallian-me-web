'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiUser, FiExternalLink, FiEdit3, FiMessageSquare, FiGrid, FiAlertCircle } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Report, ReportStatus, REPORT_REASONS } from '../types/report.types';
import { Select } from '@/components/atoms/Select';
import { imgSrc } from '@/lib/img-src';
import { relativeTime } from '@/lib/relative-time';
import { EditAdminNoteModal } from './EditAdminNoteModal';

interface ReportCardProps {
  report: Report;
  onUpdateStatus: (id: number, status: ReportStatus) => void;
  onUpdateNote: (id: number, note: string) => void;
  isUpdating: boolean;
}

const STATUS_BADGE: Record<ReportStatus, { label: string; classes: string }> = {
  PENDING: {
    label: 'Pending',
    classes: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  },
  RESOLVED: {
    label: 'Resolved',
    classes: 'bg-green-500/15 text-green-400 border border-green-500/30',
  },
  DISMISSED: {
    label: 'Dismissed',
    classes: 'bg-white/8 text-white/40 border border-white/10',
  },
};

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'DISMISSED', label: 'Dismissed' },
];

export function ReportCard({
  report,
  onUpdateStatus,
  onUpdateNote,
  isUpdating,
}: ReportCardProps) {
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const badge = STATUS_BADGE[report.status];
  const reasonObj = REPORT_REASONS.find((r) => r.value === report.reason);
  const reasonLabel = reasonObj ? reasonObj.label : report.reason;

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex flex-col gap-3.5 transition-colors hover:border-white/12">
      {/* Top Header: Target Type & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/8 text-white/70 border border-white/10">
            {report.targetType === 'APPLICATION' ? (
              <>
                <FiGrid className="w-3 h-3 text-white/50" /> App Report
              </>
            ) : (
              <>
                <FiMessageSquare className="w-3 h-3 text-white/50" /> Review Report
              </>
            )}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/25">
            <FiAlertCircle className="w-3 h-3 text-red-400" />
            {reasonLabel}
          </span>
        </div>

        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      {/* Target Content Section */}
      <div className="bg-black/30 border border-white/6 rounded-lg p-3 flex flex-col gap-2">
        {report.targetType === 'APPLICATION' ? (
          <div className="flex items-center gap-3">
            {report.applicationIcon ? (
              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/10 shrink-0">
                <Image
                  fill
                  unoptimized
                  src={imgSrc(report.applicationIcon)}
                  alt={report.applicationTitle ?? 'App'}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                {report.applicationTitle?.charAt(0) ?? '?'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-white truncate">
                  {report.applicationTitle ?? `App #${report.targetId}`}
                </p>
                {report.applicationSlug && (
                  <Link
                    href={`/${report.applicationSlug}`}
                    target="_blank"
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <FiExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
              {report.applicationSlug && (
                <p className="text-xs text-white/35 font-mono">{report.applicationSlug}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-white/60 font-medium">
                Review on{' '}
                <strong className="text-white">
                  {report.applicationTitle ?? `App #${report.applicationId ?? ''}`}
                </strong>
              </span>
              {report.reviewScore !== undefined && (
                <span className="flex items-center gap-1 text-white/60">
                  <FaStar className="w-3 h-3 text-amber-400" />
                  {report.reviewScore}
                </span>
              )}
            </div>
            {report.reviewComment ? (
              <p className="text-xs text-white/70 italic border-l-2 border-white/20 pl-2.5 my-0.5">
                &ldquo;{report.reviewComment}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-white/30 italic">No comment text on review</p>
            )}
            <p className="text-[11px] text-white/35">
              Reviewer:{' '}
              {report.reviewIsAnonymous
                ? 'Anonymous'
                : report.reviewUserName || report.reviewUserEmail || 'User'}
            </p>
          </div>
        )}
      </div>

      {/* Reporter's Details and Description */}
      <div className="flex flex-col gap-2">
        {report.description && (
          <div className="bg-white/[0.02] border border-white/6 rounded-lg px-3 py-2 text-xs text-white/70 leading-relaxed">
            <span className="font-semibold text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">
              Reporter&apos;s Description:
            </span>
            {report.description}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-white/45">
          {report.userImage ? (
            <Image
              src={report.userImage}
              alt={report.userName ?? 'Reporter'}
              width={20}
              height={20}
              unoptimized
              className="rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <FiUser className="w-2.5 h-2.5 text-white/40" />
            </div>
          )}
          <span className="truncate">
            Reported by <strong className="text-white/70 font-medium">{report.userName ?? report.userEmail ?? 'User'}</strong>
          </span>
          <span className="text-white/25">&middot;</span>
          <span className="shrink-0 text-white/35">{relativeTime(report.createdAt)}</span>
        </div>
      </div>

      {/* Admin Notes Section */}
      {report.adminNotes && (
        <div className="bg-primary-950/20 border border-primary-800/30 rounded-lg p-2.5 text-xs text-white/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-primary-400">
              Admin Note
            </span>
            <button
              onClick={() => setNoteModalOpen(true)}
              className="text-[11px] text-white/40 hover:text-white transition-colors flex items-center gap-1"
            >
              <FiEdit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <p className="leading-snug text-white/65">{report.adminNotes}</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/6 mt-auto">
        {!report.adminNotes && (
          <button
            onClick={() => setNoteModalOpen(true)}
            className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FiEdit3 className="w-3.5 h-3.5" /> Add Note
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-white/40">Status:</span>
          <Select
            options={STATUS_OPTIONS}
            value={report.status}
            onChange={(e) => onUpdateStatus(report.id, e.target.value as ReportStatus)}
            disabled={isUpdating}
            className="text-xs py-1 px-2.5 pr-7 h-7"
          />
        </div>
      </div>

      <EditAdminNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        initialNote={report.adminNotes}
        isSaving={isUpdating}
        onSave={(note) => {
          onUpdateNote(report.id, note);
          setNoteModalOpen(false);
        }}
      />
    </div>
  );
}