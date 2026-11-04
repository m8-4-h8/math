// Малюнки трикутників для тем і тренажерів 7 класу: рисочки на рівних сторонах, дуги в рівних кутах,
// прямий кут, медіана / бісектриса / висота, два рівні трикутники, сума кутів і зовнішній кут.
// Повертає SVG-рядок: його вставляють і компоненти (DvaTrykutnyky, VidrizokTrykutnyka, KutyTrykutnyka),
// і тренажери (поле `malunok`). Невідоме підписуємо «?», тож малюнок не видає відповідь.
// Файл не є генератором: генератори лежать у `<N>-klas/`.

export type P = [number, number];

const f = (v: number) => v.toFixed(1);
const kolir = (k = 0) => (k ? `var(--ill-${k})` : 'var(--ill-ink)');
const riz = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const dovzh = (a: P) => Math.hypot(a[0], a[1]);
const odyn = (a: P): P => {
  const l = dovzh(a) || 1;
  return [a[0] / l, a[1] / l];
};

export const seredyna = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
export const tsentr = (t: P[]): P => [t.reduce((s, p) => s + p[0], 0) / t.length, t.reduce((s, p) => s + p[1], 0) / t.length];

/** Основа перпендикуляра з точки p на пряму ab (може лежати поза відрізком ab). */
export function proektsiia(p: P, a: P, b: P): P {
  const ab = riz(b, a);
  const t = ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2);
  return [a[0] + t * ab[0], a[1] + t * ab[1]];
}
/** Де бісектриса кута v перетинає сторону ab: ділить її у відношенні прилеглих сторін. */
export function osnovaBisektrysy(v: P, a: P, b: P): P {
  const [la, lb] = [dovzh(riz(a, v)), dovzh(riz(b, v))];
  const k = la / (la + lb);
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}
/** Величина кута при вершині v (між променями va і vb), у градусах. */
export function kut(v: P, a: P, b: P) {
  const [u, w] = [odyn(riz(a, v)), odyn(riz(b, v))];
  return (Math.acos(Math.max(-1, Math.min(1, u[0] * w[0] + u[1] * w[1]))) * 180) / Math.PI;
}

// ——— Примітиви ———

export function kontur(t: P[], k = 0, zalyvka = true) {
  const d = t.map(([x, y], i) => `${i ? 'L' : 'M'} ${f(x)} ${f(y)}`).join(' ') + ' Z';
  return `<path d="${d}" fill="${zalyvka ? kolir(k) : 'none'}" fill-opacity="${zalyvka ? 0.1 : 0}" stroke="${kolir(k)}" stroke-width="2.5" stroke-linejoin="round"/>`;
}

export function vidrizok(a: P, b: P, o: { k?: number; shtrykh?: boolean; tovshch?: number } = {}) {
  return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${kolir(o.k)}" stroke-width="${o.tovshch ?? 2.5}" stroke-linecap="round"${o.shtrykh ? ' stroke-dasharray="6 5"' : ''}/>`;
}

/** n рисочок посередині відрізка ab — позначка рівних відрізків. */
export function rysky(a: P, b: P, n: number, k = 0) {
  if (!n) return '';
  const [ux, uy] = odyn(riz(b, a));
  const [mx, my] = seredyna(a, b);
  const d = Array.from({ length: n }, (_, i) => {
    const s = (i - (n - 1) / 2) * 4.5;
    const [px, py] = [mx + ux * s, my + uy * s];
    return `M ${f(px - uy * 6)} ${f(py + ux * 6)} L ${f(px + uy * 6)} ${f(py - ux * 6)}`;
  }).join(' ');
  return `<path d="${d}" stroke="${kolir(k)}" stroke-width="2" stroke-linecap="round"/>`;
}

