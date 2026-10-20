'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface Fallback2DProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Fallback2D({
  title = 'Interactive 3D Visualizer',
  subtitle = 'Optimized 2D presentation active for low-power or reduced-motion preferences.',
  icon,
  className = '',
}: Fallback2DProps) {
  return (
    <div
      className={`w-full h-full min-h-[280px] rounded-lg glass-surface elev-z1 border border-border-subtle flex flex-col items-center justify-center p-8 text-center select-none relative overflow-hidden ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-surface-raised border border-border-glow flex items-center justify-center text-accent mb-4 shadow-[0_0_20px_rgba(143,184,214,0.25)]">
        {icon || <Compass className="w-8 h-8 text-accent animate-spin" style={{ animationDuration: '20s' }} />}
      </div>
      <h4 className="font-display font-semibold text-text-primary text-sm tracking-tight">{title}</h4>
      <p className="text-xs text-text-secondary max-w-sm mt-1.5 leading-relaxed">{subtitle}</p>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-accent/80 font-mono">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Full text & data equivalents available below</span>
      </div>
    </div>
  );
}
