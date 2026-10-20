import { AllocationItem, Coin, StressScenarioResult } from '@/types';

export interface StressScenarioDef {
  id: string;
  name: string;
  description: string;
  historicalPeriod: string;
  drawdowns: Record<string, number>; // coinId or symbol to percentage drawdown (e.g. 0.77 for -77%)
  categoryFallback: Record<string, number>;
}

export const STRESS_SCENARIOS: StressScenarioDef[] = [
  {
    id: 'bear_2018',
    name: '2018 Crypto Winter',
    description: 'The post-2017 macro contraction lasting 12+ months across all digital assets.',
    historicalPeriod: 'Dec 2017 – Dec 2018',
    drawdowns: {
      bitcoin: 0.84,
      ethereum: 0.94,
      ripple: 0.96,
      'usd-coin': 0.01,
      tether: 0.015,
    },
    categoryFallback: {
      store_of_value: 0.84,
      smart_contract: 0.94,
      defi: 0.95,
      stablecoin: 0.01,
      other: 0.95,
    },
  },
  {
    id: 'crash_2022',
    name: '2022 Liquidity Contraction',
    description: 'Federal Reserve rate hiking cycle and major centralized crypto lender liquidations.',
    historicalPeriod: 'Nov 2021 – Nov 2022',
    drawdowns: {
      bitcoin: 0.77,
      ethereum: 0.82,
      solana: 0.96,
      binancecoin: 0.79,
      cardano: 0.92,
      polkadot: 0.94,
      'avalanche-2': 0.93,
      chainlink: 0.89,
      uniswap: 0.91,
      'usd-coin': 0.01,
      tether: 0.015,
    },
    categoryFallback: {
      store_of_value: 0.77,
      smart_contract: 0.85,
      defi: 0.90,
      stablecoin: 0.01,
      other: 0.90,
    },
  },
  {
    id: 'market_shock',
    name: 'Severe Market Shock (-50%)',
    description: 'A sudden liquidity flash crash causing sharp broad-market capitulation.',
    historicalPeriod: 'Hypothetical 30-day stress',
    drawdowns: {
      'usd-coin': 0.01,
      tether: 0.01,
    },
    categoryFallback: {
      store_of_value: 0.45,
      smart_contract: 0.55,
      defi: 0.65,
      stablecoin: 0.01,
      other: 0.60,
    },
  },
];

export function runStressTest(
  allocation: AllocationItem[],
  coins: Coin[],
  scenarioId: string,
  totalAmount: number,
  currency: string = 'USD',
  customPercent?: number
): StressScenarioResult {
  const scenario = STRESS_SCENARIOS.find((s) => s.id === scenarioId) || STRESS_SCENARIOS[1];
  const coinMap = new Map<string, Coin>();
  for (const c of coins) {
    coinMap.set(c.id, c);
  }

  let totalPortfolioLoss = 0;

  const perCoinContribution = allocation.map((item) => {
    const coin = coinMap.get(item.coinId);
    const itemAmount = (item.percent / 100) * totalAmount;

    let drawdownFraction = 0;
    let isFallback = false;

    if (customPercent !== undefined && scenarioId === 'custom') {
      if (coin?.category === 'stablecoin') {
        drawdownFraction = 0.01;
      } else {
        drawdownFraction = Math.max(0.05, Math.min(0.99, customPercent / 100));
      }
    } else {
      if (coin && scenario.drawdowns[coin.id] !== undefined) {
        drawdownFraction = scenario.drawdowns[coin.id];
      } else if (coin && scenario.categoryFallback[coin.category] !== undefined) {
        drawdownFraction = scenario.categoryFallback[coin.category];
        isFallback = true;
      } else {
        drawdownFraction = coin?.category === 'stablecoin' ? 0.01 : 0.80;
        isFallback = true;
      }
    }

    const lossAmount = itemAmount * drawdownFraction;
    totalPortfolioLoss += lossAmount;

    return {
      coinId: item.coinId,
      symbol: coin?.symbol || item.coinId.toUpperCase(),
      allocationPercent: item.percent,
      drawdownPercent: Math.round(drawdownFraction * 100),
      lossAmount: Math.round(lossAmount),
      isFallbackApproximate: isFallback,
    };
  });

  const portfolioDrawdownPercent =
    totalAmount > 0 ? Math.round((totalPortfolioLoss / totalAmount) * 100) : 0;

  return {
    scenarioName: scenario.name,
    portfolioDrawdownPercent,
    portfolioLossAmount: Math.round(totalPortfolioLoss),
    currency,
    perCoinContribution,
  };
}