/** Дуга кута при вершині v між променями va і vb: n дуг (рівні кути — однакова кількість), зафарбування, підпис. */
export function duga(v: P, a: P, b: P, o: { n?: number; k?: number; r?: number; pidpys?: string; zalyvka?: boolean } = {}) {
  const { n = 1, k = 2, r = 20, zalyvka = true } = o;
  const d1 = Math.atan2(a[1] - v[1], a[0] - v[0]);
  let rizn = Math.atan2(b[1] - v[1], b[0] - v[0]) - d1;
  while (rizn <= -Math.PI) rizn += 2 * Math.PI;
  while (rizn > Math.PI) rizn -= 2 * Math.PI;
  const d2 = d1 + rizn;
  const sweep = rizn > 0 ? 1 : 0;
  const tochka = (rr: number, d: number): P => [v[0] + rr * Math.cos(d), v[1] + rr * Math.sin(d)];
  let s = '';
  if (zalyvka) {
    const [p1, p2] = [tochka(r, d1), tochka(r, d2)];
    s += `<path d="M ${f(v[0])} ${f(v[1])} L ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 0 ${sweep} ${f(p2[0])} ${f(p2[1])} Z" fill="${kolir(k)}" fill-opacity="0.22" stroke="none"/>`;
  }
  for (let i = 0; i < n; i++) {
    const rr = r - i * 4.5;
    const [p1, p2] = [tochka(rr, d1), tochka(rr, d2)];
    s += `<path d="M ${f(p1[0])} ${f(p1[1])} A ${rr} ${rr} 0 0 ${sweep} ${f(p2[0])} ${f(p2[1])}" fill="none" stroke="${kolir(k)}" stroke-width="2"/>`;
  }
  if (o.pidpys) {
    const vuzkyi = Math.abs(rizn) < (45 * Math.PI) / 180;
    const p = tochka(r + (vuzkyi ? 24 : 15), d1 + rizn / 2);
    s += napys(p, o.pidpys, { k });
  }
  return s;
}

/** Квадратик прямого кута при вершині v між променями va і vb. */
export function priamyi(v: P, a: P, b: P, k = 0) {
  const [u, w] = [odyn(riz(a, v)), odyn(riz(b, v))];
  const s = 11;
  const p1: P = [v[0] + u[0] * s, v[1] + u[1] * s];
  const p2: P = [p1[0] + w[0] * s, p1[1] + w[1] * s];
  const p3: P = [v[0] + w[0] * s, v[1] + w[1] * s];
  return `<path d="M ${f(p1[0])} ${f(p1[1])} L ${f(p2[0])} ${f(p2[1])} L ${f(p3[0])} ${f(p3[1])}" fill="none" stroke="${kolir(k)}" stroke-width="2"/>`;
}

export function tochka(p: P) {
  return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3" fill="var(--ill-ink)"/>`;
}

export function napys(p: P, t: string, o: { k?: number; rozmir?: number; kursyv?: boolean } = {}) {
  return `<text x="${f(p[0])}" y="${f(p[1])}" font-size="${o.rozmir ?? 14}" font-weight="700"${o.kursyv ? ' font-style="italic"' : ''} fill="${o.k === undefined ? 'var(--ill-accent)' : kolir(o.k)}" text-anchor="middle" dominant-baseline="central">${t}</text>`;
}

/** Буква біля точки p — назовні від точки `vid` (зазвичай центру трикутника). */
export function litera(p: P, t: string, vid: P, k = 0) {
  const u = odyn(riz(p, vid));
  return napys([p[0] + u[0] * 14, p[1] + u[1] * 14], t, { k, rozmir: 15, kursyv: true });
}

/** Підпис посередині сторони ab — назовні від точки `vid`. */
export function pidpysStorony(a: P, b: P, t: string, vid: P, k?: number) {
  const m = seredyna(a, b);
  const [ux, uy] = odyn(riz(b, a));
  let n: P = [-uy, ux];
  if ((m[0] - vid[0]) * n[0] + (m[1] - vid[1]) * n[1] < 0) n = [uy, -ux];
  const vidstup = 13 + Math.abs(n[0]) * t.length * 3;
  return napys([m[0] + n[0] * vidstup, m[1] + n[1] * vidstup], t, { k });
}

export function svg(W: number, H: number, opys: string, tilo: string) {
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys}">${tilo}</svg>`;
}

// ——— Форми трикутників ———
// Одиничні координати (y — донизу). Вершина 0 — угорі, 1 — внизу ліворуч, 2 — внизу праворуч.

export type Forma = 'hostrokutnyi' | 'hostrokutnyi2' | 'tupokutnyi' | 'priamokutnyi';
export const FORMY: Record<Forma, P[]> = {
  hostrokutnyi: [[0.36, 0], [0, 1], [1, 1]],
  hostrokutnyi2: [[0.68, 0], [0, 1], [1, 0.9]],
  tupokutnyi: [[0.12, 0], [0.38, 1], [1, 1]], // тупий кут при вершині 1
  priamokutnyi: [[0, 0], [0, 1], [1, 1]], // прямий кут при вершині 1
};

