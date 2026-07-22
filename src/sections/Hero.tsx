export default function Hero() {
  return (
    <section className="hero-section" style={{ minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "48px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div className="pulse-dot" />
        <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: "#00e676" }}>
          Live Markets
        </span>
      </div>
      <h1 className="gold-shimmer" style={{ fontSize: "clamp(36px, 8vw, 64px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-1px", marginBottom: "12px" }}>
        Dubai Exchange
      </h1>
      <p style={{ fontSize: "16px", color: "#888888", maxWidth: "480px", lineHeight: 1.6 }}>
        Real-time crypto & fiat currency tracking with luxury precision
      </p>
    </section>
  );
}
