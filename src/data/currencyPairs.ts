import type { CurrencyPair } from '@/types/currency';

export const INITIAL_PAIRS: Omit<CurrencyPair, 'currentPrice' | 'high24h' | 'low24h' | 'changePercent'>[] = [
  { id: 'btc-usd', name: 'BTC/USD', base: 'BTC', quote: 'USD', category: 'crypto', basePrice: 84320.50 },
  { id: 'eth-usd', name: 'ETH/USD', base: 'ETH', quote: 'USD', category: 'crypto', basePrice: 3256.75 },
  { id: 'xrp-usd', name: 'XRP/USD', base: 'XRP', quote: 'USD', category: 'crypto', basePrice: 2.45 },
  { id: 'sol-usd', name: 'SOL/USD', base: 'SOL', quote: 'USD', category: 'crypto', basePrice: 198.30 },
  { id: 'ada-usd', name: 'ADA/USD', base: 'ADA', quote: 'USD', category: 'crypto', basePrice: 0.85 },
  { id: 'doge-usd', name: 'DOGE/USD', base: 'DOGE', quote: 'USD', category: 'crypto', basePrice: 0.32 },
  { id: 'dot-usd', name: 'DOT/USD', base: 'DOT', quote: 'USD', category: 'crypto', basePrice: 7.20 },
  { id: 'link-usd', name: 'LINK/USD', base: 'LINK', quote: 'USD', category: 'crypto', basePrice: 18.65 },
  { id: 'usd-eur', name: 'USD/EUR', base: 'USD', quote: 'EUR', category: 'fiat', basePrice: 0.9234 },
  { id: 'usd-gbp', name: 'USD/GBP', base: 'USD', quote: 'GBP', category: 'fiat', basePrice: 0.7845 },
  { id: 'usd-jpy', name: 'USD/JPY', base: 'USD', quote: 'JPY', category: 'fiat', basePrice: 149.85 },
  { id: 'usd-chf', name: 'USD/CHF', base: 'USD', quote: 'CHF', category: 'fiat', basePrice: 0.8745 },
  { id: 'usd-aud', name: 'USD/AUD', base: 'USD', quote: 'AUD', category: 'fiat', basePrice: 1.5234 },
  { id: 'usd-cad', name: 'USD/CAD', base: 'USD', quote: 'CAD', category: 'fiat', basePrice: 1.3645 },
  { id: 'usd-cny', name: 'USD/CNY', base: 'USD', quote: 'CNY', category: 'fiat', basePrice: 7.2345 },
  { id: 'usd-sgd', name: 'USD/SGD', base: 'USD', quote: 'SGD', category: 'fiat', basePrice: 1.3456 },
  { id: 'usd-aed', name: 'USD/AED', base: 'USD', quote: 'AED', category: 'fiat', basePrice: 3.6725 },
  { id: 'btc-aed', name: 'BTC/AED', base: 'BTC', quote: 'AED', category: 'crypto', basePrice: 309780.00 },
];

export function initializePairs(): CurrencyPair[] {
  return INITIAL_PAIRS.map((pair) => {
    const variation = (Math.random() - 0.5) * 0.02;
    const currentPrice = pair.basePrice * (1 + variation);
    return {
      ...pair,
      currentPrice,
      high24h: currentPrice * 1.02,
      low24h: currentPrice * 0.98,
      changePercent: variation * 100,
    };
  });
}
