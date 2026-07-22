import { Link } from "react-router";
import { Home, Wallet, Settings } from "lucide-react";

export default function FixedFooter() {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      display: "flex", justifyContent: "space-around", padding: "12px 0",
      zIndex: 100
    }}>
      <Link to="/" style={{ color: "#888", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 10 }}>
        <Home size={20} /> Home
      </Link>
      <Link to="/dashboard" style={{ color: "#888", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 10 }}>
        <Wallet size={20} /> Wallet
      </Link>
      <Link to="/settings" style={{ color: "#888", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 10 }}>
        <Settings size={20} /> Settings
      </Link>
    </div>
  );
}
