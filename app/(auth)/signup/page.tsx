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
import { Compass, ShieldCheck, User, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser, addToast } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('investor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setCurrentUser({
      id: `usr_${Date.now()}`,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });

    addToast({
      type: 'success',
      title: 'Account Created',
      message: `Welcome, ${name}! Redirecting to ${role === 'advisor' ? 'Advisor Room' : 'Onboarding'}.`,
    });

    if (role === 'advisor') {
      router.push('/advisor');
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto">
      <DisclaimerBanner compact className="w-full mb-6" />

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
          Create Your Account
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Begin your risk-matched, advisor-verified crypto journey.
        </p>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
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
            Create {role === 'advisor' ? 'Advisor' : 'Investor'} Account
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border-subtle/50 text-center text-xs text-text-secondary">
          Already registered?{' '}
          <Link href="/login" className="text-accent hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
