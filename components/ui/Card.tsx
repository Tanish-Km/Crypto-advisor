'use client';

import React from 'react';
import { Tilt } from './Tilt';
import { GlassSurface } from './GlassSurface';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tilt?: boolean;
  maxTilt?: number;
  elevation?: 'z0' | 'z1' | 'z2' | 'z3' | 'z4';
}

export function Card({
  children,
  tilt = true,
  maxTilt = 8,
  elevation = 'z1',
  className = '',
  ...props
}: CardProps) {
  const content = (
    <GlassSurface
      elevation={elevation}
      interactive={tilt}
      className={`p-5 ${className}`}
      {...props}
    >
      {children}
    </GlassSurface>
  );

  if (!tilt) {
    return content;
  }

  return <Tilt maxTilt={maxTilt}>{content}</Tilt>;
}
