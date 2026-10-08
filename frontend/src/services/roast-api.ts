import type { RoastMode, RoastResponse } from '@shared/types/roast';
import { api } from './api-client';
export const requestRoast = (username: string, mode: RoastMode) => api<RoastResponse>('/roast', { method: 'POST', body: JSON.stringify({ username, mode }) });
