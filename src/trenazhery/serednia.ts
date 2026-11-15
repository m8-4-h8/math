// Середня лінія трикутника: трикутник ABC (B угорі), середини сторін, середня лінія іншим кольором, рисочки на
// половинах сторін (AB — одна, BC — дві, AC — три), стрілочки паралельності, підписи довжин і «?».
// Можна провести всі три середні лінії — вийдуть чотири рівні трикутники (середній зафарбовано).
// Повертає SVG-рядок: його вставляють і компонент SeredniaLiniia, і тренажер (поле `malunok`).
// Файл не є генератором: генератори лежать у `<N>-klas/`.
import { type P, type Forma, FORMY, kontur, vidrizok, rysky, tochka, litera, napys, postavyty, masshtab, seredyna, tsentr, svg } from './trykutnyky.ts';

/** Сторона трикутника; для середньої лінії — сторона, якій вона паралельна. */
export type Storona = 'AB' | 'BC' | 'AC';

export interface SeredniaOpts {
  /** Букви вершин: A (внизу ліворуч), B (угорі), C (внизу праворуч). */
  bukvy?: [string, string, string];
  /** Букви середин сторін AB, BC, AC. */
  seredyny?: [string, string, string];
  forma?: Forma;
  /** Які середні лінії провести (за стороною, якій вона паралельна). За замовчуванням — одна, паралельна AC. */
  linii?: Storona[];
  /** Підписи сторін і середніх ліній (ключ — сторона, якій лінія паралельна); '?' — шукане. */
  pidpysyStorin?: Partial<Record<Storona, string>>;
  pidpysyLinii?: Partial<Record<Storona, string>>;
  W?: number;
  H?: number;
}

const f = (v: number) => v.toFixed(1);
const odyn = (a: P): P => {
  const l = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / l, a[1] / l];
};

