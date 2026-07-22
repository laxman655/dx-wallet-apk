import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LayoutDashboard, TrendingUp, TrendingDown, Users, Fingerprint, AlertTriangle, Wallet, Landmark, LogOut, Menu, X, Power, Edit2, Trash2 } from "lucide-react";
import { cloudAdminStats, cloudAdminDeposits, cloudAdminWithdrawals, cloudAdminUsers, cloudAdminApproveDeposit, cloudAdminRejectDeposit, cloudAdminApproveWithdrawal, cloudAdminRejectWithdrawal, cloudAdminFreezeUser, cloudAdminUnfreezeUser, cloudAdminAddMoney, cloudAdminDeductMoney, cloudAdminResetPassword, cloudAdminDeleteUser, cloudAdminGetKYC, cloudAdminApproveKYC, cloudAdminRejectKYC } from "@/lib/cloudStore";
import PageTransition from "@/components/animations/PageTransition";

const menuItems = [
  { key: "overview", title: "Overview", icon: LayoutDashboard, color: "#2196f3" },
  { key: "deposits", title: "Deposits", icon: TrendingUp, color: "#00e676" },
  { key: "withdrawals", title: "Withdrawals", icon: TrendingDown, color: "#ff9800" },
  { key: "users", title: "Users", icon: Users, color: "#9c27b0" },
  { key: "kyc", title: "KYC", icon: Fingerprint, color: "#00bcd4" },
];

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [view, setView] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [kycList, setKycList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      navigate("/dashboard");
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    const s = await cloudAdminStats();
    if (s.success) setStats(s);
    const d = await cloudAdminDeposits();
    if (d.success) setDeposits(d.deposits || []);
    const w = await cloudAdminWithdrawals();
    if (w.success) setWithdrawals(w.withdrawals || []);
    const u = await cloudAdminUsers();
    if (u.success) setUsers(u.users || []);
    const k = await cloudAdminGetKYC();
    if (k.success) setKycList(k.kyc || []);
    setLoading(false);
  };

  const handleApproveDeposit = async (id: number) => {
    const r = await cloudAdminApproveDeposit(id);
    if (r.success) { toast.success("Deposit approved"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleRejectDeposit = async (id: number) => {
    const r = await cloudAdminRejectDeposit(id);
    if (r.success) { toast.success("Deposit rejected"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleApproveWithdrawal = async (id: number) => {
    const r = await cloudAdminApproveWithdrawal(id);
    if (r.success) { toast.success("Withdrawal approved"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleRejectWithdrawal = async (id: number) => {
    const r = await cloudAdminRejectWithdrawal(id);
    if (r.success) { toast.success("Withdrawal rejected"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleFreezeUser = async (id: number) => {
    const r = await cloudAdminFreezeUser(id);
    if (r.success) { toast.success("User frozen"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleUnfreezeUser = async (id: number) => {
    const r = await cloudAdminUnfreezeUser(id);
    if (r.success) { toast.success("User unfrozen"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleAddMoney = async (id: number) => {
    const amount = prompt("Enter amount to add:");
    if (!amount) return;
    const r = await cloudAdminAddMoney(id, parseFloat(amount));
    if (r.success) { toast.success("Money added"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleDeductMoney = async (id: number) => {
    const amount = prompt("Enter amount to deduct:");
    if (!amount) return;
    const r = await cloudAdminDeductMoney(id, parseFloat(amount));
    if (r.success) { toast.success("Money deducted"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleResetPassword = async (id: number) => {
    const pw = prompt("Enter new password:");
    if (!pw) return;
    const r = await cloudAdminResetPassword(id, pw);
    if (r.success) { toast.success("Password reset"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    const r = await cloudAdminDeleteUser(id);
    if (r.success) { toast.success("User deleted"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleApproveKYC = async (id: number) => {
    const r = await cloudAdminApproveKYC(id);
    if (r.success) { toast.success("KYC approved"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  const handleRejectKYC = async (id: number) => {
    const r = await cloudAdminRejectKYC(id);
    if (r.success) { toast.success("KYC rejected"); loadData(); }
    else toast.error(r.msg || "Failed");
  };

  if (!user) return null;

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
        {/* Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>Admin Panel</h1>
          <div style={{ display: "flex", gap: 12 }}>
            {menuItems.map((item) => (
              <button key={item.key} onClick={() => setView(item.key)} style={{ background: view === item.key ? `${item.color}20` : "transparent", border: `1px solid ${view === item.key ? item.color : "rgba(255,255,255,0.1)"}`, color: view === item.key ? item.color : "#888", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <item.icon size={14} /> {item.title}
              </button>
            ))}
            <button onClick={logout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 64, color: "#888" }}>Loading...</div>
          ) : (
            <>
              {/* Overview */}
              {view === "overview" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {[
                      { label: "Total Users", value: stats?.totalUsers || 0, color: "#2196f3" },
                      { label: "Total Balance", value: `$${stats?.totalBalance || "0.00"}`, color: "#00e676" },
                      { label: "Pending Deposits", value: stats?.pendingDeposits || 0, color: "#ff9800" },
                      { label: "Pending Withdrawals", value: stats?.pendingWithdrawals || 0, color: "#ff1744" },
                      { label: "Frozen Users", value: stats?.frozenUsers || 0, color: "#9c27b0" },
                    ].map((s) => (
                      <div key={s.label} className="glass-card" style={{ padding: 20, borderLeft: `3px solid ${s.color}` }}>
                        <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deposits */}
              {view === "deposits" && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Deposit Requests</h2>
                  {deposits.length === 0 ? <p style={{ color: "#888" }}>No deposits</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {deposits.map((d) => (
                        <div key={d.id} className="glass-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>User #{d.userId} - ${d.amount}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>{d.status} - {new Date(d.createdAt).toLocaleDateString()}</div>
                          </div>
                          {d.status === "pending" && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => handleApproveDeposit(d.id)} style={{ background: "#00e67620", border: "1px solid #00e676", color: "#00e676", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Approve</button>
                              <button onClick={() => handleRejectDeposit(d.id)} style={{ background: "#ff174420", border: "1px solid #ff1744", color: "#ff1744", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Reject</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Withdrawals */}
              {view === "withdrawals" && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Withdrawal Requests</h2>
                  {withdrawals.length === 0 ? <p style={{ color: "#888" }}>No withdrawals</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {withdrawals.map((w) => (
                        <div key={w.id} className="glass-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>User #{w.userId} - ${w.amount}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>{w.status} - {new Date(w.createdAt).toLocaleDateString()}</div>
                          </div>
                          {w.status === "pending" && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => handleApproveWithdrawal(w.id)} style={{ background: "#00e67620", border: "1px solid #00e676", color: "#00e676", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Approve</button>
                              <button onClick={() => handleRejectWithdrawal(w.id)} style={{ background: "#ff174420", border: "1px solid #ff1744", color: "#ff1744", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Reject</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Users */}
              {view === "users" && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Users</h2>
                  {users.length === 0 ? <p style={{ color: "#888" }}>No users</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {users.map((u) => (
                        <div key={u.id} className="glass-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name} ({u.email})</div>
                            <div style={{ fontSize: 11, color: "#888" }}>Role: {u.role} | KYC: {u.kycStatus} {u.frozen && "| FROZEN"}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {!u.frozen ? (
                              <button onClick={() => handleFreezeUser(u.id)} style={{ background: "#ff174420", border: "1px solid #ff1744", color: "#ff1744", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>Freeze</button>
                            ) : (
                              <button onClick={() => handleUnfreezeUser(u.id)} style={{ background: "#00e67620", border: "1px solid #00e676", color: "#00e676", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>Unfreeze</button>
                            )}
                            <button onClick={() => handleAddMoney(u.id)} style={{ background: "#2196f320", border: "1px solid #2196f3", color: "#2196f3", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>+Money</button>
                            <button onClick={() => handleDeductMoney(u.id)} style={{ background: "#ff980020", border: "1px solid #ff9800", color: "#ff9800", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>-Money</button>
                            <button onClick={() => handleResetPassword(u.id)} style={{ background: "#9c27b020", border: "1px solid #9c27b0", color: "#9c27b0", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>Reset PW</button>
                            <button onClick={() => handleDeleteUser(u.id)} style={{ background: "#f4433620", border: "1px solid #f44336", color: "#f44336", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* KYC */}
              {view === "kyc" && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>KYC Requests</h2>
                  {kycList.length === 0 ? <p style={{ color: "#888" }}>No KYC requests</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {kycList.map((k) => (
                        <div key={k.id} className="glass-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>User #{k.userId} - {k.fullName}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>{k.idType}: {k.idNumber} | Status: {k.status}</div>
                          </div>
                          {k.status === "pending" && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => handleApproveKYC(k.userId)} style={{ background: "#00e67620", border: "1px solid #00e676", color: "#00e676", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Approve</button>
                              <button onClick={() => handleRejectKYC(k.userId)} style={{ background: "#ff174420", border: "1px solid #ff1744", color: "#ff1744", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Reject</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
