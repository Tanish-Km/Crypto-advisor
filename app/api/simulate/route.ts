import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runBacktest } from '@/lib/engine/backtest';
import { getMarketCoins } from '@/lib/data/coingecko';

const simulateSchema = z.object({
  allocation: z.array(
    z.object({
      coinId: z.string(),
      percent: z.number(),
    })
  ),
  amount: z.number().positive(),
  window: z.enum(['1y', '3y', 'max']).default('1y'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = simulateSchema.parse(body);

    const coins = await getMarketCoins();
    const allocationItems = parsed.allocation.map((a) => ({
      coinId: a.coinId,
      percent: a.percent,
      rationale: '',
      risk: '',
      reconsiderWhen: '',
    }));

    const result = runBacktest(allocationItems, coins, parsed.amount, parsed.window);

    return NextResponse.json({
      success: true,
      simulation: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Simulation failed' }, { status: 500 });
  }
}
