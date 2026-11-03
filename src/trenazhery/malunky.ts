// Малюнки для завдань тренажера (SVG-рядок у полі `malunok`). Кольори — змінні --ill-*, як в ілюстраціях тем,
// тож малюнки однаково видно у світлій і темній темі. Файл не є генератором: генератори лежать у `<N>-klas/`.

/** Смужка, поділена на `d` рівних частин, з них `n` зафарбовано. Якщо n > d — кілька смужок (неправильний дріб). */
export function smuzhka(n: number, d: number) {
  const kilkist = Math.max(1, Math.ceil(n / d));
  const W = 300;
  const h = 34;
  const krok = 12;
  const H = kilkist * h + (kilkist - 1) * krok + 4;
  const w = (W - 4) / d;
  const ryadky = Array.from({ length: kilkist }, (_, k) => {
    const y = 2 + k * (h + krok);
    const klityny = Array.from({ length: d }, (_, i) => {
      const zafarb = k * d + i < n;
      return `<rect x="${(2 + i * w).toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" fill="${zafarb ? 'var(--ill-1)' : 'var(--ill-paper)'}" stroke="var(--ill-ink)" stroke-width="1.5"/>`;
    }).join('');
    return klityny;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Смужка, поділена на рівні частини">${ryadky}</svg>`;
}

export interface TochkaPromenia {
  nazva: string;
  /** Номер поділки, на якій стоїть точка. */
  podilka: number;
}

/**
 * Координатний промінь: `dovzhyna` поділок, підписи під кожною `pidpysy`-ю поділкою текстом із `pidpys(i)`.
 * Точки ставимо на поділки. Як у компоненті KoordynatnyiPromin, але без Astro.
 */
export function promin(dovzhyna: number, pidpysy: number, pidpys: (i: number) => string, tochky: TochkaPromenia[]) {
  const pod = Math.max(22, Math.min(48, 300 / dovzhyna));
  const x0 = 20;
  const W = x0 + pod * dovzhyna + 34;
  const y = 52;
  const H = 92;
  const rysky = Array.from({ length: dovzhyna + 1 }, (_, i) => {
    const velyka = i % pidpysy === 0;
    const x = x0 + i * pod;
    return (
      `<line x1="${x}" y1="${y - (velyka ? 9 : 5)}" x2="${x}" y2="${y + (velyka ? 9 : 5)}" stroke="var(--ill-ink)" stroke-width="${velyka ? 2 : 1.2}"/>` +
      (velyka ? `<text x="${x}" y="${y + 27}" text-anchor="middle" font-size="13" fill="var(--ill-muted)">${pidpys(i)}</text>` : '')
    );
  }).join('');
  const t = tochky
    .map(
      (tt, i) =>
        `<circle cx="${x0 + tt.podilka * pod}" cy="${y}" r="6" fill="var(--ill-${(i % 3) + 2})"/>` +
        `<text x="${x0 + tt.podilka * pod}" y="${y - 16}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ill-${(i % 3) + 2})">${tt.nazva}</text>`,
    )
    .join('');
  return (
    `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Координатний промінь з точками ${tochky.map((tt) => tt.nazva).join(', ')}">` +
    `<line x1="${x0}" y1="${y}" x2="${W - 8}" y2="${y}" stroke="var(--ill-ink)" stroke-width="2.5"/>` +
    `<path d="M ${W - 8} ${y} l -12 -6 v 12 z" fill="var(--ill-ink)"/>${rysky}${t}</svg>`
  );
}

/** Стовпчаста діаграма: підписи стовпчиків, значення, крок сітки. */
export function diahrama(stovpchyky: [string, number][], krokSitky: number, odynytsi = '') {
  const max = Math.ceil(Math.max(...stovpchyky.map(([, v]) => v)) / krokSitky) * krokSitky;
  const lini = max / krokSitky;
  const H = 210;
  const verkh = 14;
  const nyz = 34;
  const x0 = 46;
  const shyryna = 44;
  const promizhok = 18;
  const W = x0 + stovpchyky.length * (shyryna + promizhok) + 8;
  const yV = (v: number) => H - nyz - ((H - nyz - verkh) * v) / max;
  const sitka = Array.from({ length: lini + 1 }, (_, i) => {
    const v = i * krokSitky;
    return (
      `<line x1="${x0}" y1="${yV(v)}" x2="${W - 4}" y2="${yV(v)}" stroke="var(--ill-line)" stroke-width="${i === 0 ? 2 : 1}" ${i === 0 ? '' : 'stroke-dasharray="3 3"'}/>` +
      `<text x="${x0 - 6}" y="${yV(v) + 4}" text-anchor="end" font-size="12" fill="var(--ill-muted)">${v}</text>`
    );
  }).join('');
  const stovpy = stovpchyky
    .map(([nazva, v], i) => {
      const x = x0 + promizhok / 2 + i * (shyryna + promizhok);
      return (
        `<rect x="${x}" y="${yV(v)}" width="${shyryna}" height="${yV(0) - yV(v)}" rx="3" fill="var(--ill-${(i % 4) + 1})"/>` +
        `<text x="${x + shyryna / 2}" y="${H - nyz + 18}" text-anchor="middle" font-size="12" fill="var(--ill-ink)">${nazva}</text>`
      );
    })
    .join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Стовпчаста діаграма${odynytsi ? ', ' + odynytsi : ''}">${sitka}${stovpy}</svg>`;
}

/** Кут з вершиною O: одна сторона горизонтально вправо, друга — під кутом `gradusy` проти годинникової стрілки. */
export function kut(gradusy: number, pidpys = '') {
  const W = 220;
  const H = 130;
  const ox = gradusy > 100 ? 130 : 40;
  const oy = gradusy > 170 ? 70 : 110;
  const r = 85;
  const rad = (gradusy * Math.PI) / 180;
  const x2 = ox + r * Math.cos(rad);
  const y2 = oy - r * Math.sin(rad);
  const d = 26;
  const duga =
    gradusy === 90
      ? `<path d="M ${ox + 16} ${oy} V ${oy - 16} H ${ox}" fill="none" stroke="var(--ill-2)" stroke-width="2"/>`
      : `<path d="M ${ox + d} ${oy} A ${d} ${d} 0 ${gradusy > 180 ? 1 : 0} 0 ${(ox + d * Math.cos(rad)).toFixed(1)} ${(oy - d * Math.sin(rad)).toFixed(1)}" fill="none" stroke="var(--ill-2)" stroke-width="2"/>`;
  return (
    `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Кут">` +
    `<line x1="${ox}" y1="${oy}" x2="${Math.min(W - 6, ox + r)}" y2="${oy}" stroke="var(--ill-ink)" stroke-width="2.5" stroke-linecap="round"/>` +
    `<line x1="${ox}" y1="${oy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--ill-ink)" stroke-width="2.5" stroke-linecap="round"/>` +
    `${duga}<circle cx="${ox}" cy="${oy}" r="3.5" fill="var(--ill-ink)"/>` +
    (pidpys ? `<text x="${ox + 34}" y="${oy - 10}" font-size="13" fill="var(--ill-2)">${pidpys}</text>` : '') +
    `</svg>`
  );
}
