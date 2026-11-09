// Малюнки чотирикутників для тем і тренажерів 8 класу: вершини ABCD, діагоналі, кути з дугами й підписами
// (зокрема кут, більший за 180°, у неопуклого), підписи сторін, поділ діагоналлю на два трикутники.
// Повертає SVG-рядок: його вставляють і компонент Chotyrykutnyk, і тренажери (поле `malunok`).
// Невідоме підписуємо «?», тож малюнок не видає відповідь.
// Файл не є генератором: генератори лежать у `<N>-klas/`.
import { type P, kontur, litera, napys, pidpysStorony, svg, tochka, vidrizok } from './trykutnyky.ts';

export type FormaChotyrykutnyka = 'dovilnyi' | 'neopuklyi' | 'opuklyi2';

/** Одиничні координати (y — донизу), вершини A, B, C, D по колу. */
const FORMY: Record<FormaChotyrykutnyka, P[]> = {
  dovilnyi: [[0, 1], [0.18, 0.12], [1.05, 0], [1.3, 0.95]],
  opuklyi2: [[0, 0.8], [0.45, 0], [1.3, 0.3], [0.95, 1.05]],
  neopuklyi: [[0, 1], [0.55, 0], [1.1, 1], [0.55, 0.62]],
};

export interface ChotyrykutnykOpts {
  forma?: FormaChotyrykutnyka;
  /** Свої вершини (y — донизу) замість форми. */
  tochky?: P[];
  /** Назви вершин, за замовчуванням A, B, C, D. */
  bukvy?: [string, string, string, string];
  /** Діагоналі за номерами вершин: [0, 2] — AC, [1, 3] — BD. */
  diahonali?: [number, number][];
  /** Діагоналі пунктиром. */
  shtrykh?: boolean;
  /** Підписи кутів при вершинах 0..3 ('' — без дуги). '?' — шуканий кут. */
  kuty?: (string | undefined)[];
  /** Підписи сторін 0..3: AB, BC, CD, DA. */
  storony?: (string | undefined)[];
  /** Розбити діагоналлю AC на два трикутники різного кольору з дугами їхніх кутів. */
  rozbyttia?: boolean;
  W?: number;
  H?: number;
}

const f = (v: number) => v.toFixed(1);
const riz = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const odyn = (a: P): P => {
  const l = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / l, a[1] / l];
};
const cross = (a: P, b: P) => a[0] * b[1] - a[1] * b[0];

/** Площа зі знаком (y — донизу): знак показує напрям обходу. */
const ploshchaZiZnakom = (t: P[]) => t.reduce((s, p, i) => s + cross(p, t[(i + 1) % t.length]), 0) / 2;

/** Внутрішній кут многокутника при вершині i, у градусах. */
export function vnutrishniiKut(t: P[], i: number) {
  const n = t.length;
  const [p, v, q] = [t[(i + n - 1) % n], t[i], t[(i + 1) % n]];
  const [a, b] = [odyn(riz(p, v)), odyn(riz(q, v))];
  const malyi = (Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1]))) * 180) / Math.PI;
  const opuklyi = Math.sign(cross(riz(v, p), riz(q, v))) === Math.sign(ploshchaZiZnakom(t));
  return opuklyi ? malyi : 360 - malyi;
}

/** Дуга внутрішнього кута при вершині v між напрямками на p і q (зокрема більшого за 180°), з підписом. */
function dugaKuta(t: P[], i: number, j: number, k: number, o: { kolir: number; r: number; pidpys?: string; zalyvka?: boolean; vel?: boolean }) {
  const [v, p, q] = [t[i], t[j], t[k]];
  const [a, b] = [odyn(riz(p, v)), odyn(riz(q, v))];
  const vel = !!o.vel; // кут більший за 180° — дуга йде довшим шляхом
  const malyiSweep = cross(a, b) > 0 ? 1 : 0;
  const sweep = vel ? 1 - malyiSweep : malyiSweep;
  const kolir = `var(--ill-${o.kolir})`;
  const [p1, p2]: P[] = [[v[0] + a[0] * o.r, v[1] + a[1] * o.r], [v[0] + b[0] * o.r, v[1] + b[1] * o.r]];
  let s = '';
  if (o.zalyvka !== false) s += `<path d="M ${f(v[0])} ${f(v[1])} L ${f(p1[0])} ${f(p1[1])} A ${o.r} ${o.r} 0 ${vel ? 1 : 0} ${sweep} ${f(p2[0])} ${f(p2[1])} Z" fill="${kolir}" fill-opacity="0.22" stroke="none"/>`;
  s += `<path d="M ${f(p1[0])} ${f(p1[1])} A ${o.r} ${o.r} 0 ${vel ? 1 : 0} ${sweep} ${f(p2[0])} ${f(p2[1])}" fill="none" stroke="${kolir}" stroke-width="2"/>`;
  if (o.pidpys) {
    let bis = odyn([a[0] + b[0], a[1] + b[1]]);
    if (vel) bis = [-bis[0], -bis[1]];
    const d = vel ? o.r + 9 : o.r + 16;
    s += napys([v[0] + bis[0] * d, v[1] + bis[1] * d], o.pidpys, { k: o.kolir });
  }
  return s;
}

