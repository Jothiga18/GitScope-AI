export const CAT: Record<string, string[]> = {
  'Web / Frontend': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Vue', 'Svelte'],
  Backend: ['Java', 'Go', 'PHP', 'Ruby', 'C#', 'Scala', 'Elixir'],
  'Data / AI': ['Python', 'Jupyter Notebook', 'R', 'Julia'],
  DevOps: ['Shell', 'Dockerfile', 'HCL', 'Makefile', 'PowerShell'],
  Mobile: ['Swift', 'Dart', 'Kotlin', 'Objective-C'],
  Systems: ['C', 'C++', 'Rust', 'Zig', 'Assembly'],
};
export function summarizeLanguages(own: any[]) {
  const n: Record<string, number> = {};
  own.forEach((r) => r.language && (n[r.language] = (n[r.language] || 0) + 1));
  return Object.entries(n).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}
export const buildDna = (languages: { name: string; count: number }[]) => Object.entries(CAT).map(([category, ls]) => {
  const hit = languages.filter((l) => ls.includes(l.name));
  return { category, repos: hit.reduce((t, l) => t + l.count, 0), languages: hit.map((l) => l.name) };
}).filter((d) => d.repos);
