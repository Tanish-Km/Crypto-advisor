import { NextResponse } from 'next/server';
import { getMarketCoins } from '@/lib/data/coingecko';

export async function GET() {
  try {
    const coins = await getMarketCoins();
    return NextResponse.json({ success: true, coins });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
