import { Search } from "lucide-react";
import type { FilterType } from "@/types/currency";

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "favorites", label: "Favorites" },
  { key: "crypto", label: "Crypto" },
  { key: "fiat", label: "Fiat" },
];

export default function FilterBar({ filter, onFilterChange, search, onSearchChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button key={f.key} className={`filter-pill ${filter === f.key ? "active" : ""}`} onClick={() => onFilterChange(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#555555" }} />
        <input
          type="text"
          className="search-input"
          placeholder="Search currencies..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
