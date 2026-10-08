// Smoke test against running servers (npm run dev). Network-light: no GitHub data required.
const api = (process.env.BACKEND_URL || 'http://localhost:4000') + '/api/v1', web = process.env.FRONTEND_URL || 'http://localhost:3000';
const checks = [
  ['backend health', async () => (await (await fetch(api + '/health')).json()).success === true],
  ['invalid username rejected', async () => { const r = await fetch(api + '/analysis', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"username":"gitlab.com/x"}' }); return r.status === 400 && (await r.json()).error.code === 'INVALID_INPUT'; }],
  ['landing renders', async () => (await (await fetch(web)).text()).includes('GitScope AI')],
  ['compare page renders', async () => (await fetch(web + '/compare')).status === 200],
];
let failed = 0;
for (const [name, fn] of checks) { let ok = false; try { ok = await fn(); } catch {} console.log(ok ? 'PASS' : 'FAIL', name); if (!ok) failed++; }
process.exit(failed ? 1 : 0);
