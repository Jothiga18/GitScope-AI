import type { GithubProfile } from '@shared/types/github';
import { api } from './api-client';

export const fetchProfile = (username: string) =>
  api<GithubProfile>(`/github/profile/${encodeURIComponent(username)}`);
