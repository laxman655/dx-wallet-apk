import { useState } from "react";
import { cloudCreateWithdrawal } from "@/lib/cloudStore";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !bankName || !accountNumber) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const r = await cloudCreateWithdrawal(parseFloat(amount), "USD", accountNumber);
      if (r.success) { toast.success("Withdrawal request submitted!"); setAmount(""); setBankName(""); setAccountNumber(""); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: 92 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Withdraw</h1>
          <div className="glass-card" style={{ padding: 24 }}>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (USD)" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 12 }} />
            <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Bank Name" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 12 }} />
            <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account Number" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
            <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
              {loading ? "Submitting..." : "Request Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
