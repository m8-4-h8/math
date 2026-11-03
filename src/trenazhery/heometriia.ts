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
