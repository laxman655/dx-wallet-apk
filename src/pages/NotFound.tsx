import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <h1 style={{ fontSize: 72, fontWeight: 900, color: "#c8a822" }}>404</h1>
      <p style={{ color: "#888", marginBottom: 24 }}>Page not found</p>
      <Link to="/" style={{ textDecoration: "none" }}>
        <button className="btn-gold" style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8 }}>
          <ArrowLeft size={16} /> Go Home
        </button>
      </Link>
    </div>
  );
}
