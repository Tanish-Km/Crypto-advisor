'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { Fallback2D } from '@/components/three/Fallback2D';
import { useAppStore } from '@/lib/store/useAppStore';
import { Coin, Match } from '@/types';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  Sliders,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Info,
  Calendar,
  AlertTriangle,
  History,
} from 'lucide-react';

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => <Fallback2D title="Loading 3D Portfolio Tower..." />,
});

const PortfolioTower = dynamic(
  () => import('@/components/three/PortfolioTower').then((m) => m.PortfolioTower),
  { ssr: false }
);

const RadarScorecard3D = dynamic(
  () => import('@/components/three/RadarScorecard3D').then((m) => m.RadarScorecard3D),
  { ssr: false }
);

export default function InvestorDashboardPage() {
  const {
    currentUser,
    profile,
    recommendation,
    matches,
    coins,
    versions,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'why' | 'entry' | 'risks' | 'versions'>('why');
  const [selectedScorecardCoin, setSelectedScorecardCoin] = useState<Coin | null>(null);

  const isApproved = recommendation?.status === 'approved';

  const coinMap = new Map<string, Coin>();
  coins.forEach((c) => coinMap.set(c.id, c));

  const matchMap = new Map<string, Match>();
  matches.forEach((m) => matchMap.set(m.coinId, m));

  return (
    <div className="relative min-h-[90vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      {/* Top Compliance Disclaimer Banner */}
      <DisclaimerBanner compact className="mb-6" />

      {/* Header Status Bar */}
      <div className="glass-surface elev-z2 rounded-lg p-5 sm:p-6 mb-8 border border-border-glow/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              Your Personalized Crypto Allocation
            </h1>
            {isApproved ? (
              <Badge variant="approved" approvedDate={recommendation.approvedAt ? new Date(recommendation.approvedAt).toLocaleDateString() : 'Verified'} />
            ) : (
              <Badge variant="pending" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Engineered for <span className="text-accent font-semibold">{profile?.persona.replace('_', ' ').toUpperCase() || 'BALANCED BUILDER'}</span> (Risk Score: {profile?.riskScore || 6}/10)
          </p>
        </div>

        {/* Quick 3D Navigation Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/dashboard/galaxy">
            <Button variant="secondary" size="sm" icon={<Layers className="w-4 h-4 text-accent" />}>
              3D Risk Galaxy
            </Button>
          </Link>
          <Link href="/dashboard/simulator">
            <Button variant="secondary" size="sm" icon={<Sliders className="w-4 h-4 text-accent-2" />}>
              Stress Test
            </Button>
          </Link>
          <Link href="/dashboard/messages">
            <Button variant="secondary" size="sm" icon={<MessageSquare className="w-4 h-4 text-gold" />}>
              Advisor Q&A
            </Button>
          </Link>
        </div>
      </div>

      {/* Advisor Note Parchment Card */}
      <div className="glass-surface elev-z2 rounded-lg p-5 mb-8 border border-gold/30 bg-gold/5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center text-gold shrink-0">
            <ShieldCheck className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-gold uppercase tracking-wider font-mono">
                Advisor Review Note • Elena Rostova, CFA
              </span>
              <span className="text-[11px] text-text-muted font-mono">
                {isApproved ? 'Approved & Locked' : 'Initial Analysis Review'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-primary mt-1.5 leading-relaxed italic">
              &ldquo;{recommendation?.advisorNote || 'Allocation calibrated to provide core network appreciation while maintaining a resilient liquidity buffer against market pullbacks.'}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Column (7 cols): 3D Portfolio Tower */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card elevation="z2" className="glass-surface p-6 text-left" tilt={false}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">
                  3D Portfolio Architecture
                </span>
                <h3 className="font-display text-lg font-bold text-text-primary mt-0.5">
                  Asset Weight Distribution
                </h3>
              </div>
              <span className="text-xs font-mono text-text-secondary bg-surface-raised px-2.5 py-1 rounded-pill border border-border-subtle">
                Total: 100%
              </span>
            </div>

            {/* 3D Portfolio Tower Canvas */}
            <div className="w-full h-80 sm:h-96 relative">
              <Scene fov={38} starCount={300}>
                {recommendation && (
                  <PortfolioTower
                    allocation={recommendation.allocation}
                    coins={coins}
                    onSelectCoin={(coinId) => {
                      const c = coinMap.get(coinId);
                      if (c) setSelectedScorecardCoin(c);
                    }}
                  />
                )}
              </Scene>
              <div className="absolute bottom-2 right-2 pointer-events-none">
                <span className="text-[10px] text-text-muted font-mono bg-void/80 px-2 py-0.5 rounded border border-border-subtle">
                  Hover segment to inspect
                </span>
              </div>
            </div>

            {/* Allocation breakdown list below tower */}
            <div className="mt-6 pt-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recommendation?.allocation.map((item) => {
                const coin = coinMap.get(item.coinId);
                return (
                  <div
                    key={item.coinId}
                    onClick={() => coin && setSelectedScorecardCoin(coin)}
                    className="p-2.5 rounded-md bg-surface-raised/40 border border-border-subtle hover:border-accent/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-text-primary">{coin?.symbol || item.coinId}</span>
                      <span className="text-accent font-semibold">{item.percent}%</span>
                    </div>
                    <span className="text-[10px] text-text-muted capitalize block mt-0.5 truncate">
                      {coin?.category.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Matched Coin Cards with plain-language reasons */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-text-primary">
              Matched Assets & Explanations
            </h3>
            <span className="text-xs font-mono text-accent">
              {recommendation?.allocation.length || 0} Assets
            </span>
          </div>

          <div className="space-y-4">
            {recommendation?.allocation.map((item) => {
              const coin = coinMap.get(item.coinId);
              const match = matchMap.get(item.coinId);
              if (!coin) return null;

              return (
                <Card key={item.coinId} elevation="z1" className="p-4 relative group" tilt maxTilt={6}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-surface-raised border border-border-glow flex items-center justify-center font-mono font-bold text-xs text-text-primary">
                        {coin.symbol}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-text-primary leading-tight">{coin.name}</h4>
                        <span className="text-[10px] text-text-secondary capitalize">
                          {coin.category.replace('_', ' ')} • ${coin.price >= 1 ? coin.price.toLocaleString() : coin.price.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono font-bold text-accent">{item.percent}%</span>
                      {match && (
                        <span className="text-[10px] font-mono text-text-muted">
                          Match: {match.matchPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Plain Language Reasons from engine */}
                  <div className="mt-3 space-y-1.5 text-xs text-text-secondary">
                    {match?.reasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-accent shrink-0 font-bold">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Objective Warning */}
                  {match?.warnings && match.warnings.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-border-subtle/50 text-[11px] text-text-muted flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                      <span>{match.warnings[0]}</span>
                    </div>
                  )}

                  {/* Trigger 3D Scorecard Radar Modal */}
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedScorecardCoin(coin)}
                      className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Health Scorecard</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Section: Why These Picks, Entry Plan, Risks, Versions */}
      <div className="border-t border-border-subtle pt-8">
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-border-subtle pb-3">
          {[
            { id: 'why', label: 'Why These Picks (Engine Proof)' },
            { id: 'entry', label: 'Entry Plan (DCA Schedule)' },
            { id: 'risks', label: 'Risk Analysis & Stress Limits' },
            { id: 'versions', label: `Version History (${versions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-accent/20 text-accent border border-accent/40 shadow-[0_0_12px_rgba(143,184,214,0.25)]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Why These Picks */}
        {activeTab === 'why' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-text-secondary leading-relaxed">
            <Card elevation="z1" className="p-5 space-y-3" tilt={false}>
              <h4 className="font-display font-bold text-sm text-text-primary">
                Weighted Scoring Architecture
              </h4>
              <p>
                CryptoCompass utilizes pure deterministic multi-attribute scoring. No black-box machine learning models make unexplainable guesses with your capital.
              </p>
              <ul className="space-y-1.5 list-disc pl-4 text-text-primary">
                <li><strong className="text-accent">Liquidity:</strong> Absolute trading volume &amp; 24h market cap ratios guarantee exit flexibility.</li>
                <li><strong className="text-accent">Stability:</strong> Inverse 90-day annualized volatility and historical peak-to-trough drawdowns.</li>
                <li><strong className="text-accent">Network Size:</strong> Log-transformed market cap ensuring deep institutional backing.</li>
                <li><strong className="text-accent">Track Record:</strong> Operational age in years through major bear market cycles.</li>
              </ul>
            </Card>

            <Card elevation="z1" className="p-5 space-y-3" tilt={false}>
              <h4 className="font-display font-bold text-sm text-text-primary">
                Suitability Guarantee
              </h4>
              <p>
                All non-stablecoin assets are constrained to a maximum single holding limit (max 45% for Balanced Builders) to avoid single-asset catastrophe.
              </p>
              <div className="p-3 rounded-md bg-void/60 border border-border-subtle text-[11px]">
                <span className="font-bold text-gold block mb-1">Human Accountability:</span>
                Every recommendation must be audited by a human advisor before it is unlocked.
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Entry Plan */}
        {activeTab === 'entry' && (
          <Card elevation="z1" className="p-6 max-w-2xl text-xs space-y-4" tilt={false}>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <div>
                <h4 className="font-display font-bold text-sm text-text-primary">
                  Recommended Entry Method: {recommendation?.entryPlan.type === 'dca' ? 'Dollar-Cost Averaging (DCA)' : 'Lump Sum Entry'}
                </h4>
                <p className="text-text-secondary text-[11px]">
                  {recommendation?.entryPlan.type === 'dca'
                    ? 'Automated installment staging to reduce timing risk.'
                    : 'Direct one-time allocation for long-term hold.'}
                </p>
              </div>
            </div>

            {recommendation?.entryPlan.type === 'dca' && (
              <div className="p-4 rounded-md bg-void/70 border border-border-subtle space-y-2">
                <div className="flex justify-between border-b border-border-subtle/50 pb-2">
                  <span>Total Capital:</span>
                  <span className="font-mono font-bold text-text-primary">${profile?.amount.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle/50 pb-2">
                  <span>Installments:</span>
                  <span className="font-mono font-bold text-accent">4 Weekly Tranches</span>
                </div>
                <div className="flex justify-between">
                  <span>Tranche Amount:</span>
                  <span className="font-mono font-bold text-text-primary">${((profile?.amount || 10000) / 4).toLocaleString()} USD every 7 days</span>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Tab 3: Risks & Disclaimers */}
        {activeTab === 'risks' && (
          <Card elevation="z1" className="p-6 max-w-2xl text-xs space-y-3" tilt={false}>
            <div className="flex items-center gap-2 text-warning font-semibold">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span>Downside Stress Parameters</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Crypto assets carry structural volatility risks. In severe historical bear markets (such as 2018 and 2022), digital assets experienced peak drawdowns between 75% and 95%.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Never invest funds that are required for living expenses, debt obligations, or emergency cash reserves.
            </p>
            <Link href="/dashboard/simulator">
              <Button size="sm" variant="secondary" className="mt-2">
                Launch Historical Crash Simulator
              </Button>
            </Link>
          </Card>
        )}

        {/* Tab 4: Version History */}
        {activeTab === 'versions' && (
          <div className="space-y-3 max-w-2xl">
            {versions.map((ver) => (
              <Card key={ver.id} elevation="z1" className="p-4 flex items-center justify-between text-xs" tilt={false}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-raised border border-border-glow flex items-center justify-center font-mono font-bold text-accent">
                    v{ver.version}
                  </div>
                  <div>
                    <h5 className="font-semibold text-text-primary capitalize">
                      {ver.status.replace('_', ' ')} by {ver.updatedBy}
                    </h5>
                    <span className="text-[11px] text-text-muted">
                      {new Date(ver.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-pill">
                  {ver.allocation.length} Assets
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 3D Radar Health Scorecard Modal */}
      {selectedScorecardCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
          <Card elevation="z4" className="max-w-lg w-full glass-surface border-accent/40 p-6 relative" tilt={false}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-accent font-semibold tracking-wider">
                  Coin Health Scorecard
                </span>
                <h3 className="font-display text-lg font-bold text-text-primary">
                  {selectedScorecardCoin.name} ({selectedScorecardCoin.symbol})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScorecardCoin(null)}
                className="text-text-muted hover:text-text-primary p-1"
              >
                ✕
              </button>
            </div>

            {/* 3D Radar Scene */}
            <div className="h-64 w-full relative">
              <Scene fov={38} enableStars={false}>
                <RadarScorecard3D
                  scores={
                    matchMap.get(selectedScorecardCoin.id)?.scores || {
                      liquidity: 80,
                      stability: 75,
                      size: 90,
                      trackRecord: 85,
                      categoryFit: 90,
                    }
                  }
                  coinSymbol={selectedScorecardCoin.symbol}
                />
              </Scene>
            </div>

            <div className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-text-muted text-[10px] block">Market Cap:</span>
                <span className="text-text-primary font-semibold">
                  ${(selectedScorecardCoin.marketCap / 1e9).toFixed(1)}B
                </span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">90d Volatility:</span>
                <span className="text-text-primary font-semibold">
                  {(selectedScorecardCoin.volatility90d * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button size="sm" onClick={() => setSelectedScorecardCoin(null)}>
                Close Scorecard
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
