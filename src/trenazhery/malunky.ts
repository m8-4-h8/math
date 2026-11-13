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

export interface TochkaPloshchyny {
  nazva: string;
  x: number;
  y: number;
}

/**
 * Координатна площина від −m до m по обох осях: сітка, осі зі стрілками, числа на осях, точки з назвами.
 * Координати точок не підписуємо — їх треба прочитати.
 */
export function ploshchyna(tochky: TochkaPloshchyny[], m = 5) {
  const k = 24;
  const W = (2 * m + 2) * k;
  const c = W / 2;
  const X = (x: number) => c + x * k;
  const Y = (y: number) => c - y * k;
  const sitka = Array.from({ length: 2 * m + 1 }, (_, i) => {
    const v = i - m;
    return (
      `<line x1="${X(v)}" y1="${Y(m)}" x2="${X(v)}" y2="${Y(-m)}" stroke="var(--ill-line)" stroke-width="0.6" opacity="0.6"/>` +
      `<line x1="${X(-m)}" y1="${Y(v)}" x2="${X(m)}" y2="${Y(v)}" stroke="var(--ill-line)" stroke-width="0.6" opacity="0.6"/>` +
      (v !== 0
        ? `<text x="${X(v)}" y="${c + 14}" text-anchor="middle" font-size="10" fill="var(--ill-muted)">${v < 0 ? '−' + -v : v}</text>` +
          `<text x="${c - 5}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10" fill="var(--ill-muted)">${v < 0 ? '−' + -v : v}</text>`
        : '')
    );
  }).join('');
  const osi =
    `<line x1="4" y1="${c}" x2="${W - 6}" y2="${c}" stroke="var(--ill-ink)" stroke-width="1.8"/>` +
    `<path d="M ${W - 4} ${c} l -8 -4 v 8 z" fill="var(--ill-ink)"/>` +
    `<line x1="${c}" y1="${W - 4}" x2="${c}" y2="6" stroke="var(--ill-ink)" stroke-width="1.8"/>` +
    `<path d="M ${c} 4 l -4 8 h 8 z" fill="var(--ill-ink)"/>` +
    `<text x="${W - 10}" y="${c - 8}" font-size="13" font-style="italic" fill="var(--ill-ink)">x</text>` +
    `<text x="${c + 8}" y="14" font-size="13" font-style="italic" fill="var(--ill-ink)">y</text>` +
    `<text x="${c - 5}" y="${c + 14}" text-anchor="end" font-size="10" fill="var(--ill-muted)">0</text>`;
  const t = tochky
    .map(
      (tt, i) =>
        `<circle cx="${X(tt.x)}" cy="${Y(tt.y)}" r="5" fill="var(--ill-${(i % 3) + 2})"/>` +
        `<text x="${X(tt.x) + 7}" y="${Y(tt.y) - 7}" font-size="14" font-weight="700" fill="var(--ill-${(i % 3) + 2})">${tt.nazva}</text>`,
    )
    .join('');
  return `<svg viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="Координатна площина з точками ${tochky.map((tt) => tt.nazva).join(', ')}">${sitka}${osi}${t}</svg>`;
}

export interface Hrafik {
  /** Вузли ламаної (x; y), x — зростають. Перший x — зазвичай 0. */
  tochky: [number, number][];
  /** Крок клітинки по осях (в одиницях величин). */
  krokX: number;
  krokY: number;
  /** Підписи осей: «t, год», «T, °C». */
  osX: string;
  osY: string;
  /** Пунктир «читання» графіка: від x до графіка й до осі y, або горизонталь на рівні y. */
  chytaty?: { x?: number; y?: number };
}

/** Значення ламаної в точці x (лінійно між вузлами). */
export function hrafikY(tochky: [number, number][], x: number) {
  for (let i = 1; i < tochky.length; i++) {
    const [x1, y1] = tochky[i - 1];
    const [x2, y2] = tochky[i];
    if (x >= x1 && x <= x2) return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
  }
  return NaN;
}

