import { useState, useEffect, useCallback, useRef } from 'react';
import type { CurrencyPair, FlashState } from '@/types/currency';
import { initializePairs } from '@/data/currencyPairs';

export function useLiveCurrency() {
  const [pairs, setPairs] = useState<CurrencyPair[]>(initializePairs);
  const [flashState, setFlashState] = useState<FlashState | null>(null);
  const prevPricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const initial: Record<string, number> = {};
    pairs.forEach((p) => { initial[p.id] = p.currentPrice; });
    prevPricesRef.current = initial;
  }, []);

  const updatePrices = useCallback(() => {
    setPairs((prevPairs) => {
      const updated = prevPairs.map((pair) => {
        const isCrypto = pair.category === 'crypto';
        const maxChange = isCrypto ? 0.02 : 0.0005;
        const change = (Math.random() - 0.5) * 2 * maxChange;
        const newPrice = pair.currentPrice * (1 + change);
        const newHigh = Math.max(pair.high24h, newPrice);
        const newLow = Math.min(pair.low24h, newPrice);
        const changePercent = ((newPrice - pair.basePrice) / pair.basePrice) * 100;
        return { ...pair, currentPrice: newPrice, high24h: newHigh, low24h: newLow, changePercent };
      });
      const randomIdx = Math.floor(Math.random() * updated.length);
      const randomPair = updated[randomIdx];
      const prevPrices = prevPricesRef.current;
      const prevPrice = prevPrices[randomPair.id] ?? randomPair.currentPrice;
      const dir: 'up' | 'down' = randomPair.currentPrice >= prevPrice ? 'up' : 'down';
      setFlashState({ pairId: randomPair.id, direction: dir });
      setTimeout(() => setFlashState(null), 600);
      const newPrev: Record<string, number> = {};
      updated.forEach((p) => { newPrev[p.id] = p.currentPrice; });
      prevPricesRef.current = newPrev;
      return updated;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(updatePrices, 5000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  return { pairs, flashState };
}
