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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Removal reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain why this app is being removed…"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
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
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-60"
          >
            {isSubmitting ? 'Removing…' : 'Confirm Remove'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
