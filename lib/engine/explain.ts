import { Coin, CoinScores, InvestorProfile } from '@/types';

export function generateExplanations(
  coin: Coin,
  scores: CoinScores,
  profile: Pick<InvestorProfile, 'riskScore' | 'liquidityNeed' | 'categories' | 'horizonYears'>
): { reasons: string[]; warnings: string[] } {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Stability / Risk explanation
  if (coin.category === 'stablecoin') {
    reasons.push('Designed for capital preservation with negligible price fluctuations.');
  } else if (scores.stability >= 65) {
    reasons.push(
      profile.riskScore <= 3
        ? 'Fits your low risk tolerance: historically less volatile than the broader crypto market.'
        : 'Solid stability score helping anchor your portfolio against sharp downward swings.'
    );
  } else if (profile.riskScore >= 7) {
    reasons.push('Matches your growth posture with strong upside sensitivity during market expansions.');
  }

  // Liquidity explanation
  if (scores.liquidity >= 70) {
    if (profile.liquidityNeed) {
      reasons.push('Highly liquid: deep order books allow rapid exit into cash without price slippage.');
    } else {
      reasons.push('Exceptional market liquidity with over $1B+ in daily global trading volume.');
    }
  }

  // Track record
  if (coin.ageYears >= 7) {
    reasons.push(`Tested across multiple market cycles with over ${coin.ageYears} years of operational history.`);
  } else if (scores.trackRecord >= 50) {
    reasons.push('Proven track record through major industry stress tests and network upgrades.');
  }

  // Size / Market Cap
  if (scores.size >= 80) {
    reasons.push('Foundational tier-1 market capitalization with institutional-grade adoption.');
  }

  // Category fit
  if (profile.categories.includes(coin.category)) {
    const catLabel = coin.category.replace('_', ' ');
    reasons.push(`Directly matches your interest in ${catLabel} innovation.`);
  }

  // Fallback if fewer than 2 reasons
  if (reasons.length < 2) {
    reasons.push('Well-capitalized network with active developer and node participation.');
  }
  if (reasons.length < 2) {
    reasons.push('Complementary diversification benefits alongside your primary holdings.');
  }

  // Limit reasons to 2-4
  const finalReasons = reasons.slice(0, 4);

  // Warnings
  if (coin.category !== 'stablecoin') {
    warnings.push('Price can fall sharply in market downturns; invest only what you can afford to lose.');
    if (coin.volatility90d > 0.65) {
      warnings.push('Elevated volatility: swings exceeding 20-30% within a month are common.');
    }
  } else {
    warnings.push('Subject to regulatory custody changes and banking partner counterparty risks.');
  }

  return { reasons: finalReasons, warnings };
}
