export const TOKENS = {
  colors: {
    bgVoid: '#08090C',
    bgDeep: '#0E1015',
    surface: '#14171E',
    surfaceRaised: '#1B2029',
    surfaceGlass: 'rgba(20, 24, 32, 0.70)',
    borderSubtle: 'rgba(168, 196, 216, 0.12)',
    borderGlow: 'rgba(168, 196, 216, 0.45)',
    textPrimary: '#F0F4F8',
    textSecondary: '#9EAEBE',
    textMuted: '#637384',
    accent: '#8FB8D6',
    accent2: '#D4A373',
    success: '#68CFA4',
    warning: '#E5B888',
    danger: '#E06D77',
    gold: '#D4A373',
  },
  categories: {
    store_of_value: {
      color: '#D4A373',
      label: 'Store of Value',
      desc: 'Digital gold and foundational collateral',
    },
    smart_contract: {
      color: '#8FB8D6',
      label: 'Smart Contract Platforms',
      desc: 'Layer-1 networks powering decentralized apps',
    },
    defi: {
      color: '#B69EC9',
      label: 'Decentralized Finance',
      desc: 'Financial protocols without centralized intermediaries',
    },
    stablecoin: {
      color: '#68CFA4',
      label: 'Stablecoins',
      desc: 'Pegged currency assets for risk management and liquidity',
    },
    other: {
      color: '#9EAEBE',
      label: 'Other',
      desc: 'Cross-chain, oracles, and infrastructure',
    },
  },
  personas: {
    cautious_saver: {
      id: 'cautious_saver',
      name: 'Cautious Saver',
      range: '1 - 3',
      primary: '#68CFA4',
      secondary: '#2E6953',
      description: 'Capital preservation first, stability over rapid growth.',
      shape: 'Mostly BTC/ETH plus a large stablecoin buffer.',
    },
    balanced_builder: {
      id: 'balanced_builder',
      name: 'Balanced Builder',
      range: '4 - 7',
      primary: '#8FB8D6',
      secondary: '#D4A373',
      description: 'Steady long-term growth with calculated, controlled risk.',
      shape: 'BTC/ETH core plus a curated mid-cap slice.',
    },
    growth_seeker: {
      id: 'growth_seeker',
      name: 'Growth Seeker',
      range: '8 - 10',
      primary: '#D4A373',
      secondary: '#E06D77',
      description: 'Accepts large swings in pursuit of higher upside.',
      shape: 'Core plus a larger mid-cap slice, minimal stable buffer.',
    },
  },
  elevation: {
    z0: '0 1px 0 rgba(168, 196, 216, 0.04) inset',
    z1: '0 6px 16px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(168, 196, 216, 0.08) inset',
    z2: '0 14px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(168, 196, 216, 0.12)',
    z3: '0 24px 50px rgba(0, 0, 0, 0.65), 0 0 24px rgba(143, 184, 214, 0.16)',
    z4: '0 34px 70px rgba(0, 0, 0, 0.75), 0 0 40px rgba(212, 163, 115, 0.22)',
  },
  motion: {
    fast: 150,
    base: 280,
    slow: 600,
    scene: 1200,
  },
} as const;

export type CategoryKey = keyof typeof TOKENS.categories;
export type PersonaKey = keyof typeof TOKENS.personas;
