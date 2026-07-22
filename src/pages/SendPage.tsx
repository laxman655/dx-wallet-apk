import { useState } from "react";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";
import CryptoTickerHeader from "@/components/CryptoTickerHeader";
import PageHeader from "@/components/PageHeader";
import { cloudSendMoney } from "@/lib/cloudStore";
import { NavButtonsFooter } from "@/components/DxFooter";

export default function SendPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email || !amount || parseFloat(amount) <= 0) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const r = await cloudSendMoney(email.trim(), parseFloat(amount), currency);
      if (r.success) { toast.success("Sent!"); setEmail(""); setAmount(""); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a0a", paddingTop: 92, paddingBottom: 90, overflowY: "auto" }}>
        <PageHeader title="SEND" />
        <CryptoTickerHeader />
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%", padding: "10px 12px" }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Send Money</h3>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Recipient Email" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="glass-input" style={{ flex: 1, padding: "12px 16px" }} />
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="glass-input" style={{ width: 100, padding: "12px" }}>
                <option value="USDT">USDT</option>
                <option value="AED">AED</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <button onClick={handleSend} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
              {loading ? "Sending..." : "Send Now"}
            </button>
          </div>
        </div>
        <NavButtonsFooter />
      </div>
    </PageTransition>
  );
}
