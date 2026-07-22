import type { ReactNode } from "react";

interface AnimatedGradientProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export default function AnimatedGradient({ children, style }: AnimatedGradientProps) {
  return (
    <div
      className="animated-gradient-border"
      style={{
        position: "relative",
        borderRadius: 16,
        padding: 1,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(20,20,20,0.85)",
          borderRadius: 15,
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
