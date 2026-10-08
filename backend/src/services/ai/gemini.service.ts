import { env } from '../../config/env';
import { AppError } from '../../utils/response';
import { aiInterpretationSchema } from '../../schemas/analysis.schema';
import { roastAiSchema } from '../../schemas/roast.schema';
import { parseAiOutput } from './ai-parser';
import { buildProfilePrompt } from './prompts/profile-analysis.prompt';
import { buildRoastPrompt } from './prompts/roast.prompt';
import type { AiInterpretation, DeveloperFacts } from '../../../../shared/types/analysis';
async function generate(prompt: string): Promise<string> {
  if (!env.GEMINI_API_KEY || !env.GEMINI_MODEL) throw new AppError('AI_NOT_CONFIGURED', 'AI is not configured. Set GEMINI_API_KEY and GEMINI_MODEL on the backend.', 503);
  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`, {
      method: 'POST', signal: AbortSignal.timeout(45_000), headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.7, maxOutputTokens: 4096 } }),
    });
  } catch { throw new AppError('AI_UNAVAILABLE', 'Could not reach the Gemini API.', 502); }
  if (res.status === 404) throw new AppError('AI_NOT_CONFIGURED', `Model "${env.GEMINI_MODEL}" was not found. Check GEMINI_MODEL.`, 503);
  if (res.status === 400 || res.status === 403) throw new AppError('AI_NOT_CONFIGURED', 'Gemini rejected the request. Check GEMINI_API_KEY and GEMINI_MODEL.', 503);
  if (!res.ok) throw new AppError('AI_UNAVAILABLE', `Gemini returned status ${res.status}.`, 502);
  const j: any = await res.json();
  return j?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
}
/** Compact, structured view of the facts: the only data the model ever sees. */
const compact = (f: DeveloperFacts) => JSON.stringify({
  profile: { name: f.profile.name, username: f.profile.username, bio: f.profile.bio, company: f.profile.company, location: f.profile.location, hasWebsite: !!f.profile.website },
  stats: f.stats, scores: f.scores, languages: f.languages, maturityCounts: f.maturityCounts,
  repos: f.repos.slice(0, 15).map((r) => ({ name: r.name, description: r.description?.slice(0, 120), language: r.language, stars: r.stars, forks: r.forks, pushed: r.pushed, maturity: r.maturity, hasReadme: r.readme === null ? 'unknown' : r.readme > 0 })),
  hygiene: f.hygiene.map((h) => h.text),
});
export const interpretProfile = async (f: DeveloperFacts): Promise<AiInterpretation> => parseAiOutput(await generate(buildProfilePrompt(compact(f))), aiInterpretationSchema) as AiInterpretation;
export const generateRoast = async (f: DeveloperFacts, mode: string) => parseAiOutput(await generate(buildRoastPrompt(mode, compact(f))), roastAiSchema).roast;
