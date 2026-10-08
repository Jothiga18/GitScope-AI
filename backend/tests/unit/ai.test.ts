import { describe, expect, it } from 'vitest';
import { parseAiOutput, safeParseJson } from '../../src/services/ai/ai-parser';
import { aiInterpretationSchema } from '../../src/schemas/analysis.schema';
const good = { summary: 's', archetype: { name: 'The Builder' }, workingStyle: { 'Solo Builder': '70' } };
describe('AI validation', () => {
  it('parses fenced JSON', () => expect(safeParseJson('```json\n{"a":1}\n```')).toEqual({ a: 1 }));
  it('extracts JSON from chatter', () => expect(safeParseJson('Here: {"a":2} done')).toEqual({ a: 2 }));
  it('throws on garbage', () => expect(() => safeParseJson('nope')).toThrow(/could not be read/));
  it('fills defaults and coerces', () => { const r = parseAiOutput(JSON.stringify(good), aiInterpretationSchema); expect(r.workingStyle['Solo Builder']).toBe(70); expect(r.roadmap).toEqual([]); });
  it('rejects missing required fields', () => expect(() => parseAiOutput('{"summary":"x"}', aiInterpretationSchema)).toThrow(/expected structure/));
});
