import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  drift: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
}

const SHADES = ['#A88B45', '#1A202C', '#4A5568', '#E2E8F0', '#ECC94B', '#48BB78', '#F56565', '#4299E1'];

export default function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate initial set
    const temp: Particle[] = [];
    for (let i = 0; i < 90; i++) {
      temp.push({
        id: Math.random(),
        x: Math.random() * 100, // percentage
        y: -10 - Math.random() * 40, // high start
        color: SHADES[Math.floor(Math.random() * SHADES.length)],
        size: 6 + Math.random() * 8,
        drift: -1.5 + Math.random() * 3,
        speed: 1.5 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: -3 + Math.random() * 6
      });
    }
    setParticles(temp);

    let active = true;
    const update = () => {
      if (!active) return;
      setParticles(prev =>
        prev.map(p => {
          let nextY = p.y + p.speed;
          let nextX = p.x + p.drift;
          let nextRotation = p.rotation + p.rotationSpeed;
          // Loop back up if it falls off bottom
          if (nextY > 110) {
            nextY = -10;
            nextX = Math.random() * 100;
          }
          return { ...p, y: nextY, x: nextX, rotation: nextRotation };
        })
      );
      requestAnimationFrame(update);
    };

    const frameId = requestAnimationFrame(update);
    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.size % 2 === 0 ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.85,
            transition: 'transform 0.05s linear'
          }}
        />
      ))}
    </div>
  );
}
