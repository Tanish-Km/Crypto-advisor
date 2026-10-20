import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeRiskScore } from '@/lib/engine';
import { mockDb } from '@/lib/db/mockDb';
import { InvestorProfile } from '@/types';

const profileSchema = z.object({
  userId: z.string().min(1),
  goal: z.enum(['save', 'grow', 'learn', 'short_term']),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  horizonYears: z.number().positive(),
  experience: z.enum(['none', 'beginner', 'intermediate']),
  incomeStability: z.enum(['stable', 'variable', 'uncertain']),
  lossReaction: z.enum(['sell_all', 'sell_some', 'hold', 'buy_more']),
  riskPreference: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  liquidityNeed: z.boolean(),
  categories: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = profileSchema.parse(body);

    const { riskScore, persona } = computeRiskScore({
      lossReaction: parsed.lossReaction,
      riskPreference: parsed.riskPreference,
      horizonYears: parsed.horizonYears,
      incomeStability: parsed.incomeStability,
      experience: parsed.experience,
      goal: parsed.goal,
      liquidityNeed: parsed.liquidityNeed,
    });

    const fullProfile: InvestorProfile = {
      ...parsed,
      riskScore,
      persona,
    };

    mockDb.profiles.set(parsed.userId, fullProfile);

    return NextResponse.json({
      success: true,
      profile: fullProfile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error saving profile' },
      { status: 500 }
    );
  }
}
