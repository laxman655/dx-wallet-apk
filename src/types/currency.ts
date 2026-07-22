export type CurrencyCategory = 'crypto' | 'fiat';

export interface CurrencyPair {
  id: string;
  name: string;
  base: string;
  quote: string;
  category: CurrencyCategory;
  basePrice: number;
  currentPrice: number;
  high24h: number;
  low24h: number;
  changePercent: number;
}

export type FilterType = 'all' | 'favorites' | 'crypto' | 'fiat';

export interface FlashState {
  pairId: string;
  direction: 'up' | 'down';
}
