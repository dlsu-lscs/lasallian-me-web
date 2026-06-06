import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { FiAlertTriangle } from 'react-icons/fi';

interface ResubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ResubmitConfirmModal({ isOpen, onClose, onConfirm, isSubmitting }: ResubmitConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save & Resubmit for Review">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <p className="text-sm text-white/70 leading-relaxed">
            This app is currently <span className="text-white font-medium">approved</span> and publicly visible.
            Saving changes will send it back for admin review and it will appear as{' '}
            <span className="text-amber-400 font-medium">pending</span> until an admin approves it again.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Save & Resubmit'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
