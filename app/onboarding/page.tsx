'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RadioCard } from '@/components/ui/RadioCard';
import { Slider } from '@/components/ui/Slider';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { Fallback2D } from '@/components/three/Fallback2D';
import { useAppStore } from '@/lib/store/useAppStore';
import { computeRiskScore } from '@/lib/engine';
import { InvestorProfile } from '@/types';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Clock,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => <Fallback2D title="Loading Journey Station..." />,
});

const JourneyStation = dynamic(
  () => import('@/components/three/JourneyStation').then((m) => m.JourneyStation),
  { ssr: false }
);

const PersonaAvatar = dynamic(
  () => import('@/components/three/PersonaAvatar').then((m) => m.PersonaAvatar),
  { ssr: false }
);

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile, addToast, currentUser } = useAppStore();

  const [step, setStep] = useState(1);
  const [isRevealed, setIsRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State matching Plan.md Section 6
  const [goal, setGoal] = useState<InvestorProfile['goal']>('grow');
  const [amount, setAmount] = useState<number>(10000);
  const [currency] = useState<string>('USD');
  const [horizonYears, setHorizonYears] = useState<number>(3);
  const [experience, setExperience] = useState<InvestorProfile['experience']>('beginner');
  const [incomeStability, setIncomeStability] = useState<InvestorProfile['incomeStability']>('stable');
  const [lossReaction, setLossReaction] = useState<InvestorProfile['lossReaction']>('hold');
  const [riskPreference, setRiskPreference] = useState<InvestorProfile['riskPreference']>(3);
  const [liquidityNeed, setLiquidityNeed] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>(['smart_contract', 'store_of_value']);

  // Calculated Persona State for Reveal
  const [calculatedResult, setCalculatedResult] = useState<{
    riskScore: number;
    persona: InvestorProfile['persona'];
  } | null>(null);

  const toggleCategory = (cat: string) => {
    if (cat === 'no_preference') {
      setCategories(['no_preference']);
      return;
    }
    const clean = categories.filter((c) => c !== 'no_preference');
    if (clean.includes(cat)) {
      const filtered = clean.filter((c) => c !== cat);
      setCategories(filtered.length > 0 ? filtered : ['no_preference']);
    } else {
      setCategories([...clean, cat]);
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const scoreData = computeRiskScore({
      lossReaction,
      riskPreference,
      horizonYears,
      incomeStability,
      experience,
      goal,
      liquidityNeed,
    });

    const fullProfile: InvestorProfile = {
      userId: currentUser?.id || 'usr_investor_demo',
      goal,
      amount,
      currency,
      horizonYears,
      experience,
      incomeStability,
      lossReaction,
      riskPreference,
      liquidityNeed,
      categories,
      riskScore: scoreData.riskScore,
      persona: scoreData.persona,
      assignedAdvisorId: 'usr_advisor_demo',
    };

    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProfile),
      });
    } catch {
      // Local fallback handled in store
    }

    setCalculatedResult(scoreData);
    setProfile(fullProfile);
    setSubmitting(false);
    setIsRevealed(true);

    addToast({
      type: 'success',
      title: 'Profile Evaluated',
      message: `Risk Persona generated: ${
        scoreData.persona === 'cautious_saver'
          ? 'Cautious Saver'
          : scoreData.persona === 'growth_seeker'
          ? 'Growth Seeker'
          : 'Balanced Builder'
      }`,
    });
  };

  const stationLabels = ['Primary Goal', 'Investment Capital', 'Horizon & Income', 'Risk Reactions', 'Asset Categories'];

  // Persona Reveal Screen
  if (isRevealed && calculatedResult) {
    const personaDetails = {
      cautious_saver: {
        title: 'Cautious Saver',
        color: '#68CFA4',
        description: 'You prioritize capital preservation and peace of mind above all else. Your recommended allocation leans heavily into Bitcoin, Ethereum, and a resilient stablecoin liquidity reserve.',
      },
      balanced_builder: {
        title: 'Balanced Builder',
        color: '#8FB8D6',
        description: 'You seek dependable long-term crypto growth while managing sharp downside drawdowns. Your portfolio anchors in premier tier-1 networks with a controlled mid-cap growth slice.',
      },
      growth_seeker: {
        title: 'Growth Seeker',
        color: '#D4A373',
        description: 'You embrace market swings in pursuit of meaningful capital appreciation. Your profile tolerates high volatility in exchange for high-beta ecosystem expansion.',
      },
    }[calculatedResult.persona];

    return (
      <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-8 max-w-4xl mx-auto">
        <Card elevation="z3" className="w-full glass-surface border-accent/40 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-accent-2 to-gold" />

          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block mb-2">
            Persona Reveal Complete
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
            You are a <span style={{ color: personaDetails.color }}>{personaDetails.title}</span>
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
            {personaDetails.description}
          </p>

          {/* 3D Persona Avatar & Risk Gauge side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center my-6">
            <div className="h-56 w-full relative">
              <Scene fov={40} enableStars={false}>
                <PersonaAvatar persona={calculatedResult.persona} />
              </Scene>
              <span className="text-[10px] font-mono text-text-muted mt-2 block">
                3D Kinetic Gyroscope Avatar
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <RiskGauge score={calculatedResult.riskScore} size="lg" />
              <div className="mt-4 p-3 rounded-md bg-void/60 border border-border-subtle max-w-xs text-left text-xs">
                <span className="text-text-muted block text-[10px] uppercase font-mono">Profile Summary</span>
                <p className="text-text-primary mt-0.5">Budget: ${amount.toLocaleString()} USD</p>
                <p className="text-text-primary">Time Horizon: {horizonYears} Years</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push('/dashboard')}
              icon={<Sparkles className="w-5 h-5 text-void" />}
              className="w-full sm:w-auto"
            >
              See My Matches & Recommendations
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center px-4 py-8 max-w-5xl mx-auto">
      {/* Top Disclaimer */}
      <DisclaimerBanner compact className="mb-6" />

      {/* Stepper Progress Bar */}
      <div className="mb-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-accent font-bold">Step {step} / 5</span>
          <span className="text-text-muted">•</span>
          <span className="text-text-primary font-medium">{stationLabels[step - 1]}</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-pill transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-accent shadow-[0_0_8px_rgba(143,184,214,0.5)]'
                  : s < step
                  ? 'w-4 bg-accent/40'
                  : 'w-4 bg-surface-raised border border-border-subtle'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Split Layout: 3D Journey Station Left, Interactive Questions Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3D Procedural Journey Station */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center min-h-[380px] rounded-lg glass-surface border-border-subtle relative overflow-hidden">
          <div className="absolute inset-0">
            <Scene fov={40} starCount={400}>
              <JourneyStation step={step} />
            </Scene>
          </div>
          <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
            <span className="text-[11px] font-mono text-accent/80 px-3 py-1 rounded-pill glass-surface border border-accent/20">
              Station {step}: {stationLabels[step - 1]}
            </span>
          </div>
        </div>

        {/* Right: Question Form Overlay */}
        <Card elevation="z3" className="lg:col-span-7 glass-surface border-border-glow/40 p-6 sm:p-8 flex flex-col justify-between" tilt={false}>
          {/* Station 1: Goal */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">Question 1 of 5</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary mt-1">
                  What is your primary goal for crypto investing?
                </h2>
                <p className="text-xs text-text-secondary mt-1">This helps establish baseline risk limits.</p>
              </div>

              <div className="space-y-3 pt-2">
                <RadioCard
                  selected={goal === 'grow'}
                  onClick={() => setGoal('grow')}
                  title="Grow Long-Term Wealth"
                  description="Build portfolio capital over multiple years through premier decentralized networks."
                />
                <RadioCard
                  selected={goal === 'save'}
                  onClick={() => setGoal('save')}
                  title="Capital Preservation & High Yield"
                  description="Protect purchasing power with low drawdowns and dollar-pegged stable buffers."
                />
                <RadioCard
                  selected={goal === 'learn'}
                  onClick={() => setGoal('learn')}
                  title="Learn & Explore the Ecosystem"
                  description="Gain hands-on exposure to smart contracts and blockchain technology with modest capital."
                />
                <RadioCard
                  selected={goal === 'short_term'}
                  onClick={() => setGoal('short_term')}
                  title="Short-Term Market Momentum"
                  description="Capture higher cyclical swings across dynamic market trends."
                />
              </div>
            </div>
          )}

          {/* Station 2: Amount */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">Question 2 of 5</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary mt-1">
                  How much capital are you comfortable investing?
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Only invest amounts whose temporary drawdown will not impact your living essentials.
                </p>
              </div>

              <div className="pt-4 space-y-6">
                <Slider
                  min={500}
                  max={50000}
                  step={500}
                  value={amount}
                  onChange={setAmount}
                  label="Target Investment Capital (USD)"
                  formatValue={(val) => `$${val.toLocaleString()} USD`}
                />

                <div className="grid grid-cols-4 gap-2">
                  {[1000, 5000, 15000, 30000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-2 rounded-md border text-xs font-mono font-semibold transition-all ${
                        amount === preset
                          ? 'border-accent bg-accent/20 text-accent shadow-[0_0_10px_rgba(143,184,214,0.3)]'
                          : 'border-border-subtle bg-surface-raised/40 text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      ${preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-md bg-void/60 border border-border-subtle text-xs text-text-secondary">
                  <span className="text-text-primary font-semibold block mb-0.5">Dollar-Cost Averaging (DCA) Note:</span>
                  Amounts above $5,000 will automatically include a multi-week DCA entry plan recommendation to prevent buying tops.
                </div>
              </div>
            </div>
          )}

          {/* Station 3: Horizon & Income */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">Question 3 of 5</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary mt-1">
                  What is your timeline and income stability?
                </h2>
                <p className="text-xs text-text-secondary mt-1">Crypto market cycles typically run in 3 to 4 year waves.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                    Time Horizon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: '< 1 Year', val: 0.5 },
                      { label: '1 - 3 Years', val: 2 },
                      { label: '3 - 5 Years', val: 4 },
                      { label: '5+ Years', val: 6 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setHorizonYears(item.val)}
                        className={`p-3 rounded-md border text-xs font-semibold transition-all ${
                          horizonYears === item.val
                            ? 'border-accent bg-accent/20 text-accent shadow-[0_0_10px_rgba(143,184,214,0.3)]'
                            : 'border-border-subtle bg-surface-raised/40 text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                    Income Predictability
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Stable & Reliable', val: 'stable' as const },
                      { label: 'Variable / Freelance', val: 'variable' as const },
                      { label: 'Uncertain', val: 'uncertain' as const },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setIncomeStability(item.val)}
                        className={`p-2.5 rounded-md border text-xs font-semibold transition-all ${
                          incomeStability === item.val
                            ? 'border-accent bg-accent/20 text-accent shadow-[0_0_10px_rgba(143,184,214,0.3)]'
                            : 'border-border-subtle bg-surface-raised/40 text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Station 4: Risk Scenarios (Physical Slabs) */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">Question 4 of 5</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary mt-1">
                  Scenario: Your portfolio drops 30% in a month. You…
                </h2>
                <p className="text-xs text-text-secondary mt-1">Select the reaction closest to your genuine emotional response.</p>
              </div>

              <div className="space-y-2.5 pt-2">
                <RadioCard
                  selected={lossReaction === 'sell_all'}
                  onClick={() => setLossReaction('sell_all')}
                  title="Sell everything to cash"
                  description="I cannot sleep peacefully if my portfolio suffers significant paper drawdowns."
                />
                <RadioCard
                  selected={lossReaction === 'sell_some'}
                  onClick={() => setLossReaction('sell_some')}
                  title="Sell a portion to reduce risk"
                  description="I de-risk partially to secure remaining capital while keeping some exposure."
                />
                <RadioCard
                  selected={lossReaction === 'hold'}
                  onClick={() => setLossReaction('hold')}
                  title="Do nothing and hold through the cycle"
                  description="I expect crypto volatility and trust my long-term diversified allocation."
                />
                <RadioCard
                  selected={lossReaction === 'buy_more'}
                  onClick={() => setLossReaction('buy_more')}
                  title="Buy more at discounted prices"
                  description="I view sharp drawdowns as attractive entry opportunities."
                />
              </div>

              {/* Liquidity need toggle */}
              <div className="pt-2 flex items-center justify-between p-3 rounded-md bg-void/60 border border-border-subtle">
                <div>
                  <span className="text-xs font-semibold text-text-primary block">Immediate Liquidity Access</span>
                  <span className="text-[11px] text-text-secondary">Do you anticipate needing to withdraw these funds on short notice?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLiquidityNeed(!liquidityNeed)}
                  className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all ${
                    liquidityNeed
                      ? 'bg-accent text-void shadow-[0_0_10px_rgba(143,184,214,0.35)]'
                      : 'bg-surface-raised text-text-muted border border-border-subtle'
                  }`}
                >
                  {liquidityNeed ? 'YES' : 'NO'}
                </button>
              </div>
            </div>
          )}

          {/* Station 5: Preferred Categories */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">Question 5 of 5</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary mt-1">
                  Which crypto sectors are you interested in?
                </h2>
                <p className="text-xs text-text-secondary mt-1">Select all that apply, or choose No Preference for algorithmic suitability.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <RadioCard
                  selected={categories.includes('store_of_value')}
                  onClick={() => toggleCategory('store_of_value')}
                  title="Store of Value"
                  badge="Bitcoin"
                  description="Foundational digital reserve assets designed to resist monetary debasement."
                />
                <RadioCard
                  selected={categories.includes('smart_contract')}
                  onClick={() => toggleCategory('smart_contract')}
                  title="Smart Contract Platforms"
                  badge="ETH / SOL"
                  description="Layer-1 networks powering decentralized applications, tokens, and compute."
                />
                <RadioCard
                  selected={categories.includes('defi')}
                  onClick={() => toggleCategory('defi')}
                  title="Decentralized Finance (DeFi)"
                  badge="LINK / UNI"
                  description="Open protocols for lending, trading, and decentralized financial plumbing."
                />
                <RadioCard
                  selected={categories.includes('stablecoin')}
                  onClick={() => toggleCategory('stablecoin')}
                  title="Stablecoins & Yield"
                  badge="USDC / USDT"
                  description="Dollar-backed collateral maintaining constant value for low-risk parking."
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCategories(['no_preference'])}
                  className={`w-full py-2.5 rounded-md border text-xs font-semibold transition-all ${
                    categories.includes('no_preference')
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-border-subtle bg-surface-raised/40 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  No Preference (Let engine allocate based purely on risk & track record)
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-border-subtle flex items-center justify-between gap-4 mt-6">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={handleNext}
              disabled={submitting}
              icon={step === 5 ? <Sparkles className="w-4 h-4 text-void" /> : <ArrowRight className="w-4 h-4 text-void" />}
            >
              {step === 5 ? (submitting ? 'Computing...' : 'Calculate My Persona') : 'Next Question'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
