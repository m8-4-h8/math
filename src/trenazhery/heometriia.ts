// Малюнки кутів для тренажерів геометрії 7 класу (SVG-рядок у полі `malunok`). Як компоненти SumizhniKuty
// і VertykalniKuty, але без Astro. Невідомий кут підписуємо «?», тож малюнок не видає відповідь.
// Файл не є генератором: генератори лежать у `<N>-klas/`.

const rad = (g: number) => (g * Math.PI) / 180;
const f = (v: number) => v.toFixed(1);

function sektor(ox: number, oy: number, g1: number, g2: number, r: number, povorot = 0) {
  const a = [ox + r * Math.cos(rad(g1 + povorot)), oy - r * Math.sin(rad(g1 + povorot))];
  const b = [ox + r * Math.cos(rad(g2 + povorot)), oy - r * Math.sin(rad(g2 + povorot))];
  return `M ${ox} ${oy} L ${f(a[0])} ${f(a[1])} A ${r} ${r} 0 0 0 ${f(b[0])} ${f(b[1])} Z`;
}

function tekst(x: number, y: number, t: string, kolir: string, rozmir = 14) {
  return `<text x="${f(x)}" y="${f(y)}" font-size="${rozmir}" font-weight="700" fill="${kolir}" text-anchor="middle" dominant-baseline="central">${t}</text>`;
}

/**
 * Суміжні кути: пряма, точка O і промінь під кутом `kut` до правої частини прямої.
 * `pidpysy` — що написати в правому і лівому куті (наприклад, «40°» і «?»).
 */
export function sumizhni(kut: number, pidpysy: [string, string]) {
  const W = 260;
  const H = 140;
  const [ox, oy] = [130, 112];
  const c = [ox + 100 * Math.cos(rad(kut)), oy - 100 * Math.sin(rad(kut))];
  const misce = (g1: number, g2: number) => {
    const r = g2 - g1 < 40 ? 66 : 48;
    const g = (g1 + g2) / 2;
    return [ox + r * Math.cos(rad(g)), oy - r * Math.sin(rad(g))];
  };
  const [p1, p2] = [misce(0, kut), misce(kut, 180)];
  return (
    `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Пряма і промінь з точки на ній: два суміжні кути, ${pidpysy[0] === '?' ? 'правий невідомий' : `правий ${pidpysy[0]}`}, ${pidpysy[1] === '?' ? 'лівий невідомий' : `лівий ${pidpysy[1]}`}">` +
    `<path d="${sektor(ox, oy, 0, kut, 30)}" fill="var(--ill-2)" fill-opacity="0.22" stroke="var(--ill-2)" stroke-width="2"/>` +
    `<path d="${sektor(ox, oy, kut, 180, 24)}" fill="var(--ill-1)" fill-opacity="0.22" stroke="var(--ill-1)" stroke-width="2"/>` +
    `<line x1="14" y1="${oy}" x2="${W - 14}" y2="${oy}" stroke="var(--ill-ink)" stroke-width="2.5" stroke-linecap="round"/>` +
    `<line x1="${ox}" y1="${oy}" x2="${f(c[0])}" y2="${f(c[1])}" stroke="var(--ill-ink)" stroke-width="2.5" stroke-linecap="round"/>` +
    `<circle cx="${ox}" cy="${oy}" r="3" fill="var(--ill-ink)"/>` +
    tekst(p1[0], p1[1], pidpysy[0], 'var(--ill-2)') +
    tekst(p2[0], p2[1], pidpysy[1], 'var(--ill-1)') +
    `</svg>`
  );
}

/**
 * Дві прямі перетинаються: кути 1–4 (1 — між правою частиною першої прямої і другою прямою, далі проти
 * годинникової стрілки). `pidpysy[i]` — підпис у куті i + 1 («62°» або «?»). Малюнок трохи повернуто.
 */
