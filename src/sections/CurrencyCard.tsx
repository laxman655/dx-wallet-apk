import { useState, useCallback } from "react";
import { Star } from "lucide-react";
import type { CurrencyPair, FlashState } from "@/types/currency";

interface CurrencyCardProps {
  pair: CurrencyPair;
  flash?: FlashState;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const currencyIcons: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  XRP: "✕",
  SOL: "◎",
  ADA: "₳",
  DOGE: "Ð",
  DOT: "•",
  LINK: "⬡",
};

export default function CurrencyCard({ pair, flash, isFavorite, onToggleFavorite }: CurrencyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isUp = pair.changePercent >= 0;
  const isFlashing = flash?.pairId === pair.id;

  const formatPrice = useCallback((price: number) => {
    if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(4);
    if (price >= 0.01) return price.toFixed(6);
    return price.toFixed(8);
  }, []);

  return (
    <div
      className={`currency-card ${isFlashing ? (flash?.direction === "up" ? "flash-up border-up" : "flash-down border-down") : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative" }}
    >
      <div style={{ padding: "20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255, 215, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 700,
                color: "#ffd700",
                border: "1px solid rgba(255, 215, 0, 0.2)",
              }}
            >
              {currencyIcons[pair.base] || pair.base[0]}
            </span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff" }}>{pair.name}</div>
              <div style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "1px" }}>
                {pair.category}
              </div>
            </div>
          </div>
          <button
            className="star-btn"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(pair.id); }}
            style={{ opacity: isHovered || isFavorite ? 1 : 0.3 }}
          >
            <Star
              size={16}
              fill={isFavorite ? "#ffd700" : "none"}
              color={isFavorite ? "#ffd700" : "#888888"}
            />
          </button>
        </div>

        {/* Price */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
            {formatPrice(pair.currentPrice)}
          </div>
        </div>

        {/* Change and Range */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: isUp ? "#00e676" : "#ff1744",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isUp ? "▲" : "▼"} {Math.abs(pair.changePercent).toFixed(2)}%
          </div>
          <div style={{ fontSize: "11px", color: "#555555", textAlign: "right" }}>
            <div style={{ color: "#00e676" }}>H: {formatPrice(pair.high24h)}</div>
            <div style={{ color: "#ff1744" }}>L: {formatPrice(pair.low24h)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
