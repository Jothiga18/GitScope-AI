import { env } from '../../config/env';
import { GITHUB_CACHE_TTL_MS, GITHUB_TIMEOUT_MS } from '../../config/constants';
import { AppError } from '../../utils/response';
import { TtlCache } from '../../utils/cache';
const cache = new TtlCache<any>(GITHUB_CACHE_TTL_MS, 500);
/** Authenticated, cached GitHub GET with timeout, one retry on 5xx, and normalized errors. */
export async function ghGet(path: string, allow404 = false): Promise<any> {
  const hit = cache.get(path);
  if (hit !== undefined) return hit;
  let res: Response | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      res = await fetch('https://api.github.com' + path, {
        signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'gitscope-ai', ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}) },
      });
    } catch { if (attempt) throw new AppError('NETWORK_ERROR', 'Could not reach GitHub (network error or timeout).', 502); continue; }
    if (res.status < 500) break;
  }
  const r = res!;
  if (r.status === 404) { if (allow404) return null; throw new AppError('GITHUB_USER_NOT_FOUND', 'GitHub user not found.', 404); }
  if (r.status === 429 || (r.status === 403 && r.headers.get('x-ratelimit-remaining') === '0'))
    throw new AppError('GITHUB_RATE_LIMIT', 'GitHub rate limit reached. Wait a few minutes, or set GITHUB_TOKEN on the backend.', 429);
  if (!r.ok) throw new AppError('GITHUB_ERROR', `GitHub returned status ${r.status}.`, 502);
  const v = await r.json();
  cache.set(path, v);
  return v;
}
