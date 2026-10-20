export interface GlossaryTerm {
  slug: string;
  term: string;
  iconType: 'scale' | 'droplet' | 'wave' | 'shield' | 'calendar' | 'layers' | 'gyro' | 'split';
  shortDef: string;
  explanation: string;
  example: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: 'market-cap',
    term: 'Market Cap',
    iconType: 'scale',
    shortDef: 'Total value of all circulating coins in the market.',
    explanation: 'Calculated by multiplying the current coin price by the total number of circulating coins. High market cap coins are generally more established and resilient.',
    example: 'If a coin has 10 million coins priced at $10 each, its market cap is $100 million.',
  },
  {
    slug: 'liquidity',
    term: 'Liquidity',
    iconType: 'droplet',
    shortDef: 'How easily and quickly you can buy or sell without moving the price.',
    explanation: 'High liquidity means there are many buyers and sellers active right now. You can exit into cash whenever you need without taking a heavy loss on market slippage.',
    example: 'Selling $5,000 of Bitcoin takes milliseconds with zero price slip; selling an obscure token might move the price 10%.',
  },
  {
    slug: 'volatility',
    term: 'Volatility',
    iconType: 'wave',
    shortDef: 'The speed and magnitude of price swings up or down.',
    explanation: 'Volatility measures how wildly a price bounces over time. High volatility offers large profit potential but comes with elevated risk of rapid capital drawdowns.',
    example: 'A stablecoin has nearly 0% annual volatility, whereas meme tokens can swing 50% in a single day.',
  },
  {
    slug: 'max-drawdown',
    term: 'Max Drawdown',
    iconType: 'wave',
    shortDef: 'The largest historical percentage loss from peak to trough.',
    explanation: 'Drawdown tells you the worst pain an investor experienced if they bought at the absolute top before a major bear market or crash.',
    example: 'Bitcoin fell ~77% from $69,000 to $15,500 in 2022; this was its max drawdown during that cycle.',
  },
  {
    slug: 'stablecoin',
    term: 'Stablecoin',
    iconType: 'shield',
    shortDef: 'Cryptocurrency pegged 1:1 to a real-world currency like the US Dollar.',
    explanation: 'Backed by bank deposits, short-term US treasuries, or algorithmic vaults to maintain a constant $1.00 valuation for safety and parking capital.',
    example: 'USDC and USDT stay at $1.00, allowing you to lock in gains without converting to physical fiat bank wires.',
  },
  {
    slug: 'smart-contracts',
    term: 'Smart Contracts',
    iconType: 'layers',
    shortDef: 'Self-executing code stored on the blockchain without middlemen.',
    explanation: 'Programs that automatically enforce agreements when predetermined conditions are met. Ethereum and Solana are primary platforms that host them.',
    example: 'A decentralized loan that automatically releases collateral to you the second your payment is confirmed on-chain.',
  },
  {
    slug: 'dca',
    term: 'Dollar-Cost Averaging (DCA)',
    iconType: 'calendar',
    shortDef: 'Investing fixed amounts at regular intervals regardless of price.',
    explanation: 'Instead of risking a lump-sum right before a market drop, DCA smooths your average purchase price across dips and rallies over weeks or months.',
    example: 'Investing $250 every Sunday for 4 weeks rather than $1,000 all at once.',
  },
  {
    slug: 'rebalancing',
    term: 'Portfolio Rebalancing',
    iconType: 'gyro',
    shortDef: 'Adjusting asset weights back to your target risk allocation.',
    explanation: 'When one coin surges, it can grow to represent too much of your total portfolio, exposing you to unintended risk. Rebalancing restores your planned target.',
    example: 'Trimming an over-performing asset from 60% back to your advisor-approved 45% target and moving gains into a stable buffer.',
  },
];
