// Малюнки задач на побудову циркулем і лінійкою (7 клас): серединний перпендикуляр і поділ відрізка навпіл,
// бісектриса кута, кут, рівний даному, перпендикуляр до прямої (через точку на прямій і з точки поза нею),
// трикутник за трьома сторонами, за двома сторонами і кутом між ними, за стороною і двома кутами.
// `krok` — скільки кроків побудови показати (1, 2 або 3): так тема показує побудову покроково.
// Дуги циркуля — помаранчеві, те, що побудували, — зелене. Повертає SVG-рядок для компонента Pobudova
// і для тренажерів (поле `malunok`). Підписи й aria-label не називають шуканого числа.
// Файл не є генератором: генератори лежать у `<N>-klas/`.
import { type P, duga, litera, napys, pidpysStorony, priamyi, rysky, svg, tochka, vidrizok } from './trykutnyky.ts';

export type VydPobudovy = 'serednia' | 'bisektrysa' | 'kut' | 'perpNa' | 'perpZ' | 'trykutnyk' | 'dviStoronyKut' | 'storonaDvaKuty';

export interface PobudovaOpts {
  vyd: VydPobudovy;
  /** Скільки кроків показати: 1, 2 або 3 (за замовчуванням — усі). */
  krok?: number;
  /** serednia: радіус дуг як частка відрізка AB (за замовчуванням 0,65; 0,5 і менше — дуги не перетинаються). */
  chastka?: number;
  /** Кут у градусах: bisektrysa, kut, dviStoronyKut — кут A; storonaDvaKuty — кут A. */
  alfa?: number;
  /** storonaDvaKuty — кут B. */
  beta?: number;
  /** trykutnyk: сторони [a, b, c] = [BC, AC, AB]; dviStoronyKut: [—, AC, AB]; storonaDvaKuty: [—, —, AB]. */
  storony?: [number, number, number];
  /** Підписи сторін [a, b, c] (BC, AC, AB) і кута ('' — без підпису). */
  pidpysy?: [string, string, string];
  pidpysKuta?: string;
  pidpysKuta2?: string;
  /** trykutnyk: повні кола замість дуг і обидві точки перетину (C і C₁). */
  povni?: boolean;
  /** serednia, bisektrysa: пунктиром відрізки до точок перетину дуг і рисочки — для доведення. */
  dovedennia?: boolean;
  /** В aria-label не називати, що саме побудовано (для завдання «Що побудовано?»). */
  bezVysnovku?: boolean;
  W?: number;
  H?: number;
}

const f = (v: number) => v.toFixed(1);
const rad = (g: number) => (g * Math.PI) / 180;
const dir = (g: number): P => [Math.cos(rad(g)), Math.sin(rad(g))];
const plus = (a: P, b: P, k = 1): P => [a[0] + b[0] * k, a[1] + b[1] * k];
const vidst = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1]);
/** Напрям від a до b у градусах (0 — праворуч, 90 — угору). */
const napriamok = (a: P, b: P) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

