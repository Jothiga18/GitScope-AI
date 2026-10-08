import { ago } from './activity-analyzer';
export function maturity(r: any) {
  if (r.archived) return ['Archived', 'Marked archived by its owner.'];
  const age = ago(r.created_at), idle = ago(r.pushed_at);
  if (r.stargazers_count >= 10 || (age > 365 && idle < 365 && r.size > 500 && r.description))
    return ['Mature Project', `${r.stargazers_count} stars, ${Math.round(age / 30)} months old, ${r.size} KB, pushed ${Math.round(idle)} days ago.`];
  if (idle < 90 && r.size > 100) return ['Active Project', `Pushed ${Math.round(idle)} days ago with ${r.size} KB of code.`];
  if (r.size < 50 || (!r.description && age < 90)) return ['Experimental', `Small (${r.size} KB)${r.description ? '' : ' with no description'}.`];
  return ['Prototype', `Moderate size (${r.size} KB), last pushed ${Math.round(idle)} days ago.`];
}
