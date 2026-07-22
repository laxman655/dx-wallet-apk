import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 16 }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#c8a822", cursor: "pointer", padding: 4 }}>
        <ArrowLeft size={20} />
      </button>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#c8a822", letterSpacing: 3, textTransform: "uppercase" }}>{title}</h2>
    </div>
  );
}
