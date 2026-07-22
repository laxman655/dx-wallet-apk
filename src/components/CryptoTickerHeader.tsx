import { useEffect, useState } from "react";

const INITIAL_TICKER = [
  { symbol: "BTC", price: 84320.50, change: 2.34 },
  { symbol: "ETH", price: 3256.75, change: 1.87 },
  { symbol: "XRP", price: 2.45, change: -0.52 },
  { symbol: "SOL", price: 198.30, change: 3.21 },
  { symbol: "ADA", price: 0.85, change: -1.15 },
  { symbol: "DOGE", price: 0.32, change: 5.67 },
  { symbol: "DOT", price: 7.20, change: -0.89 },
  { symbol: "LINK", price: 18.65, change: 1.45 },
];

export default function CryptoTickerHeader() {
  const [ticker, setTicker] = useState(INITIAL_TICKER);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => prev.map(t => ({
        ...t,
        price: t.price * (1 + (Math.random() - 0.5) * 0.002),
        change: t.change + (Math.random() - 0.5) * 0.1
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      overflow: "hidden", height: 36
    }}>
      <div className="crypto-ticker-scroll" style={{
        display: "flex", gap: 32, whiteSpace: "nowrap",
        padding: "8px 0", willChange: "transform"
      }}>
        {[...ticker, ...ticker, ...ticker].map((t, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 600, color: t.change >= 0 ? "#00e676" : "#ff1744" }}>
            {t.symbol}: ${t.price.toFixed(2)} ({t.change >= 0 ? "+" : ""}{t.change.toFixed(2)}%)
          </span>
        ))}
      </div>
    </div>
  );
}
