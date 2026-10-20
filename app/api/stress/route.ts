import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runStressTest, STRESS_SCENARIOS } from '@/lib/engine/stress';
import { getMarketCoins } from '@/lib/data/coingecko';

const stressSchema = z.object({
  allocation: z.array(
    z.object({
      coinId: z.string(),
      percent: z.number(),
    })
  ),
  scenarioId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  customPercent: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = stressSchema.parse(body);

    const coins = await getMarketCoins();
    const allocationItems = parsed.allocation.map((a) => ({
      coinId: a.coinId,
      percent: a.percent,
      rationale: '',
      risk: '',
      reconsiderWhen: '',
    }));

    const result = runStressTest(
      allocationItems,
      coins,
      parsed.scenarioId,
      parsed.amount,
      parsed.currency,
      parsed.customPercent
    );

    return NextResponse.json({
      success: true,
      scenarios: STRESS_SCENARIOS,
      stressResult: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Stress test failed' }, { status: 500 });
  }
}
