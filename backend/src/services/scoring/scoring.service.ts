import { CAT } from '../analysis/language-analyzer';
import { c, avg } from './score-calculator';
import type { Scores } from '../../../../shared/types/analysis';
export function computeScores({ user, repos, own, languages, stars, recent, months, described, profileFields, topRows, showcase, readmes }: any): Scores {
  return {
    technicalBreadth: c(languages.length * 14 + Object.keys(CAT).filter((k) => languages.some((l) => CAT[k].includes(l.name))).length * 10),
    projectQuality: c(avg(topRows.map((r) => r.quality))),
    consistency: c((own.length ? recent.length / own.length : 0) * 55 + (months / 12) * 45),
    documentation: c(described * 45 + (own.length ? own.filter((r) => r.license).length / own.length : 0) * 20 + (own.length ? own.filter((r) => r.topics?.length).length / own.length : 0) * 20 + (Object.values(readmes).filter(Boolean).length / Math.max(1, Object.keys(readmes).length)) * 15),
    openSource: c(Math.log2(stars + 1) * 8 + Math.log2(repos.reduce((s, r) => s + r.forks_count, 0) + 1) * 8 + (own.length ? own.filter((r) => r.license).length / own.length : 0) * 30),
    portfolioReadiness: c(profileFields * 8 + avg(showcase.map((r) => r.quality)) * 0.4 + Math.min(20, recent.length * 4)),
    communitySignal: c(Math.log2(user.followers + 1) * 7 + Math.log2(stars + 1) * 6),
  };
}
