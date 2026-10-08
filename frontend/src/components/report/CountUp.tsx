'use client';

import { useEffect, useState } from 'react';

export default function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !Number.isFinite(value)) {
      setDisplayValue(value);
      return;
    }

    const precision = `${value}`.split('.')[1]?.length || 0;
    const scale = 10 ** precision;
    const started = performance.now();
    let frame = 0;
    function update(now: number) {
      const progress = Math.min((now - started) / 800, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(progress === 1 ? value : Math.round(value * eased * scale) / scale);
      if (progress < 1) frame = window.requestAnimationFrame(update);
    }

    setDisplayValue(0);
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue}</>;
}
