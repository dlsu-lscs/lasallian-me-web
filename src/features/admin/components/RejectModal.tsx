import { useState } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export function RequestChangesModal({ isOpen, onClose, onConfirm, isSubmitting }: RejectModalProps) {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request Changes">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">
            Reason <span className="text-amber-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain what changes are needed…"
            className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
            className="bg-amber-600/70 hover:bg-amber-600 border border-amber-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending…' : 'Request Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
