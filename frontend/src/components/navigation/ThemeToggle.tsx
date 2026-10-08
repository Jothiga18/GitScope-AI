'use client';

import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from '@phosphor-icons/react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'gitscope-theme';

function setDocumentTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const userSelected = useRef(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    const initial = current === 'dark' ? 'dark' : 'light';
    setTheme(initial);

    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    function followSystem(event: MediaQueryListEvent) {
      try {
        if (!userSelected.current && localStorage.getItem(STORAGE_KEY) === null) {
          const next = event.matches ? 'dark' : 'light';
          setTheme(next);
          setDocumentTheme(next);
        }
      } catch {
        const next = event.matches ? 'dark' : 'light';
        setTheme(next);
        setDocumentTheme(next);
      }
    }

    preference.addEventListener('change', followSystem);
    return () => preference.removeEventListener('change', followSystem);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    userSelected.current = true;
    setTheme(next);
    setDocumentTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The selected theme remains active for this page when storage is unavailable.
    }
  }

  const dark = theme === 'dark';
  return (
    <button
      className="btn ghost sm theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
    >
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
