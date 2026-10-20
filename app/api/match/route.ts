import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runFullMatchEngine } from '@/lib/engine';
import { getMarketCoins } from '@/lib/data/coingecko';
import { mockDb } from '@/lib/db/mockDb';

const matchSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = matchSchema.parse(body);

    const profile = mockDb.profiles.get(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Investor profile not found. Please complete onboarding first.' },
        { status: 404 }
      );
    }

    const coins = await getMarketCoins();
    const result = runFullMatchEngine(profile, coins);

    mockDb.recommendations.set(result.recommendation.id, result.recommendation);
    mockDb.recommendationVersions.push({
      id: `ver_1_${Date.now()}`,
      recommendationId: result.recommendation.id,
      version: 1,
      allocation: JSON.parse(JSON.stringify(result.recommendation.allocation)),
      entryPlan: result.recommendation.entryPlan,
      advisorNote: result.recommendation.advisorNote,
      status: result.recommendation.status,
      updatedAt: result.recommendation.createdAt,
      updatedBy: 'engine',
    });

    return NextResponse.json({
      success: true,
      matches: result.matches,
      allocation: result.allocation,
      recommendation: result.recommendation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to run matching engine' }, { status: 500 });
  }
}