/** Повернути (на `povorot` градусів) і віддзеркалити форму навколо центру. */
export function pereminyty(t: P[], povorot = 0, dzerkalo = false): P[] {
  const [cx, cy] = tsentr(t);
  const a = (povorot * Math.PI) / 180;
  return t.map(([x, y]) => {
    const dx = (dzerkalo ? -1 : 1) * (x - cx);
    const dy = y - cy;
    return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
  });
}

const ramka = (t: P[]) => {
  const xs = t.map((p) => p[0]);
  const ys = t.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
};
/** Масштаб, з яким усі форми вміщаються в прямокутник w×h. */
export const masshtab = (formy: P[][], w: number, h: number) => Math.min(...formy.map((t) => Math.min(w / ramka(t).w, h / ramka(t).h)));
/** Поставити форму з масштабом s по центру прямокутника (x, y, w, h). */
export function postavyty(t: P[], s: number, x: number, y: number, w: number, h: number): P[] {
  const r = ramka(t);
  const [dx, dy] = [x + (w - r.w * s) / 2 - r.x0 * s, y + (h - r.h * s) / 2 - r.y0 * s];
  return t.map(([px, py]) => [px * s + dx, py * s + dy]);
}

// ——— Два рівні трикутники ———

export interface DvaOpts {
  forma?: Forma;
  /** Як повернута й чи віддзеркалена друга копія. */
  povorot?: number;
  dzerkalo?: boolean;
  litery1?: string[];
  /** Букви другого трикутника в порядку відповідних вершин: вершина i другого відповідає вершині i першого. */
  litery2?: string[];
  /** Рисочки на стороні i (від вершини i до i+1), однакові в обох трикутниках. */
  rysky?: number[];
  /** Дуги в куті при вершині i, однакові в обох трикутниках. */
  dugy?: number[];
  pidpysySt1?: (string | undefined)[];
  pidpysySt2?: (string | undefined)[];
  pidpysyKut1?: (string | undefined)[];
  pidpysyKut2?: (string | undefined)[];
}

export function dvaTrykutnyky(o: DvaOpts = {}) {
  const { forma = 'hostrokutnyi', povorot = 0, dzerkalo = false, litery1 = ['A', 'B', 'C'], litery2 = ['K', 'M', 'N'] } = o;
  const { rysky: rs = [0, 0, 0], dugy: ds = [0, 0, 0] } = o;
  const W = 360;
  const H = 200;
  const f1 = FORMY[forma];
  const f2 = pereminyty(f1, povorot, dzerkalo);
  const s = masshtab([f1, f2], 135, 135);
  const t1 = postavyty(f1, s, 20, 32, 135, 135);
  const t2 = postavyty(f2, s, 205, 32, 135, 135);
  let tilo = kontur(t1, 1) + kontur(t2, 3);
  const opysy: string[] = [];
  for (const [t, lit, pSt, pKut] of [
    [t1, litery1, o.pidpysySt1, o.pidpysyKut1],
    [t2, litery2, o.pidpysySt2, o.pidpysyKut2],
  ] as const) {
    const c = tsentr(t);
    for (let i = 0; i < 3; i++) {
      const [a, b, z] = [t[i], t[(i + 1) % 3], t[(i + 2) % 3]];
      tilo += rysky(a, b, rs[i]);
      if (ds[i]) tilo += duga(a, b, z, { n: ds[i], pidpys: pKut?.[i] });
      else if (pKut?.[i]) tilo += duga(a, b, z, { n: 1, k: 4, zalyvka: false, pidpys: pKut[i] });
      if (pSt?.[i]) tilo += pidpysStorony(a, b, pSt[i]!, c);
      tilo += litera(a, lit[i], c);
    }
  }
  const nazva = (lit: readonly string[], i: number) => `${lit[i]}${lit[(i + 1) % 3]}`;
  for (let i = 0; i < 3; i++) if (rs[i]) opysy.push(`${nazva(litery1, i)} = ${nazva(litery2, i)}`);
  for (let i = 0; i < 3; i++) if (ds[i]) opysy.push(`кут ${litery1[i]} = кут ${litery2[i]}`);
  const vidomi = [
    ...[0, 1, 2].filter((i) => o.pidpysySt1?.[i] && o.pidpysySt1[i] !== '?').map((i) => `${nazva(litery1, i)} = ${o.pidpysySt1![i]}`),
    ...[0, 1, 2].filter((i) => o.pidpysySt2?.[i] && o.pidpysySt2[i] !== '?').map((i) => `${nazva(litery2, i)} = ${o.pidpysySt2![i]}`),
    ...[0, 1, 2].filter((i) => o.pidpysyKut1?.[i] && o.pidpysyKut1[i] !== '?').map((i) => `кут ${litery1[i]} = ${o.pidpysyKut1![i]}`),
    ...[0, 1, 2].filter((i) => o.pidpysyKut2?.[i] && o.pidpysyKut2[i] !== '?').map((i) => `кут ${litery2[i]} = ${o.pidpysyKut2![i]}`),
  ];
  const opys =
    `Трикутники ${litery1.join('')} і ${litery2.join('')}` +
    (opysy.length ? `. Позначено рівні: ${opysy.join(', ')}` : '') +
    (vidomi.length ? `. Відомо: ${vidomi.join(', ')}` : '');
  return svg(W, H, opys, tilo);
}

