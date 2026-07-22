export function SkeletonPulse({ width, height, style }: { width?: string | number; height?: string | number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: width ?? "100%",
        height: height ?? 20,
        background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
        backgroundSize: "200% 100%",
        borderRadius: 8,
        animation: "skeleton-shimmer 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

export default function SkeletonCard() {
  return (
    <div
      style={{
        background: "rgba(20,20,20,0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SkeletonPulse width="40%" height={18} />
        <SkeletonPulse width={32} height={32} style={{ borderRadius: "50%" }} />
      </div>
      <SkeletonPulse width="60%" height={32} />
      <SkeletonPulse width="30%" height={16} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <SkeletonPulse width="45%" height={36} />
        <SkeletonPulse width="45%" height={36} />
      </div>
    </div>
  );
}
