'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from '@phosphor-icons/react';

export const ANALYSIS_STAGES = [
  'PROFILE',
  'REPOSITORIES',
  'TECH STACK',
  'ACTIVITY',
  'PROJECT QUALITY',
  'AI INTERPRETATION',
  'REPORT',
] as const;

type StageListProps = {
  mode: 'progress' | 'complete';
};

export default function StageList({ mode }: StageListProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (mode !== 'progress') return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= ANALYSIS_STAGES.length - 1) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [mode]);

  return (
    <>
      <h1 className="serif stage-heading">Reading the profile</h1>
      <ol className="stages">
        {ANALYSIS_STAGES.map((stage, index) => {
          const state = mode === 'complete' || index < activeIndex
            ? 'done'
            : index === activeIndex
              ? 'active'
              : 'pending';

          return (
            <li className={`stage-row stage-${state}`} key={stage}>
              <span>{stage}</span>
              <span className="stage-status" role="img" aria-label={state === 'done' ? 'done' : state === 'active' ? 'in progress' : 'pending'}>
                {state === 'done' && <CheckCircle className="stage-check" size={20} weight="fill" color="var(--success)" aria-hidden="true" />}
                {state === 'active' && <span className="stage-spinner" />}
                {state === 'pending' && <span className="stage-pending-ring" />}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
}
