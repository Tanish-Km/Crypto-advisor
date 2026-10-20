'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-subtle bg-deep/90 py-12 px-6 text-text-secondary select-none relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-sm text-text-primary">
              Crypto<span className="text-accent">Compass</span>
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            A risk-matched, explainable crypto guidance platform for beginners, with a certified human advisor in the loop.
          </p>
          <p className="text-[11px] text-text-muted mt-3">
            Educational information, not financial advice. Crypto is volatile and you can lose money. Regulations vary by jurisdiction; check local laws.
          </p>
        </div>

        <div className="flex flex-wrap gap-12 text-xs">
          <div>
            <h4 className="font-semibold text-text-primary uppercase tracking-wider mb-3 text-[11px]">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/onboarding" className="hover:text-accent transition-colors">
                  Take Risk Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/galaxy" className="hover:text-accent transition-colors">
                  3D Risk Galaxy
                </Link>
              </li>
              <li>
                <Link href="/dashboard/simulator" className="hover:text-accent transition-colors">
                  Crash Stress Test
                </Link>
              </li>
              <li>
                <Link href="/dashboard/learn" className="hover:text-accent transition-colors">
                  Crypto Glossary
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary uppercase tracking-wider mb-3 text-[11px]">
              Advisor Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/advisor" className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  Advisor Review Desk
                </Link>
              </li>
              <li>
                <span className="text-text-muted">Certified Methodology</span>
              </li>
              <li>
                <span className="text-text-muted">Zero Custody Risk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border-subtle/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-muted">
        <p>© {new Date().getFullYear()} CryptoCompass. Built with 3D Depth & Human Verification.</p>
        <p className="mt-2 sm:mt-0 font-mono">Status: Connected to Market Oracles & Local Demo DB</p>
      </div>
    </footer>
  );
}