// ——— Медіана, бісектриса, висота ———

export type VydVidrizka = 'медіана' | 'бісектриса' | 'висота';

export interface VidrizokOpts {
  forma?: Forma;
  /** Що провести; null — лише трикутник. */
  vyd?: VydVidrizka | null;
  /** З якої вершини (0, 1, 2). */
  z?: number;
  litery?: string[];
  /** Буква основи відрізка на протилежній стороні. */
  osnova?: string;
  /** Показати позначки (рисочки, дуги, прямий кут), що «видають» вид відрізка. */
  poznachky?: boolean;
  /** Підписи: частини сторони біля основи [ближче до вершини z+1, ближче до z+2], половинки кута, сторони. */
  pidpysyChastyn?: (string | undefined)[];
  pidpysyPolovyn?: (string | undefined)[];
  pidpysyKutiv?: (string | undefined)[];
  /** Підпис кута між відрізком і стороною біля основи (з боку вершини z+1). */
  pidpysKutaOsnovy?: string;
}

export function vidrizokTrykutnyka(o: VidrizokOpts = {}) {
  const { forma = 'hostrokutnyi', vyd = null, z = 0, litery = ['A', 'B', 'C'], osnova = 'D', poznachky = true } = o;
  const W = 300;
  const H = 210;
  const f1 = FORMY[forma];
  const s = masshtab([f1], 230, 150);
  // Для тупокутного залишаємо місце для висоти поза трикутником.
  const t = postavyty(f1, s, 35, 28, 230, 150);
  const c = tsentr(t);
  const [v, a, b] = [t[z], t[(z + 1) % 3], t[(z + 2) % 3]];
  let tilo = kontur(t, 1);
  let D: P | null = null;
  if (vyd === 'медіана') D = seredyna(a, b);
  if (vyd === 'бісектриса') D = osnovaBisektrysy(v, a, b);
  if (vyd === 'висота') D = proektsiia(v, a, b);
  const opys: string[] = [`Трикутник ${litery.join('')}`];
  if (D) {
    // Висота поза трикутником: продовжуємо сторону штрихом до основи.
    const zovni = vyd === 'висота' && (D[0] - a[0]) * (D[0] - b[0]) + (D[1] - a[1]) * (D[1] - b[1]) > 0.5;
    if (zovni) {
      const blyzhcha = dovzh(riz(D, a)) < dovzh(riz(D, b)) ? a : b;
      tilo += vidrizok(blyzhcha, D, { shtrykh: true, tovshch: 2 });
    }
    const zbig = dovzh(riz(D, a)) < 1 || dovzh(riz(D, b)) < 1; // висота збігається зі стороною
    tilo += vidrizok(v, D, { k: 2 }); // якщо висота збігається зі стороною — виділяємо цю сторону
    if (poznachky) {
      if (vyd === 'медіана') tilo += rysky(a, D, 1) + rysky(D, b, 1);
      if (vyd === 'бісектриса')
        tilo += duga(v, a, D, { n: 1, r: 26, pidpys: o.pidpysyPolovyn?.[0] }) + duga(v, D, b, { n: 1, r: 26, pidpys: o.pidpysyPolovyn?.[1] });
      if (vyd === 'висота') tilo += priamyi(D, v, zovni || zbig ? (dovzh(riz(D, a)) > dovzh(riz(D, b)) ? a : b) : a);
    }
    if (o.pidpysyChastyn?.[0]) tilo += pidpysStorony(a, D, o.pidpysyChastyn[0], c);
    if (o.pidpysyChastyn?.[1]) tilo += pidpysStorony(D, b, o.pidpysyChastyn[1], c);
    if (!(poznachky && vyd === 'бісектриса')) {
      if (o.pidpysyPolovyn?.[0]) tilo += duga(v, a, D, { n: 1, r: 26, k: 4, zalyvka: false, pidpys: o.pidpysyPolovyn[0] });
      if (o.pidpysyPolovyn?.[1]) tilo += duga(v, D, b, { n: 1, r: 32, k: 4, zalyvka: false, pidpys: o.pidpysyPolovyn[1] });
    }
    if (o.pidpysKutaOsnovy) tilo += duga(D, v, a, { n: 1, r: 18, k: 4, zalyvka: false, pidpys: o.pidpysKutaOsnovy });
    if (!zbig) {
      tilo += tochka(D) + litera(D, osnova, v); // буква основи — з протилежного від вершини боку
    }
    opys.push(`з вершини ${litery[z]} проведено відрізок ${litery[z]}${zbig ? (dovzh(riz(D, a)) < 1 ? litery[(z + 1) % 3] : litery[(z + 2) % 3]) : osnova}`);
    if (poznachky && vyd === 'медіана') opys.push(`${litery[(z + 1) % 3]}${osnova} = ${osnova}${litery[(z + 2) % 3]}`);
    if (poznachky && vyd === 'бісектриса') opys.push(`кути ${litery[(z + 1) % 3]}${litery[z]}${osnova} і ${osnova}${litery[z]}${litery[(z + 2) % 3]} рівні`);
    if (poznachky && vyd === 'висота') opys.push(`відрізок перпендикулярний до прямої ${litery[(z + 1) % 3]}${litery[(z + 2) % 3]}`);
  }
  for (let i = 0; i < 3; i++) {
    tilo += litera(t[i], litery[i], c);
    if (o.pidpysyKutiv?.[i]) tilo += duga(t[i], t[(i + 1) % 3], t[(i + 2) % 3], { n: 1, k: 4, zalyvka: false, pidpys: o.pidpysyKutiv[i] });
  }
  return svg(W, H, opys.join('; '), tilo);
}

