import { describe, expect, it } from 'vitest';
import { c, weightedOverall } from '../../src/services/scoring/score-calculator';
import { computeScores } from '../../src/services/scoring/scoring.service';
const empty = { user: { followers: 0 }, repos: [], own: [], languages: [], stars: 0, recent: [], months: 0, described: 0, profileFields: 0, topRows: [], showcase: [], readmes: {} };
describe('scoring', () => {
  it('clamps', () => { expect(c(-5)).toBe(0); expect(c(140)).toBe(100); expect(c(49.6)).toBe(50); });
  it('weighted overall bounds', () => { expect(weightedOverall({ technicalBreadth: 100, projectQuality: 100, consistency: 100, documentation: 100, openSource: 100, portfolioReadiness: 100, communitySignal: 100 })).toBe(100); expect(weightedOverall({})).toBe(0); });
  it('empty profile scores zero, never NaN', () => { Object.values(computeScores(empty)).forEach((v) => expect(v).toBe(0)); });
  it('rewards breadth and followers', () => {
    const s = computeScores({ ...empty, user: { followers: 100 }, languages: [{ name: 'Go', count: 2 }, { name: 'Python', count: 1 }, { name: 'Rust', count: 1 }], stars: 50 });
    expect(s.technicalBreadth).toBeGreaterThan(40); expect(s.communitySignal).toBeGreaterThan(0);
  });
});