export function peretyn(kut: number, pidpysy: [string, string, string, string], povorot = 0) {
  const W = 260;
  const H = 200;
  const [ox, oy] = [W / 2, H / 2];
  const L = 95;
  const kinets = (g: number) => [ox + L * Math.cos(rad(g + povorot)), oy - L * Math.sin(rad(g + povorot))];
  const [a1, a2, b1, b2] = [kinets(0), kinets(180), kinets(kut), kinets(180 + kut)];
  const kuty = [
    [0, kut],
    [kut, 180],
    [180, 180 + kut],
    [180 + kut, 360],
  ];
  const kolir = (i: number) => (i % 2 ? 'var(--ill-2)' : 'var(--ill-1)');
  const sektory = kuty
    .map(([g1, g2], i) => `<path d="${sektor(ox, oy, g1, g2, i % 2 ? 26 : 32, povorot)}" fill="${kolir(i)}" fill-opacity="0.2" stroke="${kolir(i)}" stroke-width="2"/>`)
    .join('');
  const pidpysyKutiv = kuty
    .map(([g1, g2], i) => {
      const vuzkyi = g2 - g1 < 45;
      const g = (g1 + g2) / 2 + povorot;
      const n = vuzkyi ? 46 : 19;
      const p = vuzkyi ? 74 : 58;
      return (
        tekst(ox + n * Math.cos(rad(g)), oy - n * Math.sin(rad(g)), String(i + 1), 'var(--ill-ink)', 12) +
        tekst(ox + p * Math.cos(rad(g)), oy - p * Math.sin(rad(g)), pidpysy[i], kolir(i))
      );
    })
    .join('');
  const vidomi = pidpysy.map((p, i) => (p === '?' ? '' : `кут ${i + 1} — ${p}`)).filter(Boolean);
  return (
    `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Дві прямі перетинаються, кути пронумеровано від 1 до 4; ${vidomi.join(', ')}">` +
    sektory +
    `<line x1="${f(a1[0])}" y1="${f(a1[1])}" x2="${f(a2[0])}" y2="${f(a2[1])}" stroke="var(--ill-ink)" stroke-width="2.5" stroke-linecap="round"/>` +
    `<line x1="${f(b1[0])}" y1="${f(b1[1])}" x2="${f(b2[0])}" y2="${f(b2[1])}" stroke="var(--ill-ink)" stroke-width="2.5" stroke-linecap="round"/>` +
    `<circle cx="${ox}" cy="${oy}" r="3" fill="var(--ill-ink)"/>` +
    pidpysyKutiv +
    `</svg>`
  );
}

// ——— Дві прямі і січна ———
// Кути нумеруємо однаково всюди (і в темах, і в тренажерах): біля прямої a (вгорі) 1 — вгорі ліворуч від
// січної, 2 — вгорі праворуч, 3 — внизу ліворуч, 4 — внизу праворуч; біля прямої b (внизу) так само 5–8.

export type VydPary =
  | 'відповідні'
  | 'внутрішні різносторонні'
  | 'внутрішні односторонні'
  | 'зовнішні різносторонні'
  | 'зовнішні односторонні'
  | 'вертикальні'
  | 'суміжні';

const chvert = (k: number) => (k - 1) % 4; // 0 — вгорі ліворуч, 1 — вгорі праворуч, 2 — внизу ліворуч, 3 — внизу праворуч
const vhori = (k: number) => chvert(k) < 2;
const pravoruch = (k: number) => chvert(k) % 2 === 1;
/** Внутрішній — між прямими a і b: під a або над b. */
export const vnutrishnii = (k: number) => (k <= 4 ? !vhori(k) : vhori(k));

/** Як називається пара кутів i, j (номери 1–8); null — якщо особливої назви немає. */
export function vydPary(i: number, j: number): VydPary | null {
  if (i === j) return null;
  const odnaPriama = (i <= 4) === (j <= 4);
  if (odnaPriama) return vhori(i) !== vhori(j) && pravoruch(i) !== pravoruch(j) ? 'вертикальні' : 'суміжні';
  if (chvert(i) === chvert(j)) return 'відповідні';
  const rizniBoky = pravoruch(i) !== pravoruch(j);
  if (vnutrishnii(i) && vnutrishnii(j)) return rizniBoky ? 'внутрішні різносторонні' : 'внутрішні односторонні';
  if (!vnutrishnii(i) && !vnutrishnii(j)) return rizniBoky ? 'зовнішні різносторонні' : 'зовнішні односторонні';
  return null;
}

/** Величина кута k, якщо січна утворює з прямою a кут `kut` (кут 2), а пряма b повернута на `nakhyl` градусів. */
export function velychyna(k: number, kut: number, nakhyl = 0) {
  const g = k <= 4 ? kut : kut - nakhyl;
  return chvert(k) === 1 || chvert(k) === 2 ? g : 180 - g;
}

export interface SichnaOpts {
  /** Кут між січною і прямою a (кут 2), у градусах. */
  kut?: number;
  /** На скільки градусів повернута пряма b; 0 — прямі паралельні. */
  nakhyl?: number;
  /** Які кути зафарбувати: перший — синім, другий — помаранчевим, решта — зеленим. */
  vydilyty?: number[];
  /** Підписи біля кутів: «70°» або «?». */
  pidpysy?: Partial<Record<number, string>>;
  /** Писати номери кутів 1–8. */
  nomery?: boolean;
  /** Позначити паралельність стрілками на прямих. */
  strilky?: boolean;
}