// ——— Кути трикутника: сума і зовнішній кут ———

export interface KutyOpts {
  forma?: Forma;
  litery?: string[];
  /** Підписи кутів при вершинах 0, 1, 2. */
  pidpysy?: (string | undefined)[];
  /** Зовнішній кут: при якій вершині і з підписом. Сторону (вершина − наступна) продовжуємо за вершину. */
  zovnishnii?: { v: number; pidpys?: string; litera?: string };
  /** Пряма через вершину 0, паралельна протилежній стороні (для доведення суми кутів). */
  paralelna?: boolean;
  /** Розфарбувати кути: однаковий колір — рівні кути на доведенні. */
  kolory?: boolean;
}

export function kutyTrykutnyka(o: KutyOpts = {}) {
  const { forma = 'hostrokutnyi', litery = ['A', 'B', 'C'], pidpysy = [], kolory = false } = o;
  const W = 300;
  const H = 210;
  const f1 = FORMY[forma];
  const zov = o.zovnishnii;
  const s = masshtab([f1], zov || o.paralelna ? 180 : 220, 140);
  const x0 = !zov ? 40 : zov.v === 1 ? 85 : zov.v === 2 ? 35 : 60;
  const t = postavyty(f1, s, x0, o.paralelna || zov?.v === 0 ? 55 : 40, zov ? 180 : 220, 140);
  const c = tsentr(t);
  let tilo = kontur(t, 1);
  const KOL = [2, 3, 4];
  const opys: string[] = [`Трикутник ${litery.join('')}`];
  if (o.paralelna) {
    const [v, a, b] = t;
    const u = odyn(riz(b, a));
    const p1: P = [v[0] - u[0] * 95, v[1] - u[1] * 95];
    const p2: P = [v[0] + u[0] * 95, v[1] + u[1] * 95];
    tilo += vidrizok(p1, p2, { tovshch: 2 });
    // Кути при вершині 0 між паралельною і сторонами — рівні кутам 1 і 2 (різносторонні).
    tilo += duga(v, p1, a, { k: KOL[1], r: 22, pidpys: kolory ? '1' : undefined });
    tilo += duga(v, b, p2, { k: KOL[2], r: 22, pidpys: kolory ? '2' : undefined });
    opys.push(`через вершину ${litery[0]} проведено пряму, паралельну ${litery[1]}${litery[2]}`);
  }
  if (zov) {
    // Продовжуємо основу (для вершин 1 і 2) або сторону BA (для вершини 0) за вершину.
    const v = t[zov.v];
    const [iVid, iInsha] = zov.v === 0 ? [1, 2] : zov.v === 1 ? [2, 0] : [1, 0];
    const u = odyn(riz(v, t[iVid]));
    const kin: P = [v[0] + u[0] * 58, v[1] + u[1] * 58];
    tilo += vidrizok(v, kin, { tovshch: 2.5 });
    tilo += duga(v, t[iInsha], kin, { k: 4, r: 24, pidpys: zov.pidpys });
    if (zov.litera) tilo += napys([kin[0] + u[0] * 12, kin[1] + u[1] * 12], zov.litera, { k: 0, rozmir: 15, kursyv: true });
    opys.push(`сторону ${litery[iVid]}${litery[zov.v]} продовжено за вершину ${litery[zov.v]}, позначено зовнішній кут`);
  }
  for (let i = 0; i < 3; i++) {
    const p = pidpysy[i];
    if (p || kolory) tilo += duga(t[i], t[(i + 1) % 3], t[(i + 2) % 3], { k: kolory ? KOL[i] : 2, r: 20, zalyvka: kolory || !!p, pidpys: p });
    tilo += litera(t[i], litery[i], c);
  }
  const vidomi = [0, 1, 2].filter((i) => pidpysy[i] && pidpysy[i] !== '?').map((i) => `кут ${litery[i]} = ${pidpysy[i]}`);
  if (zov?.pidpys && zov.pidpys !== '?') vidomi.push(`зовнішній кут = ${zov.pidpys}`);
  if (vidomi.length) opys.push(vidomi.join(', '));
  return svg(W, H, opys.join('; '), tilo);
}

