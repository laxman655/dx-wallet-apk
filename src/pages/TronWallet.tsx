import { useState, useEffect } from "react";
import { cloudGetTRONAddress, cloudGetTRONBalance, cloudCreateTRONWallet } from "@/lib/cloudStore";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";

export default function TronWallet() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cloudGetTRONAddress().then(r => {
      if (r.success && r.address) setAddress(r.address);
    });
    cloudGetTRONBalance().then(r => {
      if (r.success) setBalance(r.balance || 0);
    });
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const r = await cloudCreateTRONWallet();
      if (r.success) { setAddress(r.address); toast.success("Wallet created!"); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: 92 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>TRON Wallet</h1>
          <div className="glass-card" style={{ padding: 24 }}>
            {address ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Address</div>
                  <div style={{ fontSize: 13, color: "#fff", fontFamily: "monospace", wordBreak: "break-all", marginTop: 4, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>{address}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Balance</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#c8a822", marginTop: 4 }}>{balance.toFixed(2)} TRX</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#888", marginBottom: 16 }}>No wallet found. Create one to get started.</p>
                <button onClick={handleCreate} disabled={loading} className="btn-gold" style={{ padding: "14px 32px" }}>
                  {loading ? "Creating..." : "Create Wallet"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