/** Графік залежності: сітка, осі з підписами, ламана через точки. Від'ємні y — нижче осі x. */
export function hrafik({ tochky, krokX, krokY, osX, osY, chytaty }: Hrafik) {
  const xs = tochky.map((p) => p[0]);
  const ys = tochky.map((p) => p[1]);
  const xMin = Math.min(0, ...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(0, Math.floor(Math.min(...ys) / krokY) * krokY);
  const yMax = Math.max(krokY, Math.ceil(Math.max(...ys) / krokY) * krokY);
  const nx = Math.round((xMax - xMin) / krokX);
  const ny = Math.round((yMax - yMin) / krokY);
  const kx = Math.min(30, 420 / nx);
  const ky = Math.min(24, 250 / ny);
  const [livo, verkh, pravo, nyz] = [38, 24, 54, 22];
  const W = livo + nx * kx + pravo;
  const H = verkh + ny * ky + nyz;
  const X = (x: number) => livo + ((x - xMin) / krokX) * kx;
  const Y = (y: number) => verkh + ((yMax - y) / krokY) * ky;
  const zn = (v: number) => (v < 0 ? `−${String(-v).replace('.', ',')}` : String(v).replace('.', ','));
  const kozhnyiX = nx > 14 ? 2 : 1;
  const kozhnyiY = ny > 14 ? 2 : 1;
  let sitka = '';
  for (let i = 0; i <= nx; i++) {
    const v = xMin + i * krokX;
    sitka += `<line x1="${X(v)}" y1="${Y(yMax)}" x2="${X(v)}" y2="${Y(yMin)}" stroke="var(--ill-line)" stroke-width="0.6" opacity="0.6"/>`;
    if (v !== 0 && i % kozhnyiX === 0) sitka += `<text x="${X(v)}" y="${Y(0) + 14}" text-anchor="middle" font-size="10" fill="var(--ill-muted)">${zn(v)}</text>`;
  }
  for (let j = 0; j <= ny; j++) {
    const v = yMin + j * krokY;
    sitka += `<line x1="${X(xMin)}" y1="${Y(v)}" x2="${X(xMax)}" y2="${Y(v)}" stroke="var(--ill-line)" stroke-width="0.6" opacity="0.6"/>`;
    if (v !== 0 && j % kozhnyiY === 0) sitka += `<text x="${X(0) - 5}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10" fill="var(--ill-muted)">${zn(v)}</text>`;
  }
  const osi =
    `<line x1="${X(xMin)}" y1="${Y(0)}" x2="${X(xMax) + 22}" y2="${Y(0)}" stroke="var(--ill-ink)" stroke-width="1.8"/>` +
    `<path d="M ${X(xMax) + 24} ${Y(0)} l -8 -4 v 8 z" fill="var(--ill-ink)"/>` +
    `<line x1="${X(0)}" y1="${Y(yMin)}" x2="${X(0)}" y2="${Y(yMax) - 16}" stroke="var(--ill-ink)" stroke-width="1.8"/>` +
    `<path d="M ${X(0)} ${Y(yMax) - 18} l -4 8 h 8 z" fill="var(--ill-ink)"/>` +
    `<text x="${X(xMax) + 4}" y="${Y(0) - 8}" font-size="12" font-style="italic" fill="var(--ill-ink)">${osX}</text>` +
    `<text x="${X(0) + 8}" y="${Y(yMax) - 8}" font-size="12" font-style="italic" fill="var(--ill-ink)">${osY}</text>` +
    `<text x="${X(0) - 5}" y="${Y(0) + 14}" text-anchor="end" font-size="10" fill="var(--ill-muted)">0</text>`;
  let chyt = '';
  if (chytaty?.x !== undefined) {
    const y = hrafikY(tochky, chytaty.x);
    chyt +=
      `<path d="M ${X(chytaty.x)} ${Y(0)} V ${Y(y)} H ${X(0)}" fill="none" stroke="var(--ill-1)" stroke-width="1.8" stroke-dasharray="5 4"/>` +
      `<circle cx="${X(chytaty.x)}" cy="${Y(y)}" r="5" fill="var(--ill-1)"/>`;
  }
  if (chytaty?.y !== undefined) {
    // Де графік перетинає рівень y. Одна точка — пунктир до неї і вниз на вісь; кілька — лінія через увесь графік.
    const yy = chytaty.y;
    const perety = new Set<number>();
    for (let i = 1; i < tochky.length; i++) {
      const [[x1, y1], [x2, y2]] = [tochky[i - 1], tochky[i]];
      if ((y1 - yy) * (y2 - yy) <= 0 && y1 !== y2) perety.add(x1 + ((yy - y1) / (y2 - y1)) * (x2 - x1));
      else if (y1 === yy) perety.add(x1);
    }
    if (tochky.at(-1)?.[1] === yy) perety.add(tochky.at(-1)![0]);
    const [xp] = [...perety];
    chyt +=
      perety.size === 1
        ? `<path d="M ${X(0)} ${Y(yy)} H ${X(xp)} V ${Y(0)}" fill="none" stroke="var(--ill-1)" stroke-width="1.8" stroke-dasharray="5 4"/>` +
          `<circle cx="${X(xp)}" cy="${Y(yy)}" r="5" fill="var(--ill-1)"/>`
        : `<line x1="${X(0)}" y1="${Y(yy)}" x2="${X(xMax)}" y2="${Y(yy)}" stroke="var(--ill-1)" stroke-width="1.8" stroke-dasharray="5 4"/>`;
  }
  const liniia = `<polyline points="${tochky.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" fill="none" stroke="var(--ill-4)" stroke-width="2.6" stroke-linejoin="round"/>`;
  const krapky = tochky.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="3.2" fill="var(--ill-4)"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Графік залежності: по горизонталі ${osX}, по вертикалі ${osY}">${sitka}${osi}${liniia}${krapky}${chyt}</svg>`;
}
