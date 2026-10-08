import { getBundle } from '../github/github.service';
import { ago, activeMonths } from './activity-analyzer';
import { maturity } from './maturity-analyzer';
import { summarizeLanguages, buildDna } from './language-analyzer';
import { c, avg, weightedOverall } from '../scoring/score-calculator';
import { computeScores } from '../scoring/scoring.service';


export async function buildFacts(username: string) {
  const { user, repos, readmes } = await getBundle(username);
  const own = repos.filter((r) => !r.fork);
  const forks = repos.length - own.length;
  const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const languages = summarizeLanguages(own);
  const recent = own.filter((r) => ago(r.pushed_at) < 365);
  const months = activeMonths(own);
  const rq = (r: any) => c((r.description ? 25 : 0) + (r.topics?.length ? 15 : 0) + (r.license ? 15 : 0) + (readmes[r.name] ? 15 : 0) + (r.size > 50 ? 10 : 0) + Math.min(20, Math.log2(r.stargazers_count + 1) * 5));
  const rows = own.map((r) => {
    const [level, why] = maturity(r);
    return { name: r.name, url: r.html_url, description: r.description, language: r.language, stars: r.stargazers_count, forks: r.forks_count, topics: r.topics || [], license: r.license?.spdx_id || null, pushed: r.pushed_at.slice(0, 10), size: r.size, readme: readmes[r.name] ?? null, maturity: level, why, quality: rq(r),
      showcase: Math.log2(r.stargazers_count + 1) * 8 + Math.log2(r.forks_count + 1) * 4 + (ago(r.pushed_at) < 180 ? 15 : 0) + (r.description ? 10 : 0) + (readmes[r.name] ? 10 : 0) + (r.topics?.length ? 5 : 0) + (r.license ? 5 : 0) + Math.min(10, r.size / 200) };
  });
  const showcase = [...rows].sort((a, b) => b.showcase - a.showcase).slice(0, 3).map((r) => ({
    ...r, reasons: [r.stars ? `${r.stars} stars` : null, r.forks ? `${r.forks} forks` : null, ago(r.pushed) < 180 ? 'recently updated' : null, r.description ? 'has a description' : null, r.readme ? 'has a README' : null, r.license ? `${r.license} license` : null].filter(Boolean),
    missing: [!r.description && 'a description', !r.topics.length && 'topics', !r.license && 'a license', r.readme === 0 && 'a README', r.readme && r.readme < 500 && 'a fuller README (current one is very short)'].filter(Boolean),
  }));
  const profileFields = [user.name, user.bio, user.blog, user.location, user.company].filter(Boolean).length;
  const topRows = [...rows].sort((a, b) => b.showcase - a.showcase).slice(0, 10);
  const described = own.length ? own.filter((r) => r.description).length / own.length : 0;
  const scores = computeScores({ user, repos, own, languages, stars, recent, months, described, profileFields, topRows, showcase, readmes });
  const overall = weightedOverall(scores);
  const dna = buildDna(languages);
  const hygiene = [
    user.bio ? ['good', 'Profile has a bio.'] : ['priority', 'Add a short bio saying what you build.'],
    user.blog ? ['good', 'Profile links to a website.'] : ['attention', 'Add a website or portfolio link.'],
    described >= 0.7 ? ['good', 'Most repositories have descriptions.'] : ['attention', `${own.filter((r) => !r.description).length} of ${own.length} original repositories have no description.`],
    own.some((r) => r.topics?.length) ? ['good', 'Some repositories use topics.'] : ['attention', 'No repository uses topics, which limits discoverability.'],
    forks > own.length ? ['attention', `${forks} forks versus ${own.length} original repositories; pin original work.`] : ['good', 'Original work outweighs forks.'],
    recent.length ? ['good', `${recent.length} repositories updated in the last year.`] : ['priority', 'No original repository has been updated in the last year.'],
    own.length && !own.some((r) => r.license) ? ['attention', 'No repository declares a license.'] : ['good', 'License usage observed.'],
  ].map(([level, text]) => ({ level, text }));
  return {
    profile: { username: user.login, name: user.name, avatar: user.avatar_url, bio: user.bio, company: user.company, location: user.location, website: user.blog, url: user.html_url, followers: user.followers, following: user.following, created: user.created_at.slice(0, 10) },
    stats: { repos: user.public_repos, analyzed: repos.length, original: own.length, forks, stars, followers: user.followers, languages: languages.length, accountYears: +(ago(user.created_at) / 365).toFixed(1), updatedLastYear: recent.length },
    scores, overall, languages: languages.slice(0, 8), dna, showcase, hygiene,
    maturityCounts: rows.reduce((m: any, r) => ((m[r.maturity] = (m[r.maturity] || 0) + 1), m), {}),
    repos: rows.sort((a, b) => b.showcase - a.showcase).slice(0, 20),
  };
}
export type Facts = Awaited<ReturnType<typeof buildFacts>>;
