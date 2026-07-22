import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function FloatingKey() {
  const navigate = useNavigate();
  const [flying, setFlying] = useState(false);
  const [hover, setHover] = useState(false);
  const keyRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -60, y: 120 });

  useEffect(() => {
    if (!keyRef.current || flying) return;
    const el = keyRef.current;
    let frame: number;
    const p = posRef.current;

    const animate = () => {
      const W = window.innerWidth + 80;
      p.x += 1.2;
      p.y += Math.sin(p.x * 0.008) * 0.4;
      const bob = Math.sin(p.x * 0.01) * 10;
      const tilt = Math.sin(p.x * 0.006) * 10;

      if (p.x > W) {
        p.x = -70;
        p.y = 80 + Math.random() * (window.innerHeight * 0.3);
      }

      el.style.transform = `translate3d(${p.x}px, ${p.y + bob}px, 0) rotate(${tilt}deg)`;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [flying]);

  const handleTap = useCallback(() => {
    if (flying) return;
    setFlying(true);
    const el = keyRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = window.innerWidth / 2 - rect.left - rect.width / 2;
    const cy = window.innerHeight / 2 - rect.top - rect.height / 2;

    el.style.transition = "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease 0.4s";
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(2) rotate(360deg)`;
    el.style.opacity = "0";

    const flash = document.createElement("div");
    flash.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.4s;background:radial-gradient(circle at 50% 50%,rgba(255,215,0,0.5),transparent 60%)`;
    document.body.appendChild(flash);
    requestAnimationFrame(() => (flash.style.opacity = "1"));
    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 400);
      navigate("/login");
    }, 700);
  }, [flying, navigate]);

  return (
    <div
      ref={keyRef}
      onClick={handleTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        width: 50,
        height: 50,
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform",
        filter: hover
          ? "drop-shadow(0 0 16px rgba(255,215,0,0.9))"
          : "drop-shadow(0 0 6px rgba(255,215,0,0.5))",
        transition: "filter 0.3s ease",
      }}
    >
      <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="22" r="14" stroke="url(#keyGold)" strokeWidth="5" fill="none" />
        <circle cx="50" cy="22" r="6" fill="url(#keyGold)" />
        <rect x="46" y="36" width="8" height="42" rx="2" fill="url(#keyGold)" />
        <rect x="54" y="64" width="10" height="5" rx="1" fill="url(#keyGold)" />
        <rect x="54" y="73" width="7" height="5" rx="1" fill="url(#keyGold)" />
        <circle cx="50" cy="22" r="2" fill="#fff" opacity={hover ? 0.9 : 0.5}>
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <defs>
          <linearGradient id="keyGold" x1="30" y1="0" x2="70" y2="100">
            <stop offset="0%" stopColor="#FFF8A8" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: -2,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: 1,
          color: "#FFD700",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
        }}
      >
        Tap
      </div>
    </div>
  );
}
