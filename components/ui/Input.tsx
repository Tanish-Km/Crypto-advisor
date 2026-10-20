'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefixSymbol?: string;
}

export function Input({
  label,
  error,
  hint,
  prefixSymbol,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '_') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium tracking-wide uppercase text-text-secondary select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {prefixSymbol && (
          <span className="absolute left-3.5 text-text-muted font-mono select-none pointer-events-none">
            {prefixSymbol}
          </span>
        )}
        <input
          id={inputId}
          className={`input-recessed w-full px-4 py-2.5 rounded-md text-sm text-text-primary placeholder:text-text-muted ${
            prefixSymbol ? 'pl-8' : ''
          } ${error ? 'border-danger focus:ring-danger' : ''} ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-danger mt-0.5">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-text-muted mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
}
