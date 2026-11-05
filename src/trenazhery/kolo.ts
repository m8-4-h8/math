// Малюнки кола для тем і тренажерів 7 класу: хорди, діаметри, радіуси, трикутник AOB, діаметр, перпендикулярний до
// хорди, дотична і прямий кут між нею та радіусом, дві дотичні з однієї точки, пряма на відстані d від центра.
// Повертає SVG-рядок: його вставляють і компонент KoloElementy, і тренажери (поле `malunok`).
// Невідоме підписуємо «?», тож малюнок не видає відповідь.
// Файл не є генератором: генератори лежать у `<N>-klas/`.
import { type P, duga, kontur, litera, napys, priamyi, pidpysStorony, proektsiia, rysky, svg, tochka, vidrizok } from './trykutnyky.ts';

const f = (v: number) => v.toFixed(1);
const rad = (g: number) => (g * Math.PI) / 180;
const naKoli = (g: number): P => [Math.cos(rad(g)), Math.sin(rad(g))];

export interface VidrizokKola {
  a: string;
  b: string;
  k?: number;
  shtrykh?: boolean;
  /** Рисочки — рівні відрізки. */
  rysky?: number;
  pidpys?: string;
  /** Від якої точки відсунути підпис (за замовчуванням — від центра). */
  vid?: string;
  /** Де на відрізку стоїть підпис: 0 — біля a, 1 — біля b (за замовчуванням посередині). */
  t?: number;
}

export interface KoloOpts {
  /** Буква центра; '' — центр без букви. */
  tsentr?: string;
  /** Показати точку центра. */
  tochkaTsentru?: boolean;
  /** Точки на колі: буква → кут у градусах (0 — праворуч, 90 — угору). */
  naKoli?: Record<string, number>;
  /** Інші точки: буква → координати в радіусах (центр — [0, 0], y — угору). */
  tochky?: Record<string, P>;
  /** Середина відрізка: буква → [a, b]. */
  serednia?: Record<string, [string, string]>;
  /** Зовнішня точка на відстані d (у радіусах) під кутом kut і дотичні з неї; dotyku — букви точок дотику. */
  zovnishnia?: { l: string; d: number; kut: number; dotyku: [string, string] | [string] };
  /** Дотичні в точках кола (пряма, перпендикулярна до радіуса). */
  dotychni?: string[];
  /** Прямі через дві точки, продовжені за обидва кінці на `dali` радіусів. */
  priami?: { a: string; b: string; dali?: number; k?: number }[];
  vidrizky?: VidrizokKola[];
  /** Прямі кути: [вершина, точка на одному промені, точка на іншому]. Для дотичної в A — [A, O, 'дотA']. */
  priamiKuty?: [string, string, string][];
  /** Дуги кутів: вершина, точки на променях, підпис, кількість дуг. */
  kuty?: { v: string; a: string; b: string; pidpys?: string; n?: number; r?: number }[];
  /** Точки, які не підписуємо буквою. */
  bezLiter?: string[];
  /** Куди відсунути букву від точки: буква → кут у градусах (0 — праворуч, 90 — угору). */
  literyKut?: Record<string, number>;
  /** Зафарбувати круг. */
  kruh?: boolean;
  /** Без кола — лише точки й відрізки (серединний перпендикуляр, бісектриса кута). */
  bezKola?: boolean;
  /** Колір кола: 1 — синій (за замовчуванням), 3 — зелений (коли поруч синій трикутник). */
  kolirKola?: number;
  /** Многокутник (трикутник) через точки — синій контур із заливкою. */
  mnohokutnyk?: string[];
  /** Трикутник, описаний навколо кола: vershyny[i] — перетин дотичних у точках dotyku[i] і dotyku[i + 1]
   *  (точки дотику йдуть проти годинникової стрілки, кути — у градусах). */
  opysanyi?: { vershyny: [string, string, string]; dotyku: [string, string, string]; kuty: [number, number, number] };
  /** Основа перпендикуляра: буква → [з якої точки, пряма через a, b]. */
  proektsii?: Record<string, [string, string, string]>;
  /** Промені: з a через b і далі на `dali` радіусів. */
  promeni?: { a: string; b: string; dali?: number }[];
  W?: number;
  H?: number;
}

