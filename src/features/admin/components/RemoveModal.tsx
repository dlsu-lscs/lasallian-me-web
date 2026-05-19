import { useState } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export function RemoveModal({ isOpen, onClose, onConfirm, isSubmitting }: RemoveModalProps) {
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Remove Application">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">
            Removal reason <span className="text-red-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain why this app is being removed…"
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
            className="bg-red-600/70 hover:bg-red-600 border border-red-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Removing…' : 'Confirm Remove'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
