'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Fallback2D } from '@/components/three/Fallback2D';
import { useAppStore } from '@/lib/store/useAppStore';
import { AllocationItem, Coin } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Save,
  Lock,
  ArrowLeft,
  Sparkles,
  Calendar,
} from 'lucide-react';

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => <Fallback2D title="Loading Interactive Tower..." />,
});

const PortfolioTower = dynamic(
  () => import('@/components/three/PortfolioTower').then((m) => m.PortfolioTower),
  { ssr: false }
);

const AdvisorSeal = dynamic(
  () => import('@/components/three/AdvisorSeal').then((m) => m.AdvisorSeal),
  { ssr: false }
);

export default function AdvisorReviewDeskPage() {
  const router = useRouter();
  const {
    recommendation,
    coins,
    profile,
    updateAllocation,
    approveRecommendation,
    loginAsDemoInvestor,
    addToast,
  } = useAppStore();

  const [allocationItems, setAllocationItems] = useState<AllocationItem[]>(
    recommendation ? JSON.parse(JSON.stringify(recommendation.allocation)) : []
  );

  const [advisorNote, setAdvisorNote] = useState<string>(
    recommendation?.advisorNote ||
      'Approved after suitability review. Balanced Builder parameters verified with prudent stablecoin liquidity buffer.'
  );

  const [entryType, setEntryType] = useState<'lump_sum' | 'dca'>(
    recommendation?.entryPlan?.type || 'dca'
  );

  const [isStamping, setIsStamping] = useState<boolean>(false);
  const [stampedSuccess, setStampedSuccess] = useState<boolean>(
    recommendation?.status === 'approved'
  );

  const coinMap = new Map<string, Coin>();
  coins.forEach((c) => coinMap.set(c.id, c));

  const totalPercent = allocationItems.reduce((acc, curr) => acc + curr.percent, 0);

  const handlePercentChange = (index: number, newPercent: number) => {
    const updated = [...allocationItems];
    updated[index].percent = newPercent;
    setAllocationItems(updated);
  };

  const handleAutoBalance = () => {
    if (allocationItems.length === 0) return;
    const diff = 100 - totalPercent;
    const updated = [...allocationItems];
    // Add difference to largest holding
    let largestIdx = 0;
    for (let i = 1; i < updated.length; i++) {
      if (updated[i].percent > updated[largestIdx].percent) largestIdx = i;
    }
    updated[largestIdx].percent += diff;
    setAllocationItems(updated);
    addToast({
      type: 'info',
      title: 'Allocation Auto-Balanced',
      message: `Adjusted ${coinMap.get(updated[largestIdx].coinId)?.symbol || 'primary asset'} to ensure exact 100% total.`,
    });
  };

  const handleFieldChange = (
    index: number,
    field: 'rationale' | 'risk' | 'reconsiderWhen',
    value: string
  ) => {
    const updated = [...allocationItems];
    updated[index][field] = value;
    setAllocationItems(updated);
  };

  // Validation: Every pick must have non-empty rationale, risk, and reconsiderWhen (Plan.md Section 13)
  const emptyFieldsCount = allocationItems.filter(
    (item) =>
      !item.rationale.trim() || !item.risk.trim() || !item.reconsiderWhen.trim()
  ).length;

  const canApprove = totalPercent === 100 && emptyFieldsCount === 0;

  const handleApprove = () => {
    if (!canApprove) return;

    setIsStamping(true);
    updateAllocation(allocationItems);

    setTimeout(() => {
      approveRecommendation(advisorNote);
      setIsStamping(false);
      setStampedSuccess(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-[92vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      {/* Top Disclaimer */}
      <DisclaimerBanner compact className="mb-6" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => router.push('/advisor')}
            className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Control Room</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-text-primary">
              Audit &amp; Approve Client Recommendation
            </h1>
            <Badge variant={stampedSuccess ? 'approved' : 'pending'} />
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Client: <span className="text-accent font-semibold">Alex Rivera</span> (Balanced Builder • $15,000 USD)
          </p>
        </div>

        {/* 100% Sum Status Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-pill font-mono text-xs font-bold border flex items-center gap-1.5 ${
              totalPercent === 100
                ? 'bg-success/15 border-success/40 text-success'
                : 'bg-danger/15 border-danger/40 text-danger'
            }`}
          >
            {totalPercent === 100 ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>Total Allocation: {totalPercent}%</span>
          </div>

          {totalPercent !== 100 && (
            <Button size="sm" variant="secondary" onClick={handleAutoBalance}>
              Auto-Balance
            </Button>
          )}
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Live Interactive Portfolio Tower */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card elevation="z2" className="glass-surface p-6 sticky top-24" tilt={false}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-accent font-bold tracking-wider">
                Live 3D Architecture
              </span>
              <span className="text-xs font-mono text-text-muted">Reshapes in Real-Time</span>
            </div>

            <div className="h-80 w-full relative">
              <Scene fov={38} starCount={250}>
                <PortfolioTower allocation={allocationItems} coins={coins} />
              </Scene>
            </div>

            {/* Entry Plan Selector */}
            <div className="mt-4 pt-4 border-t border-border-subtle space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                Deployment Staging
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEntryType('dca')}
                  className={`p-2.5 rounded-md border font-semibold transition-all ${
                    entryType === 'dca'
                      ? 'border-accent bg-accent/20 text-accent font-mono'
                      : 'border-border-subtle bg-surface-raised/40 text-text-secondary'
                  }`}
                >
                  DCA (4 Installments)
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('lump_sum')}
                  className={`p-2.5 rounded-md border font-semibold transition-all ${
                    entryType === 'lump_sum'
                      ? 'border-accent bg-accent/20 text-accent font-mono'
                      : 'border-border-subtle bg-surface-raised/40 text-text-secondary'
                  }`}
                >
                  Lump Sum Immediate
                </button>
              </div>
            </div>

            {/* Advisor Note Textarea */}
            <div className="mt-4 pt-4 border-t border-border-subtle space-y-2">
              <label className="text-xs font-semibold text-gold uppercase tracking-wider block">
                Advisor Official Rationale Note
              </label>
              <textarea
                value={advisorNote}
                onChange={(e) => setAdvisorNote(e.target.value)}
                rows={3}
                className="input-recessed w-full p-2.5 rounded-md text-xs text-text-primary leading-relaxed"
                placeholder="Write official investment thesis note for the investor..."
              />
            </div>
          </Card>
        </div>

        {/* Right Column (7 cols): Per-Coin Editor Cards */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-text-primary">
              Per-Asset Weights &amp; Accountability
            </h3>
            {emptyFieldsCount > 0 && (
              <span className="text-xs font-mono text-warning flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{emptyFieldsCount} assets require statements</span>
              </span>
            )}
          </div>

          {allocationItems.map((item, index) => {
            const coin = coinMap.get(item.coinId);

            return (
              <Card key={item.coinId} elevation="z1" className="p-5 glass-surface border-border-subtle" tilt={false}>
                {/* Coin Header & Slider */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-raised border border-border-glow flex items-center justify-center font-mono font-bold text-sm text-text-primary">
                      {coin?.symbol || item.coinId}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-primary">{coin?.name || item.coinId}</h4>
                      <span className="text-[11px] text-text-secondary capitalize">
                        {coin?.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-lg font-bold text-accent">
                    {item.percent}%
                  </span>
                </div>

                {/* Percentage Slider */}
                <div className="mb-4">
                  <Slider
                    min={0}
                    max={70}
                    step={1}
                    value={item.percent}
                    onChange={(val) => handlePercentChange(index, val)}
                    unit="%"
                  />
                </div>

                {/* Accountability Form Fields (Required by Plan.md Section 13) */}
                <div className="space-y-3 pt-3 border-t border-border-subtle/50 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                      Rationale <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.rationale}
                      onChange={(e) => handleFieldChange(index, 'rationale', e.target.value)}
                      placeholder="Why this asset fits the client..."
                      className={`input-recessed w-full px-3 py-2 rounded text-xs text-text-primary ${
                        !item.rationale.trim() ? 'border-warning' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                      Downside Risk Statement <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.risk}
                      onChange={(e) => handleFieldChange(index, 'risk', e.target.value)}
                      placeholder="Specific structural or market risks..."
                      className={`input-recessed w-full px-3 py-2 rounded text-xs text-text-primary ${
                        !item.risk.trim() ? 'border-warning' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                      Reconsider When <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.reconsiderWhen}
                      onChange={(e) => handleFieldChange(index, 'reconsiderWhen', e.target.value)}
                      placeholder="Trigger event to trim or liquidate..."
                      className={`input-recessed w-full px-3 py-2 rounded text-xs text-text-primary ${
                        !item.reconsiderWhen.trim() ? 'border-warning' : ''
                      }`}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar at Bottom (z4) */}
      <div className="fixed bottom-4 inset-x-0 z-40 max-w-4xl mx-auto px-4 pointer-events-none">
        <div className="glass-surface elev-z4 rounded-pill px-6 py-3 border border-border-glow flex items-center justify-between pointer-events-auto shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
            <div>
              <span className="text-xs font-bold text-text-primary block leading-tight">
                {stampedSuccess ? 'Verified & Published' : 'Advisor Attestation Ready'}
              </span>
              <span className="text-[11px] text-text-secondary">
                {totalPercent === 100
                  ? 'All percentage allocations sum to 100%'
                  : `Sum is ${totalPercent}% (needs to be 100%)`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {stampedSuccess ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  loginAsDemoInvestor();
                  router.push('/dashboard');
                }}
                icon={<Sparkles className="w-4 h-4 text-void" />}
              >
                Switch Back to Investor View
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                disabled={!canApprove || isStamping}
                onClick={handleApprove}
                icon={<ShieldCheck className="w-4 h-4 text-void" />}
              >
                {isStamping ? 'Stamping Seal...' : 'Approve & Publish'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 3D Gold Seal Stamp Modal Impact Animation */}
      {isStamping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-md animate-in fade-in">
          <div className="flex flex-col items-center">
            <div className="h-44 w-44 relative animate-bounce">
              <Scene fov={35} enableStars={false}>
                <AdvisorSeal />
              </Scene>
            </div>
            <h3 className="font-display text-xl font-bold text-gold mt-4 tracking-wide">
              Stamping Certified Advisor Seal...
            </h3>
            <p className="text-xs text-text-secondary mt-1">Elena Rostova, CFA Attestation Verified</p>
          </div>
        </div>
      )}
    </div>
  );
}
