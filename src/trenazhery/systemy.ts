// Спільне для генераторів про системи рівнянь (7 клас): запис ax + by = c і системи з цілим розв’язком.
// Файл не є генератором: генератори лежать у `<N>-klas/`.
import { ch, type Vypadok } from './dopomoha.ts';
import { chlen, tz } from './alhebra.ts';

/** ax + by для формули: (2, −1) → «2x - y», (0, 3) → «3y». */
export function forma(a: number, b: number, x = 'x', y = 'y') {
  if (!a) return chlen(b, y, 1);
  if (!b) return chlen(a, x, 1);
  return `${chlen(a, x, 1)} ${b < 0 ? '-' : '+'} ${chlen(Math.abs(b), y, 1)}`;
}

export interface Rivniannia {
  a: number;
  b: number;
  c: number;
}

export const rivniannia = (r: Rivniannia) => `${forma(r.a, r.b)} = ${tz(r.c)}`;
export const systema = (r1: Rivniannia, r2: Rivniannia) => `\\begin{cases} ${rivniannia(r1)} \\\\ ${rivniannia(r2)} \\end{cases}`;
export const para = (x: number, y: number) => `(${ch(x)}; ${ch(y)})`;

/** Рівняння ax + by = c, яке має розв’язок (x; y). */
export function cherez(r: Vypadok, x: number, y: number, maxA = 5, maxB = 5): Rivniannia {
  const a = r.krim(-maxA, maxA, [0]);
  const b = r.krim(-maxB, maxB, [0]);
  return { a, b, c: a * x + b * y };
}

/** Визначник ≠ 0 — рівно один розв’язок. */
export const odyn = (r1: Rivniannia, r2: Rivniannia) => r1.a * r2.b - r1.b * r2.a !== 0;
