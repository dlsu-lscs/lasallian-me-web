'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';

interface EditAdminNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: string | null;
  onSave: (note: string) => void;
  isSaving: boolean;
}

export function EditAdminNoteModal({
  isOpen,
  onClose,
  initialNote = '',
  onSave,
  isSaving,
}: EditAdminNoteModalProps) {
  const [note, setNote] = useState(initialNote ?? '');

  useEffect(() => {
    setNote(initialNote ?? '');
  }, [initialNote, isOpen]);

  const handleSave = () => {
    onSave(note.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Admin Resolution Note">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
            Internal Note / Action taken
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Document why this report was resolved, dismissed, or any action taken..."
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Note'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}