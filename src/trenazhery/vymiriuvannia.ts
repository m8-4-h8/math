// Малюнки для величин 1 класу: лінійка з відрізком (сантиметри, дужка «1 дм»), метр з десяти дециметрів, терези з
// гирями (кілограми), банки по 1 л, з яких наповнюють посудину (літри), і гроші — купюри й монети (гривні, копійки).
// Повертають SVG-рядок: його вставляють і компоненти Liniika, Metr, Terezy, Banky, Hroshi, і тренажери 1 класу
// (поле `malunok`). Кольори — лише var(--ill-*). Файл не є генератором: генератори лежать у `<N>-klas/`.

const f = (v: number) => (Math.round(v * 10) / 10).toString();

function tekst(x: number, y: number, t: string, o: { k?: string; rozmir?: number; vaha?: number } = {}) {
  return `<text x="${f(x)}" y="${f(y)}" font-size="${o.rozmir ?? 13}" font-weight="${o.vaha ?? 700}" fill="${o.k ?? 'var(--ill-ink)'}" text-anchor="middle" dominant-baseline="central">${t}</text>`;
}

// ——— Лінійка ———

export interface LiniikaOpts {
  /** Довжина відрізка, см. */
  dovzhyna: number;
  /** Штрих лінійки, від якого починається відрізок (0 — правильно прикладена лінійка). */
  pochatok?: number;
  /** Букви кінців відрізка. */
  bukvy?: [string, string];
  /** Точки на відрізку: скільки сантиметрів від його початку. */
  tochky?: { nazva: string; cm: number }[];
  /** Скільки сантиметрів на лінійці (типово — до кінця відрізка і ще 1, не менше 10, не більше 15). */
  do?: number;
  /** Дужка під лінійкою від 0 до 10: «1 дм = 10 см». */
  detsymetr?: boolean;
  /** Опис для читача з екрана; типово — лише назва відрізка, без довжини. */
  opys?: string;
}

export function liniika(o: LiniikaOpts): string {
  const p = o.pochatok ?? 0;
  const d = o.dovzhyna;
  const [A, B] = o.bukvy ?? ['A', 'B'];
  const N = Math.min(15, o.do ?? Math.max(10, p + d + 1));
  if (p + d > N) throw new Error(`liniika: відрізок ${p}…${p + d} не вміщується на лінійці до ${N} см`);
  const W = 340;
  const x0 = 22;
  const k = (W - x0 - 38) / N; // праворуч — поле для «см»
  const X = (cm: number) => x0 + cm * k;
  const yV = 26; // відрізок
  const y1 = 48; // верх лінійки
  const y2 = 96; // низ лінійки
  if (o.detsymetr && N < 10) throw new Error('liniika: для дужки «1 дм» лінійка має бути не коротша за 10 см');
  const H = o.detsymetr ? 136 : 102;
  const ch: string[] = [];
  // Корпус лінійки з полями перед нулем і після останнього числа.
  ch.push(`<rect x="${f(x0 - 14)}" y="${y1}" width="${f(N * k + 36)}" height="${y2 - y1}" rx="3" fill="var(--ill-3)" fill-opacity="0.16" stroke="var(--ill-line)" stroke-width="1.5"/>`);
  for (let i = 0; i <= N; i++) {
    const dl = i % 5 === 0 ? 17 : 13;
    ch.push(`<line x1="${f(X(i))}" y1="${y1}" x2="${f(X(i))}" y2="${y1 + dl}" stroke="var(--ill-ink)" stroke-width="1.3"/>`);
    ch.push(tekst(X(i), y1 + 28, String(i), { rozmir: N > 12 ? 12 : 13, vaha: 600 }));
    if (i < N && k >= 18) ch.push(`<line x1="${f(X(i + 0.5))}" y1="${y1}" x2="${f(X(i + 0.5))}" y2="${y1 + 7}" stroke="var(--ill-muted)" stroke-width="1"/>`);
  }
  ch.push(tekst(X(N) + 11, y2 - 9, 'см', { rozmir: 10, vaha: 600, k: 'var(--ill-muted)' }));
  // Відрізок над лінійкою і пунктири від кінців до штрихів.
  const [xa, xb] = [X(p), X(p + d)];
  for (const x of [xa, xb]) ch.push(`<line x1="${f(x)}" y1="${yV}" x2="${f(x)}" y2="${y1}" stroke="var(--ill-muted)" stroke-width="1" stroke-dasharray="3 3"/>`);
  ch.push(`<line x1="${f(xa)}" y1="${yV}" x2="${f(xb)}" y2="${yV}" stroke="var(--ill-1)" stroke-width="3" stroke-linecap="round"/>`);
  const tochky = [{ nazva: A, cm: 0 }, ...(o.tochky ?? []), { nazva: B, cm: d }];
  for (const t of tochky) {
    const x = X(p + t.cm);
    ch.push(`<circle cx="${f(x)}" cy="${yV}" r="3.5" fill="var(--ill-1)"/>`);
    ch.push(tekst(x, yV - 14, t.nazva, { rozmir: 13 }));
  }
  if (o.detsymetr) {
    // Фігурна дужка під лінійкою від 0 до 10 см.
    const [a, b, y] = [X(0), X(10), y2 + 5];
    const m = (a + b) / 2;
    ch.push(`<path d="M ${f(a)} ${y} q 0 8 8 8 H ${f(m - 8)} q 8 0 8 8 q 0 -8 8 -8 H ${f(b - 8)} q 8 0 8 -8" fill="none" stroke="var(--ill-2)" stroke-width="2" stroke-linejoin="round"/>`);
    ch.push(tekst(m, y + 26, '1 дм = 10 см', { rozmir: 13, k: 'var(--ill-2)' }));
  }
  const opys = o.opys ?? `Лінійка і відрізок ${tochky.map((t) => t.nazva).join('')} над нею${o.detsymetr ? '; дужка від 0 до 10 — 1 дециметр' : ''}`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys}">${ch.join('')}</svg>`;
}

