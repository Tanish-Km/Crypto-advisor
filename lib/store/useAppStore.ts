import { create } from 'zustand';
import {
  Alert,
  AllocationItem,
  Coin,
  InvestorProfile,
  Match,
  Message,
  Recommendation,
  RecommendationVersion,
  User,
} from '@/types';
import { DEMO_ADVISOR, DEMO_INVESTOR, SAMPLE_INVESTOR_PROFILE, SAMPLE_RECOMMENDATION } from '@/lib/db/mockDb';
import { SEED_COINS } from '@/lib/data/seedCoins';
import { runFullMatchEngine } from '@/lib/engine';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

interface AppState {
  currentUser: User | null;
  profile: InvestorProfile | null;
  coins: Coin[];
  matches: Match[];
  recommendation: Recommendation | null;
  versions: RecommendationVersion[];
  messages: Message[];
  alerts: Alert[];
  toasts: ToastItem[];
  isLowPower: boolean;
  reducedMotion: boolean;

  // Actions
  setCurrentUser: (user: User | null) => void;
  loginAsDemoInvestor: () => void;
  loginAsDemoAdvisor: () => void;
  logout: () => void;
  setProfile: (profile: InvestorProfile) => void;
  setCoins: (coins: Coin[]) => void;
  setRecommendation: (rec: Recommendation) => void;
  updateAllocation: (items: AllocationItem[]) => void;
  approveRecommendation: (advisorNote: string) => void;
  addMessage: (body: string, fromRole: 'investor' | 'advisor') => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  setLowPower: (low: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  resetDemoData: () => void;
  runEngineForCurrentProfile: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: DEMO_INVESTOR, // Default to demo investor so app opens directly in a working state
  profile: SAMPLE_INVESTOR_PROFILE,
  coins: SEED_COINS,
  matches: runFullMatchEngine(SAMPLE_INVESTOR_PROFILE, SEED_COINS).matches,
  recommendation: SAMPLE_RECOMMENDATION,
  versions: [
    {
      id: 'ver_1',
      recommendationId: SAMPLE_RECOMMENDATION.id,
      version: 1,
      allocation: SAMPLE_RECOMMENDATION.allocation,
      entryPlan: SAMPLE_RECOMMENDATION.entryPlan,
      advisorNote: SAMPLE_RECOMMENDATION.advisorNote,
      status: 'pending_review',
      updatedAt: SAMPLE_RECOMMENDATION.createdAt,
      updatedBy: 'engine',
    },
  ],
  messages: [
    {
      id: 'msg_1',
      recommendationId: SAMPLE_RECOMMENDATION.id,
      fromUserId: DEMO_INVESTOR.id,
      toUserId: DEMO_ADVISOR.id,
      fromName: DEMO_INVESTOR.name,
      fromRole: 'investor',
      body: 'Hi Elena! I completed my onboarding. I noticed Bitcoin and Ethereum are my primary holdings. Is the 15% stablecoin buffer enough if market volatility spikes next month?',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
  alerts: [
    {
      id: 'alt_1',
      investorId: DEMO_INVESTOR.id,
      type: 'info',
      body: 'Your profile has been submitted for certified advisor review. Average turnaround is under 24 hours.',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      read: false,
    },
  ],
  toasts: [],
  isLowPower: false,
  reducedMotion: false,

  setCurrentUser: (user) => set({ currentUser: user }),

  loginAsDemoInvestor: () => {
    set({ currentUser: DEMO_INVESTOR });
    get().addToast({
      type: 'info',
      title: 'Switched to Investor',
      message: 'Logged in as Alex Rivera (Investor account).',
    });
  },

  loginAsDemoAdvisor: () => {
    set({ currentUser: DEMO_ADVISOR });
    get().addToast({
      type: 'info',
      title: 'Switched to Advisor',
      message: 'Logged in as Elena Rostova, CFA (Advisor account).',
    });
  },

  logout: () => set({ currentUser: null }),

  setProfile: (profile) => {
    const { coins } = get();
    const result = runFullMatchEngine(profile, coins);
    set({
      profile,
      matches: result.matches,
      recommendation: result.recommendation,
    });
  },

  setCoins: (coins) => set({ coins }),

  setRecommendation: (recommendation) => set({ recommendation }),

  updateAllocation: (items) => {
    const { recommendation } = get();
    if (!recommendation) return;
    set({
      recommendation: {
        ...recommendation,
        allocation: items,
        status: 'edited',
      },
    });
  },

  approveRecommendation: (advisorNote) => {
    const { recommendation, versions, currentUser } = get();
    if (!recommendation) return;

    const newVersion = recommendation.version + 1;
    const approvedAt = new Date().toISOString();

    const updatedRec: Recommendation = {
      ...recommendation,
      status: 'approved',
      source: 'advisor',
      advisorId: currentUser?.id || DEMO_ADVISOR.id,
      advisorNote,
      version: newVersion,
      approvedAt,
    };

    const newVersionItem: RecommendationVersion = {
      id: `ver_${newVersion}`,
      recommendationId: recommendation.id,
      version: newVersion,
      allocation: JSON.parse(JSON.stringify(recommendation.allocation)),
      entryPlan: { ...recommendation.entryPlan },
      advisorNote,
      status: 'approved',
      updatedAt: approvedAt,
      updatedBy: currentUser?.name || 'Advisor',
    };

    set({
      recommendation: updatedRec,
      versions: [newVersionItem, ...versions],
    });

    get().addToast({
      type: 'success',
      title: 'Recommendation Published',
      message: 'Client portfolio verified and approved. Seal stamped.',
    });
  },

  addMessage: (body, fromRole) => {
    const { currentUser, messages, recommendation } = get();
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      recommendationId: recommendation?.id,
      fromUserId: currentUser?.id || 'anon',
      toUserId: fromRole === 'investor' ? DEMO_ADVISOR.id : DEMO_INVESTOR.id,
      fromName: currentUser?.name || (fromRole === 'investor' ? 'Alex Rivera' : 'Elena Rostova, CFA'),
      fromRole,
      body,
      createdAt: new Date().toISOString(),
    };
    set({ messages: [...messages, newMsg] });
  },

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 5000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  setLowPower: (isLowPower) => set({ isLowPower }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),

  resetDemoData: () => {
    const freshEngine = runFullMatchEngine(SAMPLE_INVESTOR_PROFILE, SEED_COINS);
    set({
      currentUser: DEMO_INVESTOR,
      profile: { ...SAMPLE_INVESTOR_PROFILE },
      coins: [...SEED_COINS],
      matches: freshEngine.matches,
      recommendation: {
        ...SAMPLE_RECOMMENDATION,
        status: 'pending_review',
        version: 1,
      },
      versions: [
        {
          id: 'ver_1',
          recommendationId: SAMPLE_RECOMMENDATION.id,
          version: 1,
          allocation: SAMPLE_RECOMMENDATION.allocation,
          entryPlan: SAMPLE_RECOMMENDATION.entryPlan,
          advisorNote: SAMPLE_RECOMMENDATION.advisorNote,
          status: 'pending_review',
          updatedAt: SAMPLE_RECOMMENDATION.createdAt,
          updatedBy: 'engine',
        },
      ],
      messages: [
        {
          id: 'msg_1',
          recommendationId: SAMPLE_RECOMMENDATION.id,
          fromUserId: DEMO_INVESTOR.id,
          toUserId: DEMO_ADVISOR.id,
          fromName: DEMO_INVESTOR.name,
          fromRole: 'investor',
          body: 'Hi Elena! I completed my onboarding. I noticed Bitcoin and Ethereum are my primary holdings. Is the 15% stablecoin buffer enough if market volatility spikes next month?',
          createdAt: new Date().toISOString(),
        },
      ],
      alerts: [
        {
          id: 'alt_1',
          investorId: DEMO_INVESTOR.id,
          type: 'info',
          body: 'Your profile has been submitted for certified advisor review. Average turnaround is under 24 hours.',
          createdAt: new Date().toISOString(),
          read: false,
        },
      ],
    });
    get().addToast({
      type: 'info',
      title: 'Demo State Reset',
      message: 'Accounts, sample client, and pending recommendation restored.',
    });
  },

  runEngineForCurrentProfile: () => {
    const { profile, coins } = get();
    if (!profile) return;
    const result = runFullMatchEngine(profile, coins);
    set({
      matches: result.matches,
      recommendation: result.recommendation,
    });
  },
}));
