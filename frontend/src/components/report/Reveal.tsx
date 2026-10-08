'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function Reveal({ children }: { children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = heading.current;
    if (!element || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    setReady(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={heading} className="serif reveal-heading" data-ready={ready} data-visible={visible}>
      {children}
    </h2>
  );
}
