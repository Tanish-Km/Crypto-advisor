import { AllocationItem, Coin, Match, PersonaType } from '@/types';

export interface AllocationResult {
  allocation: AllocationItem[];
}

export function generateAllocation(
  matches: Match[],
  coins: Coin[],
  persona: PersonaType
): AllocationResult {
  const coinMap = new Map<string, Coin>();
  for (const c of coins) {
    coinMap.set(c.id, c);
  }

  // Separate matched coins into buckets
  const stableCoins = matches.filter((m) => {
    const c = coinMap.get(m.coinId);
    return c?.category === 'stablecoin';
  });

  const coreCoins = matches.filter((m) => {
    const c = coinMap.get(m.coinId);
    return c?.symbol === 'BTC' || c?.symbol === 'ETH';
  });

  const midCapCoins = matches.filter((m) => {
    const c = coinMap.get(m.coinId);
    return c?.category !== 'stablecoin' && c?.symbol !== 'BTC' && c?.symbol !== 'ETH';
  });

  const items: AllocationItem[] = [];

  // Targets by persona
  let targetStable = 15;
  let targetCore = 60;
  let targetMid = 25;
  let maxSingleNonStable = 45;

  if (persona === 'cautious_saver') {
    targetStable = 35;
    targetCore = 60;
    targetMid = 5;
    maxSingleNonStable = 50;
  } else if (persona === 'balanced_builder') {
    targetStable = 15;
    targetCore = 60;
    targetMid = 25;
    maxSingleNonStable = 45;
  } else if (persona === 'growth_seeker') {
    targetStable = 5;
    targetCore = 50;
    targetMid = 45;
    maxSingleNonStable = 35;
  }

  // 1. Stablecoin allocation
  if (targetStable > 0 && stableCoins.length > 0) {
    const topStable = stableCoins[0];
    const coin = coinMap.get(topStable.coinId)!;
    items.push({
      coinId: topStable.coinId,
      percent: targetStable,
      rationale: 'Liquid reserve buffer for capital preservation and volatility mitigation.',
      risk: 'Counterparty custodian or regulatory peg friction.',
      reconsiderWhen: 'If yields compress severely or custodian reserves face audit concerns.',
      coin,
    });
  } else if (targetStable > 0) {
    // If no stablecoin matched, add back to core
    targetCore += targetStable;
  }

  // 2. Core (BTC + ETH) allocation
  if (coreCoins.length >= 2) {
    // Distribute between BTC and ETH
    const btcShare = Math.round(targetCore * 0.6);
    const ethShare = targetCore - btcShare;

    const btcMatch = coreCoins.find((c) => coinMap.get(c.coinId)?.symbol === 'BTC') || coreCoins[0];
    const ethMatch = coreCoins.find((c) => coinMap.get(c.coinId)?.symbol === 'ETH') || coreCoins[1];

    items.push({
      coinId: btcMatch.coinId,
      percent: Math.min(btcShare, maxSingleNonStable),
      rationale: 'Foundational store-of-value anchor with highest institutional adoption and security.',
      risk: 'Macro liquidity pullbacks and multi-month cyclical drawdowns.',
      reconsiderWhen: 'Sustained network hashrate drop or fundamental shift in store-of-value thesis.',
      coin: coinMap.get(btcMatch.coinId),
    });

    items.push({
      coinId: ethMatch.coinId,
      percent: Math.min(ethShare, maxSingleNonStable),
      rationale: 'Primary smart contract settlement layer with established developer ecosystem and fee burn.',
      risk: 'Layer-1 fee competition and protocol upgrade risks.',
      reconsiderWhen: 'Protracted loss of developer market share to competing high-speed layer-1s.',
      coin: coinMap.get(ethMatch.coinId),
    });
  } else if (coreCoins.length === 1) {
    const singleCore = coreCoins[0];
    items.push({
      coinId: singleCore.coinId,
      percent: Math.min(targetCore, maxSingleNonStable),
      rationale: 'Core foundational crypto asset providing baseline portfolio resilience.',
      risk: 'General crypto market cyclical downturns.',
      reconsiderWhen: 'Major structural breakdown in blockchain adoption.',
      coin: coinMap.get(singleCore.coinId),
    });
  }

  // 3. Mid-cap allocation
  if (targetMid > 0 && midCapCoins.length > 0) {
    // Take top 1 or 2 mid caps
    const count = targetMid >= 25 && midCapCoins.length >= 2 ? 2 : 1;
    const midSlice = midCapCoins.slice(0, count);
    const splitPercent = Math.floor(targetMid / midSlice.length);

    midSlice.forEach((m, idx) => {
      const p = idx === midSlice.length - 1 ? targetMid - splitPercent * (midSlice.length - 1) : splitPercent;
      const coin = coinMap.get(m.coinId)!;
      items.push({
        coinId: m.coinId,
        percent: Math.min(p, maxSingleNonStable),
        rationale: `Growth satellite providing targeted exposure to ${coin.category.replace('_', ' ')} ecosystem expansion.`,
        risk: 'Higher beta volatility and sharper drawdowns during market corrections.',
        reconsiderWhen: 'Ecosystem activity stagnation or prolonged loss of developer momentum.',
        coin,
      });
    });
  }

  // 4. Ensure sum equals exactly 100
  let currentSum = items.reduce((acc, item) => acc + item.percent, 0);

  if (items.length > 0 && currentSum !== 100) {
    const diff = 100 - currentSum;
    // Find the largest holding to absorb or release the difference
    let largestIndex = 0;
    for (let i = 1; i < items.length; i++) {
      if (items[i].percent > items[largestIndex].percent) {
        largestIndex = i;
      }
    }
    items[largestIndex].percent += diff;
  }

  // Double check integer rounding and positive bounds
  currentSum = items.reduce((acc, item) => acc + item.percent, 0);
  if (currentSum !== 100 && items.length > 0) {
    items[0].percent += 100 - currentSum;
  }

  return { allocation: items };
}
