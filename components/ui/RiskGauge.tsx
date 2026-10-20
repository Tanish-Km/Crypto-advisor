'use client';

import React from 'react';

interface RiskGaugeProps {
  score: number; // 1 to 10
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function RiskGauge({
  score,
  size = 'md',
  showLabel = true,
  className = '',
}: RiskGaugeProps) {
  // Clamp score
  const safeScore = Math.max(1, Math.min(10, score));

  // Needle angle: 1 maps to -90 deg, 10 maps to +90 deg
  const angle = -90 + ((safeScore - 1) / 9) * 180;

  const sizeDimensions = {
    sm: { width: 140, height: 75, r: 50 },
    md: { width: 220, height: 120, r: 85 },
    lg: { width: 300, height: 160, r: 120 },
  };

  const dim = sizeDimensions[size];

  let zoneColor = '#68CFA4'; // seafoam green (cautious)
  let zoneLabel = 'Cautious Saver (1-3)';
  if (safeScore >= 4 && safeScore <= 7) {
    zoneColor = '#8FB8D6'; // silver-cyan (balanced)
    zoneLabel = 'Balanced Builder (4-7)';
  } else if (safeScore >= 8) {
    zoneColor = '#D4A373'; // champagne amber (growth)
    zoneLabel = 'Growth Seeker (8-10)';
  }

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative" style={{ width: dim.width, height: dim.height }}>
        <svg
          viewBox="0 0 200 110"
          className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#68CFA4" />
              <stop offset="45%" stopColor="#8FB8D6" />
              <stop offset="75%" stopColor="#D4A373" />
              <stop offset="100%" stopColor="#E06D77" />
            </linearGradient>

            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Colored Gradient Active Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-90"
          />

          {/* Center Hub */}
          <circle cx="100" cy="100" r="10" fill="#14171E" stroke="var(--border-subtle)" strokeWidth="3" />
          <circle cx="100" cy="100" r="4" fill={zoneColor} filter="url(#needleGlow)" />

          {/* Needle Group with dynamic angle transition */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke={zoneColor}
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#needleGlow)"
            />
            {/* Arrow Tip */}
            <polygon points="96,30 104,30 100,20" fill={zoneColor} />
          </g>
        </svg>

        {/* Score Number Display */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold tracking-tight" style={{ color: zoneColor }}>
            {safeScore}
            <span className="text-xs text-text-muted font-normal"> / 10</span>
          </span>
        </div>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider mt-2" style={{ color: zoneColor }}>
          {zoneLabel}
        </span>
      )}
    </div>
  );
}
