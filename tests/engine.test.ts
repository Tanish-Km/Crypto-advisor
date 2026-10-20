import { describe, it, expect } from 'vitest';
import {
  computeRiskScore,
  hardFilterCoins,
  rankCoins,
  generateAllocation,
  generateExplanations,
  runStressTest,
  runBacktest,
  runFullMatchEngine,
} from '@/lib/engine';
import { SEED_COINS } from '@/lib/data/seedCoins';
import { InvestorProfile } from '@/types';

describe('Matching Engine Tests', () => {
  it('computes Cautious Saver profile correctly (risk 1-3)', () => {
    const result = computeRiskScore({
      lossReaction: 'sell_all',
      riskPreference: 1,
      horizonYears: 0.5,
      incomeStability: 'uncertain',
      experience: 'none',
      goal: 'save',
      liquidityNeed: true,
    });

    expect(result.riskScore).toBeLessThanOrEqual(3);
    expect(result.persona).toBe('cautious_saver');
  });

  it('computes Balanced Builder profile correctly (risk 4-7)', () => {
    const result = computeRiskScore({
      lossReaction: 'hold',
      riskPreference: 2,
      horizonYears: 3,
      incomeStability: 'variable',
      experience: 'beginner',
      goal: 'grow',
      liquidityNeed: false,
    });

    expect(result.riskScore).toBeGreaterThanOrEqual(4);
    expect(result.riskScore).toBeLessThanOrEqual(7);
    expect(result.persona).toBe('balanced_builder');
  });

  it('computes Growth Seeker profile correctly (risk 8-10)', () => {
    const result = computeRiskScore({
      lossReaction: 'buy_more',
      riskPreference: 4,
      horizonYears: 6,
      incomeStability: 'stable',
      experience: 'intermediate',
      goal: 'short_term',
      liquidityNeed: false,
    });

    expect(result.riskScore).toBeGreaterThanOrEqual(8);
    expect(result.persona).toBe('growth_seeker');
  });

  it('hard filters coins appropriately for low-risk users', () => {
    const filtered = hardFilterCoins(SEED_COINS, {
      riskScore: 2,
      liquidityNeed: true,
    });

    // In low risk, market cap must be >= $10B (unless stablecoin)
    for (const coin of filtered) {
      if (coin.category !== 'stablecoin') {
        expect(coin.marketCap).toBeGreaterThanOrEqual(10_000_000_000);
      }
    }
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('allocations for all personas always sum to exactly 100', () => {
    const personas: ('cautious_saver' | 'balanced_builder' | 'growth_seeker')[] = [
      'cautious_saver',
      'balanced_builder',
      'growth_seeker',
    ];

    for (const persona of personas) {
      const { matches } = rankCoins(SEED_COINS, persona, ['smart_contract', 'store_of_value']);
      const { allocation } = generateAllocation(matches, SEED_COINS, persona);

      const total = allocation.reduce((sum, item) => sum + item.percent, 0);
      expect(total).toBe(100);

      // Verify each holding is positive
      for (const item of allocation) {
        expect(item.percent).toBeGreaterThan(0);
      }
    }
  });

  it('generates between 2 and 4 plain-language reasons per match', () => {
    const btc = SEED_COINS.find((c) => c.symbol === 'BTC')!;
    const scores = {
      liquidity: 95,
      stability: 80,
      size: 100,
      trackRecord: 100,
      categoryFit: 100,
    };

    const { reasons, warnings } = generateExplanations(btc, scores, {
      riskScore: 5,
      liquidityNeed: true,
      categories: ['store_of_value'],
      horizonYears: 3,
    });

    expect(reasons.length).toBeGreaterThanOrEqual(2);
    expect(reasons.length).toBeLessThanOrEqual(4);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('runs stress test and computes portfolio drawdown', () => {
    const testProfile: InvestorProfile = {
      userId: 'test_user',
      goal: 'grow',
      amount: 10000,
      currency: 'USD',
      horizonYears: 3,
      experience: 'beginner',
      incomeStability: 'stable',
      lossReaction: 'hold',
      riskPreference: 3,
      liquidityNeed: false,
      categories: ['smart_contract'],
      riskScore: 6,
      persona: 'balanced_builder',
    };

    const { allocation } = runFullMatchEngine(testProfile, SEED_COINS);
    const stressResult = runStressTest(allocation, SEED_COINS, 'crash_2022', 10000, 'USD');

    expect(stressResult.portfolioDrawdownPercent).toBeGreaterThan(0);
    expect(stressResult.portfolioLossAmount).toBeGreaterThan(0);
    expect(stressResult.perCoinContribution.length).toBe(allocation.length);
  });

  it('runs backtest and returns realistic timeseries metrics', () => {
    const testProfile: InvestorProfile = {
      userId: 'test_user',
      goal: 'grow',
      amount: 10000,
      currency: 'USD',
      horizonYears: 3,
      experience: 'beginner',
      incomeStability: 'stable',
      lossReaction: 'hold',
      riskPreference: 3,
      liquidityNeed: false,
      categories: ['smart_contract'],
      riskScore: 6,
      persona: 'balanced_builder',
    };

    const { allocation } = runFullMatchEngine(testProfile, SEED_COINS);
    const backtestResult = runBacktest(allocation, SEED_COINS, 10000, '1y');

    expect(backtestResult.timeseries.length).toBe(13); // 12 months + start
    expect(backtestResult.maxDrawdownPercent).toBeGreaterThanOrEqual(0);
  });
});
