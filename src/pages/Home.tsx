import { Link } from "react-router";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import Hero from "@/sections/Hero";
import FilterBar from "@/sections/FilterBar";
import CurrencyGrid from "@/sections/CurrencyGrid";
import Navbar from "@/sections/Navbar";
import Ticker from "@/sections/Ticker";
import { useFavorites } from "@/hooks/useFavorites";
import { useLiveCurrency } from "@/hooks/useLiveCurrency";
import { useState } from "react";

export default function Home() {
  const { favorites, toggleFavorite } = useFavorites();
  const { pairs, flash } = useLiveCurrency();
  const [filter, setFilter] = useState<"all" | "favorites" | "crypto" | "fiat">("all");
  const [search, setSearch] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />
      <Hero />
      <Ticker pairs={pairs} />
      <FilterBar filter={filter} onFilterChange={setFilter} search={search} onSearchChange={setSearch} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        <CurrencyGrid pairs={pairs} flash={flash} favorites={favorites} onToggleFavorite={toggleFavorite} filter={filter} search={search} />
      </div>
      {/* Auth buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button className="btn-outline-gold" style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8 }}>
            <LogIn size={16} /> Sign In
          </button>
        </Link>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <button className="btn-gold" style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8 }}>
            <UserPlus size={16} /> Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
