'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { useAppStore } from '@/lib/store/useAppStore';
import { ShieldCheck, Users, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdvisorClientsPage() {
  const { profile, recommendation } = useAppStore();

  const isApproved = recommendation?.status === 'approved';

  return (
    <div className="relative min-h-[92vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      <DisclaimerBanner compact className="mb-6" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/advisor" className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Control Room</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Client Portfolio Roster
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        <Card elevation="z2" className="p-6 glass-surface" tilt={false}>
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
                  alex.rivera@example.com • Onboarded: Balanced Builder
                </p>
              </div>
            </div>

            <Link href="/advisor/reviews">
              <Button size="sm" icon={<ArrowRight className="w-4 h-4 text-void" />}>
                Open Review Desk
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-text-muted text-[10px] block">Capital Target:</span>
              <span className="text-text-primary font-bold">${profile?.amount.toLocaleString()} USD</span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] block">Risk Score:</span>
              <span className="text-accent font-bold">6 / 10</span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] block">Time Horizon:</span>
              <span className="text-text-primary font-bold">{profile?.horizonYears || 3} Years</span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] block">Active Status:</span>
              <span className={`font-bold ${isApproved ? 'text-gold' : 'text-warning'}`}>
                {isApproved ? 'Verified & Published' : 'Pending Advisor Audit'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
