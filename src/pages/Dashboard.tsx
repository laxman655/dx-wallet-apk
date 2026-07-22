import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { cloudGetDashboard, cloudGetTransactions, cloudGetDeposits, cloudGetWithdrawals, cloudCreateDeposit, cloudCreateWithdrawal, cloudSendMoney, cloudConvertCurrency } from "@/lib/cloudStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, Download, Upload, LogOut, TrendingUp, TrendingDown, Eye, EyeOff, Wallet } from "lucide-react";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import PageTransition from "@/components/animations/PageTransition";
import CryptoTickerHeader from "@/components/CryptoTickerHeader";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [sendEmail, setSendEmail] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const dash = await cloudGetDashboard();
    if (dash.success) setBalance(dash.balance || 0);
    const txs = await cloudGetTransactions();
    if (txs.success) setTransactions(txs.transactions || []);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) { toast.error("Enter valid amount"); return; }
    setLoading(true);
    const r = await cloudCreateDeposit(parseFloat(depositAmount));
    if (r.success) { toast.success("Deposit request submitted!"); setDepositAmount(""); fetchData(); }
    else toast.error(r.msg || "Failed");
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) { toast.error("Enter valid amount"); return; }
    if (parseFloat(withdrawAmount) > balance) { toast.error("Insufficient balance"); return; }
    setLoading(true);
    const r = await cloudCreateWithdrawal(parseFloat(withdrawAmount), "USD", "");
    if (r.success) { toast.success("Withdrawal request submitted!"); setWithdrawAmount(""); fetchData(); }
    else toast.error(r.msg || "Failed");
    setLoading(false);
  };

  const handleSend = async () => {
    if (!sendEmail || !sendAmount) { toast.error("Fill all fields"); return; }
    setLoading(true);
    const r = await cloudSendMoney(sendEmail, parseFloat(sendAmount), "USD");
    if (r.success) { toast.success("Money sent!"); setSendEmail(""); setSendAmount(""); fetchData(); }
    else toast.error(r.msg || "Failed");
    setLoading(false);
  };

  if (!user) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff" }}>Loading...</div>;

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
        <CryptoTickerHeader />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 100px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>Dashboard</h1>
              <p style={{ color: "#888", fontSize: 14 }}>Welcome back, {user.name}</p>
            </div>
            <Button onClick={logout} variant="outline" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}>
              <LogOut size={16} /> Logout
            </Button>
          </div>

          {/* Balance Card */}
          <div style={{ background: "linear-gradient(135deg, rgba(200,168,34,0.15), rgba(138,112,24,0.08))", borderRadius: 24, padding: 32, border: "1px solid rgba(200,168,34,0.2)", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Wallet size={20} color="#c8a822" />
              <span style={{ color: "#c8a822", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Total Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                {showBalance ? <EyeOff size={16} color="#888" /> : <Eye size={16} color="#888" />}
              </button>
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#fff" }}>
              {showBalance ? `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "****"}
            </div>
          </div>

          {/* Actions Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
            {/* Deposit */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Download size={20} color="#00e676" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Deposit</h3>
              </div>
              <Input type="number" placeholder="Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="glass-input" style={{ marginBottom: 12 }} />
              <Button onClick={handleDeposit} disabled={loading} className="btn-gold" style={{ width: "100%" }}>
                <Download size={16} /> Deposit
              </Button>
            </div>

            {/* Withdraw */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Upload size={20} color="#ff1744" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Withdraw</h3>
              </div>
              <Input type="number" placeholder="Amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="glass-input" style={{ marginBottom: 12 }} />
              <Button onClick={handleWithdraw} disabled={loading} className="btn-gold" style={{ width: "100%" }}>
                <Upload size={16} /> Withdraw
              </Button>
            </div>

            {/* Send */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Send size={20} color="#2196f3" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Send Money</h3>
              </div>
              <Input type="email" placeholder="Recipient Email" value={sendEmail} onChange={(e) => setSendEmail(e.target.value)} className="glass-input" style={{ marginBottom: 8 }} />
              <Input type="number" placeholder="Amount" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="glass-input" style={{ marginBottom: 12 }} />
              <Button onClick={handleSend} disabled={loading} className="btn-gold" style={{ width: "100%" }}>
                <Send size={16} /> Send
              </Button>
            </div>
          </div>

          {/* Transactions */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: 32 }}>No transactions yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {tx.type === "deposit" ? <TrendingUp size={16} color="#00e676" /> : <TrendingDown size={16} color="#ff1744" />}
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.description}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{new Date(tx.createdAt).toLocaleDateString()}</div>
                      </div>
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
      </div>
    </PageTransition>
  );
}
