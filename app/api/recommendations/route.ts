import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db/mockDb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');

  const allRecs = Array.from(mockDb.recommendations.values());

  if (role === 'advisor') {
    return NextResponse.json({
      success: true,
      recommendations: allRecs,
      versions: mockDb.recommendationVersions,
    });
  }

  if (userId) {
    const userRecs = allRecs.filter((r) => r.investorId === userId);
    return NextResponse.json({
      success: true,
      recommendations: userRecs,
      versions: mockDb.recommendationVersions.filter((v) =>
        userRecs.some((r) => r.id === v.recommendationId)
      ),
    });
  }

  return NextResponse.json({
    success: true,
    recommendations: allRecs,
  });
}
