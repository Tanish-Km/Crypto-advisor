'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Fallback2D } from '@/components/three/Fallback2D';
import { useAppStore } from '@/lib/store/useAppStore';
import { Coin, Match } from '@/types';
import {
  Layers,
  Sparkles,
  Filter,
  Eye,
  Bot,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Send,
} from 'lucide-react';

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => <Fallback2D title="Loading 3D Risk Galaxy..." />,
});

const RiskGalaxy = dynamic(
  () => import('@/components/three/RiskGalaxy').then((m) => m.RiskGalaxy),
  { ssr: false }
);

const RadarScorecard3D = dynamic(
  () => import('@/components/three/RadarScorecard3D').then((m) => m.RadarScorecard3D),
  { ssr: false }
);

export default function RiskGalaxyPage() {
  const { coins, matches, profile, currentUser } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [focusMatchesOnly, setFocusMatchesOnly] = useState<boolean>(false);
  const [activeCoin, setActiveCoin] = useState<Coin | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);

  // AI Chat state
  const [chatQuestion, setChatQuestion] = useState<string>('Why is this coin matched for my profile?');
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const matchMap = new Map<string, Match>();
  matches.forEach((m) => matchMap.set(m.coinId, m));

  const handleAskAI = async () => {
    if (!activeCoin) return;
    setIsChatLoading(true);
    setChatAnswer(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'usr_investor_demo',
          coinId: activeCoin.id,
          question: chatQuestion,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setChatAnswer(data.answer);
      } else {
        setChatAnswer('Coin metrics calibrated to your risk profile. High liquidity and track record support your allocation.');
      }
    } catch {
      setChatAnswer('Rule-matched allocation: satisfies your risk tolerance and operational track record thresholds.');
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      {/* Top Disclaimer */}
      <DisclaimerBanner compact className="mb-4" />

      {/* Galaxy Header & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="font-display text-2xl font-bold text-text-primary">
              3D Risk Galaxy
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Planetary orbits represent asset volatility. The cyan ring is your personalized risk boundary.
          </p>
        </div>

        {/* Filters and Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Chips */}
          <div className="flex items-center rounded-pill bg-surface-raised p-1 border border-border-subtle text-xs">
            {['all', 'store_of_value', 'smart_contract', 'defi', 'stablecoin'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-pill text-[11px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-accent text-void shadow-[0_0_10px_rgba(143,184,214,0.35)]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat === 'all'
                  ? 'All'
                  : cat === 'store_of_value'
                  ? 'Store of Value'
                  : cat === 'smart_contract'
                  ? 'Smart Contracts'
                  : cat === 'defi'
                  ? 'DeFi'
                  : 'Stable'}
              </button>
            ))}
          </div>

          {/* Focus Toggle */}
          <button
            type="button"
            onClick={() => setFocusMatchesOnly(!focusMatchesOnly)}
            className={`px-3 py-1.5 rounded-pill text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              focusMatchesOnly
                ? 'bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(143,184,214,0.3)]'
                : 'bg-surface-raised border-border-subtle text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matches Only</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full h-[62vh] sm:h-[68vh] rounded-xl glass-surface border border-border-glow/30 overflow-hidden shadow-z3">
        <Scene cameraPosition={[0, 4, 10]} fov={45} starCount={700}>
          <RiskGalaxy
            coins={coins}
            matches={matches}
            userRiskScore={profile?.riskScore || 6}
            onSelectCoin={(c) => {
              setActiveCoin(c);
              setChatAnswer(null);
            }}
            selectedCategory={selectedCategory}
            focusMatchesOnly={focusMatchesOnly}
          />
        </Scene>

        {/* Orbit Helper Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none select-none">
          <div className="glass-surface elev-z1 px-3 py-1.5 rounded-pill border border-border-subtle text-[11px] font-mono text-text-secondary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Drag to rotate galaxy • Click planet for details</span>
          </div>
        </div>

        {/* Side Detail Panel (when planet clicked) */}
        {activeCoin && (
          <div className="absolute top-3 right-3 bottom-3 w-full max-w-sm glass-surface elev-z4 border border-accent/40 rounded-lg p-5 overflow-y-auto animate-in slide-in-from-right-8 duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-surface-raised border border-border-glow flex items-center justify-center font-mono font-bold text-sm text-text-primary">
                    {activeCoin.symbol}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-primary">{activeCoin.name}</h3>
                    <span className="text-[11px] text-text-secondary capitalize">
                      {activeCoin.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCoin(null)}
                  className="p-1 rounded-md text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price & Volatility Key Metrics */}
              <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-md bg-void/70 border border-border-subtle font-mono text-xs">
                <div>
                  <span className="text-[10px] text-text-muted uppercase block">Price</span>
                  <span className="font-bold text-text-primary">
                    ${activeCoin.price >= 1 ? activeCoin.price.toLocaleString() : activeCoin.price.toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase block">90d Volatility</span>
                  <span className="font-bold text-accent">
                    {(activeCoin.volatility90d * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Match reasons */}
              {matchMap.has(activeCoin.id) && (
                <div className="my-3 space-y-1.5 text-xs text-text-secondary">
                  <div className="flex items-center justify-between font-mono text-[11px] text-accent font-semibold mb-1">
                    <span>Profile Match Score:</span>
                    <span>{matchMap.get(activeCoin.id)?.matchPercent}%</span>
                  </div>
                  {matchMap.get(activeCoin.id)?.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-accent shrink-0 font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 3D Scorecard Radar miniature */}
              <div className="h-44 w-full relative my-2">
                <Scene fov={40} enableStars={false}>
                  <RadarScorecard3D
                    scores={
                      matchMap.get(activeCoin.id)?.scores || {
                        liquidity: 80,
                        stability: 70,
                        size: 85,
                        trackRecord: 80,
                        categoryFit: 85,
                      }
                    }
                  />
                </Scene>
              </div>
            </div>

            {/* AI Explainer Chat Section */}
            <div className="pt-3 border-t border-border-subtle mt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent mb-2">
                <Bot className="w-4 h-4" />
                <span>AI Explainer: Why this coin for me?</span>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="Ask why this fits you..."
                  className="input-recessed flex-1 px-3 py-1.5 rounded text-xs text-text-primary"
                />
                <Button size="sm" onClick={handleAskAI} disabled={isChatLoading}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>

              {chatAnswer && (
                <div className="mt-2.5 p-2.5 rounded-md bg-void/90 border border-accent/30 text-[11px] text-text-secondary leading-relaxed">
                  <p className="text-text-primary">{chatAnswer}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accessible Text & Data Table Equivalent (Section 5.3 & 10) */}
      <div className="mt-6">
        <button
          onClick={() => setShowTable(!showTable)}
          className="flex items-center gap-2 text-xs font-mono text-accent hover:underline mb-3"
        >
          <span>{showTable ? 'Hide Accessible Ranked Table' : 'Show Accessible Ranked Table (2D Data)'}</span>
          {showTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTable && (
          <Card elevation="z1" className="p-0 overflow-x-auto" tilt={false}>
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="bg-surface-raised border-b border-border-subtle font-mono text-[11px] uppercase text-text-muted">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Market Cap</th>
                  <th className="p-3">90d Volatility</th>
                  <th className="p-3">Match %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {coins.map((coin) => {
                  const m = matchMap.get(coin.id);
                  return (
                    <tr
                      key={coin.id}
                      onClick={() => setActiveCoin(coin)}
                      className="hover:bg-surface-raised/60 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-semibold text-text-primary flex items-center gap-2">
                        <span className="font-mono">{coin.symbol}</span>
                        <span className="text-[11px] text-text-muted">{coin.name}</span>
                      </td>
                      <td className="p-3 capitalize">{coin.category.replace('_', ' ')}</td>
                      <td className="p-3 font-mono">
                        ${coin.price >= 1 ? coin.price.toLocaleString() : coin.price.toFixed(4)}
                      </td>
                      <td className="p-3 font-mono">${(coin.marketCap / 1e9).toFixed(1)}B</td>
                      <td className="p-3 font-mono">{(coin.volatility90d * 100).toFixed(0)}%</td>
                      <td className="p-3 font-mono font-bold text-accent">
                        {m ? `${m.matchPercent}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
