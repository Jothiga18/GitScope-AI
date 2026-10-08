import type { AnalysisReport } from '@shared/types/analysis';
import { api } from './api-client';
export const fetchReport = (username: string) => api<AnalysisReport>(`/report/${encodeURIComponent(username)}`);
