import CurrencyCard from "./CurrencyCard";
import type { CurrencyPair, FlashState, FilterType } from "@/types/currency";

interface CurrencyGridProps {
  pairs: CurrencyPair[];
  flash: FlashState | null;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  filter: FilterType;
  search: string;
}

export default function CurrencyGrid({ pairs, flash, favorites, onToggleFavorite, filter, search }: CurrencyGridProps) {
  const filtered = pairs.filter((p) => {
    if (filter === "favorites" && !favorites.includes(p.id)) return false;
    if (filter === "crypto" && p.category !== "crypto") return false;
    if (filter === "fiat" && p.category !== "fiat") return false;
    if (search) {
      const s = search.toLowerCase();
      return p.name.toLowerCase().includes(s) || p.base.toLowerCase().includes(s) || p.quote.toLowerCase().includes(s);
    }
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="no-results">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <p style={{ fontSize: "16px", fontWeight: 600 }}>No currencies found</p>
        <p style={{ fontSize: "14px" }}>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="currency-grid">
      {filtered.map((pair) => (
        <CurrencyCard key={pair.id} pair={pair} flash={flash} isFavorite={favorites.includes(pair.id)} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
