import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function FlyingBird() {
  const navigate = useNavigate();
  const [flying, setFlying] = useState(false);
  const [hover, setHover] = useState(false);
  const birdRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const posRef = useRef({ x: -120, y: 80 });
  const velRef = useRef({ vx: 1.8, vy: 0.3 });

  useEffect(() => {
    if (!birdRef.current || flying) return;
    const el = birdRef.current;
    let frame: number;

    const fly = () => {
      const W = window.innerWidth + 200;
      const p = posRef.current;
      const v = velRef.current;

      p.x += v.vx;
      p.y += v.vy + Math.sin(p.x * 0.008) * 0.6;

      const bob = Math.sin(p.x * 0.015) * 12;
      const tilt = Math.sin(p.x * 0.01) * 8;

      if (p.x > W) {
        p.x = -140;
        p.y = 60 + Math.random() * (window.innerHeight * 0.4);
      }

      el.style.transform = `translate3d(${p.x}px, ${p.y + bob}px, 0) rotate(${tilt}deg) scaleX(1)`;
      frame = requestAnimationFrame(fly);
    };

    frame = requestAnimationFrame(fly);
    return () => cancelAnimationFrame(frame);
  }, [flying]);

  useEffect(() => {
    if (!imgRef.current || flying) return;
    const img = imgRef.current;
    let frameIdx = 0;
    const interval = setInterval(() => {
      frameIdx = frameIdx === 0 ? 1 : 0;
      img.src = frameIdx === 0 ? "/bird-fly.png" : "/bird-fly-2.png";
    }, 200);
    return () => clearInterval(interval);
  }, [flying]);

  const handleTap = useCallback(() => {
    if (flying) return;
    setFlying(true);
    const el = birdRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = window.innerWidth / 2 - rect.left - rect.width / 2;
    const cy = window.innerHeight / 2 - rect.top - rect.height / 2;

    el.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease 0.5s";
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(2.2) rotate(0deg)`;
    el.style.opacity = "0";

    const flash = document.createElement("div");
    flash.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.5s;background:radial-gradient(circle at 50% 50%,rgba(255,215,0,0.55),rgba(200,168,34,0.15),transparent 60%)`;
    document.body.appendChild(flash);
    requestAnimationFrame(() => (flash.style.opacity = "1"));
    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 500);
      navigate("/login");
    }, 750);
  }, [flying, navigate]);

  if (flying) {
    return (
      <div
        ref={birdRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          width: 90,
          height: 90,
          pointerEvents: "none",
        }}
      >
        <img
          src="/bird-fly.png"
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={birdRef}
      onClick={handleTap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        width: 90,
        height: 90,
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform",
        filter: hover
          ? "drop-shadow(0 0 18px rgba(255,215,0,0.8)) brightness(1.15)"
          : "drop-shadow(0 0 8px rgba(255,215,0,0.5))",
        transition: "filter 0.3s ease",
      }}
    >
      <img
        ref={imgRef}
        src="/bird-fly.png"
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
          bottom: -6,
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
    </div>
  );
}
