// Кути без градусів для 2 класу: два промені зі спільним початком (вершиною), букви з вершиною посередині назви,
// модель прямого кута з паперу (пунктирний куточок, прикладений до вершини), квадратик прямого кута і підписи
// «менший від прямого / прямий / більший за прямий». Кут можна повернути: прямий кут лишається прямим.
// Повертає SVG-рядок: його вставляють і компонент PriamyiKut, і тренажер 2 класу (поле `malunok`).
// Файл не є генератором: генератори лежать у `<N>-klas/`.

export interface KutyOpts {
  /** Величини кутів у градусах (від 20 до 160). Градусів на малюнку немає — лише промені. */
  kuty: number[];
  /** Назви кутів, вершина — середня буква: 'ABC' — A на одній стороні, B — вершина, C — на другій. */
  nazvy?: string[];
  /** На скільки градусів повернути кожен кут (проти годинникової стрілки). */
  povoroty?: number[];
  /** Прикласти до кожного кута модель прямого кута (пунктирний куточок). */
  model?: boolean;
  /** Без підписів виду кута і без квадратика прямого кута — для задач. */
  bez_nazv?: boolean;
  /** Підписати вершину і сторони кута (для одного кута). */
  chastyny?: boolean;
  /** Свій опис для читача з екрана (aria-label), якщо стандартний видає відповідь. */
  opys?: string;
}

type P = [number, number];
const f = (v: number) => v.toFixed(1);
const rad = (g: number) => (g * Math.PI) / 180;
const pt = (v: P, kut: number, r: number): P => [v[0] + r * Math.cos(rad(kut)), v[1] - r * Math.sin(rad(kut))];

export const vydKuta = (g: number) => (g === 90 ? 'прямий' : g < 90 ? 'менший від прямого' : 'більший за прямий');

function tekst(p: P, t: string, o: { k?: string; rozmir?: number; kursyv?: boolean; vaha?: number; anchor?: string } = {}) {
  return `<text x="${f(p[0])}" y="${f(p[1])}" font-size="${o.rozmir ?? 14}" font-weight="${o.vaha ?? 700}"${o.kursyv ? ' font-style="italic"' : ''} fill="${o.k ?? 'var(--ill-ink)'}" text-anchor="${o.anchor ?? 'middle'}" dominant-baseline="central">${t}</text>`;
}

