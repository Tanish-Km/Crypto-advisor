import {
  Alert,
  InvestorProfile,
  Message,
  Recommendation,
  RecommendationVersion,
  User,
} from '@/types';
import { SEED_COINS } from '@/lib/data/seedCoins';
import { runFullMatchEngine } from '@/lib/engine';

export const DEMO_INVESTOR: User = {
  id: 'usr_investor_demo',
  email: 'investor@cryptocompass.demo',
  name: 'Alex Rivera',
  role: 'investor',
  createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
};

export const DEMO_ADVISOR: User = {
  id: 'usr_advisor_demo',
  email: 'advisor@cryptocompass.demo',
  name: 'Elena Rostova, CFA',
  role: 'advisor',
  createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
};

export const SAMPLE_INVESTOR_PROFILE: InvestorProfile = {
  userId: DEMO_INVESTOR.id,
  goal: 'grow',
  amount: 15000,
  currency: 'USD',
  horizonYears: 3,
  experience: 'beginner',
  incomeStability: 'stable',
  lossReaction: 'hold',
  riskPreference: 3,
  liquidityNeed: false,
  categories: ['smart_contract', 'store_of_value'],
  riskScore: 6,
  persona: 'balanced_builder',
  assignedAdvisorId: DEMO_ADVISOR.id,
};

// Initial engine run to seed the initial recommendation
const initialEngineResult = runFullMatchEngine(SAMPLE_INVESTOR_PROFILE, SEED_COINS);

export const SAMPLE_RECOMMENDATION: Recommendation = {
  ...initialEngineResult.recommendation,
  id: 'rec_demo_101',
  investorId: DEMO_INVESTOR.id,
  advisorId: DEMO_ADVISOR.id,
  status: 'pending_review',
  version: 1,
  advisorNote: 'Initial automated allocation matching Balanced Builder parameters. Pending human advisor review.',
};

export const INITIAL_MESSAGES: Message[] = [
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
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt_1',
    investorId: DEMO_INVESTOR.id,
    type: 'info',
    body: 'Your profile has been submitted for certified advisor review. Average turnaround is under 24 hours.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: false,
  },
];

export interface AppDatabaseState {
  users: User[];
  profiles: Map<string, InvestorProfile>;
  recommendations: Map<string, Recommendation>;
  recommendationVersions: RecommendationVersion[];
  messages: Message[];
  alerts: Alert[];
}

// Global server memory storage (persists during node process runtime)
class MemoryDatabase {
  users: User[] = [DEMO_INVESTOR, DEMO_ADVISOR];
  profiles: Map<string, InvestorProfile> = new Map([[DEMO_INVESTOR.id, SAMPLE_INVESTOR_PROFILE]]);
  recommendations: Map<string, Recommendation> = new Map([[SAMPLE_RECOMMENDATION.id, { ...SAMPLE_RECOMMENDATION }]]);
  recommendationVersions: RecommendationVersion[] = [
    {
      id: 'ver_1',
      recommendationId: SAMPLE_RECOMMENDATION.id,
      version: 1,
      allocation: JSON.parse(JSON.stringify(SAMPLE_RECOMMENDATION.allocation)),
      entryPlan: { ...SAMPLE_RECOMMENDATION.entryPlan },
      advisorNote: SAMPLE_RECOMMENDATION.advisorNote,
      status: SAMPLE_RECOMMENDATION.status,
      updatedAt: SAMPLE_RECOMMENDATION.createdAt,
      updatedBy: 'engine',
    },
  ];
  messages: Message[] = [...INITIAL_MESSAGES];
  alerts: Alert[] = [...INITIAL_ALERTS];

  resetToDemo(): void {
    this.users = [DEMO_INVESTOR, DEMO_ADVISOR];
    this.profiles = new Map([[DEMO_INVESTOR.id, { ...SAMPLE_INVESTOR_PROFILE }]]);
    this.recommendations = new Map([[SAMPLE_RECOMMENDATION.id, JSON.parse(JSON.stringify(SAMPLE_RECOMMENDATION))]]);
    this.recommendationVersions = [
      {
        id: 'ver_1',
        recommendationId: SAMPLE_RECOMMENDATION.id,
        version: 1,
        allocation: JSON.parse(JSON.stringify(SAMPLE_RECOMMENDATION.allocation)),
        entryPlan: { ...SAMPLE_RECOMMENDATION.entryPlan },
        advisorNote: SAMPLE_RECOMMENDATION.advisorNote,
        status: SAMPLE_RECOMMENDATION.status,
        updatedAt: SAMPLE_RECOMMENDATION.createdAt,
        updatedBy: 'engine',
      },
    ];
    this.messages = [...INITIAL_MESSAGES];
    this.alerts = [...INITIAL_ALERTS];
  }
}

// Declare global variable for hot reload persistence
const globalForDb = global as unknown as { mockDb: MemoryDatabase };
export const mockDb = globalForDb.mockDb || new MemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.mockDb = mockDb;
