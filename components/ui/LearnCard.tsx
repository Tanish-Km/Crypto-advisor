'use client';

import React from 'react';
import { GlassSurface } from './GlassSurface';
import { GlossaryTerm } from '@/lib/data/glossary';
import { BookOpen, Scale, Droplet, Activity, Shield, Calendar, Layers, Split, X } from 'lucide-react';

interface LearnCardProps {
  term: GlossaryTerm;
  onClose?: () => void;
  className?: string;
}

export function LearnCard({ term, onClose, className = '' }: LearnCardProps) {
  const iconMap: Record<GlossaryTerm['iconType'], React.ReactNode> = {
    scale: <Scale className="w-5 h-5 text-accent" />,
    droplet: <Droplet className="w-5 h-5 text-accent" />,
    wave: <Activity className="w-5 h-5 text-warning" />,
    shield: <Shield className="w-5 h-5 text-success" />,
    calendar: <Calendar className="w-5 h-5 text-accent-2" />,
    layers: <Layers className="w-5 h-5 text-accent" />,
    gyro: <Split className="w-5 h-5 text-gold" />,
    split: <Split className="w-5 h-5 text-accent" />,
  };

  return (
    <GlassSurface
      elevation="z3"
      className={`p-6 border border-accent/30 max-w-md w-full relative shadow-[0_25px_50px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border-glow flex items-center justify-center">
            {iconMap[term.iconType] || <BookOpen className="w-5 h-5 text-accent" />}
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-accent">
              Plain English Guide
            </span>
            <h3 className="text-base font-bold text-text-primary">{term.term}</h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3 text-xs leading-relaxed">
        <p className="text-text-primary font-medium">{term.shortDef}</p>
        <p className="text-text-secondary">{term.explanation}</p>

        <div className="p-3 rounded-md bg-void/70 border border-border-subtle">
          <span className="font-semibold text-accent text-[11px] uppercase tracking-wide block mb-1">
            Real-World Example
          </span>
          <p className="text-text-primary text-[12px] italic">{term.example}</p>
        </div>
      </div>
    </GlassSurface>
  );
}
