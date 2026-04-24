"use client";

import { useEffect, useState, useRef } from "react";

const PARTICLE_COUNT = 40;
const DURATION = 3500;

const colors = [
  "#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1", "#96E6A1",
  "#DDA0DD", "#FF9A76", "#F6D55C", "#3DC1D3", "#E056B0",
  "#7BED9F", "#FFA502", "#1E90FF", "#FF6348", "#A29BFE",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  spin: number;
  shape: "circle" | "rect" | "star";
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    y: 20 + Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 10,
    angle: Math.random() * 360,
    speed: 2 + Math.random() * 5,
    spin: Math.random() * 720 - 360,
    shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function Celebration({ onComplete }: { onComplete?: () => void }) {
  const [particles] = useState(() => generateParticles());
  const [visible, setVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play random congratulation sound
    const sound = Math.random() > 0.5 ? "/congratulations.m4a" : "/well_done.m4a";
    const audio = new Audio(sound);
    audioRef.current = audio;
    audio.play().catch(() => {});

    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, DURATION);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Burst particles */}
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.speed * 60;
        const ty = Math.sin(rad) * p.speed * 60 + 200; // gravity pull down

        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.shape === "rect" ? p.size * 0.6 : p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "star" ? "2px" : "2px",
              animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.3}s`,
              // @ts-expect-error CSS custom properties
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
              "--spin": `${p.spin}deg`,
            }}
          />
        );
      })}

      {/* Big emoji bursts */}
      {["🎉", "⭐", "🎊", "🌟", "🥳"].map((emoji, i) => (
        <span
          key={emoji}
          className="absolute text-5xl sm:text-6xl"
          style={{
            left: `${15 + i * 18}%`,
            top: "30%",
            animation: `confetti-fall ${2 + i * 0.2}s ease-out forwards`,
            animationDelay: `${i * 0.15}s`,
            // @ts-expect-error CSS custom properties
            "--tx": `${(Math.random() - 0.5) * 200}px`,
            "--ty": `${150 + Math.random() * 100}px`,
            "--spin": `${Math.random() * 360}deg`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
