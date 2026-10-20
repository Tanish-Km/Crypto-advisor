'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { LearnCard } from '@/components/ui/LearnCard';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { GLOSSARY_TERMS, GlossaryTerm } from '@/lib/data/glossary';
import {
  BookOpen,
  Scale,
  Droplet,
  Activity,
  Shield,
  Calendar,
  Layers,
  Split,
  Search,
  Sparkles,
} from 'lucide-react';

export default function LearnPage() {
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [search, setSearch] = useState<string>('');

  const iconMap: Record<GlossaryTerm['iconType'], React.ReactNode> = {
    scale: <Scale className="w-6 h-6 text-accent" />,
    droplet: <Droplet className="w-6 h-6 text-accent" />,
    wave: <Activity className="w-6 h-6 text-warning" />,
    shield: <Shield className="w-6 h-6 text-success" />,
    calendar: <Calendar className="w-6 h-6 text-accent-2" />,
    layers: <Layers className="w-6 h-6 text-accent" />,
    gyro: <Split className="w-6 h-6 text-gold" />,
    split: <Split className="w-6 h-6 text-accent" />,
  };

  const filtered = GLOSSARY_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.shortDef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-[92vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      {/* Disclaimer */}
      <DisclaimerBanner compact className="mb-6" />

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              Beginner Crypto Glossary
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Demystifying complex blockchain and finance terminology into straightforward plain English.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search concepts..."
            className="input-recessed w-full pl-9 pr-4 py-2 rounded-md text-xs text-text-primary"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <Card
            key={item.slug}
            elevation="z1"
            onClick={() => setSelectedTerm(item)}
            className="p-5 cursor-pointer hover:border-accent/50 transition-all flex flex-col justify-between"
            tilt
            maxTilt={6}
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-surface-raised border border-border-glow flex items-center justify-center mb-4">
                {iconMap[item.iconType]}
              </div>
              <h3 className="font-display font-bold text-base text-text-primary mb-1.5">
                {item.term}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                {item.shortDef}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-accent">
              <span>Read plain explanation</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </Card>
        ))}
      </div>

      {/* Interactive Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md animate-in fade-in duration-200">
          <LearnCard term={selectedTerm} onClose={() => setSelectedTerm(null)} />
        </div>
      )}
    </div>
  );
}
