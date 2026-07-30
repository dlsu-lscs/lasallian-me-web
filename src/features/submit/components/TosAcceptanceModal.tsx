'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';

export interface TosAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isSubmitting: boolean;
}

export function TosAcceptanceModal({
  isOpen,
  onClose,
  onAccept,
  isSubmitting,
}: TosAcceptanceModalProps) {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (!checked || isSubmitting) return;
    onAccept();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <div className="grid gap-4">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 sm:p-5 text-sm text-white/70 leading-relaxed">
          <p>
            Before submitting an app, you must agree to our Terms of Service.
            By submitting, you confirm that you own or have permission to
            share this app, that the information you provide is accurate,
            and that you agree to our content and community guidelines.
          </p>
        </div>

        <Link
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/60 hover:text-white transition-colors underline underline-offset-2 w-fit"
        >
          Read the full Terms of Service
        </Link>

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/40 accent-white cursor-pointer"
          />
          <span className="text-sm text-white/80">
            I have read and agree to the Terms of Service.
          </span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleAccept}
            disabled={!checked || isSubmitting}
          >
            {isSubmitting ? 'Accepting…' : 'I Agree'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}