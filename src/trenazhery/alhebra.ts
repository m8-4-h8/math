// Спільне для алгебраїчних генераторів 7 класу: многочлени від однієї змінної і їхній запис у формулі.
// Файл не є генератором: генератори лежать у `<N>-klas/`.
import { ch } from './dopomoha.ts';

/** Многочлен від однієї змінної: p[i] — коефіцієнт при x^i. [9, 6, 1] — це x² + 6x + 9. */
export type Mnohochlen = number[];

/** Число для формули: −5 → «-5». */
export const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
/** Від’ємне число в дужках для формули: «(-5)». */
export const vd = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);
/** Від’ємне число в дужках для тексту: «(−5)». */
export const tvd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);

const zminna = (x: string, st: number) => (st === 0 ? '' : st === 1 ? x : `${x}^{${st}}`);

/** Одночлен k·x^st для формули без знака попереду, якщо k > 0: 1·x² → «x^{2}», −3·x → «-3x». */
export function chlen(k: number, x: string, st: number) {
  if (st === 0) return tz(k);
  if (k === 1) return zminna(x, st);
  if (k === -1) return `-${zminna(x, st)}`;
  return `${tz(k)}${zminna(x, st)}`;
}

/** Многочлен для формули, від старшого степеня: [9, -6, 1] → «x^{2} - 6x + 9». Нульовий → «0». */
export function tex(p: Mnohochlen, x = 'x') {
  const chleny: string[] = [];
  for (let st = p.length - 1; st >= 0; st--) {
    const k = p[st];
    if (!k) continue;
    if (!chleny.length) chleny.push(chlen(k, x, st));
    else chleny.push(k < 0 ? `- ${chlen(-k, x, st)}` : `+ ${chlen(k, x, st)}`);
  }
  return chleny.length ? chleny.join(' ') : '0';
}

/** Те саме для звичайного тексту: «x² − 6x + 9». */
export function tekst(p: Mnohochlen, x = 'x') {
  const STEPENI = ['', '', '²', '³', '⁴', '⁵', '⁶'];
  return tex(p, x)
    .replace(/\^\{(\d)\}/g, (_, s) => STEPENI[Number(s)])
    .replace(/-/g, '−');
}

export function dobutok(p: Mnohochlen, q: Mnohochlen): Mnohochlen {
  const d = Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (d[i + j] += a * b)));
  return d;
}

export function suma(p: Mnohochlen, q: Mnohochlen, znak = 1): Mnohochlen {
  return Array.from({ length: Math.max(p.length, q.length) }, (_, i) => (p[i] || 0) + znak * (q[i] || 0));
}

export const znachennia = (p: Mnohochlen, x: number) => p.reduce((s, k, i) => s + k * x ** i, 0);