// ——— Типові конфігурації для ознак рівності ———
// «khrest»: відрізки AB і CD перетинаються в точці O; трикутники AOC і BOD.
//   oznaka 1: O — середина AB і CD (AO = OB, CO = OD) + вертикальні кути;
//   oznaka 2: AO = OB і ∠OAC = ∠OBD + вертикальні кути.
// «spilna»: трикутники ABD і CBD зі спільною стороною BD.
//   oznaka 1: AB = CB, ∠ABD = ∠CBD;  oznaka 2: ∠ABD = ∠CBD, ∠ADB = ∠CDB;  oznaka 3: AB = CB, AD = CD.
// pidpysy: ключ — відрізок ('AC', 'BD', 'AD', 'CD', 'AO'…) або кут ('A', 'C', 'B', 'D' — кут трикутника при цій
// вершині; для «spilna»: 'A' = ∠BAD, 'C' = ∠BCD, 'ABD', 'CBD', 'ADB', 'CDB'), значення — «7 см», «40°» або «?».

export type Konfihuratsiia = 'khrest' | 'spilna';

export function konfihuratsiia(vyd: Konfihuratsiia, pidpysy: Record<string, string> = {}, oznaka: 1 | 2 | 3 = 1) {
  const W = 300;
  const H = 210;
  const T: Record<string, P> =
    vyd === 'khrest'
      ? { A: [40, 42], B: [260, 168], C: [62, 178], D: [238, 32], O: [150, 105] }
      : { B: [150, 24], D: [150, 186], A: [58, 128], C: [242, 128] };
  const pidpysVidrizka = (k: string, c: P) => (pidpysy[k] ? pidpysStorony(T[k[0]], T[k[1]], pidpysy[k], c) : '');
  // Кут: [вершина, точка, точка, позначка (кількість дуг, 0 — без позначки), радіус]
  type Kut = [string, string, string, number, number];
  let tilo = '';
  const opys: string[] = [];
  const kut = ([v, a, b, n, r]: Kut, kliuch: string) => {
    const p = pidpysy[kliuch];
    if (n) return duga(T[v], T[a], T[b], { n, r, pidpys: p });
    return p ? duga(T[v], T[a], T[b], { k: 4, zalyvka: false, r, pidpys: p }) : '';
  };
  if (vyd === 'khrest') {
    const { A, B, C, D, O } = T;
    tilo += kontur([A, O, C], 1) + kontur([B, O, D], 3);
    tilo += rysky(A, O, 1) + rysky(O, B, 1);
    if (oznaka === 1) tilo += rysky(C, O, 2) + rysky(O, D, 2);
    tilo += duga(O, A, C, { r: 18 }) + duga(O, B, D, { r: 18 });
    const c1 = tsentr([A, O, C]);
    const c2 = tsentr([B, O, D]);
    for (const k of ['AC', 'AO', 'CO']) tilo += pidpysVidrizka(k, c1);
    for (const k of ['BD', 'BO', 'DO']) tilo += pidpysVidrizka(k, c2);
    const n2 = oznaka === 2 ? 2 : 0;
    const kuty: Record<string, Kut> = { A: ['A', 'O', 'C', n2, 20], B: ['B', 'D', 'O', n2, 20], C: ['C', 'A', 'O', 0, 20], D: ['D', 'O', 'B', 0, 20] };
    for (const [k, kt] of Object.entries(kuty)) tilo += kut(kt, k);
    for (const [k, vid] of [['A', c1], ['C', c1], ['B', c2], ['D', c2]] as const) tilo += litera(T[k], k, vid);
    tilo += tochka(O) + napys([O[0], O[1] - 17], 'O', { k: 0, rozmir: 15, kursyv: true });
    opys.push(
      `Відрізки AB і CD перетинаються в точці O; позначено ${oznaka === 1 ? 'AO = OB, CO = OD' : 'AO = OB, кут OAC = кут OBD'}`,
    );
  } else {
    const { A, B, C, D } = T;
    tilo += kontur([A, B, D], 1) + kontur([C, B, D], 3);
    tilo += vidrizok(B, D, { tovshch: 3 });
    if (oznaka !== 2) tilo += rysky(A, B, 1) + rysky(B, C, 1);
    if (oznaka === 3) tilo += rysky(A, D, 2) + rysky(D, C, 2);
    const c1 = tsentr([A, B, D]);
    const c2 = tsentr([C, B, D]);
    tilo += pidpysVidrizka('AD', c1) + pidpysVidrizka('CD', c2) + pidpysVidrizka('AB', c1) + pidpysVidrizka('BC', c2);
    if (pidpysy.BD) tilo += napys([B[0] + 16, (B[1] + D[1]) / 2 + 22], pidpysy.BD);
    const nB = oznaka === 3 ? 0 : 1;
    const nD = oznaka === 2 ? 2 : 0;
    const kuty: Record<string, Kut> = {
      A: ['A', 'B', 'D', 0, 20],
      C: ['C', 'D', 'B', 0, 20],
      ABD: ['B', 'A', 'D', nB, 26],
      CBD: ['B', 'D', 'C', nB, 26],
      ADB: ['D', 'A', 'B', nD, 22],
      CDB: ['D', 'B', 'C', nD, 22],
    };
    for (const [k, kt] of Object.entries(kuty)) tilo += kut(kt, k);
    tilo += litera(A, 'A', c1) + litera(C, 'C', c2) + napys([B[0], B[1] - 13], 'B', { k: 0, rozmir: 15, kursyv: true }) + napys([D[0], D[1] + 14], 'D', { k: 0, rozmir: 15, kursyv: true });
    const pozn = ['AB = CB і рівні кути ABD і CBD', 'рівні кути ABD і CBD, рівні кути ADB і CDB', 'AB = CB і AD = CD'][oznaka - 1];
    opys.push(`Трикутники ABD і CBD зі спільною стороною BD; позначено ${pozn}`);
  }
  const vidomi = Object.entries(pidpysy)
    .filter(([, p]) => p && p !== '?')
    .map(([k, p]) => `${k.length === 1 || k.length === 3 ? 'кут ' : ''}${k} = ${p}`);
  if (vidomi.length) opys.push(vidomi.join(', '));
  return svg(W, H, opys.join('. '), tilo);
}

