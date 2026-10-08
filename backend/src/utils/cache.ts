export class TtlCache<T> {
  private m = new Map<string, { t: number; v: T }>();
  constructor(private ttl: number, private max = 200) {}
  get(k: string): T | undefined {
    const h = this.m.get(k);
    if (!h) return undefined;
    if (Date.now() - h.t > this.ttl) { this.m.delete(k); return undefined; }
    return h.v;
  }
  set(k: string, v: T) {
    if (this.m.size >= this.max) this.m.delete(this.m.keys().next().value as string);
    this.m.set(k, { t: Date.now(), v });
  }
}
