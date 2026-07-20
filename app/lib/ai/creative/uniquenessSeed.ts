/**
 * Uniqueness seed — mismo brief + entropy → webs distintas.
 */

export function hashString(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function makeUniquenessSeed(briefText: string, entropy?: string): string {
  const e = entropy ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return hashString(`${briefText.trim().toLowerCase()}::${e}`);
}

/** PRNG determinista a partir del seed (mulberry32). */
export function seededRandom(seedHex: string): () => number {
  let t = parseInt(seedHex.slice(0, 8), 16) || 1;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickSeeded<T>(rng: () => number, items: T[]): T {
  if (!items.length) throw new Error('pickSeeded: empty');
  return items[Math.floor(rng() * items.length) % items.length];
}
