import React, { useMemo } from 'react';

const ITEMS = ['🍎','🥕','🥦','🍋','🍇','🍊','🥑','🍓','🌽','🍑','🥝','🍒','🫐','🥬','🍆'];

export default function AnimatedBackground() {
  const fruits = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i,
    emoji: ITEMS[i % ITEMS.length],
    left: `${(i * 4.5 + Math.random() * 4) % 100}%`,
    duration: `${14 + (i % 7) * 3}s`,
    delay: `${-(i * 2.8)}s`,
    size: `${1.8 + (i % 4) * 0.5}rem`,
  })), []);

  return (
    <div className="bg-canvas">
      {fruits.map(f => (
        <div key={f.id} className="fruit" style={{
          left: f.left,
          fontSize: f.size,
          animationDuration: f.duration,
          animationDelay: f.delay,
        }}>
          {f.emoji}
        </div>
      ))}
    </div>
  );
}
