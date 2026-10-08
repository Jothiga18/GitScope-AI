import '@/styles/globals.css';
import type { ReactNode } from 'react';
export const metadata = { title: 'GitScope AI', description: 'Your GitHub presence, understood.' };
export default function Layout({ children }: { children: ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><head>
    <script dangerouslySetInnerHTML={{ __html: `(function(){var theme;try{theme=localStorage.getItem('gitscope-theme')}catch{}if(theme!=='light'&&theme!=='dark'){theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=theme})()` }} />
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap" />
  </head><body>{children}</body></html>);
}
