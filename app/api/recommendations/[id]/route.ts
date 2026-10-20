import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/lib/db/mockDb';
import { RecommendationVersion } from '@/types';

const allocationItemSchema = z.object({
  coinId: z.string().min(1),
  percent: z.number().int().min(1).max(100),
  rationale: z.string().min(1, 'Rationale cannot be empty'),
  risk: z.string().min(1, 'Risk statement cannot be empty'),
  reconsiderWhen: z.string().min(1, 'Reconsider condition cannot be empty'),
});

const patchSchema = z.object({
  status: z.enum(['pending_review', 'approved', 'edited', 'rejected']),
  advisorId: z.string().optional(),
  advisorNote: z.string().optional(),
  allocation: z.array(allocationItemSchema).refine(
    (items) => {
      const sum = items.reduce((acc, curr) => acc + curr.percent, 0);
      return sum === 100;
    },
    { message: 'Allocation percentages must sum to exactly 100%' }
  ),
  entryPlan: z
    .object({
      type: z.enum(['lump_sum', 'dca']),
      installments: z.number().optional(),
      intervalDays: z.number().optional(),
    })
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const existing = mockDb.recommendations.get(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = patchSchema.parse(body);

    const newVersion = existing.version + 1;
    const now = new Date().toISOString();

    const updated = {
      ...existing,
      status: parsed.status,
      advisorId: parsed.advisorId || existing.advisorId,
      advisorNote: parsed.advisorNote ?? existing.advisorNote,
      allocation: parsed.allocation,
      entryPlan: parsed.entryPlan ?? existing.entryPlan,
      source: 'advisor' as const,
      version: newVersion,
      approvedAt: parsed.status === 'approved' ? now : existing.approvedAt,
    };

    mockDb.recommendations.set(id, updated);

    // Save version history
    const versionRecord: RecommendationVersion = {
      id: `ver_${newVersion}_${Date.now()}`,
      recommendationId: id,
      version: newVersion,
      allocation: JSON.parse(JSON.stringify(parsed.allocation)),
      entryPlan: parsed.entryPlan ?? existing.entryPlan,
      advisorNote: parsed.advisorNote,
      status: parsed.status,
      updatedAt: now,
      updatedBy: parsed.advisorId || 'advisor',
    };
    mockDb.recommendationVersions.push(versionRecord);

    return NextResponse.json({
      success: true,
      recommendation: updated,
      version: versionRecord,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}
