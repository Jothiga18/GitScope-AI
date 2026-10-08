import { DeveloperFacts } from './analysis';
export interface ComparisonResult { first: DeveloperFacts; second: DeveloperFacts; metrics: { label: string; first: number; second: number }[]; note: string }
