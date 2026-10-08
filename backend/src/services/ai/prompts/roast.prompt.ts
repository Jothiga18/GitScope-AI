import { RULES } from './profile-analysis.prompt';
const TONE: Record<string, string> = { dry: 'deadpan and understated', witty: 'clever wordplay', savage: 'sharp and merciless about the code and habits', brutal: 'relentless, but only about GitHub habits' };
export const buildRoastPrompt = (mode: string, data: string) => `Write a ${TONE[mode] || TONE.witty} developer roast, 90-140 words, in plain prose. ${RULES} Only mock observable GitHub habits (unfinished repos, naming, docs, tech hopping, forks). No insults about identity, appearance, or the person's worth. Cite real repo names or numbers from the data.
Data: ${data}
Return JSON: {"roast":string}`;
