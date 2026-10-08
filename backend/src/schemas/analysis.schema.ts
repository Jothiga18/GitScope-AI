import { z } from 'zod';
import { usernameSchema } from '../validators/github.validator';
export const analysisRequestSchema = z.object({ username: usernameSchema });
export const compareRequestSchema = z.object({ first: usernameSchema, second: usernameSchema })
  .refine((v) => v.first.toLowerCase() !== v.second.toLowerCase(), { message: 'Choose two different usernames to compare.' });
const strs = z.array(z.string()).default([]);
export const aiInterpretationSchema = z.object({
  summary: z.string().min(1), developerLevel: z.string().default(''),
  archetype: z.object({ name: z.string().min(1), description: z.string().default(''), evidence: strs, blindSpot: z.string().default('') }),
  workingStyle: z.record(z.coerce.number().min(0).max(100)).default({}),
  recruiterView: z.object({ firstImpression: z.string().default(''), standsOut: strs, raisesQuestions: strs, improve: strs }).default({}),
  careerInsights: strs, interviewQuestions: strs, interviewTopics: strs,
  roadmap: z.array(z.object({ week: z.coerce.number().default(1), focus: z.string().default(''), tasks: strs })).default([]),
  projectIdeas: z.array(z.object({ title: z.string(), why: z.string().default(''), tech: strs, difficulty: z.string().default(''), portfolioValue: z.string().default(''), differentiator: z.string().default('') })).default([]),
});
