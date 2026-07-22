import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function FloatingMonkey() {
  const navigate = useNavigate();
  const [flying, setFlying] = useState(false);
  const [hover, setHover] = useState(false);
  const monkeyRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -120, y: 100 });

  useEffect(() => {
    if (!monkeyRef.current || flying) return;
    const el = monkeyRef.current;
    let frame: number;
    const p = posRef.current;

    const animate = () => {
      const W = window.innerWidth + 160;
      p.x += 1.0;
      p.y += Math.sin(p.x * 0.007) * 0.3;
      const bob = Math.sin(p.x * 0.009) * 12;
      const tilt = Math.sin(p.x * 0.005) * 6;

      if (p.x > W) {
        p.x = -140;
        p.y = 60 + Math.random() * (window.innerHeight * 0.25);
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
    const el = monkeyRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = window.innerWidth / 2 - rect.left - rect.width / 2;
    const cy = window.innerHeight / 2 - rect.top - rect.height / 2;

    el.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease 0.5s";
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(1.8) rotate(0deg)`;
    el.style.opacity = "0";

    const flash = document.createElement("div");
    flash.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.5s;background:radial-gradient(circle at 50% 50%,rgba(100,180,255,0.4),rgba(200,168,34,0.15),transparent 60%)`;
    document.body.appendChild(flash);
    requestAnimationFrame(() => (flash.style.opacity = "1"));
    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 500);
      navigate("/login");
    }, 800);
  }, [flying, navigate]);

  return (
    <div
      ref={monkeyRef}
      onClick={handleTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        width: 100,
        height: 140,
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform",
        filter: hover
          ? "drop-shadow(0 0 20px rgba(100,180,255,0.7)) drop-shadow(0 0 8px rgba(255,215,0,0.5))"
          : "drop-shadow(0 0 8px rgba(100,180,255,0.4))",
        transition: "filter 0.3s ease",
      }}
    >
      <img
        src="/monkey-action.png"
        alt="Tap to Login"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "#64B4FF",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
          textTransform: "uppercase",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}
      >
        Tap to Login
      </div>
    </div>
  );
}
