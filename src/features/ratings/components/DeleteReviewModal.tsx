import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';

interface DeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function DeleteReviewModal({ isOpen, onClose, onConfirm, isSubmitting }: DeleteReviewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Review">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-white/70">
          Are you sure you want to delete your review?{' '}
          <span className="text-red-400 font-medium">This cannot be undone.</span>
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-red-600/70 hover:bg-red-600 border border-red-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Deleting…' : 'Delete Review'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
