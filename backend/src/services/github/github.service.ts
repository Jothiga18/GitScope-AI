import { MAX_REPOS } from '../../config/constants';
import type { RawGithubBundle } from '../../types/github.types';
import { ghGet } from './github.client';
import { mapProfile, mapRepo } from './github.mapper';
const rawRepos = async (u: string): Promise<any[]> => ((await ghGet(`/users/${u}/repos?per_page=100&sort=pushed`)) as any[]).slice(0, MAX_REPOS);
export const getProfile = async (u: string) => mapProfile(await ghGet(`/users/${u}`));
export const getRepositories = async (u: string) => (await rawRepos(u)).map(mapRepo);
/** Everything the analysis engine needs, fetched once. README presence is checked for the 5 strongest original repos only. */
export async function getBundle(u: string): Promise<RawGithubBundle> {
  const user = await ghGet(`/users/${u}`);
  const repos = await rawRepos(u);
  const top = repos.filter((r) => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count || (a.pushed_at < b.pushed_at ? 1 : -1)).slice(0, 5);
  const readmes: Record<string, number> = {};
  await Promise.all(top.map(async (r) => { const d = await ghGet(`/repos/${u}/${r.name}/readme`, true).catch(() => null); readmes[r.name] = d ? d.size || 1 : 0; }));
  return { user, repos, readmes };
}
