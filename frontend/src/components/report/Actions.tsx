'use client';
import { useState } from 'react';
import { Printer, ShareNetwork, Check } from '@phosphor-icons/react';
export default function Actions() {
  const [done, setDone] = useState(false);
  async function share() {
    const url = location.href;
    if (navigator.share) { try { await navigator.share({ title: 'GitScope AI report', url }); return; } catch {} }
    await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 2000);
  }
  return (<div className="noprint" style={{ display: 'flex', gap: 8 }}>
    <button className="btn ghost sm" onClick={() => window.print()}><Printer size={16} />Download report</button>
    <button className="btn ghost sm" onClick={share}>{done ? <Check size={16} /> : <ShareNetwork size={16} />}{done ? 'URL copied' : 'Share report'}</button></div>);
}
