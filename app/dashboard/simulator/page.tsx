'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Fallback2D } from '@/components/three/Fallback2D';
import { useAppStore } from '@/lib/store/useAppStore';
import { runBacktest } from '@/lib/engine/backtest';
import { runStressTest, STRESS_SCENARIOS } from '@/lib/engine/stress';
import { BacktestResult, StressScenarioResult } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Sliders,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => <Fallback2D title="Loading 3D Crash Stage..." />,
});

const StressBars = dynamic(
  () => import('@/components/three/StressBars').then((m) => m.StressBars),
  { ssr: false }
);

export default function SimulatorPage() {
  const { recommendation, coins, profile } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Backtest State
  const [simAmount, setSimAmount] = useState<number>(profile?.amount || 10000);
  const [simWindow, setSimWindow] = useState<'1y' | '3y' | 'max'>('1y');
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);

  // Stress Test State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('crash_2022');
  const [stressResult, setStressResult] = useState<StressScenarioResult | null>(null);
  const [stressKey, setStressKey] = useState<number>(0); // re-triggers animation

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (recommendation && coins.length > 0) {
      const bRes = runBacktest(recommendation.allocation, coins, simAmount, simWindow);
      setBacktestResult(bRes);

      const sRes = runStressTest(recommendation.allocation, coins, selectedScenarioId, simAmount, 'USD');
      setStressResult(sRes);
    }
  }, [recommendation, coins, simAmount, simWindow, selectedScenarioId]);

  const handleRunStressAnimation = () => {
    setStressKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-[92vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      {/* Top Disclaimer Banner */}
      <DisclaimerBanner compact className="mb-6" />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Sliders className="w-4 h-4" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Portfolio Simulator &amp; Crash Stress Test
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Simulate historical portfolio performance across cycle windows and stress-test worst-case drawdowns.
        </p>
      </div>

      {/* SECTION 1: Historical Simulator (Backtest) */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span>Historical Backtest Simulation</span>
          </h2>
          <span className="text-xs font-mono text-text-muted">
            Lump-Sum • Fixed Target Weights
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Controls Left (4 cols) */}
          <Card elevation="z2" className="lg:col-span-4 p-6 glass-surface flex flex-col justify-between" tilt={false}>
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wider">
                Simulation Parameters
              </h3>

              <Slider
                min={1000}
                max={50000}
                step={1000}
                value={simAmount}
                onChange={setSimAmount}
                label="Simulated Capital (USD)"
                formatValue={(val) => `$${val.toLocaleString()} USD`}
              />

              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                  Historical Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1y', '3y', 'max'] as const).map((win) => (
                    <button
                      key={win}
                      type="button"
                      onClick={() => setSimWindow(win)}
                      className={`py-2 rounded-md border text-xs font-mono font-bold uppercase transition-all ${
                        simWindow === win
                          ? 'border-accent bg-accent/20 text-accent shadow-[0_0_10px_rgba(143,184,214,0.3)]'
                          : 'border-border-subtle bg-surface-raised/40 text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {win === 'max' ? '4 Years (Max)' : win}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Backtest KPI stats */}
            {backtestResult && (
              <div className="pt-6 border-t border-border-subtle grid grid-cols-2 gap-3 font-mono text-xs mt-6">
                <div className="p-2.5 rounded bg-void/60 border border-border-subtle">
                  <span className="text-[10px] text-text-muted uppercase block">Total Return</span>
                  <span className={`text-base font-bold ${backtestResult.totalReturnPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                    {backtestResult.totalReturnPercent >= 0 ? '+' : ''}{backtestResult.totalReturnPercent}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-void/60 border border-border-subtle">
                  <span className="text-[10px] text-text-muted uppercase block">Max Drawdown</span>
                  <span className="text-base font-bold text-danger">
                    -{backtestResult.maxDrawdownPercent}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-void/60 border border-border-subtle">
                  <span className="text-[10px] text-text-muted uppercase block">Best Month</span>
                  <span className="text-xs font-bold text-success">
                    +{backtestResult.bestMonthPercent}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-void/60 border border-border-subtle">
                  <span className="text-[10px] text-text-muted uppercase block">Worst Month</span>
                  <span className="text-xs font-bold text-danger">
                    {backtestResult.worstMonthPercent}%
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Interactive Chart Right (8 cols) */}
          <Card elevation="z2" className="lg:col-span-8 p-6 glass-surface flex flex-col justify-between" tilt={false}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-accent font-semibold tracking-wider">
                  Portfolio Value Curve
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-mono font-bold text-text-primary">
                    ${backtestResult?.endValue.toLocaleString()} USD
                  </span>
                  <span className={`text-xs font-mono font-semibold ${
                    (backtestResult?.totalReturnPercent || 0) >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {(backtestResult?.totalReturnPercent || 0) >= 0 ? '+' : ''}
                    {backtestResult?.totalReturnPercent}% vs start (${simAmount.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            {/* Recharts 2D/3D Line Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              {mounted && backtestResult ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={backtestResult.timeseries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" stroke="#9AA7C7" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#9AA7C7"
                      fontSize={11}
                      tickLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#14171E',
                        borderColor: 'rgba(143,184,214,0.35)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#F0F4F8',
                      }}
                      formatter={(val: number) => [`$${val.toLocaleString()} USD`, 'Portfolio Value']}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8FB8D6"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#8FB8D6', stroke: '#08090C', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                </div>
              )}
            </div>

            {/* Disclaimer pill */}
            <div className="mt-4 pt-3 border-t border-border-subtle/50 text-[11px] text-text-muted italic flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Past performance does not predict future results. Crypto market cycles are volatile.</span>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 2: 3D Crash Stress Test */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>Worst-Case Crash Stress Test</span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              See how your advisor-approved allocation withstands historical industry liquidations.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleRunStressAnimation}
            icon={<Play className="w-3.5 h-3.5 text-void fill-current" />}
          >
            Replay Drop Animation
          </Button>
        </div>

        {/* Scenario Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {STRESS_SCENARIOS.map((scen) => (
            <Card
              key={scen.id}
              elevation={selectedScenarioId === scen.id ? 'z3' : 'z1'}
              onClick={() => setSelectedScenarioId(scen.id)}
              className={`p-4 cursor-pointer transition-all border ${
                selectedScenarioId === scen.id
                  ? 'border-danger bg-danger/10 shadow-[0_0_15px_rgba(255,92,122,0.3)]'
                  : 'hover:border-border-glow'
              }`}
              tilt={false}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-text-primary">{scen.name}</span>
                <span className="text-[10px] font-mono text-danger font-semibold">
                  {scen.historicalPeriod}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">{scen.description}</p>
            </Card>
          ))}
        </div>

        {/* 3D Stress Bars Stage & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 3D Scene Viewport (8 cols) */}
          <div className="lg:col-span-8 rounded-xl glass-surface border border-danger/30 h-80 sm:h-96 relative overflow-hidden shadow-z3">
            <Scene key={stressKey} fov={42} starCount={300}>
              {stressResult && <StressBars result={stressResult} />}
            </Scene>
            <div className="absolute top-3 left-3 pointer-events-none">
              <span className="text-[10px] font-mono text-danger px-2.5 py-1 rounded-pill glass-surface border border-danger/40 uppercase">
                Peak-to-Trough Drawdown
              </span>
            </div>
          </div>

          {/* Breakdown Stats Right (4 cols) */}
          <Card elevation="z2" className="lg:col-span-4 p-6 glass-surface flex flex-col justify-between" tilt={false}>
            {stressResult && (
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase text-danger font-bold tracking-wider">
                  Crash Exposure Summary
                </span>

                <div className="p-4 rounded-lg bg-danger/10 border border-danger/40 text-center">
                  <span className="text-[11px] text-text-muted uppercase block font-mono">
                    Estimated Max Portfolio Drawdown
                  </span>
                  <span className="text-3xl font-mono font-bold text-danger block my-1">
                    -{stressResult.portfolioDrawdownPercent}%
                  </span>
                  <span className="text-xs font-mono text-text-primary">
                    Loss of ~${stressResult.portfolioLossAmount.toLocaleString()} USD
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                    Per-Coin Resilience
                  </span>
                  {stressResult.perCoinContribution.map((item) => (
                    <div
                      key={item.coinId}
                      className="flex items-center justify-between text-xs p-2 rounded bg-surface-raised/40 border border-border-subtle font-mono"
                    >
                      <span className="font-semibold text-text-primary">{item.symbol}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted">{item.allocationPercent}% wt</span>
                        <span className="text-danger font-bold">-{item.drawdownPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border-subtle text-[11px] text-text-muted">
              Stablecoin allocations absorb shocks, preventing 100% exposure to drawdown peaks.
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
