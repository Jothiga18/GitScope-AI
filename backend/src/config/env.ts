import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config({ path: '../.env' }); dotenv.config();
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  GITHUB_TOKEN: z.string().optional(), GEMINI_API_KEY: z.string().optional(), GEMINI_MODEL: z.string().optional(),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) { console.error('Invalid environment:', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')); process.exit(1); }
export const env = parsed.data;
