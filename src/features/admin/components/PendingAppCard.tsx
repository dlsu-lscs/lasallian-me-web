import { Application } from '@/features/apps/types/app.types';
import { AppCard } from '@/features/apps/components/AppCard';
import type { AdminApplicationStatus } from '../services/admin.service';
import { FiCheck, FiX, FiTrash2, FiUser } from 'react-icons/fi';

interface PendingAppCardProps {
  app: Application;
  tab: AdminApplicationStatus;
  onClick?: (app: Application) => void;
  onApprove: (id: number) => void;
  onRequestChanges: (id: number) => void;
  onRemove: (id: number) => void;
  onPermanentDelete?: (id: number) => void;
  isApproving: boolean;
  isRequestingChanges: boolean;
  isRemoving: boolean;
  isDeleting?: boolean;
}

const STATUS_DOT: Record<AdminApplicationStatus, { label: string; color: string }> = {
  APPROVED:           { label: 'Approved',           color: 'bg-green-400' },
  PENDING:            { label: 'Pending',             color: 'bg-yellow-400' },
  CHANGES_REQUESTED:  { label: 'Changes Requested',  color: 'bg-amber-400' },
  REMOVED:            { label: 'Removed',             color: 'bg-white/40' },
};

export function PendingAppCard({
  app,
  tab,
  onClick,
  onApprove,
  onRequestChanges,
  onRemove,
  onPermanentDelete,
  isApproving,
  isRequestingChanges,
  isRemoving,
  isDeleting = false,
}: PendingAppCardProps) {
  const isBusy = isApproving || isRequestingChanges || isRemoving || isDeleting;
  const dot = STATUS_DOT[tab];

  const showApprove         = tab === 'PENDING' || tab === 'CHANGES_REQUESTED' || tab === 'REMOVED';
  const showRequestChanges  = tab === 'PENDING';
  const showRemove          = tab === 'APPROVED' || tab === 'PENDING' || tab === 'CHANGES_REQUESTED';
  const showPermanentDelete = tab === 'REMOVED';

  return (
    <AppCard
      app={app}
      onClick={onClick}
      showTags={false}
      variant="compact"
      iconOverlay={
        <div className="group/dot relative">
          <span className={`w-2.5 h-2.5 rounded-full ${dot.color} block ring-[1.5px] ring-black/80`} />
          <span className="absolute bottom-full right-0 mb-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black text-white whitespace-nowrap border border-white/10 opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none z-20">
            {dot.label}
          </span>
        </div>
      }
      subtitle={
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <FiUser className="w-3 h-3 text-white/30 shrink-0" />
            <span className="text-white/45 text-xs truncate">{app.userEmail}</span>
          </div>
          {app.rejectionReason && (
            <p className="text-amber-400/70 text-xs truncate">{app.rejectionReason}</p>
          )}
        </div>
      }
      action={
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {showApprove && (
            <button
              disabled={isBusy}
              onClick={() => onApprove(app.id)}
              title="Approve"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-green-400/60 hover:text-green-400 hover:bg-green-500/15 transition-colors disabled:opacity-40"
            >
              {isApproving ? <span className="text-[10px]">…</span> : <FiCheck className="w-3.5 h-3.5" />}
            </button>
          )}
          {showRequestChanges && (
            <button
              disabled={isBusy}
              onClick={() => onRequestChanges(app.id)}
              title="Request Changes"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/15 transition-colors disabled:opacity-40"
            >
              {isRequestingChanges ? <span className="text-[10px]">…</span> : <FiX className="w-3.5 h-3.5" />}
            </button>
          )}
          {showRemove && (
            <button
              disabled={isBusy}
              onClick={() => onRemove(app.id)}
              title="Remove"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors disabled:opacity-40"
            >
              {isRemoving ? <span className="text-[10px]">…</span> : <FiTrash2 className="w-3.5 h-3.5" />}
            </button>
          )}
          {showPermanentDelete && (
            <button
              disabled={isBusy}
              onClick={() => onPermanentDelete?.(app.id)}
              title="Permanently Delete"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/15 transition-colors disabled:opacity-40"
            >
              {isDeleting ? <span className="text-[10px]">…</span> : <FiTrash2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      }
    />
  );
}
