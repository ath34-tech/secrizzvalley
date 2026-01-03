// movement.js
export function validMovement(prev, next) {
  if (!prev) return true;
  const dt = Math.max(1, (next.ts || Date.now()) - (prev.ts || next.ts - 100));
  const dist = Math.hypot(next.x - prev.x, next.y - prev.y);
  const speed = dist / (dt / 1000);
  const MAX_SPEED = 900; // px/sec - tune to your game
  return speed <= MAX_SPEED * 1.5;
}
