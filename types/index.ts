export type Role = 'investor' | 'advisor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export type GoalType = 'save' | 'grow' | 'learn' | 'short_term';
export type ExperienceType = 'none' | 'beginner' | 'intermediate';
export type IncomeStabilityType = 'stable' | 'variable' | 'uncertain';
export type LossReactionType = 'sell_all' | 'sell_some' | 'hold' | 'buy_more';
export type PersonaType = 'cautious_saver' | 'balanced_builder' | 'growth_seeker';
export type CoinCategory = 'store_of_value' | 'smart_contract' | 'defi' | 'stablecoin' | 'other';
export type CoinFlag = 'low_liquidity' | 'unaudited' | 'anonymous_team' | 'new';

export interface InvestorProfile {
  userId: string;
  goal: GoalType;
  amount: number;
  currency: string;
  horizonYears: number; // e.g. 0.5, 2, 4, 6
  experience: ExperienceType;
  incomeStability: IncomeStabilityType;
  lossReaction: LossReactionType;
  riskPreference: 1 | 2 | 3 | 4;
  liquidityNeed: boolean;
  categories: string[];
  riskScore: number; // 1-10
  persona: PersonaType;
  assignedAdvisorId?: string;
}

export interface Coin {
  id: string; // coingecko id
  symbol: string;
  name: string;
  category: CoinCategory;
  marketCap: number;
  volume24h: number;
  price: number;
  change30d: number;
  change90d: number;
  volatility90d: number; // stdev of daily returns, annualized
  maxDrawdown: number; // historical, 0-1
  ageYears: number;
  flags: CoinFlag[];
  lastUpdated: string;
}

export interface CoinScores {
  liquidity: number; // 0-100
  stability: number; // 0-100
  size: number; // 0-100
  trackRecord: number; // 0-100
  categoryFit: number; // 0-100
}

export interface Match {
  coinId: string;
  coin?: Coin;
  matchPercent: number; // 0-100
  scores: CoinScores;
  reasons: string[]; // 2-4 plain language strings
  warnings: string[];
}

export interface AllocationItem {
  coinId: string;
  percent: number;
  rationale: string;
  risk: string;
  reconsiderWhen: string;
  coin?: Coin;
}

export interface EntryPlan {
  type: 'lump_sum' | 'dca';
  installments?: number;
  intervalDays?: number;
}

export type RecommendationStatus = 'pending_review' | 'approved' | 'edited' | 'rejected';
export type RecommendationSource = 'engine' | 'advisor';

export interface Recommendation {
  id: string;
  investorId: string;
  advisorId?: string;
  status: RecommendationStatus;
  source: RecommendationSource;
  allocation: AllocationItem[];
  entryPlan: EntryPlan;
  advisorNote?: string;
  version: number;
  createdAt: string;
  approvedAt?: string;
}

export interface RecommendationVersion {
  id: string;
  recommendationId: string;
  version: number;
  allocation: AllocationItem[];
  entryPlan: EntryPlan;
  advisorNote?: string;
  status: RecommendationStatus;
  updatedAt: string;
  updatedBy: string;
}

export interface Message {
  id: string;
  recommendationId?: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  createdAt: string;
  fromName?: string;
  fromRole?: Role;
}

export interface Alert {
  id: string;
  investorId: string;
  type: 'rebalance' | 'risk' | 'info';
  body: string;
  createdAt: string;
  read: boolean;
}

export interface BacktestResult {
  timeseries: { date: string; value: number }[];
  totalReturnPercent: number;
  maxDrawdownPercent: number;
  bestMonthPercent: number;
  worstMonthPercent: number;
  startValue: number;
  endValue: number;
}

export interface StressScenarioResult {
  scenarioName: string;
  portfolioDrawdownPercent: number;
  portfolioLossAmount: number;
  currency: string;
  perCoinContribution: {
    coinId: string;
    symbol: string;
    allocationPercent: number;
    drawdownPercent: number;
    lossAmount: number;
    isFallbackApproximate: boolean;
  }[];
}
