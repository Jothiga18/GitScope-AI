import { REPORT_CACHE_TTL_MS } from '../../config/constants';
import { TtlCache } from '../../utils/cache';
import { buildFacts } from '../analysis/analysis.service';
import { interpretProfile } from '../ai/gemini.service';
import type { AnalysisReport, DeveloperFacts } from '../../../../shared/types/analysis';
import type { ComparisonResult } from '../../../../shared/types/comparison';
const cache = new TtlCache<AnalysisReport>(REPORT_CACHE_TTL_MS, 100);
export const getFacts = async (u: string) => (await buildFacts(u)) as unknown as DeveloperFacts;
/** Facts always come back; an AI failure degrades into `aiError` instead of failing the whole report. */
export async function getReport(username: string): Promise<AnalysisReport> {
  const key = username.toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;
  const facts = await getFacts(username);
  let ai: AnalysisReport['ai'] = null, aiError: AnalysisReport['aiError'] = null;
  try { ai = await interpretProfile(facts); } catch (e: any) { aiError = { code: e.code || 'INTERNAL_ERROR', message: e.message || 'AI interpretation failed.' }; }
  const report = { facts, ai, aiError };
  if (ai) cache.set(key, report);
  return report;
}
const LABELS: Record<string, string> = { technicalBreadth: 'Technical Breadth', projectQuality: 'Project Quality', consistency: 'Consistency', openSource: 'Open Source', portfolioReadiness: 'Portfolio Readiness', communitySignal: 'Community Signal' };
export async function compareProfiles(a: string, b: string): Promise<ComparisonResult> {
  const [first, second] = await Promise.all([getFacts(a), getFacts(b)]);
  const metrics = [
    ...Object.entries(LABELS).map(([k, label]) => ({ label, first: (first.scores as any)[k], second: (second.scores as any)[k] })),
    { label: 'Repositories', first: first.stats.repos, second: second.stats.repos },
    { label: 'Stars', first: first.stats.stars, second: second.stats.stars },
    { label: 'Followers', first: first.stats.followers, second: second.stats.followers },
    { label: 'Languages', first: first.stats.languages, second: second.stats.languages },
    { label: 'Repos updated in last year', first: first.stats.updatedLastYear, second: second.stats.updatedLastYear },
  ];
  return { first, second, metrics, note: 'Profile comparison of observable public GitHub signals. These heuristics do not rank developers or measure ability.' };
}
