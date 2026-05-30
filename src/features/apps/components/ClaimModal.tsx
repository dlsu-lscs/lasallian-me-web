'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { useClaimApplicationMutation } from '../queries/apps.queries';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  applicationTitle: string;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function ClaimModal({
  isOpen,
  onClose,
  applicationId,
  applicationTitle,
  user,
}: ClaimModalProps) {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const claimMutation = useClaimApplicationMutation();

  const handleClose = () => {
    if (claimMutation.isPending) return;
    setAdditionalInfo('');
    setSubmitted(false);
    claimMutation.reset();
    onClose();
  };

  const handleSubmit = () => {
    claimMutation.mutate(
      { id: applicationId, additionalInfo: additionalInfo.trim() || undefined },
      {
        onSuccess: () => setSubmitted(true),
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Claim "${applicationTitle}"`}>
      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold">Claim request submitted</p>
            <p className="text-white/50 text-sm mt-1">Admins will review it shortly.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Close
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* User profile info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full object-cover shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <span className="text-white/60 text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-white/45 text-xs truncate">{user.email}</p>
            </div>
          </div>

          <p className="text-white/50 text-xs leading-relaxed">
            Your name and email will be shared with admins to verify your ownership of this application.
          </p>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Additional Information
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
              placeholder="Anything else we need to know? How do you want us to contact you?"
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors resize-none"
            />
          </div>

          {claimMutation.isError && (
            <p className="text-red-400 text-sm">
              {claimMutation.error?.message ?? 'Something went wrong. Please try again.'}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={claimMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={claimMutation.isPending}
              className="bg-white hover:bg-white/15 border border-white/20"
            >
              {claimMutation.isPending ? 'Submitting…' : 'Submit Claim'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
