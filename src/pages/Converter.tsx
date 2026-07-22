import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { cloudConvertCurrency } from "@/lib/cloudStore";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";

const currencies = ["USD", "AED", "EUR", "GBP", "JPY", "CNY", "SGD", "AUD", "CAD", "CHF", "INR"];

export default function Converter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("AED");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error("Enter amount"); return; }
    setLoading(true);
    try {
      const r = await cloudConvertCurrency(from, to, parseFloat(amount));
      if (r.success) { setResult(r.convertedAmount); toast.success("Converted!"); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: 92 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Currency Converter</h1>
          <div className="glass-card" style={{ padding: 24 }}>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <select value={from} onChange={e => setFrom(e.target.value)} className="glass-input" style={{ flex: 1, padding: "12px" }}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ArrowRightLeft size={20} color="#888" />
              <select value={to} onChange={e => setTo(e.target.value)} className="glass-input" style={{ flex: 1, padding: "12px" }}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={handleConvert} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
              {loading ? "Converting..." : "Convert"}
            </button>
            {result && (
              <div style={{ marginTop: 16, padding: 16, background: "rgba(0,230,118,0.05)", border: "1px solid rgba(0,230,118,0.2)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#00e676" }}>{parseFloat(result).toFixed(2)} {to}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
