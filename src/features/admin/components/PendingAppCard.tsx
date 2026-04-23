import { Application } from '@/features/apps/types/app.types';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';

interface PendingAppCardProps {
  app: Application;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onEdit: (app: Application) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export function PendingAppCard({
  app,
  onApprove,
  onReject,
  onEdit,
  isApproving,
  isRejecting,
}: PendingAppCardProps) {
  const isBusy = isApproving || isRejecting;
  const visibleTags = app.tags?.slice(0, 3) ?? [];
  const extraTags = (app.tags?.length ?? 0) - 3;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Preview image */}
      {app.previewImages?.[0] ? (
        <Image
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
        {/* Title + status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{app.title}</h3>
          <Badge variant="warning" className="shrink-0">Pending</Badge>
        </div>

        {/* Description */}
        {app.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
        )}

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {extraTags > 0 && <Badge>+{extraTags}</Badge>}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button
            size="sm"
            variant="primary"
            disabled={isBusy}
            onClick={() => onApprove(app.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:opacity-60"
          >
            {isApproving ? 'Approving…' : 'Approve'}
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={isBusy}
            onClick={() => onReject(app.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-60"
          >
            {isRejecting ? 'Declining…' : 'Decline'}
          </Button>
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
