import { Link, useLocation } from "react-router";
import { Home, Send, Download, User, Settings, Bell, HelpCircle } from "lucide-react";

const mainNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/deposit", label: "Deposit", icon: Download },
  { to: "/send", label: "Send", icon: Send },
  { to: "/dashboard", label: "Wallet", icon: User },
];

export function NavButtonsFooter() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <div id="dx-footer" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "8px 0 12px", zIndex: 100, height: 64
    }}>
      {mainNav.map((item) => (
        <Link key={item.to} to={item.to} style={{ textDecoration: "none", flex: 1 }}>
          <button style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: "none", border: "none", color: current === item.to ? "#c8a822" : "#888",
            fontSize: 10, fontWeight: 600, cursor: "pointer", width: "100%", padding: "6px 0"
          }}>
            <item.icon size={20} />
            {item.label}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default function DxFooter() {
  return <NavButtonsFooter />;
}
