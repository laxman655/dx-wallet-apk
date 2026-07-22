import { useState } from "react";
import { CreditCard, Building2, Bitcoin } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import CryptoTickerHeader from "@/components/CryptoTickerHeader";
import PageHeader from "@/components/PageHeader";
import { NavButtonsFooter } from "@/components/DxFooter";

const tabs = [
  { key: "card", label: "Card", icon: <CreditCard size={16} /> },
  { key: "bank", label: "Bank", icon: <Building2 size={16} /> },
  { key: "crypto", label: "Crypto", icon: <Bitcoin size={16} /> },
];

export default function DepositPage() {
  const [method, setMethod] = useState("card");

  return (
    <PageTransition>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a0a", paddingTop: 92, paddingBottom: 90, overflowY: "auto" }}>
        <PageHeader title="DEPOSIT" />
        <CryptoTickerHeader />
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%", padding: "10px 12px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setMethod(t.key)} style={{ flex: 1, padding: "10px", borderRadius: 12, background: method === t.key ? "rgba(200,168,34,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${method === t.key ? "#c8a822" : "rgba(255,255,255,0.06)"}`, color: method === t.key ? "#c8a822" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          {/* Content */}
          <div className="glass-card" style={{ padding: 24 }}>
            {method === "card" && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Card Deposit</h3>
                <p style={{ color: "#888", fontSize: 14 }}>Enter card details to deposit funds.</p>
                <input placeholder="Card Number" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 12, marginTop: 16 }} />
                <div style={{ display: "flex", gap: 12 }}>
                  <input placeholder="MM/YY" className="glass-input" style={{ flex: 1, padding: "12px 16px" }} />
                  <input placeholder="CVV" className="glass-input" style={{ flex: 1, padding: "12px 16px" }} />
                </div>
                <input type="number" placeholder="Amount (USD)" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginTop: 12, marginBottom: 16 }} />
                <button className="btn-gold" style={{ width: "100%", padding: "14px", fontSize: 14 }}>Deposit Now</button>
              </div>
            )}
            {method === "bank" && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Bank Transfer</h3>
                <p style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>Transfer to our bank account.</p>
                <div style={{ background: "rgba(200,168,34,0.05)", border: "1px solid rgba(200,168,34,0.15)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: "#888" }}>Bank: Emirates NBD</p>
                  <p style={{ fontSize: 12, color: "#888" }}>Account: 1234567890</p>
                  <p style={{ fontSize: 12, color: "#888" }}>IBAN: AE1234567890</p>
                </div>
                <input type="number" placeholder="Amount (USD)" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
                <button className="btn-gold" style={{ width: "100%", padding: "14px", fontSize: 14 }}>Submit Deposit</button>
              </div>
            )}
            {method === "crypto" && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Crypto Deposit</h3>
                <p style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>Send crypto to your wallet address.</p>
                <div style={{ background: "rgba(33,150,243,0.05)", border: "1px solid rgba(33,150,243,0.15)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: "#888" }}>USDT (TRC20)</p>
                  <p style={{ fontSize: 13, color: "#fff", fontFamily: "monospace", wordBreak: "break-all" }}>TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
                </div>
                <button className="btn-gold" style={{ width: "100%", padding: "14px", fontSize: 14 }}>I've Sent the Crypto</button>
              </div>
            )}
          </div>
        </div>
        <NavButtonsFooter />
      </div>
    </PageTransition>
  );
}
