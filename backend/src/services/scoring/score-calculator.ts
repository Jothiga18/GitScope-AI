import { SCORE_WEIGHTS } from './score-weights';
export const c = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
export const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
export function weightedOverall(scores: Record<string, number>) {
  let t = 0, w = 0;
  for (const [k, weight] of Object.entries(SCORE_WEIGHTS)) { t += (scores[k] ?? 0) * weight; w += weight; }
  return c(t / w);
}
