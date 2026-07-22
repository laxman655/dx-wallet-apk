import { useState } from "react";
import { cloudBuyCrypto, cloudSellCrypto } from "@/lib/cloudStore";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";

export default function BuySellCrypto() {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error("Enter amount"); return; }
    setLoading(true);
    try {
      const r = mode === "buy"
        ? await cloudBuyCrypto(parseFloat(amount), currency)
        : await cloudSellCrypto(parseFloat(amount), currency);
      if (r.success) { toast.success(`${mode === "buy" ? "Bought" : "Sold"} successfully!`); setAmount(""); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: 92 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Buy / Sell Crypto</h1>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setMode("buy")} style={{ flex: 1, padding: "10px", borderRadius: 12, background: mode === "buy" ? "rgba(0,230,118,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${mode === "buy" ? "#00e676" : "rgba(255,255,255,0.06)"}`, color: mode === "buy" ? "#00e676" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Buy</button>
              <button onClick={() => setMode("sell")} style={{ flex: 1, padding: "10px", borderRadius: 12, background: mode === "sell" ? "rgba(255,23,68,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${mode === "sell" ? "#ff1744" : "rgba(255,255,255,0.06)"}`, color: mode === "sell" ? "#ff1744" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sell</button>
            </div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 12 }} />
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="glass-input" style={{ width: "100%", padding: "12px", marginBottom: 16 }}>
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="TRX">TRX</option>
            </select>
            <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
              {loading ? "Processing..." : mode === "buy" ? "Buy Now" : "Sell Now"}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
