import { Application } from '@/features/apps/types/app.types';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import type { AdminApplicationStatus } from '../services/admin.service';

interface PendingAppCardProps {
  app: Application;
  tab: AdminApplicationStatus;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (app: Application) => void;
  isApproving: boolean;
  isRejecting: boolean;
  isRemoving: boolean;
}

export function PendingAppCard({
  app,
  tab,
  onApprove,
  onReject,
  onRemove,
  onEdit,
  isApproving,
  isRejecting,
  isRemoving,
}: PendingAppCardProps) {
  const isBusy = isApproving || isRejecting || isRemoving;

  const showApprove = tab === 'PENDING' || tab === 'REJECTED' || tab === 'REMOVED';
  const showDecline = tab === 'PENDING';
  const showRemove  = tab === 'APPROVED' || tab === 'PENDING' || tab === 'REJECTED';
  const visibleTags = app.tags?.slice(0, 3) ?? [];
  const extraTags = (app.tags?.length ?? 0) - 3;

  const uniqueTags = Array.from(new Set(visibleTags));

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {app.previewImages?.[0] ? (
        <img
          src={app.previewImages[0]}
          alt={app.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No preview
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{app.title}</h3>
        </div>

        {app.userEmail && (
          <p className="text-xs text-gray-500">by {app.userEmail}</p>
        )}

        {app.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
        )}

        {app.rejectionReason && (
          <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">
            Reason: {app.rejectionReason}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {uniqueTags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {extraTags > 0 && <Badge>+{extraTags}</Badge>}
        </div>

        <div className="flex gap-2 mt-auto pt-2 flex-wrap">
          {showApprove && (
            <Button
              size="sm"
              variant="primary"
              disabled={isBusy}
              onClick={() => onApprove(app.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:opacity-60"
            >
              {isApproving ? 'Approving…' : 'Approve'}
            </Button>
          )}
          {showDecline && (
            <Button
              size="sm"
              variant="primary"
              disabled={isBusy}
              onClick={() => onReject(app.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-60"
            >
              {isRejecting ? 'Declining…' : 'Decline'}
            </Button>
          )}
          {showRemove && (
            <Button
              size="sm"
              variant="primary"
              disabled={isBusy}
              onClick={() => onRemove(app.id)}
              className="flex-1 bg-gray-700 hover:bg-gray-800 focus:ring-gray-500 disabled:opacity-60"
            >
              {isRemoving ? 'Removing…' : 'Remove'}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() => onEdit(app)}
            className="shrink-0"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
