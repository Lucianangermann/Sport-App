import confetti from 'canvas-confetti';

export const triggerConfetti = (intensity: 'small' | 'medium' | 'large') => {
  const configs = {
    small: { particleCount: 40, spread: 50, startVelocity: 25, gravity: 1.2 },
    medium: { particleCount: 100, spread: 70, startVelocity: 40, gravity: 1 },
    large: { particleCount: 200, spread: 100, startVelocity: 55, gravity: 0.9, colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#A855F7'] },
  };
  const cfg = configs[intensity];
  confetti({ ...cfg, origin: { y: 0.6 } });
  if (intensity === 'large') {
    setTimeout(() => confetti({ ...cfg, origin: { x: 0.1, y: 0.5 }, angle: 60 }), 200);
    setTimeout(() => confetti({ ...cfg, origin: { x: 0.9, y: 0.5 }, angle: 120 }), 400);
  }
};
