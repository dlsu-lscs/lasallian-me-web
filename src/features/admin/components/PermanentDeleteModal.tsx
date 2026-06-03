import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';

interface PermanentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function PermanentDeleteModal({ isOpen, onClose, onConfirm, isSubmitting }: PermanentDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Permanently Delete Application">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-white/70">
          This will permanently delete the app and all associated media from S3.{' '}
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
            {isSubmitting ? 'Deleting…' : 'Permanently Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
