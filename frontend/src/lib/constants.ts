export { ROAST_MODES } from '@shared/constants';
export const ERROR_ACTIONS: Record<string, string> = {
  INVALID_INPUT: 'Check the spelling and try again.', GITHUB_USER_NOT_FOUND: 'Check the spelling, or try a different username.',
  GITHUB_RATE_LIMIT: 'Wait a few minutes and retry.', GITHUB_ERROR: 'GitHub may be having issues; retry shortly.',
  NETWORK_ERROR: 'Check that the backend is running and reachable.', RATE_LIMITED: 'Wait a minute and retry.',
};