// ——— Метр ———

export interface MetrOpts {
  /** Скільки дециметрів від початку виділити кольором (0–10). */
  vydilyty?: number;
  /** Не підписувати сантиметри під смужкою (для задач). */
  bez_chysel?: boolean;
  opys?: string;
}

export function metr(o: MetrOpts = {}): string {
  const W = 340;
  const x0 = 14;
  const k = 29; // 1 дм
  const v = o.vydilyty ?? 0;
  if (v < 0 || v > 10) throw new Error(`metr: виділити можна від 0 до 10 дм, а не ${v}`);
  const y1 = 44;
  const y2 = 80;
  const H = o.bez_chysel ? 88 : 108;
  const ch: string[] = [];
  // Дужка над смужкою: увесь метр.
  const [a, b] = [x0, x0 + 10 * k];
  const m = (a + b) / 2;
  ch.push(`<path d="M ${a} ${y1 - 4} q 0 -8 8 -8 H ${m - 8} q 8 0 8 -8 q 0 8 8 8 H ${b - 8} q 8 0 8 8" fill="none" stroke="var(--ill-2)" stroke-width="2" stroke-linejoin="round"/>`);
  ch.push(tekst(m, 12, '1 м = 10 дм = 100 см', { rozmir: 13, k: 'var(--ill-2)' }));
  for (let i = 0; i < 10; i++) {
    const x = x0 + i * k;
    const kolir = v > 0 ? (i < v ? 'var(--ill-1)' : 'var(--ill-line)') : i % 2 === 0 ? 'var(--ill-1)' : 'var(--ill-3)';
    const prozorist = v > 0 ? (i < v ? 0.45 : 0.25) : 0.3;
    ch.push(`<rect x="${x}" y="${y1}" width="${k}" height="${y2 - y1}" fill="${kolir}" fill-opacity="${prozorist}" stroke="var(--ill-ink)" stroke-width="1.2"/>`);
    ch.push(tekst(x + k / 2, (y1 + y2) / 2, '1 дм', { rozmir: 10, vaha: 600 }));
  }
  if (!o.bez_chysel) {
    for (let i = 0; i <= 10; i++) {
      const x = x0 + i * k;
      ch.push(`<line x1="${x}" y1="${y2}" x2="${x}" y2="${y2 + 6}" stroke="var(--ill-ink)" stroke-width="1.2"/>`);
      ch.push(tekst(x, y2 + 16, String(i * 10), { rozmir: 10, vaha: 600 }));
    }
    ch.push(tekst(x0 + 10 * k + 22, y2 + 16, 'см', { rozmir: 10, vaha: 600, k: 'var(--ill-muted)' }));
  }
  const opys = o.opys ?? `Смужка завдовжки 1 метр, поділена на 10 дециметрів${v > 0 ? `; кольором виділено ${v} дм` : ''}`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys}">${ch.join('')}</svg>`;
}

