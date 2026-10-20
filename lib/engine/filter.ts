import { Coin } from '@/types';

export interface FilterParams {
  riskScore: number;
  liquidityNeed: boolean;
}

export function hardFilterCoins(coins: Coin[], params: FilterParams): Coin[] {
  // First pass: basic flags and absolute volume
  let eligible = coins.filter((coin) => {
    // Exclude unaudited or anonymous_team flags
    if (coin.flags.includes('unaudited') || coin.flags.includes('anonymous_team')) {
      return false;
    }

    // Liquidity check: volume / marketCap < 0.01 or volume < $5M
    const volumeRatio = coin.marketCap > 0 ? coin.volume24h / coin.marketCap : 0;
    if (volumeRatio < 0.01 || coin.volume24h < 5_000_000) {
      return false;
    }

    // Low liquidity flag filter if user has explicit liquidityNeed
    if (params.liquidityNeed && coin.flags.includes('low_liquidity')) {
      return false;
    }

    // Size checks
    if (params.riskScore <= 3) {
      // Exclude market cap < $10B unless it's a stablecoin
      if (coin.category !== 'stablecoin' && coin.marketCap < 10_000_000_000) {
        return false;
      }
    } else if (params.riskScore <= 7) {
      // Exclude market cap < $1B
      if (coin.marketCap < 1_000_000_000) {
        return false;
      }
    }

    return true;
  });

  // Volatility cap check for low risk: exclude volatility90d above 70th percentile of the candidate set
  if (params.riskScore <= 3 && eligible.length > 2) {
    const volatilities = [...eligible].map((c) => c.volatility90d).sort((a, b) => a - b);
    const p70Index = Math.floor(volatilities.length * 0.7);
    const p70Threshold = volatilities[p70Index];

    eligible = eligible.filter((coin) => {
      // Stablecoins are never excluded by volatility cap
      if (coin.category === 'stablecoin') return true;
      return coin.volatility90d <= p70Threshold;
    });
  }

  return eligible;
}
