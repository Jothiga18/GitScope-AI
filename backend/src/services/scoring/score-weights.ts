import type { ScoreKey } from '../../../../shared/types/analysis';
export const SCORE_WEIGHTS: Record<ScoreKey, number> = { technicalBreadth: 1, projectQuality: 1.5, consistency: 1.2, documentation: 1, openSource: 0.8, portfolioReadiness: 1.2, communitySignal: 0.8 };
