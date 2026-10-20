'use client';

import React from 'react';

interface DepthLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  z?: number; // translateZ in pixels
  children: React.ReactNode;
}

export function DepthLayer({
  z = 12,
  children,
  className = '',
  style,
  ...props
}: DepthLayerProps) {
  return (
    <div
      className={`preserve-3d ${className}`}
      style={{
        transform: `translateZ(${z}px)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
