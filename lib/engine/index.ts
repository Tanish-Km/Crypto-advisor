import { AllocationItem, Coin, InvestorProfile, Match, Recommendation } from '@/types';
import { hardFilterCoins } from './filter';
import { rankCoins, PERSONA_WEIGHTS } from './rank';
import { generateAllocation } from './allocate';
import { generateExplanations } from './explain';
import { computeRiskScore } from './riskScore';

export * from './riskScore';
export * from './filter';
export * from './rank';
export * from './allocate';
export * from './explain';
export * from './stress';
export * from './backtest';

export interface EngineResult {
  matches: Match[];
  allocation: AllocationItem[];
  recommendation: Recommendation;
}

export function runFullMatchEngine(profile: InvestorProfile, coins: Coin[]): EngineResult {
  // 1. Hard filter
  const eligibleCoins = hardFilterCoins(coins, {
    riskScore: profile.riskScore,
    liquidityNeed: profile.liquidityNeed,
  });

  // Ensure we have candidates, fallback if filters were overly strict
  const candidates = eligibleCoins.length >= 3 ? eligibleCoins : coins;

  // 2. Rank & subscores
  const { matches: rawMatches } = rankCoins(candidates, profile.persona, profile.categories);

  // 3. Explain each matched candidate
  const matches = rawMatches.map((m) => {
    const coin = coins.find((c) => c.id === m.coinId)!;
    const { reasons, warnings } = generateExplanations(coin, m.scores, profile);
    return {
      ...m,
      reasons,
      warnings,
    };
  });

  // 4. Allocate
  const { allocation } = generateAllocation(matches, coins, profile.persona);

  // 5. Create default pending recommendation
  const now = new Date().toISOString();
  const recommendation: Recommendation = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    investorId: profile.userId,
    status: 'pending_review',
    source: 'engine',
    allocation,
    entryPlan: {
      type: profile.amount > 5000 ? 'dca' : 'lump_sum',
      installments: profile.amount > 5000 ? 4 : 1,
      intervalDays: 7,
    },
    version: 1,
    createdAt: now,
  };

  return {
    matches,
    allocation,
    recommendation,
  };
}