/** Стрілочка «>» посередині відрізка ab — позначка паралельності (обидві дивляться праворуч). */
function strilka(a: P, b: P): string {
  let u = odyn([b[0] - a[0], b[1] - a[1]]);
  if (u[0] < 0) u = [-u[0], -u[1]];
  const n: P = [-u[1], u[0]];
  const v: P = [(a[0] + b[0]) / 2 + u[0] * 4, (a[1] + b[1]) / 2 + u[1] * 4];
  const d = `M ${f(v[0] - u[0] * 7 + n[0] * 5)} ${f(v[1] - u[1] * 7 + n[1] * 5)} L ${f(v[0])} ${f(v[1])} L ${f(v[0] - u[0] * 7 - n[0] * 5)} ${f(v[1] - u[1] * 7 - n[1] * 5)}`;
  return `<path d="${d}" fill="none" stroke="var(--ill-ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** Підпис біля відрізка ab: зміщений по нормалі в бік точки `kudy` (або від неї, якщо vidstup < 0). */
function pidpys(a: P, b: P, t: string, kudy: P, vidstup: number) {
  const m = seredyna(a, b);
  const u = odyn([b[0] - a[0], b[1] - a[1]]);
  let n: P = [-u[1], u[0]];
  if ((kudy[0] - m[0]) * n[0] + (kudy[1] - m[1]) * n[1] < 0) n = [-n[0], -n[1]];
  // Щоб напис (≈ 7 px на знак завширшки, 14 px заввишки) не ліз на відрізок, відступаємо на його «напівтовщину» вздовж нормалі.
  const z = Math.sign(vidstup) * (Math.abs(vidstup) + Math.abs(n[0]) * t.length * 3.5 + Math.abs(n[1]) * 7);
  return napys([m[0] + n[0] * z, m[1] + n[1] * z], t, { k: t === '?' ? 4 : undefined });
}

export function seredniaLiniia(o: SeredniaOpts = {}) {
  const W = o.W ?? 300;
  const H = o.H ?? 210;
  const [lA, lB, lC] = o.bukvy ?? ['A', 'B', 'C'];
  const [lM, lN, lK] = o.seredyny ?? ['M', 'N', 'K'];
  const linii = o.linii ?? ['AC'];
  const forma = FORMY[o.forma ?? 'hostrokutnyi'];
  const t = postavyty(forma, masshtab([forma], W - 90, H - 72), 45, 28, W - 90, H - 72);
  const [B, A, C] = t;
  const O = tsentr(t);
  const vershyny: Record<Storona, [P, P]> = { AB: [A, B], BC: [B, C], AC: [A, C] };
  const ser: Record<Storona, P> = { AB: seredyna(A, B), BC: seredyna(B, C), AC: seredyna(A, C) };
  const bukvaSer: Record<Storona, string> = { AB: lM, BC: lN, AC: lK };
  const RYSKY: Record<Storona, number> = { AB: 1, BC: 2, AC: 3 };
  // Середня лінія, паралельна стороні s, сполучає середини двох інших сторін.
  const INSHI: Record<Storona, [Storona, Storona]> = { AC: ['AB', 'BC'], AB: ['BC', 'AC'], BC: ['AB', 'AC'] };
  const zSeredynoiu = new Set(linii.flatMap((s) => INSHI[s]));

  let tilo = kontur(t, 1);
  if (linii.length === 3) tilo += kontur([ser.AB, ser.BC, ser.AC], 2);
  for (const s of zSeredynoiu) {
    const [p, q] = vershyny[s];
    tilo += rysky(p, ser[s], RYSKY[s]) + rysky(ser[s], q, RYSKY[s]);
  }
  for (const s of linii) {
    const [p, q] = INSHI[s].map((x) => ser[x]);
    tilo += vidrizok(p, q, { k: 2, tovshch: 3 });
    if (linii.length === 1) tilo += strilka(p, q) + strilka(...vershyny[s]);
  }
  for (const s of linii) {
    const tekst = o.pidpysyLinii?.[s];
    if (!tekst) continue;
    const [p, q] = INSHI[s].map((x) => ser[x]);
    // Підпис — з боку сторони, якій лінія паралельна (там більше місця).
    tilo += pidpys(p, q, tekst, seredyna(...vershyny[s]), 5);
  }
  for (const s of ['AB', 'BC', 'AC'] as Storona[]) {
    const tekst = o.pidpysyStorin?.[s];
    if (!tekst) continue;
    // Назовні; якщо на стороні є буква середини — ще далі, за нею.
    tilo += pidpys(...vershyny[s], tekst, O, -(zSeredynoiu.has(s) ? 22 : 6));
  }
  tilo += [A, B, C].map(tochka).join('');
  tilo += litera(A, lA, O) + litera(B, lB, O) + litera(C, lC, O);
  for (const s of zSeredynoiu) tilo += tochka(ser[s]) + litera(ser[s], bukvaSer[s], O);

  const nazvaLinii = (s: Storona) => INSHI[s].map((x) => bukvaSer[x]).join('');
  const nazvaStorony = (s: Storona) => ({ AB: lA + lB, BC: lB + lC, AC: lA + lC })[s];
  const vidomi = [
    ...Object.entries(o.pidpysyStorin ?? {}).filter(([, v]) => v && v !== '?').map(([s, v]) => `${nazvaStorony(s as Storona)} = ${v}`),
    ...Object.entries(o.pidpysyLinii ?? {}).filter(([, v]) => v && v !== '?').map(([s, v]) => `${nazvaLinii(s as Storona)} = ${v}`),
  ];
  const opys =
    linii.length === 3
      ? `Трикутник ${lA}${lB}${lC} і три його середні лінії ${linii.map(nazvaLinii).join(', ')}: вони ділять трикутник на чотири трикутники`
      : `Трикутник ${lA}${lB}${lC}, ${linii.map((s) => `${nazvaLinii(s)} — середня лінія, паралельна ${nazvaStorony(s)}`).join('; ')}`;
  return svg(W, H, `${opys}${vidomi.length ? `; ${vidomi.join(', ')}` : ''}.`, tilo);
}
