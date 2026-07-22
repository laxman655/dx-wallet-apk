import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface FloatingSymbol {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  size: number;
  opacity: number;
}

export default function FintechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const symbolsRef = useRef<FloatingSymbol[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const parent = canvas!.parentElement;
      if (parent) {
        canvas!.width = parent.offsetWidth;
        canvas!.height = parent.offsetHeight;
      } else {
        canvas!.width = window.innerWidth;
        canvas!.height = window.innerHeight;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 60;
    const colors = [
      "#c8a822", "#e8d48b", "#b89820",
      "#e53935", "#ff5252", "#c62828",
      "#ffd70088", "#ff6b6b44",
    ];
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      size: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.5 + 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }));

    const symbols = ["$", "₿", "Ξ", "◆", "◎", "◈"];
    symbolsRef.current = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.random() * 10 + 10,
      opacity: Math.random() * 0.12 + 0.04,
    }));

    function drawGrid() {
      const w = canvas!.width;
      const h = canvas!.height;
      const gridSize = 60;

      ctx!.globalAlpha = 0.015;
      ctx!.strokeStyle = "#c8a822";
      ctx!.lineWidth = 0.5;

      for (let x = 0; x < w; x += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function drawGlowingOrbs(time: number) {
      const w = canvas!.width;
      const h = canvas!.height;

      const goldX = w * 0.15 + Math.sin(time * 0.0003) * w * 0.1;
      const goldY = h * 0.3 + Math.cos(time * 0.0004) * h * 0.1;
      const goldGrad = ctx!.createRadialGradient(goldX, goldY, 0, goldX, goldY, 200);
      goldGrad.addColorStop(0, "rgba(200,168,34,0.04)");
      goldGrad.addColorStop(0.5, "rgba(200,168,34,0.015)");
      goldGrad.addColorStop(1, "transparent");
      ctx!.fillStyle = goldGrad;
      ctx!.fillRect(0, 0, w, h);

      const redX = w * 0.8 + Math.cos(time * 0.00025) * w * 0.08;
      const redY = h * 0.6 + Math.sin(time * 0.00035) * h * 0.08;
      const redGrad = ctx!.createRadialGradient(redX, redY, 0, redX, redY, 180);
      redGrad.addColorStop(0, "rgba(200,30,30,0.035)");
      redGrad.addColorStop(0.5, "rgba(200,30,30,0.01)");
      redGrad.addColorStop(1, "transparent");
      ctx!.fillStyle = redGrad;
      ctx!.fillRect(0, 0, w, h);

      const gold2X = w * 0.7 + Math.cos(time * 0.0002) * w * 0.12;
      const gold2Y = h * 0.15 + Math.sin(time * 0.0003) * h * 0.08;
      const gold2Grad = ctx!.createRadialGradient(gold2X, gold2Y, 0, gold2X, gold2Y, 150);
      gold2Grad.addColorStop(0, "rgba(200,168,34,0.025)");
      gold2Grad.addColorStop(1, "transparent");
      ctx!.fillStyle = gold2Grad;
      ctx!.fillRect(0, 0, w, h);
    }

    function animate() {
      const time = timeRef.current++;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      drawGrid();
      drawGlowingOrbs(time);

      const particles = particlesRef.current;

      for (const p of particles) {
        p.vx *= 0.998;
        p.vy *= 0.998;
        p.x += p.vx;
        p.y += p.vy;

        p.vy -= 0.001;

        if (p.x < -15) p.x = canvas!.width + 15;
        if (p.x > canvas!.width + 15) p.x = -15;
        if (p.y < -15) p.y = canvas!.height + 15;
        if (p.y > canvas!.height + 15) p.y = -15;

        p.pulse += p.pulseSpeed;
        const pulseFactor = 0.7 + Math.sin(p.pulse) * 0.3;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * pulseFactor, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.opacity * pulseFactor;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 3 * pulseFactor, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.opacity * 0.08 * pulseFactor;
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.1;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = particles[i].color.includes("35") || particles[i].color.includes("ff52") ? `rgba(229,57,53,${alpha})` : `rgba(200,168,34,${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      for (const s of symbolsRef.current) {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -30) s.x = canvas!.width + 30;
        if (s.x > canvas!.width + 30) s.x = -30;
        if (s.y < -30) s.y = canvas!.height + 30;
        if (s.y > canvas!.height + 30) s.y = -30;

        ctx!.font = `300 ${s.size}px sans-serif`;
        ctx!.fillStyle = s.symbol === "$" ? "#c8a822" : s.symbol === "₿" ? "#e8d48b" : "#c8a822";
        ctx!.globalAlpha = s.opacity;
        ctx!.fillText(s.symbol, s.x, s.y);
      }

      const nodePositions = [
        { x: canvas!.width * 0.2, y: canvas!.height * 0.25 },
        { x: canvas!.width * 0.75, y: canvas!.height * 0.4 },
        { x: canvas!.width * 0.45, y: canvas!.height * 0.7 },
      ];

      for (const node of nodePositions) {
        const nodeX = node.x + Math.sin(time * 0.001 + node.x) * 15;
        const nodeY = node.y + Math.cos(time * 0.0012 + node.y) * 10;

        const size = 12;
        ctx!.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const hx = nodeX + size * Math.cos(angle);
          const hy = nodeY + size * Math.sin(angle);
          if (i === 0) ctx!.moveTo(hx, hy);
          else ctx!.lineTo(hx, hy);
        }
        ctx!.closePath();
        ctx!.strokeStyle = "rgba(200,168,34,0.15)";
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(nodeX, nodeY, 3, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(200,168,34,0.25)";
        ctx!.fill();

        const ringSize = 20 + Math.sin(time * 0.03 + node.x) * 8;
        ctx!.beginPath();
        ctx!.arc(nodeX, nodeY, ringSize, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(200,168,34,${0.03 + Math.sin(time * 0.03) * 0.02})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }

      ctx!.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
