const DAY = 864e5;
export const ago = (d: string) => (Date.now() - new Date(d).getTime()) / DAY;
/** Distinct months (of the last 12) in which at least one original repo was pushed. */
export const activeMonths = (own: any[]) => new Set(own.map((r) => r.pushed_at.slice(0, 7)).filter((m) => ago(m + '-28') < 365)).size;