/** Дві прямі a і b і січна c. Повертає SVG-рядок (його вставляє і компонент Sichna, і тренажер). */
export function sichna({ kut = 60, nakhyl = 0, vydilyty = [], pidpysy = {}, nomery = true, strilky = false }: SichnaOpts = {}) {
  const W = 300;
  const H = 230;
  const [ya, yb] = [72, 162];
  const dx = (yb - ya) / Math.tan(rad(kut));
  const A = [W / 2 + dx / 2, ya];
  const B = [W / 2 - dx / 2, yb];
  const KOLORY = ['var(--ill-1)', 'var(--ill-2)', 'var(--ill-3)'];
  const pryama = (P: number[], g: number, l1: number, l2: number) =>
    `<line x1="${f(P[0] - l1 * Math.cos(rad(g)))}" y1="${f(P[1] + l1 * Math.sin(rad(g)))}" x2="${f(P[0] + l2 * Math.cos(rad(g)))}" y2="${f(P[1] - l2 * Math.sin(rad(g)))}" stroke="var(--ill-ink)" stroke-width="2.5" stroke-linecap="round"/>`;
  // Межі кута k: [від, до] у градусах, проти годинникової стрілки.
  const mezhi = (k: number): [number, number] => {
    const t = k <= 4 ? 0 : nakhyl;
    return [
      [kut, t + 180],
      [t, kut],
      [t + 180, kut + 180],
      [kut + 180, t + 360],
    ][chvert(k)] as [number, number];
  };
  const vershyna = (k: number) => (k <= 4 ? A : B);
  const sektory = vydilyty
    .map((k, i) => {
      const [g1, g2] = mezhi(k);
      const [ox, oy] = vershyna(k);
      return `<path d="${sektor(ox, oy, g1, g2, 26)}" fill="${KOLORY[Math.min(i, 2)]}" fill-opacity="0.25" stroke="${KOLORY[Math.min(i, 2)]}" stroke-width="2"/>`;
    })
    .join('');
  const pidpysyKutiv = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((k) => {
      const [g1, g2] = mezhi(k);
      const [ox, oy] = vershyna(k);
      const g = (g1 + g2) / 2;
      const vuzkyi = g2 - g1 < 50;
      const i = vydilyty.indexOf(k);
      const kolir = i >= 0 ? KOLORY[Math.min(i, 2)] : 'var(--ill-ink)';
      let s = '';
      if (nomery) {
        const r = vuzkyi ? 36 : 16;
        s += tekst(ox + r * Math.cos(rad(g)), oy - r * Math.sin(rad(g)), String(k), kolir, 12);
      }
      const p = pidpysy[k];
      if (p) {
        const r = vuzkyi ? 62 : 44;
        s += tekst(ox + r * Math.cos(rad(g)), oy - r * Math.sin(rad(g)), p, i >= 0 ? kolir : 'var(--ill-accent)', 14);
      }
      return s;
    })
    .join('');
  const strilka = (x: number, y: number, g: number) =>
    `<path d="M ${f(x - 7 * Math.cos(rad(g - 30)))} ${f(y + 7 * Math.sin(rad(g - 30)))} L ${f(x)} ${f(y)} L ${f(x - 7 * Math.cos(rad(g + 30)))} ${f(y + 7 * Math.sin(rad(g + 30)))}" fill="none" stroke="var(--ill-ink)" stroke-width="2"/>`;
  const vidomi = Object.entries(pidpysy)
    .filter(([, p]) => p && p !== '?')
    .map(([k, p]) => `кут ${k} — ${p}`);
  const opys =
    `Прямі a і b${nakhyl === 0 && strilky ? ' паралельні' : ''} і січна c, кути пронумеровано від 1 до 8` + (vidomi.length ? `; ${vidomi.join(', ')}` : '');
  return (
    `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys}">` +
    sektory +
    pryama(A, 0, A[0] - 12, W - 12 - A[0]) +
    pryama(B, nakhyl, (B[0] - 12) / Math.cos(rad(nakhyl)), (W - 12 - B[0]) / Math.cos(rad(nakhyl))) +
    pryama(A, kut, (yb - ya) / Math.sin(rad(kut)) + 48, 48) +
    `<circle cx="${f(A[0])}" cy="${f(A[1])}" r="3" fill="var(--ill-ink)"/><circle cx="${f(B[0])}" cy="${f(B[1])}" r="3" fill="var(--ill-ink)"/>` +
    (strilky ? strilka(W - 40, ya, 0) + strilka(W - 40, yb - (W - 40 - B[0]) * Math.tan(rad(nakhyl)), nakhyl) : '') +
    `<text x="${W - 14}" y="${ya - 10}" font-size="14" font-style="italic" font-weight="700" fill="var(--ill-ink)" text-anchor="end">a</text>` +
    `<text x="${W - 14}" y="${f(yb - (W - 14 - B[0]) * Math.tan(rad(nakhyl)) - 10)}" font-size="14" font-style="italic" font-weight="700" fill="var(--ill-ink)" text-anchor="end">b</text>` +
    `<text x="${f(A[0] + 48 * Math.cos(rad(kut)) + 10)}" y="${f(A[1] - 48 * Math.sin(rad(kut)) + 4)}" font-size="14" font-style="italic" font-weight="700" fill="var(--ill-ink)">c</text>` +
    pidpysyKutiv +
    `</svg>`
  );
}
