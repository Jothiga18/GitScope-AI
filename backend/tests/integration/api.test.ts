import { beforeAll, describe, expect, it, vi } from 'vitest';
vi.mock('../../src/services/github/github.service', () => {
  const user = { login: 'octocat', name: 'The Octocat', avatar_url: 'x', bio: 'b', blog: 'https://x.dev', location: 'SF', company: null, html_url: 'u', followers: 5, following: 1, public_repos: 1, created_at: '2015-01-01T00:00:00Z' };
  const repo = { name: 'hello', html_url: 'u', description: 'd', language: 'TypeScript', stargazers_count: 3, forks_count: 1, topics: ['a'], license: { spdx_id: 'MIT' }, pushed_at: new Date().toISOString(), created_at: '2020-01-01T00:00:00Z', size: 300, fork: false, archived: false };
  return {
    getBundle: async (u: string) => { if (u === 'ghost') throw new (await import('../../src/utils/response')).AppError('GITHUB_USER_NOT_FOUND', 'GitHub user not found.', 404); return { user: { ...user, login: u }, repos: [repo], readmes: { hello: 900 } }; },
    getProfile: async () => ({ username: 'octocat' }), getRepositories: async () => [],
  };
});
vi.mock('../../src/services/ai/gemini.service', () => ({
  interpretProfile: async () => ({ summary: 's', developerLevel: 'Mid', archetype: { name: 'The Builder', description: '', evidence: [], blindSpot: '' }, workingStyle: {}, recruiterView: { firstImpression: '', standsOut: [], raisesQuestions: [], improve: [] }, careerInsights: [], roadmap: [], projectIdeas: [], interviewQuestions: [], interviewTopics: [] }),
  generateRoast: async () => 'A mocked roast long enough to pass.',
}));
import { buildApp } from '../../src/app';
let app: Awaited<ReturnType<typeof buildApp>>;
beforeAll(async () => { app = await buildApp(); });
const post = (url: string, payload: any) => app.inject({ method: 'POST', url: '/api/v1' + url, payload });
describe('API v1', () => {
  it('health', async () => { const r = await app.inject('/api/v1/health'); expect(r.json()).toMatchObject({ success: true, data: { status: 'ok' } }); });
  it('analysis returns facts and ai', async () => { const r = await post('/analysis', { username: 'github.com/octocat' }); const j = r.json(); expect(r.statusCode).toBe(200); expect(j.data.facts.profile.username).toBe('octocat'); expect(j.data.ai.archetype.name).toBe('The Builder'); expect(j.data.facts.overall).toBeGreaterThan(0); });
  it('analysis validates input', async () => { const r = await post('/analysis', { username: 'gitlab.com/x' }); expect(r.statusCode).toBe(400); expect(r.json().error.code).toBe('INVALID_INPUT'); });
  it('maps GitHub 404', async () => { const r = await post('/analysis', { username: 'ghost' }); expect(r.statusCode).toBe(404); expect(r.json().error.code).toBe('GITHUB_USER_NOT_FOUND'); });
  it('roast', async () => { const r = await post('/roast', { username: 'octocat', mode: 'dry' }); expect(r.json().data).toEqual({ roast: 'A mocked roast long enough to pass.', mode: 'dry' }); });
  it('roast rejects bad mode', async () => expect((await post('/roast', { username: 'octocat', mode: 'x' })).statusCode).toBe(400));
  it('compare', async () => { const r = await post('/compare', { first: 'octocat', second: 'torvalds' }); expect(r.json().data.metrics.length).toBeGreaterThan(5); });
  it('compare rejects identical users', async () => expect((await post('/compare', { first: 'a', second: 'A' })).statusCode).toBe(400));
  it('no stack traces in errors', async () => { const r = await app.inject({ method: 'POST', url: '/api/v1/analysis', payload: '{bad', headers: { 'content-type': 'application/json' } }); expect(r.body).not.toMatch(/at .*\(/); expect(r.json().success).toBe(false); });
});
