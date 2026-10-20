'use client';

import React from 'react';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'approved' | 'pending' | 'warning' | 'danger';
  advisorName?: string;
  approvedDate?: string;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  advisorName = 'Elena Rostova, CFA',
  approvedDate = 'Verified',
  className = '',
}: BadgeProps) {
  if (variant === 'approved') {
    return (
      <div
        className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 border border-gold/60 text-gold shadow-[0_0_15px_rgba(212,163,115,0.3)] hover:scale-105 transition-all duration-300 cursor-default select-none ${className}`}
      >
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-50" />
          <ShieldCheck className="relative w-4 h-4 text-gold drop-shadow-[0_0_8px_rgba(212,163,115,0.8)]" />
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase font-mono">
          Advisor Approved
        </span>

        {/* Hover Tooltip showing advisor details */}
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 rounded-md glass-surface text-text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-z3 border border-gold/40">
          <p className="font-semibold text-gold">{advisorName}</p>
          <p className="text-[10px] text-text-secondary">{approvedDate}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-surface-raised" />
        </div>
      </div>
    );
  }

  if (variant === 'pending') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-warning/15 border border-warning/40 text-warning text-xs font-medium animate-pulse shadow-[0_0_12px_rgba(229,184,136,0.25)] ${className}`}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>Pending Review</span>
      </div>
    );
  }

  if (variant === 'warning') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium bg-warning/15 text-warning border border-warning/30 ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'danger') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium bg-danger/15 text-danger border border-danger/30 ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium bg-surface-raised text-text-secondary border border-border-subtle shadow-z1 ${className}`}
    >
      {children}
    </span>
  );
}
