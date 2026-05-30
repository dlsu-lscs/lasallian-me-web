'use client';

import { useEffect } from 'react';
import { useToastStore, type ToastItem } from '@/store/toast.store';

function Toast({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const base = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white min-w-64 max-w-sm';
  const color = toast.type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`${base} ${color}`}>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
