'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const borderColors = {
          success: 'border-success/60 text-success',
          warning: 'border-warning/60 text-warning',
          danger: 'border-danger/60 text-danger',
          info: 'border-accent/60 text-accent',
        };

        const icons = {
          success: <CheckCircle className="w-4 h-4 text-success shrink-0" />,
          warning: <AlertCircle className="w-4 h-4 text-warning shrink-0" />,
          danger: <AlertCircle className="w-4 h-4 text-danger shrink-0" />,
          info: <Info className="w-4 h-4 text-accent shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto glass-surface elev-z4 rounded-lg p-3.5 border ${
              borderColors[toast.type]
            } shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-right-8 duration-300 relative`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{icons[toast.type]}</span>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">{toast.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
