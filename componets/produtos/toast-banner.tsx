'use client';

import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastBannerProps {
  message: string | null;
  type?: 'success' | 'error';
  onDismiss: () => void;
}

export function ToastBanner({
  message,
  type = 'success',
  onDismiss,
}: ToastBannerProps) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl p-4 shadow-lg border backdrop-blur-xs transition-all animate-in fade-in slide-in-from-bottom-5 ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50/95 text-emerald-800'
          : 'border-rose-200 bg-rose-50/95 text-rose-800'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
      )}

      <span className="text-sm font-medium">{message}</span>

      <button
        type="button"
        onClick={onDismiss}
        className="rounded-lg p-1 text-slate-400 hover:bg-black/5 hover:text-slate-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
