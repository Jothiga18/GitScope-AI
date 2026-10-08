import type { ComparisonResult } from '@shared/types/comparison';
import { api } from './api-client';
export const compareDevelopers = (first: string, second: string) => api<ComparisonResult>('/compare', { method: 'POST', body: JSON.stringify({ first, second }) });
