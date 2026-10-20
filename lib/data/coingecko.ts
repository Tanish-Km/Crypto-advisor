import { Coin } from '@/types';
import { SEED_COINS } from './seedCoins';
import { getCached, setCached } from './cache';

const CACHE_KEY = 'coingecko_market_data';
const CACHE_TTL_SECONDS = 300; // 5 minutes

export async function getMarketCoins(): Promise<Coin[]> {
  const cached = getCached<Coin[]>(CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    const ids = SEED_COINS.map((c) => c.id).join(',');
    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=30d,90d`,
      {
        headers,
        signal: controller.signal,
        next: { revalidate: 300 },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CoinGecko responded with status ${response.status}`);
    }

    interface CoinGeckoMarketItem {
      id: string;
      symbol: string;
      name: string;
      current_price: number;
      market_cap: number;
      total_volume: number;
      price_change_percentage_30d_in_currency?: number;
      price_change_percentage_90d_in_currency?: number;
      price_change_percentage_24h?: number;
    }

    const data: CoinGeckoMarketItem[] = await response.json();

    const mergedCoins: Coin[] = SEED_COINS.map((seed) => {
      const live = data.find((d) => d.id === seed.id);
      if (!live) return seed;

      return {
        ...seed,
        price: live.current_price ?? seed.price,
        marketCap: live.market_cap ?? seed.marketCap,
        volume24h: live.total_volume ?? seed.volume24h,
        change30d: live.price_change_percentage_30d_in_currency ?? seed.change30d,
        change90d: live.price_change_percentage_90d_in_currency ?? seed.change90d,
        lastUpdated: new Date().toISOString(),
      };
    });

    setCached(CACHE_KEY, mergedCoins, CACHE_TTL_SECONDS);
    return mergedCoins;
  } catch {
    // Graceful fallback to rich seed coins
    setCached(CACHE_KEY, SEED_COINS, 60); // Cache fallback for 1 minute
    return SEED_COINS;
  }
}
