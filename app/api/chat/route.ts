import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMarketCoins } from '@/lib/data/coingecko';
import { mockDb } from '@/lib/db/mockDb';

const chatSchema = z.object({
  userId: z.string(),
  coinId: z.string(),
  question: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, coinId, question } = chatSchema.parse(body);

    const profile = mockDb.profiles.get(userId);
    const coins = await getMarketCoins();
    const coin = coins.find((c) => c.id === coinId);

    if (!coin) {
      return NextResponse.json({ success: false, error: 'Coin not found' }, { status: 404 });
    }

    const personaLabel =
      profile?.persona === 'cautious_saver'
        ? 'Cautious Saver'
        : profile?.persona === 'growth_seeker'
        ? 'Growth Seeker'
        : 'Balanced Builder';

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are CryptoCompass AI, an educational explainer assistant for a risk-matched crypto guidance platform.
The user is a beginner.
Rules:
1. Ground your answer ONLY in the provided user profile and coin market metrics.
2. Never give speculative price targets or promise guaranteed returns.
3. Keep answers concise, objective, and beginner-friendly (under 120 words).

User Profile:
- Persona: ${personaLabel} (Risk score: ${profile?.riskScore || 5}/10)
- Horizon: ${profile?.horizonYears || 3} years
- Goal: ${profile?.goal || 'grow'}
- Liquidity need: ${profile?.liquidityNeed ? 'Yes' : 'No'}

Coin Data:
- Name: ${coin.name} (${coin.symbol})
- Category: ${coin.category}
- Market Cap: $${(coin.marketCap / 1e9).toFixed(1)}B
- 90-day Volatility: ${(coin.volatility90d * 100).toFixed(0)}%
- Historical Max Drawdown: ${(coin.maxDrawdown * 100).toFixed(0)}%
- Age: ${coin.ageYears} years

User question: "${question}"`;

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 300,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (anthropicRes.ok) {
          interface ClaudeResponse {
            content: { text: string }[];
          }
          const data: ClaudeResponse = await anthropicRes.json();
          const answer = data.content?.[0]?.text;
          if (answer) {
            return NextResponse.json({ success: true, answer });
          }
        }
      } catch {
        // Fall back to rule-grounded answer
      }
    }

    // Grounded rule-based intelligent explanation
    let answer = `As a ${personaLabel} with a risk score of ${profile?.riskScore || 6}/10, ${coin.name} (${coin.symbol}) was selected because `;
    if (coin.category === 'stablecoin') {
      answer += `it maintains a steady $1.00 valuation, providing capital preservation and liquidity without exposure to crypto drawdowns.`;
    } else if (coin.symbol === 'BTC') {
      answer += `it acts as the foundational store of value with a 15-year operational track record, high institutional adoption, and lower relative volatility than alternative tokens.`;
    } else if (coin.symbol === 'ETH') {
      answer += `it anchors the smart contract ecosystem with broad network utility, active developer participation, and deflationary fee mechanics.`;
    } else {
      answer += `it provides targeted exposure to ${coin.category.replace('_', ' ')} expansion while its ${coin.ageYears}-year track record and $${(coin.marketCap / 1e9).toFixed(1)}B market cap meet your profile's minimum liquidity thresholds.`;
    }

    if (profile?.liquidityNeed) {
      answer += ` Additionally, its high 24h trading volume ($${(coin.volume24h / 1e9).toFixed(1)}B) ensures you can exit easily if cash is required.`;
    }

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to process chat' }, { status: 500 });
  }
}
