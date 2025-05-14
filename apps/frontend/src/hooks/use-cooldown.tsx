"use client";

import { useState, useEffect } from "react";

interface UseCooldownOptions {
  initialDuration?: number;
  autoStart?: boolean;
}

export function useCooldown({
  initialDuration = 60,
  autoStart = true,
}: UseCooldownOptions = {}) {
  const [timer, setTimer] = useState(initialDuration);
  const [isCooldown, setIsCooldown] = useState(autoStart);

  useEffect(() => {
    if (timer > 0 && isCooldown) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsCooldown(false);
    }
  }, [timer, isCooldown]);

  const startCooldown = (duration?: number) => {
    setIsCooldown(true);
    setTimer(duration ?? initialDuration);
  };

  return {
    timer,
    isCooldown,
    startCooldown,
  };
}
