'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  MessageSquare,
  ShieldCheck,
  Send,
  User,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export default function MessagesPage() {
  const { messages, addMessage, currentUser, recommendation } = useAppStore();
  const [inputText, setInputText] = useState('');

  const isAdvisor = currentUser?.role === 'advisor';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addMessage(inputText.trim(), isAdvisor ? 'advisor' : 'investor');
    setInputText('');
  };

  return (
    <div className="relative min-h-[92vh] px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-16">
      {/* Disclaimer */}
      <DisclaimerBanner compact className="mb-6" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="font-display text-2xl font-bold text-text-primary">
              Advisor Consultation Thread
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Direct, verified Q&amp;A channel with certified human advisor Elena Rostova, CFA.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-text-muted block">Posting As:</span>
          <span className="text-xs font-bold text-accent font-mono">
            {currentUser?.name || 'Alex Rivera (Investor)'}
          </span>
        </div>
      </div>

      {/* Pinned Recommendation Context Card */}
      <div className="glass-surface elev-z2 rounded-lg p-4 mb-6 border border-gold/30 bg-gold/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary">
              Active Recommendation Context (v{recommendation?.version || 1})
            </h4>
            <p className="text-[11px] text-text-secondary">
              Status: <span className="capitalize font-mono text-gold font-semibold">{recommendation?.status.replace('_', ' ')}</span> • {recommendation?.allocation.length || 0} Assets Allocated
            </p>
          </div>
        </div>
        <Badge variant={recommendation?.status === 'approved' ? 'approved' : 'pending'} />
      </div>

      {/* Main Chat Stream */}
      <Card elevation="z2" className="glass-surface p-6 min-h-[420px] flex flex-col justify-between" tilt={false}>
        {/* Messages List */}
        <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2 mb-4">
          {messages.map((msg) => {
            const isMsgAdvisor = msg.fromRole === 'advisor';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMsgAdvisor ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-text-muted">
                  {isMsgAdvisor && <ShieldCheck className="w-3.5 h-3.5 text-gold" />}
                  <span className={isMsgAdvisor ? 'text-gold font-semibold' : 'text-accent font-semibold'}>
                    {msg.fromName || (isMsgAdvisor ? 'Elena Rostova, CFA' : 'Alex Rivera')}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`p-3.5 rounded-lg max-w-lg text-xs leading-relaxed shadow-z1 ${
                    isMsgAdvisor
                      ? 'glass-surface border border-gold/30 text-text-primary -rotate-1 rounded-tl-none'
                      : 'bg-accent/15 border border-accent/40 text-text-primary rotate-1 rounded-tr-none'
                  }`}
                >
                  <p>{msg.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="pt-4 border-t border-border-subtle flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isAdvisor
                ? 'Reply to client as Elena Rostova, CFA...'
                : 'Ask a question about your allocation, risk buffers, or stablecoins...'
            }
            className="input-recessed flex-1 px-4 py-2.5 rounded-md text-xs text-text-primary"
          />
          <Button type="submit" size="md" icon={<Send className="w-4 h-4 text-void" />}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
