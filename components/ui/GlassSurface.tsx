'use client';

import React from 'react';

interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'z0' | 'z1' | 'z2' | 'z3' | 'z4';
  interactive?: boolean;
}

export function GlassSurface({
  children,
  elevation = 'z1',
  interactive = false,
  className = '',
  style,
  ...props
}: GlassSurfaceProps) {
  const elevClass = `elev-${elevation}`;
  const interactiveClass = interactive
    ? 'hover:border-accent/40 hover:shadow-z2 transition-all duration-300'
    : '';

  return (
    <div
      className={`glass-surface rounded-lg relative overflow-hidden ${elevClass} ${interactiveClass} ${className}`}
      style={style}
      {...props}
    >
      {/* 1px subtle top highlight edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
