import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cloudChangePassword, cloudSetTransactionPin } from "@/lib/cloudStore";
import { toast } from "sonner";
import PageTransition from "@/components/animations/PageTransition";

export default function Settings() {
  const { user } = useAuth();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const r = await cloudChangePassword(currentPw, newPw);
      if (r.success) { toast.success("Password changed!"); setCurrentPw(""); setNewPw(""); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  const handleSetPin = async () => {
    if (!pin || pin.length < 4) { toast.error("PIN must be at least 4 digits"); return; }
    setLoading(true);
    try {
      const r = await cloudSetTransactionPin(pin);
      if (r.success) { toast.success("PIN set!"); setPin(""); }
      else { toast.error(r.msg || "Failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: 92 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Settings</h1>

          <div className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Current Password" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 12 }} />
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New Password" className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
            <button onClick={handleChangePassword} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Transaction PIN</h3>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Set 4-6 digit PIN" maxLength={6} className="glass-input" style={{ width: "100%", padding: "12px 16px", marginBottom: 16 }} />
            <button onClick={handleSetPin} disabled={loading} className="btn-gold" style={{ width: "100%", padding: 14 }}>
              {loading ? "Setting..." : "Set PIN"}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
