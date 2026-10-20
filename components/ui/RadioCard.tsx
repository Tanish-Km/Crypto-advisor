'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface RadioCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function RadioCard({
  selected,
  onClick,
  title,
  description,
  icon,
  badge,
  className = '',
}: RadioCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 select-none text-left border ${
        selected
          ? 'glass-surface elev-z3 border-accent shadow-[0_0_20px_rgba(143,184,214,0.3)] -translate-y-1'
          : 'bg-surface/60 border-border-subtle elev-z1 hover:elev-z2 hover:border-border-glow hover:-translate-y-0.5'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={`p-2 rounded-md ${
                selected ? 'bg-accent/20 text-accent' : 'bg-surface-raised text-text-secondary'
              }`}
            >
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-text-primary">{title}</span>
              {badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-pill bg-accent/20 text-accent font-mono font-medium">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <div
          className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            selected ? 'border-accent bg-accent text-void' : 'border-border-subtle bg-surface-raised'
          }`}
        >
          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
    </div>
  );
}
