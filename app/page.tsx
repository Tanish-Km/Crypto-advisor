'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Fallback2D } from '@/components/three/Fallback2D';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Compass,
  ShieldCheck,
  Sparkles,
  Layers,
  Sliders,
  Cpu,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Package,
  CheckCircle,
  Lock,
  TrendingUp,
  BarChart3,
  Check,
  FileText,
  AlertTriangle,
} from 'lucide-react';

// Dynamic import of 3D Scene with SSR false per Plan.md Section 11 & Design.md Section 11.3
const Scene = dynamic(() => import('@/components/three/Scene').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => <Fallback2D title="Loading 3D Cosmos..." subtitle="Generating procedural planets & lighting." />,
});

const LandingHeroScene = dynamic(
  () => import('@/components/three/LandingHeroScene').then((mod) => mod.LandingHeroScene),
  { ssr: false }
);

export default function LandingPage() {
  const { loginAsDemoInvestor, loginAsDemoAdvisor } = useAppStore();
  const [activeSectionTab, setActiveSectionTab] = useState<'all' | 'pillars' | 'frameworks' | 'architecture' | 'assets' | 'deliverables' | 'governance'>('all');

  // Video Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If unmuted playback was rejected, retry muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pt-6 pb-16">
        {/* 3D WebGL Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Scene starCount={700} fov={42}>
            <LandingHeroScene />
          </Scene>
        </div>

        {/* Ambient Hero Video Feathered Background Overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-35 mix-blend-screen">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover hero-video-mask filter saturate-150"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Foreground Content Grid */}
        <div className="relative z-10 w-full py-6">
          {/* Top Hero Row: Left Text & CTAs | Right Featured Working Video Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            {/* Left Column: Heading & Introduction */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill glass-surface elev-z1 border border-accent/40 text-xs font-mono text-accent mb-4 shadow-[0_0_15px_rgba(143,184,214,0.3)]">
                <Compass className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '15s' }} />
                <span>Risk-Matched Portfolios • Explainable Guidance • Certified Advisor in the Loop</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.08] mb-4">
                Explainable Crypto Guidance{' '}
                <span className="bg-gradient-to-r from-accent via-accent-2 to-gold bg-clip-text text-transparent">
                  For Beginners
                </span>
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                A 3D risk-matched guidance platform blending deterministic asset scoring with certified human advisor verification. Discover your risk persona, explore your 3D Risk Galaxy, and invest with institutional confidence.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                <Link href="/onboarding">
                  <Button size="lg" icon={<Sparkles className="w-5 h-5 text-void" />}>
                    Launch Interactive Experience
                  </Button>
                </Link>

                <Link href="/advisor">
                  <Button variant="secondary" size="lg" icon={<ShieldCheck className="w-5 h-5 text-gold" />}>
                    Advisor Room
                  </Button>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loginAsDemoInvestor}
                    className="px-3 py-1.5 rounded-md bg-accent/15 border border-accent/40 text-accent text-xs font-semibold hover:bg-accent/25 transition-all"
                  >
                    Investor Demo
                  </button>
                  <button
                    onClick={loginAsDemoAdvisor}
                    className="px-3 py-1.5 rounded-md bg-gold/15 border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/25 transition-all"
                  >
                    Advisor Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Working Video Player Card */}
            <div className="lg:col-span-5 flex justify-end">
              <Card elevation="z3" className="w-full max-w-md p-3 glass-surface border-accent/40 shadow-z3 relative overflow-hidden" tilt maxTilt={6}>
                {/* Video Container */}
                <div className="relative rounded-lg overflow-hidden bg-void/90 aspect-video border border-border-subtle group">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4" type="video/mp4" />
                  </video>

                  {/* Top Badge Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none select-none">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-void/80 border border-accent/40 text-accent font-semibold flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                      3D RISK COSMOS &amp; ENGINE
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-void/80 border border-gold/40 text-gold font-semibold backdrop-blur-md">
                      LIVE SIMULATION • 24 FPS
                    </span>
                  </div>

                  {/* Bottom Interactive Controls Bar */}
                  <div className="absolute bottom-2 inset-x-2 p-1.5 rounded-md bg-void/85 border border-border-subtle/80 backdrop-blur-md flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="p-1 rounded text-text-primary hover:text-accent hover:bg-surface-raised transition-colors"
                        title={isPlaying ? 'Pause Reel' : 'Play Reel'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-1 rounded text-text-primary hover:text-accent hover:bg-surface-raised transition-colors"
                        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-text-muted" /> : <Volume2 className="w-3.5 h-3.5 text-accent" />}
                      </button>

                      <span className="text-[10px] font-mono text-text-secondary pl-1">
                        Multi-Metric Risk Orbit
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-accent-2 font-semibold px-1.5 py-0.5 rounded bg-accent-2/15">
                      DETERMINISTIC • CFA AUDITED
                    </span>
                  </div>
                </div>

                {/* Technical Specification Footnote */}
                <div className="mt-2.5 px-1 flex items-center justify-between text-[11px] font-mono text-text-secondary">
                  <span>Spatial Volatility Engine</span>
                  <span className="text-accent font-semibold">Deterministic 3D Feed</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Interactive Filter Pills for Hero Specifications */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { id: 'all', label: 'All Frameworks' },
              { id: 'pillars', label: 'Advisory Pillars' },
              { id: 'frameworks', label: 'Risk Safeguards' },
              { id: 'architecture', label: 'Scoring Engine' },
              { id: 'assets', label: 'Curated Assets' },
              { id: 'deliverables', label: 'Client Deliverables' },
              { id: 'governance', label: 'Safety & Governance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSectionTab(tab.id as typeof activeSectionTab)}
                className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                  activeSectionTab === tab.id
                    ? 'bg-accent text-void font-bold shadow-[0_0_12px_rgba(143,184,214,0.4)]'
                    : 'glass-surface border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Detailed Hero Specifications Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-events-auto">
            {/* 1. Core Advisory Pillars */}
            {(activeSectionTab === 'all' || activeSectionTab === 'pillars') && (
              <Card elevation="z2" className="p-6 glass-surface border-accent/30" tilt maxTilt={6}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-accent/20 text-accent">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-text-primary">
                        Core Advisory Pillars
                      </h3>
                      <span className="text-[10px] font-mono text-accent">Institutional Dual-Engine</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-accent/15 border border-accent/40 text-accent font-semibold">
                    DUAL ENGINE
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-text-secondary leading-relaxed">
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/40">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-text-primary font-mono text-[11px] text-accent">
                        Risk-Matched Portfolios
                      </strong>
                      <span className="text-[10px] font-mono text-text-muted">Scale 1–10</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      Algorithmic suitability scoring mapped directly to Cautious Saver, Balanced Builder, or Growth Seeker personas.
                    </p>
                  </li>
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/40">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-text-primary font-mono text-[11px] text-accent">
                        Multi-Attribute Scoring
                      </strong>
                      <span className="text-[10px] font-mono text-text-muted">5 Dimensions</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      Deterministic normalization across liquidity, stability, network scale, track record, and utility.
                    </p>
                  </li>
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/40">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-text-primary font-mono text-[11px] text-accent">
                        Human Advisor Audit
                      </strong>
                      <span className="text-[10px] font-mono text-gold">CFA In Loop</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      Every automated portfolio is reviewed, signed, and stamped by a certified CFA professional before activation.
                    </p>
                  </li>
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/40">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-text-primary font-mono text-[11px] text-accent">
                        Crash Stress Testing
                      </strong>
                      <span className="text-[10px] font-mono text-warning">-84% Winter</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      Simulated historical drawdown modeling against 2018 winter, 2022 crashes, and custom market shocks.
                    </p>
                  </li>
                </ul>
              </Card>
            )}

            {/* 2. Risk & Guidance Frameworks */}
            {(activeSectionTab === 'all' || activeSectionTab === 'frameworks') && (
              <Card elevation="z2" className="p-6 glass-surface border-accent-2/30" tilt maxTilt={6}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-accent-2/20 text-accent-2">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-text-primary">
                        Risk Safeguards &amp; Personas
                      </h3>
                      <span className="text-[10px] font-mono text-accent-2">Capital Protection</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-accent-2/15 border border-accent-2/40 text-accent-2 font-semibold">
                    SAFEGUARDS
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-text-secondary leading-relaxed">
                  <div>
                    <h4 className="font-semibold text-text-primary text-[11px] uppercase tracking-wider mb-1.5 font-mono text-accent-2">
                      Fundamental Safeguards
                    </h4>
                    <ul className="space-y-1.5 text-[11px]">
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span><strong>100% Mathematical Constraint:</strong> Zero unallocated cash drift or speculative leverage.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span><strong>Compulsory Stablecoin Buffer:</strong> 40%–70% cash buffer (USDC) for conservative risk profiles.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span><strong>Automated DCA Schedules:</strong> Staggered tranche deployment for amounts over $5,000.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span><strong>Downside Volatility Triggers:</strong> Transparent rebalance alerts if market swings exceed 15%.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border-subtle/50">
                    <h4 className="font-semibold text-text-primary text-[11px] uppercase tracking-wider mb-1.5 font-mono text-accent-2">
                      Investor Personas
                    </h4>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-1.5 rounded bg-surface-raised/40 border border-border-subtle/30 flex items-center justify-between">
                        <span className="font-semibold text-text-primary">Cautious Saver (1–3)</span>
                        <span className="font-mono text-[10px] text-accent">60% USDC • 30% BTC • 10% ETH</span>
                      </div>
                      <div className="p-1.5 rounded bg-surface-raised/40 border border-border-subtle/30 flex items-center justify-between">
                        <span className="font-semibold text-text-primary">Balanced Builder (4–7)</span>
                        <span className="font-mono text-[10px] text-accent-2">40% BTC • 30% ETH • 20% SOL • 10% Cash</span>
                      </div>
                      <div className="p-1.5 rounded bg-surface-raised/40 border border-border-subtle/30 flex items-center justify-between">
                        <span className="font-semibold text-text-primary">Growth Seeker (8–10)</span>
                        <span className="font-mono text-[10px] text-gold">35% ETH • 25% SOL • 25% AVAX • 15% BTC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 3. Scoring Engine Architecture */}
            {(activeSectionTab === 'all' || activeSectionTab === 'architecture') && (
              <Card elevation="z2" className="p-6 glass-surface border-gold/30" tilt maxTilt={6}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-gold/20 text-gold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-text-primary">
                        Scoring Architecture
                      </h3>
                      <span className="text-[10px] font-mono text-gold">5 Normalized Metrics</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-gold/15 border border-gold/40 text-gold font-semibold">
                    ALGORITHM
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-text-secondary leading-relaxed">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-text-primary">Volatility &amp; Downside Stability</span>
                      <span className="text-gold font-bold">25%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-void/60 overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-text-primary">Network Scale &amp; Active Wallets</span>
                      <span className="text-gold font-bold">25%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-void/60 overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-text-primary">Market Liquidity &amp; Order Depth</span>
                      <span className="text-accent font-bold">20%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-void/60 overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-text-primary">Historical Longevity &amp; Uptime</span>
                      <span className="text-accent font-bold">15%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-void/60 overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-text-primary">Ecosystem Diversification</span>
                      <span className="text-accent-2 font-bold">15%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-void/60 overflow-hidden">
                      <div className="h-full bg-accent-2 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-[10px] font-mono text-text-muted">
                    <span>3D WebGL Galaxy</span>
                    <span>Live CoinGecko Sync</span>
                    <span className="text-gold">Deterministic</span>
                  </div>
                </div>
              </Card>
            )}

            {/* 4. Curated Asset Universe */}
            {(activeSectionTab === 'all' || activeSectionTab === 'assets') && (
              <Card elevation="z2" className="p-6 glass-surface border-accent/30" tilt maxTilt={6}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-accent/20 text-accent">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-text-primary">
                        Curated Asset Universe
                      </h3>
                      <span className="text-[10px] font-mono text-accent">Blue-Chip Tiers</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-accent/15 border border-accent/40 text-accent font-semibold">
                    CURATED
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/30">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-text-primary text-[11px]">Store of Value (Layer 1)</strong>
                      <span className="font-mono text-[10px] text-gold font-bold">BTC</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Digital gold reserve asset, highest institutional liquidity, apex network security.</p>
                  </li>
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/30">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-text-primary text-[11px]">Smart Contracts</strong>
                      <span className="font-mono text-[10px] text-accent font-bold">ETH • SOL • AVAX</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Decentralized compute networks, staking yield, and high-throughput application layers.</p>
                  </li>
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/30">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-text-primary text-[11px]">Liquid Cash Reserves</strong>
                      <span className="font-mono text-[10px] text-success font-bold">USDC • USDT</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Fully backed dollar reserves providing capital preservation and defensive buffers.</p>
                  </li>
                  <li className="p-2 rounded bg-surface-raised/40 border border-border-subtle/30">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-text-primary text-[11px]">DeFi &amp; Oracle Utility</strong>
                      <span className="font-mono text-[10px] text-accent-2 font-bold">LINK • UNI</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Cross-chain data oracle infrastructure and automated decentralized liquidity protocols.</p>
                  </li>
                </ul>
              </Card>
            )}

            {/* 5. Client Advisory Deliverables */}
            {(activeSectionTab === 'all' || activeSectionTab === 'deliverables') && (
              <Card elevation="z2" className="p-6 glass-surface border-success/30" tilt maxTilt={6}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-success/20 text-success">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-text-primary">
                        Client Deliverables
                      </h3>
                      <span className="text-[10px] font-mono text-success">Complete Dossier</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-success/15 border border-success/40 text-success font-semibold">
                    DELIVERABLES
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary block font-mono text-[11px] text-success">
                        Personalized Risk Dossier
                      </strong>
                      <span className="text-[11px]">Full suitability breakdown with 1–10 score and investor persona badge.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary block font-mono text-[11px] text-success">
                        Suitability-Verified Portfolio
                      </strong>
                      <span className="text-[11px]">Balanced allocation totaling exactly 100% with certified advisor digital seal.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary block font-mono text-[11px] text-success">
                        Plain-Language Explanations
                      </strong>
                      <span className="text-[11px]">2 to 4 transparent rationale bullets and objective risk factors per asset.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary block font-mono text-[11px] text-success">
                        Downside Stress Simulation
                      </strong>
                      <span className="text-[11px]">Simulated drawdown metrics modeling worst-case market contractions.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary block font-mono text-[11px] text-success">
                        DCA Capital Entry Roadmap
                      </strong>
                      <span className="text-[11px]">Staggered multi-week tranche schedule to eliminate emotional market-timing.</span>
                    </div>
                  </li>
                </ul>
              </Card>
            )}

            {/* 6. Best Practices & Safety Governance */}
            {(activeSectionTab === 'all' || activeSectionTab === 'governance') && (
              <Card elevation="z2" className="p-6 glass-surface border-warning/30" tilt maxTilt={6}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-warning/20 text-warning">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-text-primary">
                        Safety &amp; Governance
                      </h3>
                      <span className="text-[10px] font-mono text-warning">Fiduciary Standards</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-warning/15 border border-warning/40 text-warning font-semibold">
                    FIDUCIARY
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <span><strong>Human in the Loop:</strong> Certified advisor audit and dual sign-off before publishing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <span><strong>No Price Speculation:</strong> Strictly zero price targets, guaranteed returns, or pump claims.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <span><strong>Cold Storage Education:</strong> Complete self-custody and hardware wallet setup guides.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <span><strong>Mathematical Integrity:</strong> 100% allocation constraint with no unallocated cash slippage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <span><strong>Complete Audit Trail:</strong> Immutable versioned changelog of every recommendation update.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <span><strong>Educational Compliance:</strong> Prominent risk disclosures reinforcing education over trading.</span>
                  </li>
                </ul>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Trust Strip below Hero */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card elevation="z1" className="p-6">
            <div className="w-12 h-12 rounded-lg bg-accent/15 border border-accent/40 flex items-center justify-center text-accent mb-4">
              <Cpu className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-bold text-lg text-text-primary mb-2">
              Matched to Your Risk
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              No black-box algorithms. Pure, mathematical scoring across 5 key dimensions: liquidity, stability, network size, track record, and category preferences.
            </p>
          </Card>

          <Card elevation="z1" className="p-6">
            <div className="w-12 h-12 rounded-lg bg-accent-2/15 border border-accent-2/40 flex items-center justify-center text-accent-2 mb-4">
              <Sparkles className="w-6 h-6 text-accent-2" />
            </div>
            <h3 className="font-display font-bold text-lg text-text-primary mb-2">
              Explained in Plain Words
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every coin includes 2-4 transparent reasons why it fits you, objective risk statements, and plain-language learn cards with zero crypto jargon.
            </p>
          </Card>

          <Card elevation="z1" className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mb-4">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display font-bold text-lg text-text-primary mb-2">
              Verified by a Human Advisor
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              A certified advisor reviews the engine recommendations, audits allocation weightings, writes custom rationales, and provides personalized Q&amp;A guidance.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Floating Station Journey */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
            The Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mt-2">
            How CryptoCompass Works
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-3">
            Travel through our interactive cosmos from personal profile to certified portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: '3D Onboarding',
              desc: 'Answer intuitive questions on your goals, horizon, budget, and loss reactions.',
              icon: <Compass className="w-5 h-5 text-accent" />,
            },
            {
              step: '02',
              title: 'Risk Persona Reveal',
              desc: 'Discover if you are a Cautious Saver, Balanced Builder, or Growth Seeker.',
              icon: <Layers className="w-5 h-5 text-accent-2" />,
            },
            {
              step: '03',
              title: '3D Risk Galaxy',
              desc: 'Explore your matched coins glowing in your custom risk orbit, with health scorecards.',
              icon: <Sliders className="w-5 h-5 text-accent" />,
            },
            {
              step: '04',
              title: 'Advisor Approval',
              desc: 'A human professional reviews, edits, and stamps the recommendation before publishing.',
              icon: <ShieldCheck className="w-5 h-5 text-gold" />,
            },
          ].map((item) => (
            <Card key={item.step} elevation="z2" className="p-6 relative group">
              <span className="font-mono text-3xl font-extrabold text-border-subtle group-hover:text-accent/30 transition-colors">
                {item.step}
              </span>
              <div className="my-3">{item.icon}</div>
              <h4 className="font-display font-bold text-base text-text-primary mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Compliance Disclaimer Banner */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto pb-12">
        <DisclaimerBanner compact={false} className="mb-8" />
      </section>
    </div>
  );
}