/** Один кут у власних координатах (вершина в 0, 0): що намалювати і де його межі. */
function odynKut(g: number, i: number, o: KutyOpts) {
  const r = o.chastyny ? 96 : 58;
  const pov = o.povoroty?.[i] ?? 0;
  const V: P = [0, 0];
  const [a1, a2] = [pov, pov + g]; // напрямки сторін
  const A = pt(V, a2, r);
  const C = pt(V, a1, r);
  const nazva = o.nazvy?.[i];
  const tochky: P[] = [V, A, C];
  let s = '';
  if (o.model) {
    const m = 40;
    const kv: P[] = [V, pt(V, a1, m), pt(pt(V, a1, m), a1 + 90, m), pt(V, a1 + 90, m)];
    s += `<path d="M ${kv.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L ')} Z" fill="var(--ill-4)" fill-opacity="0.14" stroke="var(--ill-4)" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    tochky.push(...kv);
  }
  // Дуга кута (або квадратик, якщо кут прямий і підписи видно).
  if (g === 90 && !o.bez_nazv) {
    const q = 13;
    const [p1, p3] = [pt(V, a1, q), pt(V, a2, q)];
    const p2: P = [p1[0] + p3[0], p1[1] + p3[1]];
    s += `<path d="M ${f(p1[0])} ${f(p1[1])} L ${f(p2[0])} ${f(p2[1])} L ${f(p3[0])} ${f(p3[1])}" fill="none" stroke="var(--ill-2)" stroke-width="2"/>`;
  } else {
    const d = 20;
    const [p1, p2] = [pt(V, a1, d), pt(V, a2, d)];
    s += `<path d="M 0 0 L ${f(p1[0])} ${f(p1[1])} A ${d} ${d} 0 0 0 ${f(p2[0])} ${f(p2[1])} Z" fill="var(--ill-2)" fill-opacity="0.22" stroke="none"/>`;
    s += `<path d="M ${f(p1[0])} ${f(p1[1])} A ${d} ${d} 0 0 0 ${f(p2[0])} ${f(p2[1])}" fill="none" stroke="var(--ill-2)" stroke-width="2"/>`;
  }
  for (const K of [A, C]) s += `<line x1="0" y1="0" x2="${f(K[0])}" y2="${f(K[1])}" stroke="var(--ill-1)" stroke-width="2.8" stroke-linecap="round"/>`;
  s += `<circle cx="0" cy="0" r="3.5" fill="var(--ill-ink)"/>`;
  for (const K of [A, C]) s += `<circle cx="${f(K[0])}" cy="${f(K[1])}" r="3" fill="var(--ill-ink)"/>`;
  if (nazva) {
    const [b1, b2, b3] = [...nazva];
    // Букви на сторонах — за кінцем променя, вершина — навпроти кута.
    const LA = pt(V, a2, r + 13);
    const LC = pt(V, a1, r + 13);
    const LV = pt(V, pov + g / 2 + 180, 15);
    s += tekst(LA, b1, { kursyv: true, rozmir: 15 }) + tekst(LC, b3, { kursyv: true, rozmir: 15 }) + tekst(LV, b2, { kursyv: true, rozmir: 15 });
    tochky.push(...[LA, LC, LV].map((p): P => [p[0], p[1]]));
  }
  if (o.chastyny) {
    // «вершина» — під вершиною, «сторона» — біля середини кожного променя, назовні від кута.
    const pv: P = [-6, 34];
    s += tekst(pv, 'вершина', { k: 'var(--ill-2)', rozmir: 13 });
    tochky.push([pv[0] - 28, pv[1] + 8], [pv[0] + 28, pv[1] + 8]);
    const sA = pt(pt(V, a2, r * 0.55), a2 + 90, 15);
    const sC = pt(pt(V, a1, r * 0.55), a1 - 90, 14);
    s += tekst(sA, 'сторона', { k: 'var(--ill-1)', rozmir: 13, anchor: 'end' }) + tekst(sC, 'сторона', { k: 'var(--ill-1)', rozmir: 13 });
    tochky.push([sA[0] - 52, sA[1]], [sC[0] - 26, sC[1] + 8], [sC[0] + 26, sC[1] + 8]);
  }
  const xs = tochky.map((p) => p[0]);
  const ys = tochky.map((p) => p[1]);
  return { s, x0: Math.min(...xs) - 7, x1: Math.max(...xs) + 7, y0: Math.min(...ys) - 10, y1: Math.max(...ys) + 8 };
}

export function kutyBezHradusiv(o: KutyOpts) {
  const maxW = 340;
  const pidpys = !o.bez_nazv && !o.chastyny;
  const rozmiry = o.kuty.map((g, i) => {
    const k = odynKut(g, i, o);
    const ryadky = g === 90 ? ['прямий'] : g < 90 ? ['менший', 'від прямого'] : ['більший', 'за прямий'];
    const w = Math.max(k.x1 - k.x0, pidpys ? 84 : 0);
    return { ...k, w, ryadky };
  });
  // Розкладаємо кути в рядки шириною до maxW.
  const ryady: (typeof rozmiry)[] = [];
  for (const k of rozmiry) {
    const ost = ryady[ryady.length - 1];
    if (ost && ost.reduce((s, x) => s + x.w, 0) + k.w <= maxW) ost.push(k);
    else ryady.push([k]);
  }
  let tilo = '';
  let y = 0;
  let W = 0;
  for (const ryad of ryady) {
    const verkh = Math.min(...ryad.map((k) => k.y0));
    const nyz = Math.max(...ryad.map((k) => k.y1));
    let x = 0;
    for (const k of ryad) {
      const dx = x + (k.w - (k.x1 - k.x0)) / 2 - k.x0;
      const dy = y - verkh;
      tilo += `<g transform="translate(${f(dx)} ${f(dy)})">${k.s}</g>`;
      if (pidpys) {
        k.ryadky.forEach((t, j) => {
          tilo += tekst([x + k.w / 2, y + nyz - verkh + 10 + j * 15], t, { k: 'var(--ill-2)', rozmir: 12, vaha: 600 });
        });
      }
      x += k.w;
    }
    W = Math.max(W, x);
    y += nyz - verkh + (pidpys ? 38 : 4);
  }
  const H = Math.ceil(y);
  const nazvy = o.nazvy?.length ? ` ${o.nazvy.join(', ')}` : '';
  const opys = o.opys
    ? o.opys
    : o.bez_nazv
    ? `${o.kuty.length > 1 ? 'Кути' : 'Кут'}${nazvy}${o.model ? ' і модель прямого кута' : ''}`
    : `${o.kuty.length > 1 ? 'Кути' : 'Кут'}${nazvy}: ${o.kuty.map(vydKuta).join(', ')}${o.model ? '; до вершини прикладено модель прямого кута' : ''}`;
  return `<svg viewBox="0 0 ${Math.ceil(W)} ${H}" width="${Math.ceil(W)}" height="${H}" role="img" aria-label="${opys}">${tilo}</svg>`;
}
