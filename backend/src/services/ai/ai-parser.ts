import { ZodTypeAny, z } from 'zod';
import { AppError } from '../../utils/response';
export function safeParseJson(text: string): unknown {
  const clean = text.replace(/^```(?:json)?|```$/gm, '').trim();
  try { return JSON.parse(clean); } catch {
    const m = clean.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch { /* fall through */ } }
    throw new AppError('AI_INVALID_RESPONSE', 'The AI returned a response that could not be read.', 502);
  }
}
export function parseAiOutput<S extends ZodTypeAny>(text: string, schema: S): z.infer<S> {
  const r = schema.safeParse(safeParseJson(text));
  if (!r.success) throw new AppError('AI_INVALID_RESPONSE', 'The AI response did not match the expected structure.', 502);
  return r.data;
}
