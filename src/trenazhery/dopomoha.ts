// Спільне для всіх генераторів тренажерів: типи, випадкові числа, запис чисел і дробів, імена, відмінки.
//
// Генератор теми — файл `src/trenazhery/<N>-klas/<тема>.ts` з тією самою назвою, що й сторінка теми
// (`src/content/docs/<N>-klas/<тема>.mdx`). Він бере випадкові числа, складає з них завдання і сам рахує
// правильну відповідь, тож завдання не закінчуються. Приклад — `src/trenazhery/1-klas/sklad-chysla.ts`.
//
// Генератори запускаються і в браузері, і в автоперевірці (`npm test`) прямо через Node, тому:
// імпорти — з розширенням `.ts`, типи — лише через `import type`, без enum і namespace.

export type Riven = 1 | 2 | 3;

export interface TrenZavdannia {
  /** Звичайний текст: інструкція або умова задачі. Формули — у $...$, як у темах. */
  pytannia?: string;
  /** Малюнок SVG над умовою (наприклад, годинник). Кольори — з ilustratsii.css: var(--ill-1) тощо. */
  malunok?: string;
  /** Великий приклад, наприклад «7 + 5 =» або «$\frac{1}{2} + \frac{1}{3} =$». */
  vyraz?: string;
  /** Правильна відповідь; кілька — якщо її можна записати по-різному. Перша показується дитині. */
  vidpovid: string | number | (string | number)[];
  /** Як показати правильну відповідь, якщо інакше, ніж перша з `vidpovid`: «$\frac{3}{4}$». */
  pokaz?: string;
  /** Кнопки замість поля (для «так/ні», «>, <, =», вибору виду). Мають містити правильну відповідь. */
  varianty?: (string | number)[];
  /** Додаткова перевірка, якщо правильних записів забагато (наприклад, будь-який рівний дріб). */
  perevirka?: (vvid: string) => boolean;
  /** Наводящий крок; з'являється після другої помилки. */
  pidkazka?: string;
  /** Коротке пояснення розв'язку: показується після помилки й у розборі в кінці гри. */
  rozviazok?: string;
  /** Одиниці виміру біля поля: «см», «грн». */
  odynytsi?: string;
}

export interface Henerator {
  /** Що означає кожен рівень, коротко: ['до 10', 'до 20', 'до 100']. */
  rivni: [string, string, string];
  zavdannia(r: Vypadok, riven: Riven): TrenZavdannia;
}

// ——— Випадкові числа ———

export interface Vypadok {
  /** Ціле число від `vid` до `do_` включно. */
  chyslo(vid: number, do_: number): number;
  /** Ціле число від `vid` до `do_`, крім заборонених. */
  krim(vid: number, do_: number, zaboroneni: number[]): number;
  vybir<T>(spysok: readonly T[]): T;
  peremishaty<T>(spysok: readonly T[]): T[];
  /** true з імовірністю p. */
  shans(p?: number): boolean;
  /** Кілька різних цілих чисел з проміжку. */
  rizni(kilkist: number, vid: number, do_: number): number[];
}