// ——— Рівнобедрений трикутник ———
// Вершина B угорі (або повернута), основа AC; бічні сторони з рисочками, кути при основі з дугами.

export interface RivnobedrenyiOpts {
  /** Кут при вершині — визначає форму малюнка (градуси). */
  vershyna?: number;
  /** Повернути малюнок, щоб основа не була знизу. */
  povorot?: number;
  litery?: string[]; // [ліва вершина основи, вершина, права вершина основи, основа відрізка з вершини]
  /** Позначки: рівні бічні сторони, рівні кути при основі. */
  storony?: boolean;
  kuty?: boolean;
  /** Відрізок з вершини до основи: показати рисочки (медіана), дуги (бісектриса), прямий кут (висота). */
  vidrizok?: { mediana?: boolean; bisektrysa?: boolean; vysota?: boolean } | null;
  /** Підписи сторін; osnova — лише без відрізка BD (там її довжину дають у тексті). */
  pidpysySt?: { bichna?: string; bichna2?: string; osnova?: string; polovyna?: string };
  /** Підписи кутів; vershyna — лише без відрізка BD, polovyna — ∠ABD. */
  pidpysyKut?: { vershyna?: string; osnova1?: string; osnova2?: string; polovyna?: string; zovnishnii?: string };
}

export function rivnobedrenyi(o: RivnobedrenyiOpts = {}) {
  const { vershyna = 50, povorot = 0, litery = ['A', 'B', 'C', 'D'], storony = true, kuty = true, vidrizok: vd = null } = o;
  const W = 300;
  const H = 220;
  const ph = (vershyna * Math.PI) / 360;
  let t: P[] = [[-Math.sin(ph), Math.cos(ph)], [0, 0], [Math.sin(ph), Math.cos(ph)]];
  t = pereminyty(t, povorot);
  const zov = o.pidpysyKut?.zovnishnii;
  const s = masshtab([t], zov ? 190 : 230, 150);
  const tt = postavyty(t, s, zov ? 30 : 35, 35, zov ? 190 : 230, 150);
  const [A, B, C] = tt;
  const Dp = seredyna(A, C);
  const c = tsentr(tt);
  let tilo = kontur(tt, 1);
  if (storony) tilo += rysky(A, B, 1) + rysky(B, C, 1);
  if (vd) {
    tilo += vidrizok(B, Dp, { k: 2 });
    if (vd.mediana) tilo += rysky(A, Dp, 2) + rysky(Dp, C, 2);
    if (vd.vysota) tilo += priamyi(Dp, B, C);
    tilo += tochka(Dp) + litera(Dp, litery[3], B);
  }
  const p = o.pidpysyKut ?? {};
  if (vd?.bisektrysa) tilo += duga(B, A, Dp, { n: 2, r: 30, pidpys: p.polovyna }) + duga(B, Dp, C, { n: 2, r: 30 });
  else if (p.polovyna && vd) tilo += duga(B, A, Dp, { k: 4, zalyvka: false, r: 30, pidpys: p.polovyna });
  if (kuty) tilo += duga(A, B, C, { n: 1, pidpys: p.osnova1 }) + duga(C, A, B, { n: 1, pidpys: p.osnova2 });
  else {
    if (p.osnova1) tilo += duga(A, B, C, { k: 4, zalyvka: false, pidpys: p.osnova1 });
    if (p.osnova2) tilo += duga(C, A, B, { k: 4, zalyvka: false, pidpys: p.osnova2 });
  }
  // Підпис усього кута при вершині — лише без відрізка BD (інакше його легко сплутати з половинкою).
  if (p.vershyna && !vd) tilo += duga(B, A, C, { k: 4, zalyvka: false, r: 22, pidpys: p.vershyna });
  if (zov) {
    const u = [C[0] - A[0], C[1] - A[1]];
    const l = Math.hypot(u[0], u[1]);
    const kin: P = [C[0] + (u[0] / l) * 55, C[1] + (u[1] / l) * 55];
    tilo += vidrizok(C, kin, { tovshch: 2.5 }) + duga(C, B, kin, { k: 4, r: 24, pidpys: zov });
  }
  const st = o.pidpysySt ?? {};
  if (st.bichna) tilo += pidpysStorony(A, B, st.bichna, c);
  if (st.bichna2) tilo += pidpysStorony(B, C, st.bichna2, c);
  if (st.osnova && !vd) tilo += pidpysStorony(A, C, st.osnova, c); // з відрізком BD підпис налазить на букву D
  if (st.polovyna && vd) tilo += pidpysStorony(A, Dp, st.polovyna, c);
  tilo += litera(A, litery[0], c) + litera(B, litery[1], c) + litera(C, litery[2], c);
  const [a, b, cc, d] = litery;
  const opys = [`Трикутник ${a}${b}${cc}`];
  if (storony) opys.push(`${a}${b} = ${b}${cc}`);
  if (kuty) opys.push(`позначено рівні кути ${a} і ${cc}`);
  if (vd) opys.push(`з вершини ${b} проведено відрізок ${b}${d} до сторони ${a}${cc}`);
  const vidomi = [
    ...Object.entries(p).filter(([, v]) => v && v !== '?').map(([k, v]) => `${k === 'vershyna' ? `кут ${b}` : k === 'osnova1' ? `кут ${a}` : k === 'osnova2' ? `кут ${cc}` : k === 'zovnishnii' ? 'зовнішній кут' : `кут ${a}${b}${d}`} = ${v}`),
    ...Object.entries(st).filter(([, v]) => v && v !== '?').map(([k, v]) => `${k === 'bichna' ? `${a}${b}` : k === 'bichna2' ? `${b}${cc}` : k === 'osnova' ? `${a}${cc}` : `${a}${d}`} = ${v}`),
  ];
  if (vidomi.length) opys.push(vidomi.join(', '));
  return svg(W, H, opys.join('; '), tilo);
}
