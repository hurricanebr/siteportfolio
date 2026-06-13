export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Suavização cúbica clássica (ease-in-out). */
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Normaliza p dentro de [a, b] com suavização. */
export const range = (p: number, a: number, b: number) =>
  smooth((p - a) / (b - a));

/**
 * Gerador pseudoaleatório determinístico (mulberry32).
 * Usado para que a geometria procedural seja estável entre renders.
 */
export function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Curva de presença de um estágio da cena:
 * sobe entre [in0, in1], permanece em 1 e desce entre [out0, out1].
 */
export function stageFade(
  p: number,
  in0: number,
  in1: number,
  out0: number,
  out1: number,
) {
  return range(p, in0, in1) * (1 - range(p, out0, out1));
}
