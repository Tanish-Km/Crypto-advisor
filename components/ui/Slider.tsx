'use client';

import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  formatValue?: (val: number) => string;
  className?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  unit = '',
  formatValue,
  className = '',
}: SliderProps) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {(label || value !== undefined) && (
        <div className="flex justify-between items-center text-xs">
          {label && (
            <span className="font-medium tracking-wide uppercase text-text-secondary">
              {label}
            </span>
          )}
          <span className="font-mono text-accent font-semibold text-sm">
            {formatValue ? formatValue(value) : `${value}${unit}`}
          </span>
        </div>
      )}

      <div className="relative h-6 flex items-center select-none cursor-pointer">
        {/* Recessed Track */}
        <div className="w-full h-2 rounded-pill bg-void border border-border-subtle shadow-inner relative overflow-hidden">
          {/* Glowing Filled portion */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-accent/70 to-accent rounded-pill shadow-[0_0_10px_rgba(143,184,214,0.35)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real HTML Range for accessibility & drag */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />

        {/* 3D Sphere Knob display */}
        <div
          className="absolute -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-b from-white via-accent to-accent-2 shadow-[0_4px_10px_rgba(0,0,0,0.6),0_0_12px_rgba(143,184,214,0.5)] border border-white/60 pointer-events-none transition-transform hover:scale-125"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
