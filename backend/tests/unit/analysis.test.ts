import { describe, expect, it } from 'vitest';
import { maturity } from '../../src/services/analysis/maturity-analyzer';
import { buildDna, summarizeLanguages } from '../../src/services/analysis/language-analyzer';
const iso = (d: number) => new Date(Date.now() - d * 864e5).toISOString();
const repo = (o: any) => ({ archived: false, stargazers_count: 0, size: 10, description: null, created_at: iso(10), pushed_at: iso(5), ...o });
describe('maturity', () => {
  it('archived', () => expect(maturity(repo({ archived: true }))[0]).toBe('Archived'));
  it('mature by stars', () => expect(maturity(repo({ stargazers_count: 25 }))[0]).toBe('Mature Project'));
  it('active', () => expect(maturity(repo({ size: 400, description: 'x' }))[0]).toBe('Active Project'));
  it('experimental', () => expect(maturity(repo({}))[0]).toBe('Experimental'));
  it('prototype', () => expect(maturity(repo({ size: 80, description: 'x', created_at: iso(200), pushed_at: iso(150) }))[0]).toBe('Prototype'));
});
describe('languages', () => {
  const langs = summarizeLanguages([{ language: 'Go' }, { language: 'Go' }, { language: 'TypeScript' }, { language: null }]);
  it('counts and sorts', () => expect(langs[0]).toEqual({ name: 'Go', count: 2 }));
  it('maps to DNA categories only when supported by data', () => { const d = buildDna(langs).map((x) => x.category); expect(d).toContain('Backend'); expect(d).not.toContain('Mobile'); });
});
