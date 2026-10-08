import { z } from 'zod';
import { extractUsername } from '../../../shared/constants';
export const usernameSchema = z.string({ required_error: 'Enter a GitHub username or profile URL.' }).trim().min(1, 'Enter a GitHub username or profile URL.').max(200)
  .transform((s, ctx) => {
    const u = extractUsername(s);
    if (!u) { ctx.addIssue({ code: 'custom', message: 'That is not a valid GitHub username. Use a name like "octocat" or a github.com/username link.' }); return z.NEVER; }
    return u;
  });
