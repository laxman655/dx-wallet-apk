import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { cloudRegister, setSession, setToken } from "@/lib/cloudStore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import CryptoTickerHeader from "@/components/CryptoTickerHeader";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cp, setCp] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !cp) { toast.error("Fill all fields"); return; }
    if (password !== cp) { toast.error("Passwords don't match"); return; }
    if (password.length < 8) { toast.error("Min 8 characters"); return; }
    setLoading(true);
    try {
      const r = await cloudRegister(name, email, password, phone);
      if (r.success) {
        setSession(r.user);
        if (r.token) setToken(r.token);
        toast.success("Account created!");
        navigate("/dashboard", { replace: true });
      } else { toast.error(r.msg || "Registration failed"); }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="luxury-bg" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <CryptoTickerHeader />
      <div className="relative z-10 flex items-center justify-center px-4" style={{ flex: 1, paddingTop: 92, paddingBottom: 80 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <div className="text-center mb-5">
              <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Create Account</h2>
              <p style={{ color: "#555", fontSize: 11, marginTop: 4 }}>Join Dubai Exchange</p>
            </div>
            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="glass-input" />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input" />
              <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="glass-input" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input" />
              <Input type="password" placeholder="Confirm Password" value={cp} onChange={(e) => setCp(e.target.value)} className="glass-input" />
              <button type="submit" disabled={loading} className="btn-gold" style={{ height: 48, fontSize: 14 }}>
                {loading ? "Creating..." : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Shield size={16} /> Create Account</span>}
              </button>
            </form>
            <div className="text-center mt-4">
              <Link to="/login" style={{ color: "#c8a822", fontSize: 11, textDecoration: "none" }}>Already have an account? Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
