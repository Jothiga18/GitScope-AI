export type ScoreKey = 'technicalBreadth' | 'projectQuality' | 'consistency' | 'documentation' | 'openSource' | 'portfolioReadiness' | 'communitySignal';
export type Scores = Record<ScoreKey, number>;
export interface AiInterpretation {
  summary: string; developerLevel: string;
  archetype: { name: string; description: string; evidence: string[]; blindSpot: string };
  workingStyle: Record<string, number>;
  recruiterView: { firstImpression: string; standsOut: string[]; raisesQuestions: string[]; improve: string[] };
  careerInsights: string[]; roadmap: { week: number; focus: string; tasks: string[] }[];
  projectIdeas: { title: string; why: string; tech: string[]; difficulty: string; portfolioValue: string; differentiator: string }[];
  interviewQuestions: string[]; interviewTopics: string[];
}
export interface DeveloperFacts { profile: any; stats: Record<string, number>; scores: Scores; overall: number; languages: { name: string; count: number }[]; dna: any[]; showcase: any[]; hygiene: { level: string; text: string }[]; maturityCounts: Record<string, number>; repos: any[] }
export interface AnalysisReport { facts: DeveloperFacts; ai: AiInterpretation | null; aiError: { code: string; message: string } | null }
