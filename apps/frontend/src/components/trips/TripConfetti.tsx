'use client';

import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface TripConfettiProps {
  trigger: boolean;
}

export function TripConfetti({ trigger }: TripConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const end = Date.now() + 3 * 1000;
    const colors = ['#328032', '#fbf7f2'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, [trigger]);

  return null;
}
