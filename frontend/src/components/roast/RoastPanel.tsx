'use client';
import { useState } from 'react';
import { requestRoast } from '@/services/roast-api';
import { ROAST_MODES } from '@/lib/constants';
import type { RoastMode } from '@shared/types/roast';
import { Copy, Trash, ArrowsClockwise, Flame } from '@phosphor-icons/react';
type R = { id: number; text: string; mode: string };
const MODES = ROAST_MODES;
export default function RoastPanel({ username }: { username: string }) {
  const [mode, setMode] = useState('witty'); const [list, setList] = useState<R[]>([]); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  async function gen(m = mode) {
    setBusy(true); setErr('');
    try {
      const j = await requestRoast(username, m as RoastMode);
      setList((l) => [{ id: Date.now(), text: j.roast, mode: m }, ...l].slice(0, 10));
    } catch (e: any) { setErr(e.message === 'Failed to fetch' ? 'Network failure. Check your connection and try again.' : e.message); }
    setBusy(false);
  }
  const [cur, ...prev] = list;
  return (<div>
    <div className="modes" role="group" aria-label="Roast mode">{MODES.map((m) => <button key={m} className="btn ghost sm" aria-pressed={mode === m} onClick={() => setMode(m)} style={{ textTransform: 'capitalize' }}>{m}</button>)}</div>
    {!cur && <button className="btn" onClick={() => gen()} disabled={busy}><Flame size={18} />{busy ? 'Writing...' : 'Roast this profile'}</button>}
    {err && <p className="err" role="alert">{err}</p>}
    {cur && <figure className="quote" style={{ margin: 0 }}><div className="meta">GITSCOPE ROAST / {cur.mode.toUpperCase()}</div><p className="serif">{cur.text}</p><div className="meta">@{username} / profile, repositories, languages, activity</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn sm" onClick={() => navigator.clipboard.writeText(cur.text)}><Copy size={15} />Copy</button>
        <button className="btn sm" onClick={() => gen()} disabled={busy}><ArrowsClockwise size={15} />{busy ? 'Writing...' : 'Generate again'}</button></div></figure>}
    {prev.length > 0 && <><h3 className="serif" style={{ margin: '28px 0 10px' }}>Previous roasts</h3>
      {prev.map((r) => <div className="card" key={r.id} style={{ marginBottom: 10 }}><span className="pill">{r.mode}</span><p>{r.text}</p>
        <div style={{ display: 'flex', gap: 8 }}><button className="btn ghost sm" onClick={() => navigator.clipboard.writeText(r.text)}><Copy size={14} />Copy</button>
          <button className="btn ghost sm" onClick={() => gen(r.mode)} disabled={busy}><ArrowsClockwise size={14} />Regenerate</button>
          <button className="btn ghost sm" onClick={() => setList((l) => l.filter((x) => x.id !== r.id))}><Trash size={14} />Delete</button></div></div>)}</>}
  </div>);
}
