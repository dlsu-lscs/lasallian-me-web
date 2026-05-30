import { Modal } from '@/components/atoms/Modal';
import { useUserReviewsQuery } from '../queries/member.queries';
import type { Member } from '../types/admin.types';

interface MemberReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

function StarScore({ score }: { score: number }) {
  const filled = Math.round(score);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? 'text-yellow-400' : 'text-white/15'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-xs text-white/50">{score.toFixed(1)}</span>
    </span>
  );
}

export function MemberReviewsModal({ isOpen, onClose, member }: MemberReviewsModalProps) {
  const { data, isLoading } = useUserReviewsQuery(member?.id ?? null, isOpen && member != null);

  const reviews = data?.data ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reviews by ${member?.name ?? '…'}`}>
      {isLoading ? (
        <div className="py-8 text-center text-white/40 text-sm">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center text-white/40 text-sm">No reviews submitted yet.</div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {reviews.map((review) => (
            <div
              key={review.applicationId}
              className="glass-md rounded-xl p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-white leading-tight">
                  {review.applicationTitle}
                </p>
                <StarScore score={review.score} />
              </div>
              {review.isAnonymous ? (
                <p className="text-xs text-white/30 italic">Anonymous review</p>
              ) : review.comment ? (
                <p className="text-sm text-white/60">{review.comment}</p>
              ) : (
                <p className="text-xs text-white/25 italic">No comment</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
