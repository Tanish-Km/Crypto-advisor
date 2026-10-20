'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Compass,
  Sparkles,
  UserCheck,
  RotateCcw,
  Sliders,
  BookOpen,
  MessageSquare,
  Shield,
  Layers,
  Activity,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    loginAsDemoInvestor,
    loginAsDemoAdvisor,
    resetDemoData,
    reducedMotion,
    setReducedMotion,
  } = useAppStore();

  const isAdvisor = currentUser?.role === 'advisor';

  const navLinks = [
    { href: '/', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { href: '/dashboard', label: 'My Matches', icon: <Sparkles className="w-4 h-4" /> },
    { href: '/dashboard/galaxy', label: 'Risk Galaxy', icon: <Layers className="w-4 h-4" /> },
    { href: '/dashboard/simulator', label: 'Simulator', icon: <Sliders className="w-4 h-4" /> },
    { href: '/dashboard/learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/dashboard/messages', label: 'Advisor Q&A', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-3 inset-x-0 z-50 max-w-7xl mx-auto px-4 pointer-events-none">
      <nav className="glass-surface elev-z2 rounded-pill px-5 py-2.5 flex items-center justify-between pointer-events-auto shadow-[0_12px_30px_rgba(0,0,0,0.5)] border border-border-subtle backdrop-blur-md">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-accent-2 flex items-center justify-center text-void shadow-[0_0_15px_rgba(143,184,214,0.4)] group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-void animate-[spin_12s_linear_infinite]" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-text-primary">
            Crypto<span className="text-accent">Compass</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/15 text-accent shadow-[0_0_12px_rgba(143,184,214,0.25)] border border-accent/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Action / Demo Switcher Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Advisor Portal Link */}
          <Link
            href="/advisor"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all ${
              pathname.startsWith('/advisor')
                ? 'bg-gold/20 text-gold border border-gold/40 shadow-[0_0_12px_rgba(212,163,115,0.3)]'
                : 'text-text-secondary hover:text-gold hover:bg-gold/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Advisor Room</span>
          </Link>

          {/* Demo Role Switcher Pill */}
          <div className="flex items-center rounded-pill bg-void/80 border border-border-subtle p-0.5 text-xs">
            <button
              onClick={loginAsDemoInvestor}
              title="Switch to Investor Demo"
              className={`px-2.5 py-1 rounded-pill transition-all ${
                !isAdvisor
                  ? 'bg-accent text-void font-bold shadow-[0_0_10px_rgba(143,184,214,0.4)]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Investor
            </button>
            <button
              onClick={loginAsDemoAdvisor}
              title="Switch to Advisor Demo"
              className={`px-2.5 py-1 rounded-pill transition-all ${
                isAdvisor
                  ? 'bg-gold text-void font-bold shadow-[0_0_10px_rgba(212,163,115,0.4)]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Advisor
            </button>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={resetDemoData}
            title="Reset demo data to initial state"
            className="p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
