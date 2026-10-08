import { describe, expect, it } from 'vitest';
import { usernameSchema } from '../../src/validators/github.validator';
describe('usernameSchema', () => {
  it.each([['octocat', 'octocat'], ['@octocat', 'octocat'], ['github.com/octocat', 'octocat'], ['https://github.com/octocat/hello?tab=x', 'octocat']])('accepts %s', (i, o) => expect(usernameSchema.parse(i)).toBe(o));
  it.each(['', '   ', 'gitlab.com/x', 'bad name', '-lead', 'a'.repeat(40)])('rejects "%s"', (i) => expect(usernameSchema.safeParse(i).success).toBe(false));
});
