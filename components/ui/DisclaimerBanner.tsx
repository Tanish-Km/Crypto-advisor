'use client';

import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export function DisclaimerBanner({ compact = false, className = '' }: DisclaimerBannerProps) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <div
      className={`glass-surface elev-z1 border-warning/30 rounded-md p-3 text-xs text-text-secondary select-none relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-warning font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-warning" />
          <span>Educational Guidance & Risk Disclaimer</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-text-muted hover:text-text-primary transition-colors text-xs flex items-center gap-1"
        >
          <span>{expanded ? 'Less' : 'More'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <p className="mt-1.5 text-text-primary text-[12px] leading-relaxed">
        Educational information, not financial advice. Crypto is volatile and you can lose money.
      </p>

      {expanded && (
        <div className="mt-2 pt-2 border-t border-border-subtle text-[11px] text-text-secondary space-y-1">
          <p>
            Past asset performance does not guarantee future results. Allocations are rule-matched to your answers and verified by a human advisor for suitability.
          </p>
          <p className="text-text-muted">
            Cryptocurrency regulations vary significantly by jurisdiction. Check local laws before buying or holding digital assets.
          </p>
        </div>
      )}
    </div>
  );
}
