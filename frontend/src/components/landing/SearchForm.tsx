'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { extractUsername } from '@shared/constants';
import { ApiError } from '@/services/api-client';
import { fetchProfile } from '@/services/github-api';

type SubmitState = 'idle' | 'loading' | 'success';

export default function SearchForm() {
  const [v, setV] = useState('');
  const [err, setErr] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const router = useRouter();

  async function go(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state !== 'idle') return;
    const u = extractUsername(v);
    if (!u) return setErr('Enter a valid GitHub username or github.com/username link.');

    setErr('');
    setState('loading');
    try {
      await fetchProfile(u);
      setState('success');
      window.setTimeout(() => router.push(`/report/${u}`), 700);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'GITHUB_USER_NOT_FOUND') {
        setState('idle');
        setErr(error.message);
        return;
      }
      router.push(`/report/${u}`);
    }
  }

  const busy = state !== 'idle';
  const label = state === 'loading' ? 'Checking profile' : state === 'success' ? 'Profile found' : 'Generate my profile';
  return (<form onSubmit={go} noValidate id="analyze" aria-busy={state === 'loading'}>
    <div className="search"><label htmlFor="u" style={{ position: 'absolute', left: -9999 }}>GitHub username or profile URL</label>
      <input id="u" value={v} onChange={(e) => { setV(e.target.value); setErr(''); }} placeholder="github.com/username" autoComplete="off" disabled={busy} aria-invalid={!!err} aria-describedby="uerr" />
      <button className="btn" type="submit" disabled={busy}>
        {state === 'loading' && <span className="search-spinner" aria-hidden="true" />}
        {state === 'success' && <CheckCircle className="success-check" size={18} weight="fill" color="var(--success)" aria-hidden="true" />}
        {state === 'idle' && <>Generate my profile <ArrowRight size={16} /></>}
        {state !== 'idle' && label}
      </button></div>
    <span className="sr-only" aria-live="polite">{state === 'loading' ? 'Checking profile' : state === 'success' ? 'Profile found' : ''}</span>
    <p id="uerr" className="err" role="alert">{err}</p>
    <p className="note">No GitHub login required.</p></form>);
}
