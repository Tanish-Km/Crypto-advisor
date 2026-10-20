'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-md gap-2',
    lg: 'px-7 py-3.5 text-base font-semibold rounded-md gap-2.5',
  };

  let variantClass = '';

  if (variant === 'primary') {
    variantClass = 'btn-3d text-void font-bold';
  } else if (variant === 'secondary') {
    variantClass = 'btn-3d-secondary text-text-primary';
  } else if (variant === 'danger') {
    variantClass =
      'bg-danger/20 text-danger border border-danger/40 hover:bg-danger/30 hover:border-danger transition-all duration-150';
  } else if (variant === 'ghost') {
    variantClass =
      'bg-transparent text-text-secondary hover:text-text-primary hover:-translate-y-0.5 transition-all duration-150';
  }

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent ${sizeClasses[size]} ${variantClass} ${className}`}
      {...props}
    >
      {icon && <span className="inline-block shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
