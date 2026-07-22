import { useState, useCallback } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback((pairId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(pairId)) {
        next.delete(pairId);
      } else {
        next.add(pairId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (pairId: string) => favorites.has(pairId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
