import React from 'react';

export default function FloatingBackground({ admin }) {
  const blobs = admin
    ? [
        { w: 400, h: 400, top: '-10%', left: '-5%', bg: '#1e40af' },
        { w: 300, h: 300, bottom: '10%', right: '5%', bg: '#7c3aed' },
        { w: 250, h: 250, top: '40%', left: '40%', bg: '#0f766e' },
      ]
    : [
        { w: 500, h: 500, top: '-15%', left: '-10%', bg: '#14b8a6' },
        { w: 350, h: 350, bottom: '5%', right: '-5%', bg: '#6366f1' },
        { w: 280, h: 280, top: '35%', left: '45%', bg: '#f59e0b' },
      ];

  return (
    <>
      {blobs.map((b, i) => (
        <div key={i} className="blob" style={{
          width: b.w, height: b.h,
          top: b.top, left: b.left,
          bottom: b.bottom, right: b.right,
          background: b.bg,
          animationDelay: `${i * 2}s`,
        }} />
      ))}
    </>
  );
}