export function chotyrykutnyk(o: ChotyrykutnykOpts = {}) {
  const W = o.W ?? 280;
  const H = o.H ?? 200;
  const syri = o.tochky ?? FORMY[o.forma ?? 'dovilnyi'];
  const bukvy = o.bukvy ?? ['A', 'B', 'C', 'D'];
  // Масштаб: вміщаємо в рамку з полями.
  const xs = syri.map((p) => p[0]);
  const ys = syri.map((p) => p[1]);
  const pole = 34;
  const s = Math.min((W - 2 * pole) / (Math.max(...xs) - Math.min(...xs)), (H - 2 * pole) / (Math.max(...ys) - Math.min(...ys)));
  const x0 = (W - (Math.max(...xs) - Math.min(...xs)) * s) / 2 - Math.min(...xs) * s;
  const y0 = (H - (Math.max(...ys) - Math.min(...ys)) * s) / 2 - Math.min(...ys) * s;
  const t: P[] = syri.map(([x, y]) => [x0 + x * s, y0 + y * s]);
  const tsentr: P = [t.reduce((a, p) => a + p[0], 0) / 4, t.reduce((a, p) => a + p[1], 0) / 4];

  let tilo = '';
  const neopuklyi = t.some((_, i) => vnutrishniiKut(t, i) > 180);
  const opys = [`Чотирикутник ${bukvy.join('')}${neopuklyi ? ' (неопуклий)' : ''}`];
  if (o.rozbyttia) {
    tilo += kontur([t[0], t[1], t[2]], 1) + kontur([t[0], t[2], t[3]], 3);
    tilo += dugaKuta(t, 1, 0, 2, { kolir: 1, r: 20 }) + dugaKuta(t, 0, 1, 2, { kolir: 1, r: 26 }) + dugaKuta(t, 2, 0, 1, { kolir: 1, r: 26 });
    tilo += dugaKuta(t, 3, 2, 0, { kolir: 3, r: 20 }) + dugaKuta(t, 0, 2, 3, { kolir: 3, r: 26 }) + dugaKuta(t, 2, 3, 0, { kolir: 3, r: 26 });
    opys.push(`діагональ ${bukvy[0]}${bukvy[2]} ділить його на трикутники ${bukvy[0]}${bukvy[1]}${bukvy[2]} і ${bukvy[0]}${bukvy[2]}${bukvy[3]}`);
  } else tilo += kontur(t, 1);
  for (const [i, j] of o.diahonali ?? []) {
    tilo += vidrizok(t[i], t[j], { k: 2, shtrykh: o.shtrykh ?? true, tovshch: 2 });
  }
  if (o.diahonali?.length) opys.push(`діагоналі ${o.diahonali.map(([i, j]) => bukvy[i] + bukvy[j]).join(' і ')}`);
  if (o.rozbyttia) tilo += vidrizok(t[0], t[2], { k: 0, tovshch: 2 });
  const vidomi: string[] = [];
  (o.kuty ?? []).forEach((pidpys, i) => {
    if (!pidpys) return;
    tilo += dugaKuta(t, i, (i + 3) % 4, (i + 1) % 4, { kolir: pidpys === '?' ? 4 : 2, r: 22, pidpys, vel: vnutrishniiKut(t, i) > 180 });
    if (pidpys !== '?') vidomi.push(`кут ${bukvy[i]} = ${pidpys}`);
  });
  (o.storony ?? []).forEach((pidpys, i) => {
    if (!pidpys) return;
    tilo += pidpysStorony(t[i], t[(i + 1) % 4], pidpys, tsentr);
    if (pidpys !== '?') vidomi.push(`${bukvy[i]}${bukvy[(i + 1) % 4]} = ${pidpys}`);
  });
  t.forEach((p, i) => {
    tilo += tochka(p);
    // Букву ставимо назовні: від сусідніх вершин, а в неопуклої вершини — у бік кута, більшого за 180°.
    const [a, b] = [odyn(riz(t[(i + 3) % 4], p)), odyn(riz(t[(i + 1) % 4], p))];
    let nazovni = odyn([-(a[0] + b[0]), -(a[1] + b[1])]);
    if (vnutrishniiKut(t, i) > 180) nazovni = [-nazovni[0], -nazovni[1]];
    tilo += litera(p, bukvy[i], [p[0] - nazovni[0], p[1] - nazovni[1]]);
  });
  if (vidomi.length) opys.push(vidomi.join(', '));
  return svg(W, H, opys.join('; '), tilo);
}
