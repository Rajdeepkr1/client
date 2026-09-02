import { useState } from 'react';
import { motion } from 'framer-motion';
import './ConfettiBlast.css';

const COLORS = ['#8b5cf6', '#06b6d4', '#34d399', '#fbbf24', '#f87171', '#ec4899'];
const PIECE_COUNT = 36;

interface Piece {
  id: number;
  color: string;
  x: number;
  y: number;
  rotate: number;
  size: number;
  delay: number;
}

export function ConfettiBlast() {
  const [pieces] = useState<Piece[]>(() => {
    return Array.from({ length: PIECE_COUNT }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 90 + Math.random() * 160;
      return {
        id: i,
        color: COLORS[i % COLORS.length],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance + 40, // slight downward drift, like gravity
        rotate: Math.random() * 720 - 360,
        size: 5 + Math.random() * 6,
        delay: Math.random() * 0.12,
      };
    });
  });

  return (
    <div className="confetti-blast" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="confetti-piece"
          style={{ background: p.color, width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
