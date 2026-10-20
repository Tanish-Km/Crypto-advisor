'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  ShieldCheck,
  Users,
  Clock,
  CheckCircle2,
  Activity,
  ArrowRight,
  Sliders,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdvisorControlRoomPage() {
  const { recommendation, profile, currentUser, loginAsDemoAdvisor } = useAppStore();

  const isApproved = recommendation?.status === 'approved';

  return (
    <div className="relative min-h-[92vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      {/* Top Disclaimer */}
      <DisclaimerBanner compact className="mb-6" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(212,163,115,0.35)]">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                Advisor Verification Control Room
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Certified Professional Desk • Elena Rostova, CFA (Chartered Financial Analyst)
              </p>
            </div>
          </div>
        </div>

        <Link href="/advisor/reviews">
          <Button icon={<Sliders className="w-4 h-4 text-void" />}>
            Open Review &amp; Edit Desk
          </Button>
        </Link>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card elevation="z1" className="p-5 flex items-center justify-between" tilt={false}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
              Active Clients
            </span>
            <span className="font-mono text-2xl font-bold text-text-primary mt-1 block">
              1 Client
            </span>
            <span className="text-[11px] text-accent mt-0.5 block">Alex Rivera (Assigned)</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border-glow flex items-center justify-center text-accent">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card elevation="z1" className="p-5 flex items-center justify-between" tilt={false}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
              Pending Reviews
            </span>
            <span className="font-mono text-2xl font-bold text-warning mt-1 block">
              {isApproved ? '0 Queue' : '1 Pending'}
            </span>
            <span className="text-[11px] text-text-secondary mt-0.5 block">
              {isApproved ? 'All clients approved' : 'Requires verification'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-warning/15 border border-warning/40 flex items-center justify-center text-warning">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card elevation="z1" className="p-5 flex items-center justify-between" tilt={false}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
              Approved This Month
            </span>
            <span className="font-mono text-2xl font-bold text-gold mt-1 block">
              {isApproved ? '5 Sealed' : '4 Sealed'}
            </span>
            <span className="text-[11px] text-gold mt-0.5 block">100% Suitability score</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card elevation="z1" className="p-5 flex items-center justify-between" tilt={false}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
              Average Risk Score
            </span>
            <span className="font-mono text-2xl font-bold text-accent mt-1 block">
              6.0 / 10
            </span>
            <span className="text-[11px] text-text-secondary mt-0.5 block">Balanced Builder cluster</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border-glow flex items-center justify-center text-accent">
            <Activity className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Pending Review Queue Table / Cards */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">
            Client Review Queue
          </h2>
          <span className="text-xs font-mono text-text-muted">
            1 Active Assignment
          </span>
        </div>

        <Card elevation="z2" className="p-6 glass-surface border-border-glow/40" tilt={false}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-accent-2 flex items-center justify-center text-void font-bold text-lg font-mono">
                AR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-text-primary">Alex Rivera</h3>
                  <Badge variant={isApproved ? 'approved' : 'pending'} />
                </div>
                <p className="text-xs text-text-secondary mt-0.5 font-mono">
                  Persona: <span className="text-accent font-semibold">Balanced Builder</span> • Capital: ${profile?.amount.toLocaleString() || '15,000'} USD • Horizon: {profile?.horizonYears || 3} Years
                </p>
              </div>
            </div>

            <Link href="/advisor/reviews">
              <Button size="md" icon={<ArrowRight className="w-4 h-4 text-void" />}>
                {isApproved ? 'Audit / Edit Allocation' : 'Review & Approve Recommendation'}
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-text-muted text-[10px] uppercase block">Risk Score</span>
              <span className="text-text-primary font-bold">6 / 10</span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] uppercase block">Assigned Advisor</span>
              <span className="text-gold font-bold">Elena Rostova, CFA</span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] uppercase block">Allocated Assets</span>
              <span className="text-text-primary font-bold">{recommendation?.allocation.length || 0} Assets</span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] uppercase block">Recommendation Version</span>
              <span className="text-accent font-bold">v{recommendation?.version || 1}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