export function kolo(o: KoloOpts = {}) {
  const W = o.W ?? 300;
  const H = o.H ?? 220;
  const O = o.tsentr ?? (o.bezKola ? '' : 'O');
  const pt: Record<string, P> = { [O || '_O']: [0, 0] };
  const naK = new Set<string>();
  for (const [l, g] of Object.entries(o.naKoli ?? {})) {
    pt[l] = naKoli(g);
    naK.add(l);
  }
  Object.assign(pt, o.tochky ?? {});
  const z = o.zovnishnia;
  if (z) {
    pt[z.l] = [z.d * Math.cos(rad(z.kut)), z.d * Math.sin(rad(z.kut))];
    const fi = (Math.acos(1 / z.d) * 180) / Math.PI;
    z.dotyku.forEach((l, i) => {
      pt[l] = naKoli(z.kut + (i ? -fi : fi));
      naK.add(l);
    });
  }
  const op = o.opysanyi;
  if (op) {
    op.dotyku.forEach((l, i) => {
      pt[l] = naKoli(op.kuty[i]);
      naK.add(l);
    });
    op.vershyny.forEach((l, i) => {
      const [g1, g2] = [op.kuty[i], op.kuty[(i + 1) % 3]];
      const rizn = (((g2 - g1) % 360) + 360) % 360; // дуга між точками дотику проти годинникової стрілки
      const d = 1 / Math.cos(rad(rizn / 2));
      pt[l] = [d * Math.cos(rad(g1 + rizn / 2)), d * Math.sin(rad(g1 + rizn / 2))];
    });
  }
  for (const [l, [a, b]] of Object.entries(o.serednia ?? {})) pt[l] = [(pt[a][0] + pt[b][0]) / 2, (pt[a][1] + pt[b][1]) / 2];
  for (const [l, [x, a, b]] of Object.entries(o.proektsii ?? {})) pt[l] = proektsiia(pt[x], pt[a], pt[b]);
  // Дотичні: допоміжні точки «дот<буква>» по обидва боки від точки дотику.
  const liniiDotychnykh: [P, P][] = [];
  for (const l of [...(o.dotychni ?? []), ...(z ? z.dotyku : [])]) {
    const [x, y] = pt[l];
    pt[`дот${l}`] = [x - y * 1.1, y + x * 1.1];
    pt[`дот${l}2`] = [x + y * 1.1, y - x * 1.1];
    if (o.dotychni?.includes(l)) liniiDotychnykh.push([pt[`дот${l}`], pt[`дот${l}2`]]);
  }
  const liniiPriamykh: [P, P][] = (o.priami ?? []).map(({ a, b, dali = 0.5 }) => {
    const [p, q] = [pt[a], pt[b]];
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    const [ux, uy] = [(q[0] - p[0]) / l, (q[1] - p[1]) / l];
    return [[p[0] - ux * dali, p[1] - uy * dali], [q[0] + ux * dali, q[1] + uy * dali]];
  });
  for (const { a, b, dali = 0.6 } of o.promeni ?? []) {
    const [p, q] = [pt[a], pt[b]];
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    liniiPriamykh.push([p, [q[0] + ((q[0] - p[0]) / l) * dali, q[1] + ((q[1] - p[1]) / l) * dali]]);
  }
  if (z) {
    // Дотичні з зовнішньої точки — трохи далі за точку дотику.
    for (const l of z.dotyku) {
      const [p, q] = [pt[z.l], pt[l]];
      const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
      liniiPriamykh.push([p, [q[0] + ((q[0] - p[0]) / d) * 0.45, q[1] + ((q[1] - p[1]) / d) * 0.45]]);
    }
  }
  // Масштаб: коло, видимі точки й лінії вміщаємо в рамку з полями.
  const vsi: P[] = [...(o.bezKola ? [] : ([[-1, -1], [1, 1]] as P[])), ...Object.entries(pt).filter(([l]) => !l.startsWith('дот')).map(([, p]) => p), ...liniiDotychnykh.flat(), ...liniiPriamykh.flat()];
  const xs = vsi.map((p) => p[0]);
  const ys = vsi.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const pole = 28;
  const s = Math.min((W - 2 * pole) / (x1 - x0), (H - 2 * pole) / (y1 - y0));
  const ox = (W - (x1 - x0) * s) / 2 - x0 * s;
  const oy = (H - (y1 - y0) * s) / 2 + y1 * s;
  const m = ([x, y]: P): P => [ox + x * s, oy - y * s];
  const M: Record<string, P> = Object.fromEntries(Object.entries(pt).map(([l, p]) => [l, m(p)]));
  const C = M[O || '_O'];

  const kk = `var(--ill-${o.kolirKola ?? 1})`;
  let tilo = '';
  const bahato = o.mnohokutnyk ?? op?.vershyny;
  if (bahato) tilo += kontur(bahato.map((l) => M[l]), 1);
  if (!o.bezKola) tilo += `<circle cx="${f(C[0])}" cy="${f(C[1])}" r="${f(s)}" fill="${kk}" fill-opacity="${o.kruh ? 0.18 : bahato ? 0 : 0.06}" stroke="${kk}" stroke-width="2.5"/>`;
  for (const [p, q] of [...liniiDotychnykh, ...liniiPriamykh]) tilo += vidrizok(m(p), m(q), { tovshch: 2 });
  const opys: string[] = o.bezKola ? [] : [O ? `Коло з центром ${O}` : 'Коло'];
  if (o.mnohokutnyk) opys.push(`${o.mnohokutnyk.length === 3 ? 'трикутник' : 'многокутник'} ${o.mnohokutnyk.join('')}${o.bezKola ? '' : ', вершини на колі'}`);
  if (op) opys.push(`трикутник ${op.vershyny.join('')} описано навколо кола, точки дотику ${op.dotyku.join(', ')}`);
  const vidomi: string[] = [];
  for (const v of o.vidrizky ?? []) {
    tilo += vidrizok(M[v.a], M[v.b], { k: v.k ?? 0, shtrykh: v.shtrykh });
    if (v.rysky) tilo += rysky(M[v.a], M[v.b], v.rysky);
  }
  for (const [v, a, b] of o.priamiKuty ?? []) tilo += priamyi(M[v], M[a], M[b]);
  for (const k of o.kuty ?? []) {
    tilo += duga(M[k.v], M[k.a], M[k.b], { n: k.n ?? 1, r: k.r ?? 20, pidpys: k.pidpys, zalyvka: !!k.pidpys || !!k.n });
    if (k.pidpys && k.pidpys !== '?') vidomi.push(`кут ${k.a}${k.v}${k.b} = ${k.pidpys}`);
  }
  for (const v of o.vidrizky ?? []) {
    if (!v.pidpys) continue;
    const [a, b] = [M[v.a], M[v.b]];
    const k = 2 * (v.t ?? 0.5) - 1; // підпис — посередині відрізка від a + k·(b − a) до b
    const a1: P = [a[0] + k * (b[0] - a[0]), a[1] + k * (b[1] - a[1])];
    tilo += pidpysStorony(a1, b, v.pidpys, v.vid ? M[v.vid] : C);
    if (v.pidpys !== '?') vidomi.push(`${v.a}${v.b} — ${v.pidpys}`);
  }
  const bez = new Set(o.bezLiter ?? []);
  for (const [l, p] of Object.entries(M)) {
    if (l.startsWith('дот') || l === '_O') continue;
    if (l !== O || o.tochkaTsentru !== false) tilo += tochka(p);
    if (bez.has(l)) continue;
    const kutL = o.literyKut?.[l];
    if (kutL !== undefined) tilo += litera(p, l, [p[0] - Math.cos(rad(kutL)), p[1] + Math.sin(rad(kutL))]);
    else if (l === O) {
      // Букву центра ставимо з того боку, де немає відрізків.
      const sus = (o.vidrizky ?? []).flatMap((v) => (v.a === O ? [M[v.b]] : v.b === O ? [M[v.a]] : []));
      let [dx, dy] = sus.reduce(([sx, sy], q) => {
        const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
        return [sx + (q[0] - p[0]) / d, sy + (q[1] - p[1]) / d];
      }, [0, 0] as P);
      if (Math.hypot(dx, dy) < 0.3) [dx, dy] = [0.6, -1];
      tilo += litera(p, l, [p[0] + dx, p[1] + dy]);
    } else tilo += litera(p, l, naK.has(l) || Math.hypot(pt[l][0], pt[l][1]) > 0.2 ? C : [C[0], C[1] - 1]);
  }
  const tNaKoli = [...naK].filter((l) => !bez.has(l));
  if (tNaKoli.length) opys.push(`на колі точки ${tNaKoli.join(', ')}`);
  if (z) opys.push(`з точки ${z.l} проведено дотичні ${z.dotyku.map((l) => `${z.l}${l}`).join(' і ')}`);
  if (o.dotychni?.length) opys.push(`проведено дотичну в точці ${o.dotychni.join(', ')}`);
  const vv = (o.vidrizky ?? []).map((v) => `${v.a}${v.b}`);
  if (vv.length) opys.push(`проведено ${vv.join(', ')}`);
  if (o.priamiKuty?.length) opys.push(`прямі кути при точках ${o.priamiKuty.map((k) => k[0]).join(', ')}`);
  if (vidomi.length) opys.push(vidomi.join(', '));
  return svg(W, H, opys.join('; ') || 'Малюнок', tilo);
}

