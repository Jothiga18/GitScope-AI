'use client';

import { useEffect, useState, type ReactNode } from 'react';
import StageList from './StageList';

export default function ReportReveal({ children }: { children: ReactNode }) {
  const [showStages, setShowStages] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      setShowStages(false);
      setRevealed(true);
    }, reducedMotion ? 300 : 600);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="report-reveal">
      {showStages && <div className="report-reveal-stages" role="status" aria-live="polite"><StageList mode="complete" /></div>}
      <div className={`report-reveal-content${revealed ? ' is-revealed' : ''}`} inert={!revealed}>
        {children}
      </div>
    </div>
  );
}
