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
  ArrowRight,
  TrendingUp,
  Layers,
  Sliders,
  CheckCircle2,
  Lock,
  Cpu,
  UserCheck,
  Film,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wrench,
  Package,
  CheckCircle,
  FileVideo,
  Monitor,
  FolderArchive,
  Palette,
  Workflow,
  Share2,
  Maximize2,
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
  const [activeSectionTab, setActiveSectionTab] = useState<'all' | 'competencies' | 'techniques' | 'software' | 'deliverables' | 'practices'>('all');

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
                <Film className="w-3.5 h-3.5 text-accent animate-pulse" />
                <span>Motion Graphics &amp; Animated Visual Content • 3D Platforms</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.08] mb-4">
                Motion Graphics{' '}
                <span className="bg-gradient-to-r from-accent via-accent-2 to-gold bg-clip-text text-transparent">
                  Designer
                </span>
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                Expertise in creating animated visual content for video, broadcast, and digital platforms.
                You blend design principles with animation techniques.
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
                      MOTION GRAPHICS REEL
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-void/80 border border-gold/40 text-gold font-semibold backdrop-blur-md">
                      1080P • 24 FPS
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
                        Kinetic Halftone Crystal
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-accent-2 font-semibold px-1.5 py-0.5 rounded bg-accent-2/15">
                      PRORES • LOTTIE
                    </span>
                  </div>
                </div>

                {/* Technical Specification Footnote */}
                <div className="mt-2.5 px-1 flex items-center justify-between text-[11px] font-mono text-text-secondary">
                  <span>Particle Grid Animation</span>
                  <span className="text-accent font-semibold">12.0s Seamless Loop</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Interactive Filter Pills for Hero Specifications */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { id: 'all', label: 'All Specifications' },
              { id: 'competencies', label: 'Core Competencies' },
              { id: 'techniques', label: 'Animation Techniques' },
              { id: 'software', label: 'Software Proficiency' },
              { id: 'deliverables', label: 'Projects & Deliverables' },
              { id: 'practices', label: 'Best Practices' },
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
            {/* 1. Core Competencies */}
            {(activeSectionTab === 'all' || activeSectionTab === 'competencies') && (
              <Card elevation="z2" className="p-6 glass-surface border-accent/30" tilt maxTilt={6}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-accent/20 text-accent">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    Core Competencies
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-text-secondary leading-relaxed">
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-accent">
                      Animation Principles
                    </strong>
                    Timing, easing, anticipation, follow-through.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-accent">
                      Visual Design
                    </strong>
                    Typography, color theory, composition.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-accent">
                      Technical Execution
                    </strong>
                    Software proficiency and workflow optimization.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-accent">
                      Storytelling
                    </strong>
                    Communicating messages through motion.
                  </li>
                </ul>
              </Card>
            )}

            {/* 2. Animation Techniques: Fundamental Principles & Styles */}
            {(activeSectionTab === 'all' || activeSectionTab === 'techniques') && (
              <Card elevation="z2" className="p-6 glass-surface border-accent-2/30" tilt maxTilt={6}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-accent-2/20 text-accent-2">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    Animation Techniques
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
                  <div>
                    <h4 className="font-semibold text-text-primary text-[11px] uppercase tracking-wider mb-1.5 font-mono text-accent-2">
                      Fundamental Principles
                    </h4>
                    <ul className="space-y-1 list-disc pl-4 text-[12px]">
                      <li>Squash and stretch for organic movement</li>
                      <li>Anticipation and follow-through</li>
                      <li>Ease in/out for natural motion</li>
                      <li>Secondary action for depth</li>
                      <li>Staging for clarity</li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border-subtle/50">
                    <h4 className="font-semibold text-text-primary text-[11px] uppercase tracking-wider mb-1.5 font-mono text-accent-2">
                      Motion Design Styles
                    </h4>
                    <ol className="space-y-1 list-decimal pl-4 text-[12px]">
                      <li>Kinetic typography</li>
                      <li>Explainer video graphics</li>
                      <li>Logo animations and reveals</li>
                      <li>Infographic animations</li>
                      <li>Broadcast graphics packages</li>
                    </ol>
                  </div>
                </div>
              </Card>
            )}

            {/* 3. Software Proficiency */}
            {(activeSectionTab === 'all' || activeSectionTab === 'software') && (
              <Card elevation="z2" className="p-6 glass-surface border-gold/30" tilt maxTilt={6}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-gold/20 text-gold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    Software Proficiency
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-text-secondary leading-relaxed">
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-gold">
                      After Effects
                    </strong>
                    Primary motion graphics tool.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-gold">
                      Cinema 4D / Blender
                    </strong>
                    3D elements and integration.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-gold">
                      Illustrator / Photoshop
                    </strong>
                    Asset creation and visual design.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-gold">
                      Premiere Pro
                    </strong>
                    Video integration and editorial pacing.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-gold">
                      Lottie / Bodymovin
                    </strong>
                    High-performance web animation export.
                  </li>
                </ul>
              </Card>
            )}

            {/* 4. Project Types */}
            {(activeSectionTab === 'all' || activeSectionTab === 'deliverables') && (
              <Card elevation="z2" className="p-6 glass-surface border-border-glow/30" tilt maxTilt={6}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-surface-raised text-accent">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    Project Types
                  </h3>
                </div>

                <ul className="space-y-1.5 text-xs text-text-secondary leading-relaxed list-disc pl-4">
                  <li>Animated logos and brand elements</li>
                  <li>Social media content and ads</li>
                  <li>Explainer and tutorial videos</li>
                  <li>Broadcast graphics packages</li>
                  <li>Title sequences and lower thirds</li>
                  <li>UI/UX micro-interactions &amp; animations</li>
                </ul>
              </Card>
            )}

            {/* 5. Deliverables */}
            {(activeSectionTab === 'all' || activeSectionTab === 'deliverables') && (
              <Card elevation="z2" className="p-6 glass-surface border-success/30" tilt maxTilt={6}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-success/20 text-success">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    Deliverables
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-success">
                      Animated Video Files
                    </strong>
                    High-definition MP4, MOV, Apple ProRes.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-success">
                      Lottie JSON Files
                    </strong>
                    Optimized vector animations for web and mobile apps.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-success">
                      Project Files &amp; Assets
                    </strong>
                    Fully organized layered comps and source materials.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-success">
                      Style Frames &amp; Storyboards
                    </strong>
                    Pre-production visual direction and motion blueprints.
                  </li>
                  <li>
                    <strong className="text-text-primary block font-mono text-[11px] text-success">
                      Animation Specifications
                    </strong>
                    Detailed easing curves, durations, and implementation guides.
                  </li>
                </ul>
              </Card>
            )}

            {/* 6. Best Practices */}
            {(activeSectionTab === 'all' || activeSectionTab === 'practices') && (
              <Card elevation="z2" className="p-6 glass-surface border-warning/30" tilt maxTilt={6}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-warning/20 text-warning">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    Best Practices
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span><strong>Style Frames:</strong> Start with style frames for client and stakeholder approval.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span><strong>Pre-Compositions:</strong> Use structured pre-comps for clean project hierarchy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span><strong>Modular Elements:</strong> Create reusable kinetic building blocks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span><strong>Consistent Timing:</strong> Maintain harmonious easing curves across scenes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span><strong>Platform Optimization:</strong> Calibrate compression and framerates for target devices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span><strong>Version Control:</strong> Systematic iteration and asset backups throughout the project lifecycle.</span>
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
