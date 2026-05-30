import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiX, FiUser, FiExternalLink } from 'react-icons/fi';
import type { ClaimRequest, ClaimRequestStatus } from '../types/admin.types';

interface ClaimRequestCardProps {
  claim: ClaimRequest;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  isApproving: boolean;
  isDeclining: boolean;
}

const STATUS_BADGE: Record<ClaimRequestStatus, { label: string; classes: string }> = {
  PENDING:  { label: 'Pending',  classes: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  APPROVED: { label: 'Approved', classes: 'bg-green-500/15 text-green-400 border border-green-500/30' },
  DECLINED: { label: 'Declined', classes: 'bg-white/8 text-white/40 border border-white/10' },
};

export function ClaimRequestCard({
  claim,
  onApprove,
  onDecline,
  isApproving,
  isDeclining,
}: ClaimRequestCardProps) {
  const isBusy = isApproving || isDeclining;
  const badge = STATUS_BADGE[claim.status];
  const submittedAt = new Date(claim.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
      {/* App info */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/${claim.applicationSlug}`}
              target="_blank"
              className="text-white font-semibold text-sm hover:text-white/80 transition-colors truncate"
            >
              {claim.applicationTitle}
            </Link>
            <FiExternalLink className="w-3 h-3 text-white/30 shrink-0" />
          </div>
          <p className="text-white/35 text-xs font-mono">{claim.applicationSlug}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      {/* Claimant info */}
      <div className="flex items-center gap-2.5">
        {claim.userImage ? (
          <Image
            src={claim.userImage}
            alt={claim.userName}
            width={32}
            height={32}
            unoptimized
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <FiUser className="w-3.5 h-3.5 text-white/40" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white/80 text-xs font-semibold truncate">{claim.userName}</p>
          <p className="text-white/40 text-xs truncate">{claim.userEmail}</p>
        </div>
      </div>

      {/* Additional info */}
      {claim.additionalInfo && (
        <p className="text-white/55 text-xs leading-relaxed bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2">
          {claim.additionalInfo}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className="text-white/30 text-[10px]">Submitted {submittedAt}</span>

        {claim.status === 'PENDING' && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              disabled={isBusy}
              onClick={() => onApprove(claim.id)}
              title="Approve"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-green-400/60 hover:text-green-400 hover:bg-green-500/15 transition-colors disabled:opacity-40"
            >
              {isApproving ? <span className="text-[10px]">…</span> : <FiCheck className="w-3.5 h-3.5" />}
            </button>
            <button
              disabled={isBusy}
              onClick={() => onDecline(claim.id)}
              title="Decline"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
            >
              {isDeclining ? <span className="text-[10px]">…</span> : <FiX className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