/** Пряма і коло: три випадки поруч — d < r (дві спільні точки), d = r (одна), d > r (жодної). */
export function priamaIKolo(vypadky: number[] = [0.55, 1, 1.45], pidpysy = ['d < r', 'd = r', 'd > r']) {
  const W = 330;
  const H = 185;
  const r = 38;
  let tilo = '';
  vypadky.forEach((d, i) => {
    const cx = 55 + i * 110;
    const cy = 58;
    const yl = cy + d * r;
    tilo += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--ill-1)" fill-opacity="0.06" stroke="var(--ill-1)" stroke-width="2.5"/>`;
    tilo += vidrizok([cx - 52, yl], [cx + 52, yl], { tovshch: 2 });
    tilo += vidrizok([cx, cy], [cx, yl], { k: 2, shtrykh: true, tovshch: 2 });
    tilo += priamyi([cx, yl], [cx, cy], [cx + 10, yl], 2);
    tilo += tochka([cx, cy]) + napys([cx + 9, cy - 9], 'O', { k: 0, rozmir: 13, kursyv: true });
    tilo += napys([cx - 9, (cy + yl) / 2 + 2], 'd', { k: 2, rozmir: 13, kursyv: true });
    if (d < 1) {
      const h = Math.sqrt(1 - d * d) * r;
      tilo += tochka([cx - h, yl]) + tochka([cx + h, yl]);
    } else if (d === 1) tilo += tochka([cx, yl]);
    tilo += napys([cx, 168], pidpysy[i] ?? '', { k: 0, rozmir: 13 });
  });
  const opys = vypadky.map((d, i) => `${pidpysy[i]}: ${d < 1 ? 'пряма перетинає коло у двох точках' : d === 1 ? 'пряма дотикається до кола в одній точці' : 'пряма не має з колом спільних точок'}`);
  return svg(W, H, `Коло з центром O і пряма на відстані d від центра, три випадки. ${opys.join('; ')}`, tilo);
}

