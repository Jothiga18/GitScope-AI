export const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
export const ROAST_MODES = ['dry', 'witty', 'savage', 'brutal'] as const;
/** Accepts "user", "@user", "github.com/user" or a full profile URL. Returns null when invalid. */
export function extractUsername(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  let s = input.trim().replace(/^@/, '');
  const m = s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#\s]+)/i);
  if (m) s = m[1];
  return USERNAME_RE.test(s) ? s : null;
}
