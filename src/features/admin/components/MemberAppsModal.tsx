import Image from 'next/image';
import { Modal } from '@/components/atoms/Modal';
import { useUserApplicationsQuery } from '../queries/member.queries';
import { imgSrc } from '@/lib/img-src';
import type { Member } from '../types/admin.types';

interface MemberAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  APPROVED: { label: 'Approved', className: 'bg-green-500/15 text-green-400 border border-green-500/25' },
  PENDING: { label: 'Pending', className: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25' },
  CHANGES_REQUESTED: { label: 'Changes Requested', className: 'bg-amber-500/15 text-amber-400 border border-amber-500/25' },
  REMOVED: { label: 'Removed', className: 'bg-white/8 text-white/40 border border-white/15' },
};

export function MemberAppsModal({ isOpen, onClose, member }: MemberAppsModalProps) {
  const { data, isLoading } = useUserApplicationsQuery(member?.id ?? null, isOpen && member != null);

  const apps = data?.data ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apps by ${member?.name ?? '…'}`}>
      {isLoading ? (
        <div className="py-8 text-center text-white/40 text-sm">Loading…</div>
      ) : apps.length === 0 ? (
        <div className="py-8 text-center text-white/40 text-sm">No apps submitted yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {apps.map((app) => {
            const badge = STATUS_BADGE[app.status] ?? STATUS_BADGE.REMOVED;
            return (
              <div key={app.id} className="glass-md rounded-xl overflow-hidden flex gap-3 p-3">
                {app.previewImages?.[0] ? (
                  <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      fill
                      unoptimized
                      src={imgSrc(app.previewImages[0])}
                      alt={app.title}
                      className="object-cover"
                    />
                  </div>
                ) : app.icon ? (
                  <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      fill
                      unoptimized
                      src={imgSrc(app.icon)}
                      alt={app.title}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 shrink-0 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/20 text-xs">
                    No img
                  </div>
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{app.title}</p>
                  <span
                    className={`self-start text-[11px] font-medium px-2 py-0.5 rounded-full ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