// ——— Терези ———

/** Число — гиря (кг), рядок — предмет. */
export type Vantazh = number | string;

export interface TereziOpts {
  zliva: Vantazh[];
  sprava: Vantazh[];
  /** Яка шалька нижче (важча); типово — рівновага. */
  nakhyl?: 'rivno' | 'zliva' | 'sprava';
  opys?: string;
}

const shyryna = (v: Vantazh) => (typeof v === 'number' ? 40 : Math.max(48, v.length * 8 + 14));
const nazvaVantazhu = (v: Vantazh) => (typeof v === 'number' ? `гиря ${v} кг` : v);

export function terezy(o: TereziOpts): string {
  const W = 340;
  const H = 178;
  const cx = W / 2;
  const yP = 44; // вісь коромисла
  const L = 116;
  const nakhyl = o.nakhyl ?? 'rivno';
  const dy = nakhyl === 'zliva' ? 13 : nakhyl === 'sprava' ? -13 : 0;
  const kintsi: [number, number][] = [
    [cx - L, yP + dy],
    [cx + L, yP - dy],
  ];
  const ch: string[] = [];
  // Підставка і стійка.
  ch.push(`<path d="M ${cx - 46} 172 L ${cx + 46} 172 L ${cx + 30} 158 L ${cx - 30} 158 Z" fill="var(--ill-line)" fill-opacity="0.5" stroke="var(--ill-ink)" stroke-width="1.5"/>`);
  ch.push(`<line x1="${cx}" y1="158" x2="${cx}" y2="${yP}" stroke="var(--ill-ink)" stroke-width="3"/>`);
  ch.push(`<line x1="${kintsi[0][0]}" y1="${kintsi[0][1]}" x2="${kintsi[1][0]}" y2="${kintsi[1][1]}" stroke="var(--ill-ink)" stroke-width="3.5" stroke-linecap="round"/>`);
  ch.push(`<circle cx="${cx}" cy="${yP}" r="5" fill="var(--ill-ink)"/>`);
  [o.zliva, o.sprava].forEach((vantazhi, i) => {
    const [x, y] = kintsi[i];
    const yS = y + 64; // дно шальки
    ch.push(`<path d="M ${x} ${y} L ${x - 52} ${yS} M ${x} ${y} L ${x + 52} ${yS}" stroke="var(--ill-muted)" stroke-width="1.2"/>`);
    ch.push(`<path d="M ${x - 58} ${yS} Q ${x} ${yS + 20} ${x + 58} ${yS}" fill="var(--ill-line)" fill-opacity="0.35" stroke="var(--ill-ink)" stroke-width="2"/>`);
    const razom = vantazhi.reduce((s, v) => s + shyryna(v), 0) + 4 * (vantazhi.length - 1);
    let xx = x - razom / 2;
    for (const v of vantazhi) {
      const w = shyryna(v);
      const xc = xx + w / 2;
      const niz = yS + 8; // предмети стоять у чаші шальки
      if (typeof v === 'number') {
        ch.push(`<path d="M ${f(xc - 19)} ${niz} L ${f(xc + 19)} ${niz} L ${f(xc + 14)} ${niz - 24} L ${f(xc - 14)} ${niz - 24} Z" fill="var(--ill-ink)" fill-opacity="0.18" stroke="var(--ill-ink)" stroke-width="1.5"/>`);
        ch.push(`<path d="M ${f(xc - 6)} ${niz - 24} Q ${f(xc)} ${niz - 34} ${f(xc + 6)} ${niz - 24}" fill="none" stroke="var(--ill-ink)" stroke-width="1.5"/>`);
        ch.push(tekst(xc, niz - 12, `${v} кг`, { rozmir: 12 }));
      } else {
        ch.push(`<rect x="${f(xx)}" y="${niz - 30}" width="${f(w)}" height="30" rx="12" fill="var(--ill-2)" fill-opacity="0.35" stroke="var(--ill-2)" stroke-width="1.5"/>`);
        ch.push(tekst(xc, niz - 15, v, { rozmir: 13 }));
      }
      xx += w + 4;
    }
  });
  const stan = nakhyl === 'rivno' ? 'у рівновазі' : nakhyl === 'zliva' ? 'ліва шалька нижче' : 'права шалька нижче';
  const opys = o.opys ?? `Терези: ліворуч ${o.zliva.map(nazvaVantazhu).join(', ')}; праворуч ${o.sprava.map(nazvaVantazhu).join(', ')}; ${stan}`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys}">${ch.join('')}</svg>`;
}

