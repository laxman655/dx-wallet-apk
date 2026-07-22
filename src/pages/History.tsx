import { useEffect, useState } from "react";
import { cloudGetTransactions } from "@/lib/cloudStore";
import PageTransition from "@/components/animations/PageTransition";
import CryptoTickerHeader from "@/components/CryptoTickerHeader";

export default function History() {
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    cloudGetTransactions().then(r => { if (r.success) setTxs(r.transactions || []); });
  }, []);

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: 92 }}>
        <CryptoTickerHeader />
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Transaction History</h1>
          {txs.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: 64 }}>No transactions yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {txs.map((tx: any) => (
                <div key={tx.id} className="glass-card" style={{ padding: 16, display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.description}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tx.type === "deposit" ? "#00e676" : "#ff1744" }}>
                    {tx.type === "deposit" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
