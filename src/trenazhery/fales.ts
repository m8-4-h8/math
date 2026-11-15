// Малюнки до теореми Фалеса: кут, на одній стороні якого відкладено рівні відрізки (одна рисочка), через їхні кінці
// проведено паралельні прямі (одним кольором), і на другій стороні теж вийшли рівні відрізки (дві рисочки).
// Варіант «зошит»: рівновіддалені лінії зошита й навскісний відрізок, поділений ними на рівні частини.
// Повертає SVG-рядок: його вставляють і компонент Fales, і тренажер (поле `malunok`). Шукане підписуємо «?».
// Файл не є генератором: генератори лежать у `<N>-klas/`.
import { type P, napys, rysky, svg, tochka, vidrizok } from './trykutnyky.ts';

const ПІДРЯДКОВІ = '₀₁₂₃₄₅₆₇₈₉';
const indeks = (n: number) => String(n).split('').map((c) => ПІДРЯДКОВІ[Number(c)]).join('');

export interface FalesOpts {
  /** Скільки рівних відрізків на першій стороні. */
  n?: number;
  /** Перший відрізок починається у вершині кута O (OA₁ = A₁A₂ = …), інакше — з точки A₁. */
  vidO?: boolean;
  /** Підписи відрізків на першій стороні (знизу) і на другій (зверху); '?' — шукане. */
  pidpysyA?: (string | undefined)[];
  pidpysyB?: (string | undefined)[];
  /** Рисочки на відрізках другої сторони (за замовчуванням є — теорема вже «спрацювала»). */
  ryskyB?: boolean;
  /** Замість кута — лінії зошита і навскісний відрізок. */
  zoshyt?: boolean;
  W?: number;
  H?: number;
}

export function fales(o: FalesOpts = {}) {
  const W = o.W ?? 330;
  const H = o.H ?? 210;
  const n = o.n ?? 3;
  let tilo = '';
  if (o.zoshyt) {
    const krok = (H - 40) / n;
    const y = (i: number) => 20 + i * krok;
    for (let i = 0; i <= n; i++) tilo += `<line x1="10" y1="${y(i).toFixed(1)}" x2="${W - 10}" y2="${y(i).toFixed(1)}" stroke="var(--ill-1)" stroke-width="2"/>`;
    const [a, b]: [P, P] = [[70, y(0)], [W - 70, y(n)]];
    const t = (i: number): P => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n];
    tilo += vidrizok(a, b, { k: 2, tovshch: 3 });
    for (let i = 0; i < n; i++) {
      tilo += rysky(t(i), t(i + 1), 1, 2);
      const p = (o.pidpysyB ?? [])[i];
      if (p) {
        const m = t(i + 0.5);
        tilo += napys([m[0] + 22, m[1] - 4], p, { k: p === '?' ? 4 : 2, rozmir: 13 });
      }
    }
    for (let i = 0; i <= n; i++) tilo += tochka(t(i));
    const opys = `Лінії зошита на однаковій відстані одна від одної перетинають навскісний відрізок і ділять його на ${n} рівних частин.`;
    return svg(W, H, opys, tilo);
  }

  const O: P = [24, H - 30];
  const u1: P = [1, 0];
  const kut = (34 * Math.PI) / 180;
  const u2: P = [Math.cos(kut), -Math.sin(kut)];
  const pochatok = o.vidO ? 0 : 1;
  const ostannii = pochatok + n;
  const s1 = (W - 60) / ostannii;
  const s2 = s1 * 0.82;
  const A = (i: number): P => [O[0] + u1[0] * s1 * i, O[1] + u1[1] * s1 * i];
  const B = (i: number): P => [O[0] + u2[0] * s2 * i, O[1] + u2[1] * s2 * i];
  // Сторони кута.
  tilo += vidrizok(O, [O[0] + u1[0] * (W - 30), O[1]], { k: 0, tovshch: 2 });
  tilo += vidrizok(O, [O[0] + u2[0] * (s2 * ostannii + 26), O[1] + u2[1] * (s2 * ostannii + 26)], { k: 0, tovshch: 2 });
  // Паралельні прямі — трохи довші за відрізки AᵢBᵢ (на 8 px з кожного боку, щоб не залазити на підписи точок).
  for (let i = pochatok; i <= ostannii; i++) {
    if (i === 0) continue;
    const [a, b] = [A(i), B(i)];
    const dl = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d: P = [((b[0] - a[0]) / dl) * 8, ((b[1] - a[1]) / dl) * 8];
    tilo += vidrizok([a[0] - d[0], a[1] - d[1]], [b[0] + d[0], b[1] + d[1]], { k: 2, tovshch: 2 });
  }
  for (let i = pochatok; i < ostannii; i++) {
    tilo += rysky(A(i), A(i + 1), 1, 0);
    if (o.ryskyB !== false) tilo += rysky(B(i), B(i + 1), 2, 0);
    // Довжини: на першій стороні — над нею, між паралельними прямими; на другій — під нею, теж між прямими.
    // Біля вершини O смужка вужча, тому там підпис іде на зовнішній бік сторони.
    const pa = (o.pidpysyA ?? [])[i - pochatok];
    if (pa) {
      const m = A(i + 0.5);
      tilo += napys(i === 0 ? [m[0], m[1] + 16] : [m[0] - 9, m[1] - 13], pa, { k: pa === '?' ? 4 : 3, rozmir: 13 });
    }
    const pb = (o.pidpysyB ?? [])[i - pochatok];
    if (pb) {
      const m = B(i + 0.5);
      const vseredynu: P = [-u2[1], u2[0]];
      const z = i === 0 ? -13 : 15;
      tilo += napys([m[0] + vseredynu[0] * z, m[1] + vseredynu[1] * z], pb, { k: pb === '?' ? 4 : 3, rozmir: 13 });
    }
  }
  tilo += tochka(O) + napys([O[0] - 4, O[1] + 16], 'O', { k: 0, rozmir: 15, kursyv: true });
  for (let i = Math.max(1, pochatok); i <= ostannii; i++) {
    const [a, b] = [A(i), B(i)];
    tilo += tochka(a) + tochka(b);
    tilo += napys([a[0] + 9, a[1] + 16], `A${indeks(i)}`, { k: 0, rozmir: 14, kursyv: true });
    tilo += napys([b[0] - 15, b[1] - 12], `B${indeks(i)}`, { k: 0, rozmir: 14, kursyv: true });
  }
  const vidomi = [
    ...(o.pidpysyA ?? []).map((p, i) => (p && p !== '?' ? `A${pochatok + i}A${pochatok + i + 1} = ${p}` : '')),
    ...(o.pidpysyB ?? []).map((p, i) => (p && p !== '?' ? `B${pochatok + i}B${pochatok + i + 1} = ${p}` : '')),
  ].filter(Boolean);
  const opys = `Кут з вершиною O. На одній стороні ${n} рівних відрізків, через їхні кінці проведено паралельні прямі до другої сторони${
    vidomi.length ? `; ${vidomi.join(', ')}` : ''
  }.`;
  return svg(W, H, opys, tilo);
}
