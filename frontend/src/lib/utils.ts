export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export const fmt = (n: number) => new Intl.NumberFormat('en').format(n);