/** Без `zerno` — справжні випадкові числа; із зерном — однакові щоразу (для автоперевірки). */
export function stvorytyVypadok(zerno?: number): Vypadok {
  let s = (zerno ?? Math.floor(Math.random() * 2 ** 32)) >>> 0;
  const vypadkove =
    zerno === undefined
      ? Math.random
      : () => {
          // mulberry32
          s = (s + 0x6d2b79f5) >>> 0;
          let t = s;
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
  const chyslo = (vid: number, do_: number) => vid + Math.floor(vypadkove() * (do_ - vid + 1));
  const r: Vypadok = {
    chyslo,
    krim(vid, do_, zaboroneni) {
      const dozvoleni: number[] = [];
      for (let x = vid; x <= do_; x++) if (!zaboroneni.includes(x)) dozvoleni.push(x);
      return r.vybir(dozvoleni);
    },
    vybir: (spysok) => spysok[chyslo(0, spysok.length - 1)],
    peremishaty(spysok) {
      const a = [...spysok];
      for (let i = a.length - 1; i > 0; i--) {
        const j = chyslo(0, i);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    shans: (p = 0.5) => vypadkove() < p,
    rizni(kilkist, vid, do_) {
      return r.peremishaty(Array.from({ length: do_ - vid + 1 }, (_, i) => vid + i)).slice(0, kilkist);
    },
  };
  return r;
}

// ——— Числа ———

export const nsd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : nsd(b, a % b));
export const nsk = (a: number, b: number) => (a / nsd(a, b)) * b;

/** 12345 → «12 345» (нерозривний пробіл) для тексту. Чотирицифрові пишемо разом: 1234. */
export function ch(n: number) {
  const z = n < 0 ? '−' : '';
  const s = String(Math.abs(n));
  return z + (s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
}

/** 12345 → «12\ 345», −5 → «-5» для формули в $...$. */
export function tch(n: number) {
  const s = String(Math.abs(n));
  return (n < 0 ? '-' : '') + (s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\ '));
}

/**
 * Десятковий дріб без похибок: ціле число `cile`, поділене на 10^znakiv.
 * des(325, 2) → «3,25»; des(320, 2) → «3,2»; des(-5, 1) → «−0,5».
 */
export function des(cile: number, znakiv: number) {
  const z = cile < 0 ? '−' : '';
  const s = String(Math.abs(cile)).padStart(znakiv + 1, '0');
  const tsila = s.slice(0, s.length - znakiv) || '0';
  const drob = s.slice(s.length - znakiv).replace(/0+$/, '');
  return z + ch(Number(tsila)) + (drob ? ',' + drob : '');
}

/** Те саме для формули: «3{,}25». */
export function tdes(cile: number, znakiv: number) {
  return des(cile, znakiv).replace('−', '-').replace(/ /g, '\\ ').replace(',', '{,}');
}

// ——— Дроби ———

/** \frac{n}{d} для формули. */
export const tdrib = (n: number, d: number) => `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;

/** Скорочує дріб: [6, 8] → [3, 4]. Знак — у чисельнику. */
export function skorotyty(n: number, d: number): [number, number] {
  const k = nsd(n, d) * (d < 0 ? -1 : 1);
  return [n / k, d / k];
}

/** Нескоротний дріб як відповідь: 7/4 → ['7/4', '1 3/4']; 4/2 → ['2']; 0 → ['0']. */
export function vidpovidDrib(n: number, d: number): string[] {
  const [a, b] = skorotyty(n, d);
  const z = a < 0 ? '−' : '';
  const m = Math.abs(a);
  if (b === 1) return [`${z}${m}`];
  if (m < b) return [`${z}${m}/${b}`];
  return [`${z}${m}/${b}`, `${z}${Math.floor(m / b)} ${m % b}/${b}`];
}

/** Те саме для формули: 7/4 → «1\frac{3}{4}» (мішане), 3/4 → «\frac{3}{4}». */
export function tvidpovidDrib(n: number, d: number, mishane = true) {
  const [a, b] = skorotyty(n, d);
  const z = a < 0 ? '-' : '';
  const m = Math.abs(a);
  if (b === 1) return `${z}${m}`;
  if (!mishane || m < b) return `${z}\\frac{${m}}{${b}}`;
  return `${z}${Math.floor(m / b)}\\frac{${m % b}}{${b}}`;
}

/**
 * Перевірка «будь-який дріб, рівний n/d»: дитина може не скорочувати або записати мішаним числом.
 * Розуміє «6/8», «1 3/4», «2», «0,75».
 */
export function rivnyiDrib(n: number, d: number) {
  return (vvid: string) => {
    const t = vvid.replace(/\s+/g, ' ').trim().replace(/[−–]/g, '-');
    let m = t.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
    if (m) {
      const z = m[1] ? -1 : 1;
      return z * (Number(m[2]) * Number(m[4]) + Number(m[3])) * d === n * Number(m[4]);
    }
    m = t.match(/^(-?\d+)\/(-?\d+)$/);
    if (m) return Number(m[2]) !== 0 && Number(m[1]) * d === n * Number(m[2]);
    m = t.match(/^-?\d+(?:[.,]\d+)?$/);
    if (m) return Math.abs(Number(t.replace(',', '.')) * d - n) < 1e-9;
    return false;
  };
}

// ——— Слова ———

/** Форма слова після числа: mnozh(1, 'яблуко', 'яблука', 'яблук') → «яблуко», 3 → «яблука», 5 → «яблук». */
export function mnozh(n: number, odyn: string, dva: string, piat: string) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a >= 11 && a <= 14) return piat;
  if (b === 1) return odyn;
  if (b >= 2 && b <= 4) return dva;
  return piat;
}

/** «5 яблук». */
export const skilky = (n: number, odyn: string, dva: string, piat: string) => `${ch(n)} ${mnozh(n, odyn, dva, piat)}`;

export interface Osoba {
  imia: string;
  /** true — хлопчик: «купив»; false — дівчинка: «купила». */
  khlopets: boolean;
}

const KHLOPTSI = ['Андрій', 'Богдан', 'Василь', 'Денис', 'Іван', 'Марко', 'Назар', 'Остап', 'Петро', 'Тарас', 'Максим', 'Олег'];
const DIVCHATA = ['Оля', 'Марійка', 'Софія', 'Ганна', 'Ірина', 'Леся', 'Настя', 'Дарина', 'Катя', 'Соломія', 'Зоряна', 'Віра'];

export function osoba(r: Vypadok): Osoba {
  return r.shans() ? { imia: r.vybir(KHLOPTSI), khlopets: true } : { imia: r.vybir(DIVCHATA), khlopets: false };
}

/** Дві різні особи. */
export function dviOsoby(r: Vypadok): [Osoba, Osoba] {
  const a = osoba(r);
  let b = osoba(r);
  while (b.imia === a.imia) b = osoba(r);
  return [a, b];
}

/** Дієслово за родом: rid(osoba, 'купив', 'купила'). */
export const rid = (o: Osoba, cholovichyi: string, zhinochyi: string) => (o.khlopets ? cholovichyi : zhinochyi);

/** Перша літера велика. */
export const zVelykoi = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
