import confetti from "canvas-confetti";

export function triggerCelebration() {
  const defaults = { origin: { y: 0.7 } };

  confetti({
    ...defaults,
    particleCount: 80,
    spread: 100,
    colors: ["#ffd700", "#ffec8b", "#ffffff", "#00e676"],
  });

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      spread: 120,
      colors: ["#ffd700", "#ff9800", "#ffffff"],
      origin: { y: 0.6, x: 0.3 },
    });
  }, 200);

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      spread: 120,
      colors: ["#ffd700", "#00e676", "#ffffff"],
      origin: { y: 0.6, x: 0.7 },
    });
  }, 400);
}

export function triggerMiniCelebration() {
  confetti({
    particleCount: 30,
    spread: 60,
    colors: ["#ffd700", "#ffec8b"],
    origin: { y: 0.8 },
    ticks: 60,
  });
}
