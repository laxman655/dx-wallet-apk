import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function BitcoinCoin() {
  const navigate = useNavigate();
  const [flying, setFlying] = useState(false);
  const [hover, setHover] = useState(false);
  const coinRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: 100 });
  const velRef = useRef({ vx: 1.5, vy: 0.4 });

  useEffect(() => {
    if (!coinRef.current || flying) return;
    const el = coinRef.current;
    let frame: number;

    const fly = () => {
      const W = window.innerWidth + 140;
      const H = window.innerHeight;
      const p = posRef.current;
      const v = velRef.current;

      p.x += v.vx;
      p.y += v.vy + Math.sin(p.x * 0.006) * 0.5;

      const bob = Math.sin(p.x * 0.012) * 15;
      const tilt = Math.sin(p.x * 0.008) * 12;

      if (p.x > W) {
        p.x = -120;
        p.y = 80 + Math.random() * (H * 0.35);
      }

      el.style.transform = `translate3d(${p.x}px, ${p.y + bob}px, 0) rotate(${tilt}deg)`;
      frame = requestAnimationFrame(fly);
    };

    frame = requestAnimationFrame(fly);
    return () => cancelAnimationFrame(frame);
  }, [flying]);

  const handleTap = useCallback(() => {
    if (flying) return;
    setFlying(true);
    const el = coinRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = window.innerWidth / 2 - rect.left - rect.width / 2;
    const cy = window.innerHeight / 2 - rect.top - rect.height / 2;

    el.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease 0.5s";
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(2.5) rotate(720deg)`;
    el.style.opacity = "0";

    const flash = document.createElement("div");
    flash.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.5s;background:radial-gradient(circle at 50% 50%,rgba(255,215,0,0.6),rgba(200,168,34,0.2),transparent 60%)`;
    document.body.appendChild(flash);
    requestAnimationFrame(() => (flash.style.opacity = "1"));
    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 500);
      navigate("/login");
    }, 800);
  }, [flying, navigate]);

  if (flying) {
    return (
      <div
        ref={coinRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          width: 70,
          height: 70,
          pointerEvents: "none",
        }}
      >
        <img
          src="/bitcoin-coin.png"
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={coinRef}
      onClick={handleTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        width: 70,
        height: 70,
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform",
        filter: hover
          ? "drop-shadow(0 0 20px rgba(255,215,0,0.9)) brightness(1.2)"
          : "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
        transition: "filter 0.3s ease",
      }}
    >
      <img
        src="/bitcoin-coin.png"
        alt="Tap to Login"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          animation: "coinSpin 3s linear infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "#FFD700",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
          textTransform: "uppercase",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}
      >
        Tap to Login
      </div>

      <style>{`
        @keyframes coinSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
