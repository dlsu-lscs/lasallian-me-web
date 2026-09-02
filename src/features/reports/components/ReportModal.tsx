'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiAlertTriangle, FiArrowLeft, FiGrid, FiMessageSquare } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { imgSrc } from '@/lib/img-src';
import {
  REPORT_REASONS,
  type ReportReasonValue,
  type ReportTarget,
} from '../types/report.types';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { reason: string; description?: string }) => void;
  isSubmitting: boolean;
  target: ReportTarget | null;
}

function TargetPreview({ target }: { target: ReportTarget }) {
  if (target.type === 'APPLICATION') {
    const { app } = target;
    return (
      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 flex items-center gap-3">
        {app.icon ? (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
            <Image
              fill
              unoptimized
              src={imgSrc(app.icon)}
              alt={app.title}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
            {app.title?.charAt(0) ?? <FiGrid className="w-4 h-4" />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate">{app.title}</h3>
          {app.author || app.userEmail ? (
            <p className="text-xs text-white/40 truncate">
              by {app.author ?? app.userEmail}
            </p>
          ) : app.description ? (
            <p className="text-xs text-white/40 truncate">{app.description.split('\n')[0]}</p>
          ) : null}
        </div>
      </div>
    );
  }

  const { rating } = target;
  const displayName =
    rating.isAnonymous || (!rating.userName && !rating.userEmail)
      ? 'Anonymous'
      : (rating.userName ?? rating.userEmail!);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 text-white/70 font-medium">
          <FiMessageSquare className="w-3.5 h-3.5 text-white/40" />
          Review by <strong className="text-white">{displayName}</strong>
        </span>
        <span className="flex items-center gap-1 text-white/60 font-semibold">
          <FaStar className="w-3 h-3 text-amber-400" />
          {rating.score}
        </span>
      </div>
      {rating.comment ? (
        <p className="text-xs text-white/60 italic border-l-2 border-white/20 pl-2 line-clamp-2">
          &ldquo;{rating.comment}&rdquo;
        </p>
      ) : (
        <p className="text-xs text-white/30 italic">No written comment</p>
      )}
    </div>
  );
}

export function ReportModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  target,
}: ReportModalProps) {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [reason, setReason] = useState<ReportReasonValue>('INAPPROPRIATE');
  const [description, setDescription] = useState('');

  // Reset modal state whenever opened or closed
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setReason('INAPPROPRIATE');
      setDescription('');
    }
  }, [isOpen]);

  if (!target) return null;

  const targetLabel = target.type === 'APPLICATION' ? 'Application' : 'Review';
  const selectedReasonObj = REPORT_REASONS.find((r) => r.value === reason);
  const selectedReasonLabel = selectedReasonObj ? selectedReasonObj.label : reason;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'form') {
      setStep('confirm');
    } else {
      onConfirm({
        reason,
        description: description.trim() ? description.trim() : undefined,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={step === 'form' ? `Report ${targetLabel}` : 'Confirm Report'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Preview of the target being reported */}
        <TargetPreview target={target} />

        {step === 'form' ? (
          <>
            {/* Reason selector using Select atom */}
            <Select
              label="Reason for reporting *"
              labelPosition="top"
              options={REPORT_REASONS}
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReasonValue)}
              disabled={isSubmitting}
              containerClassName="w-full"
              className="w-full text-xs"
            />

            {/* Optional description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wide">
                  Additional Details <span className="text-white/30 font-normal lowercase">(optional)</span>
                </label>
                <span className="text-[10px] text-white/30">{description.length}/500</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                placeholder={`Please describe why this ${targetLabel.toLowerCase()} should be flagged or reviewed…`}
                rows={3}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors resize-none disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-white/8">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || !reason}
              >
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation details */}
            <div className="flex flex-col gap-3 py-1">
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5">
                <FiAlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-red-200">
                    Are you sure you want to report this {targetLabel.toLowerCase()}?
                  </p>
                  <p className="text-[11px] text-red-200/70 leading-relaxed">
                    This report will be sent to administrators for moderation. False or abusive
                    reports may lead to account penalties.
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/6 rounded-lg px-3 py-2.5 text-xs text-white/70 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-semibold text-white/40">
                  Selected Reason
                </span>
                <span className="text-white font-medium">{selectedReasonLabel}</span>
                {description && (
                  <>
                    <span className="text-[10px] uppercase font-semibold text-white/40 mt-1.5">
                      Your Note
                    </span>
                    <span className="text-white/80">{description}</span>
                  </>
                )}
              </div>
            </div>

            {/* Confirmation actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/8">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep('form')}
                disabled={isSubmitting}
                className="gap-1.5"
              >
                <FiArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Confirm & Submit'}
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