/** Два кола з центрами O₁ і O₂ (радіуси R і r, відстань між центрами d); пунктир O₁O₂ і підпис під малюнком. */
export function dvaKola(R: number, r: number, d: number, pidpys = '') {
  const W = 160;
  const H = 130;
  // Математичні координати: O₁ = (0, 0), O₂ = (d, 0).
  const x0 = Math.min(-R, d - r);
  const x1 = Math.max(R, d + r);
  const vys = 2 * Math.max(R, r);
  const s = Math.min((W - 24) / (x1 - x0), (H - 44) / vys);
  const ox = (W - (x1 - x0) * s) / 2 - x0 * s;
  const oy = (H - 22) / 2 + 2;
  const O1: P = [ox, oy];
  const O2: P = [ox + d * s, oy];
  let tilo = `<circle cx="${f(O1[0])}" cy="${f(oy)}" r="${f(R * s)}" fill="var(--ill-1)" fill-opacity="0.06" stroke="var(--ill-1)" stroke-width="2.5"/>`;
  tilo += `<circle cx="${f(O2[0])}" cy="${f(oy)}" r="${f(r * s)}" fill="var(--ill-3)" fill-opacity="0.08" stroke="var(--ill-3)" stroke-width="2.5"/>`;
  if (d > 0) tilo += vidrizok(O1, O2, { k: 2, shtrykh: true, tovshch: 1.5 });
  tilo += tochka(O1) + tochka(O2);
  tilo += napys([O1[0] - 2, oy - 11], 'O₁', { k: 0, rozmir: 12, kursyv: true });
  tilo += napys([O2[0] + 2, oy + 12], 'O₂', { k: 0, rozmir: 12, kursyv: true });
  if (pidpys) tilo += napys([W / 2, H - 10], pidpys, { k: 0, rozmir: 12 });
  const vyd =
    d > R + r ? 'кола лежать одне поза одним, спільних точок немає'
    : d === R + r ? 'кола дотикаються зовні в одній точці'
    : d > Math.abs(R - r) ? 'кола перетинаються у двох точках'
    : d === Math.abs(R - r) ? 'кола дотикаються зсередини в одній точці'
    : 'менше коло лежить усередині більшого, спільних точок немає';
  return svg(W, H, `Два кола з центрами O₁ і O₂: ${vyd}${pidpys ? ` (${pidpys})` : ''}`, tilo);
}