// ——— Банки по 1 л ———

export interface BankyOpts {
  /** Скільки банок по 1 л вилили в посудину (до 10). */
  kilkist: number;
  /** Назва посудини під малюнком. */
  posudyna?: string;
  /** Не писати місткість на посудині (для задач). */
  bez_vidpovidi?: boolean;
  opys?: string;
}

export function banky(o: BankyOpts): string {
  const n = o.kilkist;
  if (n < 1 || n > 10) throw new Error(`banky: ${n} — лише від 1 до 10`);
  const W = 340;
  const krok = 32;
  const riadky = Math.ceil(n / 5);
  const H = Math.max(118, riadky * 50 + 40);
  const ch: string[] = [];
  const y0 = (H - 20 - riadky * 50) / 2 + 6;
  for (let i = 0; i < n; i++) {
    const x = 10 + (i % 5) * krok;
    const y = y0 + Math.floor(i / 5) * 50;
    ch.push(`<rect x="${x}" y="${y + 6}" width="26" height="36" rx="5" fill="none" stroke="var(--ill-1)" stroke-width="1.5"/>`);
    ch.push(`<rect x="${x + 2}" y="${y + 14}" width="22" height="26" rx="3" fill="var(--ill-1)" fill-opacity="0.35"/>`);
    ch.push(`<rect x="${x + 4}" y="${y}" width="18" height="6" rx="1.5" fill="var(--ill-1)" fill-opacity="0.6"/>`);
    ch.push(tekst(x + 13, y + 28, '1 л', { rozmir: 11 }));
  }
  const ym = H / 2 - 8;
  ch.push(`<path d="M 176 ${ym} H 206 M 199 ${ym - 6} L 207 ${ym} L 199 ${ym + 6}" fill="none" stroke="var(--ill-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);
  // Посудина з ручками.
  const [px, pw, py, ph] = [222, 100, ym - 40, 80];
  ch.push(`<path d="M ${px - 10} ${py + 14} h 10 M ${px + pw} ${py + 14} h 10" stroke="var(--ill-ink)" stroke-width="3" stroke-linecap="round"/>`);
  ch.push(`<rect x="${px + 3}" y="${py + 14}" width="${pw - 6}" height="${ph - 17}" rx="6" fill="var(--ill-1)" fill-opacity="0.3"/>`);
  ch.push(`<path d="M ${px} ${py} V ${py + ph - 8} Q ${px} ${py + ph} ${px + 8} ${py + ph} H ${px + pw - 8} Q ${px + pw} ${py + ph} ${px + pw} ${py + ph - 8} V ${py}" fill="none" stroke="var(--ill-ink)" stroke-width="2"/>`);
  ch.push(tekst(px + pw / 2, py + ph / 2 + 6, o.bez_vidpovidi ? '? л' : `${n} л`, { rozmir: 16, k: o.bez_vidpovidi ? 'var(--ill-4)' : 'var(--ill-ink)' }));
  if (o.posudyna) ch.push(tekst(px + pw / 2, py + ph + 14, o.posudyna, { rozmir: 12, vaha: 600, k: 'var(--ill-muted)' }));
  const opys = o.opys ?? `Банки по 1 літру, з яких воду вилили в ${o.posudyna ?? 'посудину'}`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys}">${ch.join('')}</svg>`;
}

// ——— Гроші ———

export interface HroshiOpts {
  /** Гривні: 1, 2, 5, 10 — монети, 20 і більше — купюри. */
  hrn?: number[];
  /** Копійки: монети 10 і 50 к. */
  kop?: number[];
  opys?: string;
}

const MONETY_HRN = [1, 2, 5, 10];
const KUPIURY = [20, 50, 100, 200, 500];
const MONETY_KOP = [10, 50];

export function hroshi(o: HroshiOpts): string {
  const hrn = o.hrn ?? [];
  const kop = o.kop ?? [];
  for (const h of hrn) if (!MONETY_HRN.includes(h) && !KUPIURY.includes(h)) throw new Error(`hroshi: немає грошей ${h} грн`);
  for (const k of kop) if (!MONETY_KOP.includes(k)) throw new Error(`hroshi: немає монети ${k} к.`);
  type Rich = { vyd: 'kupiura' | 'moneta' | 'kop'; n: number; w: number };
  const rechi: Rich[] = [
    ...hrn.map((n): Rich => (n >= 20 ? { vyd: 'kupiura', n, w: 96 } : { vyd: 'moneta', n, w: 52 })),
    ...kop.map((n): Rich => ({ vyd: 'kop', n, w: 42 })),
  ];
  const W = 340;
  const vidstup = 8;
  // Розкладаємо в рядки завширшки W.
  const riadky: Rich[][] = [[]];
  let x = vidstup;
  for (const r of rechi) {
    if (x + r.w > W - vidstup && riadky[riadky.length - 1].length > 0) {
      riadky.push([]);
      x = vidstup;
    }
    riadky[riadky.length - 1].push(r);
    x += r.w + 8;
  }
  const vysota = 62;
  const H = riadky.length * vysota + 8;
  const ch: string[] = [];
  riadky.forEach((riad, j) => {
    const shyr = riad.reduce((s, r) => s + r.w, 0) + 8 * (riad.length - 1);
    let xx = (W - shyr) / 2;
    const yc = 4 + j * vysota + vysota / 2;
    for (const r of riad) {
      const xc = xx + r.w / 2;
      if (r.vyd === 'kupiura') {
        ch.push(`<rect x="${f(xx)}" y="${f(yc - 26)}" width="${r.w}" height="52" rx="5" fill="var(--ill-3)" fill-opacity="0.25" stroke="var(--ill-3)" stroke-width="2"/>`);
        ch.push(`<rect x="${f(xx + 5)}" y="${f(yc - 21)}" width="${r.w - 10}" height="42" rx="3" fill="none" stroke="var(--ill-3)" stroke-width="0.9" stroke-dasharray="2 2"/>`);
        ch.push(tekst(xc, yc - 5, String(r.n), { rozmir: 19 }));
        ch.push(tekst(xc, yc + 13, 'гривень', { rozmir: 11, vaha: 600 }));
      } else {
        const rad = r.vyd === 'moneta' ? 25 : 20;
        ch.push(`<circle cx="${f(xc)}" cy="${f(yc)}" r="${rad}" fill="var(--ill-2)" fill-opacity="${r.vyd === 'moneta' ? 0.3 : 0.18}" stroke="var(--ill-2)" stroke-width="1.8"/>`);
        ch.push(`<circle cx="${f(xc)}" cy="${f(yc)}" r="${rad - 5}" fill="none" stroke="var(--ill-2)" stroke-width="0.9"/>`);
        ch.push(tekst(xc, yc - 5, String(r.n), { rozmir: r.vyd === 'moneta' ? 17 : 14 }));
        ch.push(tekst(xc, yc + 11, r.vyd === 'moneta' ? 'грн' : 'к.', { rozmir: 11, vaha: 600 }));
      }
      xx += r.w + 8;
    }
  });
  const nazvy = rechi.map((r) => (r.vyd === 'kupiura' ? `купюра ${r.n} грн` : r.vyd === 'moneta' ? `монета ${r.n} грн` : `монета ${r.n} к.`));
  const opys = o.opys ?? `Гроші: ${nazvy.join(', ')}`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opys}">${ch.join('')}</svg>`;
}
