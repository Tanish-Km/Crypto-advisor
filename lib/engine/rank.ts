import { Coin, CoinScores, Match, PersonaType } from '@/types';

export interface PersonaWeights {
  liquidity: number;
  stability: number;
  size: number;
  trackRecord: number;
  categoryFit: number;
}

export const PERSONA_WEIGHTS: Record<PersonaType, PersonaWeights> = {
  cautious_saver: {
    liquidity: 0.20,
    stability: 0.35,
    size: 0.20,
    trackRecord: 0.15,
    categoryFit: 0.10,
  },
  balanced_builder: {
    liquidity: 0.20,
    stability: 0.20,
    size: 0.20,
    trackRecord: 0.15,
    categoryFit: 0.25,
  },
  growth_seeker: {
    liquidity: 0.15,
    stability: 0.10,
    size: 0.15,
    trackRecord: 0.10,
    categoryFit: 0.50,
  },
};

export const GROWTH_FALLBACK_WEIGHTS: PersonaWeights = {
  liquidity: 0.25,
  stability: 0.15,
  size: 0.25,
  trackRecord: 0.15,
  categoryFit: 0.20,
};

function normalize(val: number, min: number, max: number): number {
  if (max <= min) return 50;
  const clamped = Math.max(min, Math.min(max, val));
  return ((clamped - min) / (max - min)) * 100;
}

export function computeSubScores(coins: Coin[], userCategories: string[]): Map<string, CoinScores> {
  const result = new Map<string, CoinScores>();
  if (coins.length === 0) return result;

  // Find min/max for normalization
  const volumes = coins.map((c) => c.volume24h);
  const minVol = Math.min(...volumes);
  const maxVol = Math.max(...volumes);

  const volRatios = coins.map((c) => (c.marketCap > 0 ? c.volume24h / c.marketCap : 0));
  const minRatio = Math.min(...volRatios);
  const maxRatio = Math.max(...volRatios);

  const volatilities = coins.map((c) => c.volatility90d);
  const minVolat = Math.min(...volatilities);
  const maxVolat = Math.max(...volatilities);

  const drawdowns = coins.map((c) => c.maxDrawdown);
  const minDd = Math.min(...drawdowns);
  const maxDd = Math.max(...drawdowns);

  const logCaps = coins.map((c) => Math.log10(Math.max(1, c.marketCap)));
  const minCap = Math.min(...logCaps);
  const maxCap = Math.max(...logCaps);

  const hasPreferences = userCategories.length > 0 && !userCategories.includes('no_preference');

  for (const coin of coins) {
    // 1. Liquidity: blend of absolute volume and volume/marketCap ratio
    const normVol = normalize(coin.volume24h, minVol, maxVol);
    const ratio = coin.marketCap > 0 ? coin.volume24h / coin.marketCap : 0;
    const normRatio = normalize(ratio, minRatio, maxRatio);
    const liquidity = Math.round(normVol * 0.5 + normRatio * 0.5);

    // 2. Stability: inverse of volatility and maxDrawdown
    const invVolat = 100 - normalize(coin.volatility90d, minVolat, maxVolat);
    const invDd = 100 - normalize(coin.maxDrawdown, minDd, maxDd);
    const stability = Math.round(invVolat * 0.5 + invDd * 0.5);

    // 3. Size: log-scaled marketCap
    const logCap = Math.log10(Math.max(1, coin.marketCap));
    const size = Math.round(normalize(logCap, minCap, maxCap));

    // 4. Track Record: ageYears capped at 10
    const trackRecord = Math.round(Math.min(10, Math.max(1, coin.ageYears)) * 10);

    // 5. Category Fit: 100 if preferred, 50 if no preference, 20 otherwise
    let categoryFit = 50;
    if (hasPreferences) {
      categoryFit = userCategories.includes(coin.category) ? 100 : 20;
    }

    result.set(coin.id, {
      liquidity,
      stability,
      size,
      trackRecord,
      categoryFit,
    });
  }

  return result;
}

export function rankCoins(
  coins: Coin[],
  persona: PersonaType,
  userCategories: string[]
): { matches: Match[]; weightsUsed: PersonaWeights } {
  const scoresMap = computeSubScores(coins, userCategories);

  const hasMeaningfulCategories =
    userCategories.length > 0 && !userCategories.includes('no_preference');

  let weights = PERSONA_WEIGHTS[persona];
  if (persona === 'growth_seeker' && !hasMeaningfulCategories) {
    weights = GROWTH_FALLBACK_WEIGHTS;
  }

  const matches: Match[] = coins.map((coin) => {
    const scores = scoresMap.get(coin.id) ?? {
      liquidity: 50,
      stability: 50,
      size: 50,
      trackRecord: 50,
      categoryFit: 50,
    };

    const rawMatch =
      weights.liquidity * scores.liquidity +
      weights.stability * scores.stability +
      weights.size * scores.size +
      weights.trackRecord * scores.trackRecord +
      weights.categoryFit * scores.categoryFit;

    // Match percent clamped 0..100
    const matchPercent = Math.max(10, Math.min(99, Math.round(rawMatch)));

    return {
      coinId: coin.id,
      coin,
      matchPercent,
      scores,
      reasons: [],
      warnings: [],
    };
  });

  // Sort descending by matchPercent
  matches.sort((a, b) => b.matchPercent - a.matchPercent);

  return { matches, weightsUsed: weights };
}