/** Точки перетину кіл (c1, r1) і (c2, r2): спершу та, що ліворуч від напрямку c1 → c2. */
export function peretynKil(c1: P, r1: number, c2: P, r2: number): P[] {
  const d = vidst(c1, c2);
  if (d === 0 || d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const u: P = [(c2[0] - c1[0]) / d, (c2[1] - c1[1]) / d];
  const m = plus(c1, u, a);
  return h < 1e-9 ? [m] : [plus(m, [-u[1], u[0]], h), plus(m, [u[1], -u[0]], h)];
}

interface Liniia {
  a: P;
  b: P;
  k?: number;
  shtrykh?: boolean;
  tovshch?: number;
}
interface Duga {
  c: P;
  r: number;
  vid: number;
  do: number;
  kolo?: boolean;
}

/** Креслення в математичних координатах (y — угору); наприкінці вміщаємо в рамку W × H. */
class Kreslennia {
  t: Record<string, P> = {};
  kutBukvy: Record<string, number> = {};
  linii: Liniia[] = [];
  dugy: Duga[] = [];
  kuty: { v: string; a: string; b: string; n?: number; k?: number; pidpys?: string; r?: number }[] = [];
  priami: [string, string, string][] = [];
  rysky: { a: string; b: string; n: number }[] = [];
  storony: { a: string; b: string; t: string; vid: string }[] = [];
  napysy: { p: P; t: string; k?: number }[] = [];
  opys: string[] = [];
  bezVysnovku = false;

  /** Останній крок в aria-label: повністю або без назви побудованого. */
  vysnovok(povnyi: string, neitralnyi: string) {
    this.opys.push(this.bezVysnovku ? neitralnyi : povnyi);
  }

  tochka(l: string, p: P, kutBukvy?: number) {
    this.t[l] = p;
    if (kutBukvy !== undefined) this.kutBukvy[l] = kutBukvy;
  }
  /** Дуга циркуля з центром c навколо напрямку g (± rozmakh градусів). */
  duga(c: P, r: number, g: number, rozmakh = 16) {
    this.dugy.push({ c, r, vid: g - rozmakh, do: g + rozmakh });
  }

  malunok(W: number, H: number) {
    const vsi: P[] = [...Object.values(this.t), ...this.linii.flatMap((l) => [l.a, l.b]), ...this.napysy.map((n) => n.p)];
    for (const d of this.dugy) {
      const [g1, g2] = d.kolo ? [0, 360] : [d.vid, d.do];
      for (let g = g1; g <= g2 + 1e-9; g += (g2 - g1) / 12) vsi.push(plus(d.c, dir(g), d.r));
    }
    const xs = vsi.map((p) => p[0]);
    const ys = vsi.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const pole = 24;
    const s = Math.min((W - 2 * pole) / (x1 - x0 || 1), (H - 2 * pole) / (y1 - y0 || 1));
    const ox = (W - (x1 - x0) * s) / 2 - x0 * s;
    const oy = (H - (y1 - y0) * s) / 2 + y1 * s;
    const m = ([x, y]: P): P => [ox + x * s, oy - y * s];
    const M: Record<string, P> = Object.fromEntries(Object.entries(this.t).map(([l, p]) => [l, m(p)]));
    const tsentr = m([(x0 + x1) / 2, (y0 + y1) / 2]);

    let tilo = '';
    for (const d of this.dugy) {
      const r = d.r * s;
      if (d.kolo) {
        const c = m(d.c);
        tilo += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="var(--ill-2)" stroke-width="1.8"/>`;
        continue;
      }
      const [p1, p2] = [m(plus(d.c, dir(d.vid), d.r)), m(plus(d.c, dir(d.do), d.r))];
      const velyka = d.do - d.vid > 180 ? 1 : 0;
      tilo += `<path d="M ${f(p1[0])} ${f(p1[1])} A ${f(r)} ${f(r)} 0 ${velyka} 0 ${f(p2[0])} ${f(p2[1])}" fill="none" stroke="var(--ill-2)" stroke-width="1.8" stroke-linecap="round"/>`;
    }
    for (const l of this.linii) tilo += vidrizok(m(l.a), m(l.b), { k: l.k, shtrykh: l.shtrykh, tovshch: l.tovshch });
    for (const r of this.rysky) tilo += rysky(M[r.a], M[r.b], r.n);
    for (const [v, a, b] of this.priami) tilo += priamyi(M[v], M[a], M[b], 3);
    for (const k of this.kuty) tilo += duga(M[k.v], M[k.a], M[k.b], { n: k.n ?? 1, k: k.k ?? 3, r: k.r ?? 24, pidpys: k.pidpys });
    for (const st of this.storony) tilo += pidpysStorony(M[st.a], M[st.b], st.t, M[st.vid]);
    for (const n of this.napysy) tilo += napys(m(n.p), n.t, { k: n.k ?? 0, rozmir: 14, kursyv: true });
    for (const [l, p] of Object.entries(M)) {
      if (l.startsWith('_')) continue;
      tilo += tochka(p);
      const g = this.kutBukvy[l];
      tilo += g === undefined ? litera(p, l, tsentr) : litera(p, l, [p[0] - Math.cos(rad(g)), p[1] + Math.sin(rad(g))]);
    }
    return svg(W, H, this.opys.join('; ') || 'Малюнок побудови', tilo);
  }
}

const R = 2.5; // товщина ліній даної фігури

function serednia(k: Kreslennia, krok: number, o: PobudovaOpts) {
  const [A, B]: P[] = [[0, 0], [4, 0]];
  const r = 4 * (o.chastka ?? 0.65);
  k.tochka('A', A, 200);
  k.tochka('B', B, 340);
  k.linii.push({ a: A, b: B, tovshch: R });
  k.opys.push('Відрізок AB');
  const [C, D] = peretynKil(A, r, B, r);
  const rozmakh = (C ? napriamok(A, C) : 20) + 16;
  if (krok >= 1) k.duga(A, r, 0, rozmakh);
  if (krok >= 2) {
    k.duga(B, r, 180, rozmakh);
    if (C && D) {
      k.tochka('C', C, 90);
      k.tochka('D', D, 270);
      k.opys.push('дуги однакового радіуса з центрами A і B перетинаються в точках C і D');
    } else k.opys.push(`дуги з центрами A і B ${C ? 'лише торкаються' : 'не перетинаються'}`);
  }
  if (krok >= 3 && C && D) {
    k.linii.push({ a: plus(C, [0, 0.3]), b: plus(D, [0, -0.3]), k: 3, tovshch: R });
    k.tochka('M', [2, 0], 315);
    k.priami.push(['M', 'B', 'C']);
    k.rysky.push({ a: 'A', b: 'M', n: 1 }, { a: 'M', b: 'B', n: 1 });
    k.vysnovok('пряма CD перетинає AB у точці M — середині відрізка, під прямим кутом', 'проведено пряму CD, вона перетинає AB у точці M');
  }
  if (o.dovedennia && C && D) {
    for (const [a, b] of [['A', 'C'], ['B', 'C'], ['A', 'D'], ['B', 'D']]) {
      k.linii.push({ a: k.t[a], b: k.t[b], shtrykh: true, tovshch: 1.6 });
      k.rysky.push({ a, b, n: 2 });
    }
    k.opys.push('пунктиром AC, BC, AD, BD — рівні радіуси');
  }
}

function bisektrysa(k: Kreslennia, krok: number, o: PobudovaOpts) {
  const al = o.alfa ?? 64;
  const O: P = [0, 0];
  k.tochka('O', O, 200);
  k.tochka('_1', dir(0).map((v) => v * 4.2) as P);
  k.tochka('_2', dir(al).map((v) => v * 4.2) as P);
  k.linii.push({ a: O, b: k.t._1, tovshch: R }, { a: O, b: k.t._2, tovshch: R });
  if (o.pidpysKuta) k.kuty.push({ v: 'O', a: '_1', b: '_2', k: 1, r: 36, pidpys: o.pidpysKuta, n: 0 });
  k.opys.push(`Кут з вершиною O${o.pidpysKuta ? `, ${o.pidpysKuta}` : ''}`);
  const r1 = 2.2;
  const A = plus(O, dir(0), r1);
  const B = plus(O, dir(al), r1);
  if (krok >= 1) {
    k.duga(O, r1, al / 2, al / 2 + 10);
    k.tochka('A', A, 270);
    k.tochka('B', B, al + 90);
    k.opys.push('дуга з центром O перетинає сторони кута в точках A і B');
  }
  const r2 = vidst(A, B) * 0.8;
  const C = peretynKil(A, r2, B, r2).sort((p, q) => vidst(O, q) - vidst(O, p))[0]; // та, що далі від O
  if (krok >= 2) {
    k.duga(A, r2, napriamok(A, C), 20);
    k.duga(B, r2, napriamok(B, C), 20);
    k.tochka('C', C, al / 2 - 75);
    k.opys.push('дуги однакового радіуса з центрами A і B перетинаються в точці C');
  }
  if (krok >= 3) {
    k.tochka('_3', plus(O, dir(al / 2), 4.4));
    k.linii.push({ a: O, b: k.t._3, k: 3, tovshch: R });
    k.kuty.push({ v: 'O', a: 'A', b: 'C', r: 30 }, { v: 'O', a: 'C', b: 'B', r: 30 });
    k.vysnovok('промінь OC ділить кут навпіл', 'проведено промінь OC');
  }
  if (o.dovedennia) {
    k.linii.push({ a: A, b: C, shtrykh: true, tovshch: 1.6 }, { a: B, b: C, shtrykh: true, tovshch: 1.6 });
    k.rysky.push({ a: 'O', b: 'A', n: 1 }, { a: 'O', b: 'B', n: 1 }, { a: 'A', b: 'C', n: 2 }, { a: 'B', b: 'C', n: 2 });
    k.opys.push('пунктиром AC і BC; OA = OB, AC = BC');
  }
}

function kut(k: Kreslennia, krok: number, o: PobudovaOpts) {
  const be = o.alfa ?? 50;
  const A: P = [0, 0];
  const O: P = [4.4, 0];
  const r = 1.7;
  k.tochka('A', A, 200);
  k.tochka('_1', [3.2, 0]);
  k.tochka('_2', plus(A, dir(be), 3.2));
  k.linii.push({ a: A, b: k.t._1, tovshch: R }, { a: A, b: k.t._2, tovshch: R });
  k.tochka('O', O, 230);
  k.tochka('_3', [7.6, 0]);
  k.linii.push({ a: O, b: k.t._3, tovshch: R });
  k.opys.push(`Даний кут з вершиною A${o.pidpysKuta ? `, ${o.pidpysKuta}` : ''} і промінь з початком O`);
  if (o.pidpysKuta) k.kuty.push({ v: 'A', a: '_1', b: '_2', k: 1, r: 52, n: 0, pidpys: o.pidpysKuta });
  const [B, C, D, E] = [plus(A, dir(0), r), plus(A, dir(be), r), plus(O, dir(0), r), plus(O, dir(be), r)];
  if (krok >= 1) {
    k.duga(A, r, be / 2, be / 2 + 12);
    k.duga(O, r, be / 2 + 8, be / 2 + 20);
    k.tochka('B', B, 290);
    k.tochka('C', C, be + 90);
    k.tochka('D', D, 290);
    k.opys.push('дуги однакового радіуса з центрами A і O: точки B, C і D');
  }
  if (krok >= 2) {
    k.linii.push({ a: B, b: C, shtrykh: true, tovshch: 1.6 });
    k.duga(D, vidst(B, C), napriamok(D, E), 22);
    k.tochka('E', E, be + 90);
    k.opys.push('дуга з центром D радіусом BC перетинає першу дугу в точці E');
  }
  if (krok >= 3) {
    k.tochka('_4', plus(O, dir(be), 3.2));
    k.linii.push({ a: O, b: k.t._4, k: 3, tovshch: R }, { a: D, b: E, shtrykh: true, tovshch: 1.6 });
    k.kuty.push({ v: 'A', a: 'B', b: 'C', r: 26 }, { v: 'O', a: 'D', b: 'E', r: 26 });
    k.vysnovok('промінь OE: кут DOE дорівнює даному куту BAC', 'проведено промінь OE');
  }
}

function perpNa(k: Kreslennia, krok: number) {
  const M: P = [0, 0];
  k.linii.push({ a: [-3.2, 0], b: [3.2, 0], tovshch: R });
  k.napysy.push({ p: [3.1, 0.35], t: 'a' });
  k.tochka('M', M, 315);
  k.opys.push('Пряма a і точка M на ній');
  const r1 = 1.6;
  const [A, B]: P[] = [[-r1, 0], [r1, 0]];
  if (krok >= 1) {
    k.duga(M, r1, 180, 18);
    k.duga(M, r1, 0, 18);
    k.tochka('A', A, 270);
    k.tochka('B', B, 270);
    k.opys.push('дуга з центром M перетинає пряму в точках A і B');
  }
  const C: P = [0, Math.sqrt(2.6 ** 2 - r1 ** 2)];
  if (krok >= 2) {
    k.duga(A, 2.6, napriamok(A, C), 18);
    k.duga(B, 2.6, napriamok(B, C), 18);
    k.tochka('C', C, 0);
    k.opys.push('дуги однакового більшого радіуса з центрами A і B перетинаються в точці C');
  }
  if (krok >= 3) {
    k.linii.push({ a: [0, -0.6], b: plus(C, [0, 0.45]), k: 3, tovshch: R });
    k.priami.push(['M', 'B', 'C']);
    k.vysnovok('пряма MC перпендикулярна до прямої a', 'проведено пряму MC');
  }
}

function perpZ(k: Kreslennia, krok: number) {
  const P0: P = [0, 2];
  k.linii.push({ a: [-3.2, 0], b: [3.2, 0], tovshch: R });
  k.napysy.push({ p: [3.1, 0.35], t: 'a' });
  k.tochka('P', P0, 90);
  k.opys.push('Пряма a і точка P поза нею');
  const r = 2.5;
  const [A, B]: P[] = [[-1.5, 0], [1.5, 0]];
  if (krok >= 1) {
    k.dugy.push({ c: P0, r, vid: napriamok(P0, A) - 12, do: napriamok(P0, B) + 12 });
    k.tochka('A', A, 120);
    k.tochka('B', B, 60);
    k.opys.push('дуга з центром P перетинає пряму в точках A і B');
  }
  const Q: P = [0, -2];
  if (krok >= 2) {
    k.duga(A, r, napriamok(A, Q), 18);
    k.duga(B, r, napriamok(B, Q), 18);
    k.tochka('Q', Q, 270);
    k.opys.push('дуги того самого радіуса з центрами A і B перетинаються в точці Q по інший бік прямої');
  }
  if (krok >= 3) {
    k.linii.push({ a: [0, 2.45], b: [0, -2.45], k: 3, tovshch: R });
    k.tochka('H', [0, 0], 135);
    k.priami.push(['H', 'B', 'P']);
    k.vysnovok('пряма PQ перпендикулярна до прямої a і перетинає її в точці H', 'проведено пряму PQ, вона перетинає пряму a в точці H');
  }
}

function trykutnyk(k: Kreslennia, krok: number, o: PobudovaOpts) {
  const [a, b, c] = o.storony ?? [5, 4, 6];
  const [pa, pb, pc] = o.pidpysy ?? ['a', 'b', 'c'];
  const [A, B]: P[] = [[0, 0], [c, 0]];
  k.tochka('A', A, 225);
  k.tochka('B', B, 315);
  k.linii.push({ a: A, b: B, tovshch: R });
  k.opys.push(`Відрізок AB${pc ? ` = ${pc}` : ''}`);
  if (pc) k.napysy.push({ p: [c / 2, -0.12 * c], t: pc });
  const [C, C1] = peretynKil(A, b, B, a);
  if (krok >= 2) {
    if (o.povni) {
      k.dugy.push({ c: A, r: b, vid: 0, do: 360, kolo: true }, { c: B, r: a, vid: 0, do: 360, kolo: true });
    } else if (C) {
      k.duga(A, b, napriamok(A, C), 14);
      k.duga(B, a, napriamok(B, C), 14);
    } else {
      k.dugy.push({ c: A, r: b, vid: -6, do: 80 }, { c: B, r: a, vid: 100, do: 186 });
    }
    k.opys.push(`${o.povni ? 'кола' : 'дуги'} з центром A радіусом ${pb || 'b'} і з центром B радіусом ${pa || 'a'}`);
    if (C) {
      k.tochka('C', C, 90);
      if (o.povni && C1) {
        k.tochka('C₁', C1, 270);
        k.opys.push('перетинаються в точках C і C₁');
      } else k.opys.push('перетинаються в точці C');
    } else k.opys.push('не перетинаються');
  }
  if (krok >= 3 && C) {
    k.linii.push({ a: A, b: C, k: 3, tovshch: R }, { a: B, b: C, k: 3, tovshch: R });
    if (pb) k.storony.push({ a: 'A', b: 'C', t: pb, vid: 'B' });
    if (pa) k.storony.push({ a: 'B', b: 'C', t: pa, vid: 'A' });
    k.opys.push('трикутник ABC');
  }
}

function dviStoronyKut(k: Kreslennia, krok: number, o: PobudovaOpts) {
  const al = o.alfa ?? 60;
  const [, b, c] = o.storony ?? [0, 4, 5];
  const [, pb, pc] = o.pidpysy ?? ['', 'b', 'c'];
  const A: P = [0, 0];
  const L = Math.max(b, c) + 1;
  k.tochka('A', A, 225);
  k.tochka('_1', [L, 0]);
  k.tochka('_2', plus(A, dir(al), L));
  k.linii.push({ a: A, b: k.t._1, tovshch: R }, { a: A, b: k.t._2, tovshch: R });
  k.kuty.push({ v: 'A', a: '_1', b: '_2', k: 1, r: 26, pidpys: o.pidpysKuta ?? `${al}°` });
  k.opys.push(`Побудовано кут A, що дорівнює ${o.pidpysKuta ?? `${al}°`}`);
  const [B, C] = [plus(A, dir(0), c), plus(A, dir(al), b)];
  if (krok >= 2) {
    k.duga(A, c, 0, 8);
    k.duga(A, b, al, 8);
    k.tochka('B', B, 315);
    k.tochka('C', C, al + 90);
    k.opys.push(`на сторонах циркулем відкладено AB${pc ? ` = ${pc}` : ''} і AC${pb ? ` = ${pb}` : ''}`);
    if (pc) k.napysy.push({ p: [c / 2, -0.45], t: pc });
    if (pb) k.storony.push({ a: 'A', b: 'C', t: pb, vid: 'B' });
  }
  if (krok >= 3) {
    k.linii.push({ a: B, b: C, k: 3, tovshch: R });
    k.opys.push('відрізок BC завершує трикутник ABC');
  }
}

function storonaDvaKuty(k: Kreslennia, krok: number, o: PobudovaOpts) {
  const [al, be] = [o.alfa ?? 50, o.beta ?? 60];
  const [, , c] = o.storony ?? [0, 0, 5];
  const [, , pc] = o.pidpysy ?? ['', '', 'c'];
  const [A, B]: P[] = [[0, 0], [c, 0]];
  k.tochka('A', A, 225);
  k.tochka('B', B, 315);
  k.linii.push({ a: A, b: B, tovshch: R });
  if (pc) k.napysy.push({ p: [c / 2, -0.12 * c], t: pc });
  k.opys.push(`Відрізок AB${pc ? ` = ${pc}` : ''}`);
  const peretyn = al + be < 180;
  const AC = peretyn ? (c * Math.sin(rad(be))) / Math.sin(rad(al + be)) : 0;
  const C = plus(A, dir(al), AC);
  if (krok >= 2) {
    const [LA, LB] = peretyn ? [AC + 0.25 * c, vidst(B, C) + 0.25 * c] : [0.9 * c, 0.9 * c];
    k.tochka('_1', plus(A, dir(al), LA));
    k.tochka('_2', plus(B, dir(180 - be), LB));
    k.linii.push({ a: A, b: k.t._1, tovshch: 2 }, { a: B, b: k.t._2, tovshch: 2 });
    k.kuty.push({ v: 'A', a: 'B', b: '_1', k: 1, r: 26, pidpys: o.pidpysKuta ?? `${al}°` }, { v: 'B', a: '_2', b: 'A', k: 4, r: 26, pidpys: o.pidpysKuta2 ?? `${be}°` });
    k.opys.push(`при кінцях відрізка побудовано кути ${o.pidpysKuta ?? `${al}°`} і ${o.pidpysKuta2 ?? `${be}°`}; промені ${peretyn ? 'перетинаються' : 'не перетинаються'}`);
  }
  if (krok >= 3 && peretyn) {
    k.tochka('C', C, 90);
    k.linii.push({ a: A, b: C, k: 3, tovshch: R }, { a: B, b: C, k: 3, tovshch: R });
    k.opys.push('трикутник ABC');
  }
}

export function pobudova(o: PobudovaOpts) {
  const krok = o.krok ?? 3;
  const k = new Kreslennia();
  k.bezVysnovku = !!o.bezVysnovku;
  const rozmir: Record<VydPobudovy, [number, number]> = {
    serednia: [220, 230],
    bisektrysa: [250, 210],
    kut: [320, 160],
    perpNa: [260, 200],
    perpZ: [240, 240],
    trykutnyk: [260, 200],
    dviStoronyKut: [260, 200],
    storonaDvaKuty: [260, 210],
  };
  if (o.vyd === 'serednia') serednia(k, krok, o);
  else if (o.vyd === 'bisektrysa') bisektrysa(k, krok, o);
  else if (o.vyd === 'kut') kut(k, krok, o);
  else if (o.vyd === 'perpNa') perpNa(k, krok);
  else if (o.vyd === 'perpZ') perpZ(k, krok);
  else if (o.vyd === 'trykutnyk') trykutnyk(k, krok, o);
  else if (o.vyd === 'dviStoronyKut') dviStoronyKut(k, krok, o);
  else storonaDvaKuty(k, krok, o);
  const [W, H] = rozmir[o.vyd];
  return k.malunok(o.W ?? W, o.H ?? (o.povni ? 240 : H));
}
