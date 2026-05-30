'use client';

import { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    const savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = savedOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-end sm:items-center justify-center p-4 sm:p-6">
        <div
          className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-[var(--shadow-modal)] rounded-3xl p-6 max-w-lg w-full text-white my-2"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
