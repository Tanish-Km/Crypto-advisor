'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RadioCard } from '@/components/ui/RadioCard';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { useAppStore } from '@/lib/store/useAppStore';
import { Role } from '@/types';
import { Compass, ShieldCheck, User, Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemoInvestor, loginAsDemoAdvisor, setCurrentUser, addToast } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('investor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (role === 'advisor') {
      loginAsDemoAdvisor();
      router.push('/advisor');
    } else {
      loginAsDemoInvestor();
      router.push('/dashboard');
    }
  };

  const handleDemoInvestor = () => {
    loginAsDemoInvestor();
    router.push('/dashboard');
  };

  const handleDemoAdvisor = () => {
    loginAsDemoAdvisor();
    router.push('/advisor');
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto">
      <DisclaimerBanner compact className="w-full mb-6" />

      {/* Auth Glass Card at z3 */}
      <Card elevation="z3" className="w-full glass-surface border-border-glow/40 p-8 text-left" tilt={false}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-base text-text-primary">
            Crypto<span className="text-accent">Compass</span>
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold text-text-primary mt-2">
          Sign In to Your Space
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Access your risk-matched allocation or certified advisor review room.
        </p>

        {/* Role Selector Radio Cards */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <RadioCard
            selected={role === 'investor'}
            onClick={() => setRole('investor')}
            title="Investor"
            icon={<User className="w-4 h-4" />}
          />
          <RadioCard
            selected={role === 'advisor'}
            onClick={() => setRole('advisor')}
            title="Advisor"
            icon={<ShieldCheck className="w-4 h-4" />}
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" size="md" className="w-full mt-2" icon={<ArrowRight className="w-4 h-4 text-void" />}>
            Sign In as {role === 'advisor' ? 'Advisor' : 'Investor'}
          </Button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 pt-5 border-t border-border-subtle/50 text-center">
          <span className="text-[10px] font-mono uppercase text-text-muted tracking-wider block mb-2.5">
            1-Click Stage Demo Accounts
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleDemoInvestor}
              className="flex-1 text-xs"
              icon={<Sparkles className="w-3.5 h-3.5 text-accent" />}
            >
              Investor Demo
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleDemoAdvisor}
              className="flex-1 text-xs"
              icon={<ShieldCheck className="w-3.5 h-3.5 text-gold" />}
            >
              Advisor Demo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
