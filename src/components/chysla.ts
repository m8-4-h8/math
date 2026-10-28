// Спільні обчислення для ілюстрацій 5 класу: десяткові дроби без похибок і подільність.

// Десятковий дріб зберігаємо як ціле число `ts` і кількість цифр після коми `k`: 3,25 → { ts: 325n, k: 2 }.
// Так 0,1 + 0,2 дає рівно 0,3, а не 0,30000000000000004.
export interface Desiatkovyi {
  ts: bigint;
  k: number;
}

export function desiatkovyi(x: string | number): Desiatkovyi {
  const s = String(x).trim().replace(',', '.').replace(/\s/g, '');
  const minus = s.startsWith('-');
  const [tsila, drob = ''] = s.replace('-', '').split('.');
  const ts = BigInt((tsila || '0') + drob);
  return { ts: minus ? -ts : ts, k: drob.length };
}

// Зводимо до однакової кількості цифр після коми.
export function doK(d: Desiatkovyi, k: number): Desiatkovyi {
  return { ts: d.ts * 10n ** BigInt(k - d.k), k };
}

// Прибираємо зайві нулі в кінці дробової частини.
export function skorotyty(d: Desiatkovyi): Desiatkovyi {
  let { ts, k } = d;
  while (k > 0 && ts % 10n === 0n) {
    ts /= 10n;
    k--;
  }
  return { ts, k };
}

// Запис з комою: { ts: 325n, k: 2 } → «3,25». `minK` — скільки цифр після коми показати щонайменше
// (зберегти нулі, наприклад «2,50»). Тисячі відділяємо пробілом.
export function zapys(d: Desiatkovyi, minK = 0): string {
  const dd = d.k < minK ? doK(d, minK) : d;
  const minus = dd.ts < 0n;
  const s = (minus ? -dd.ts : dd.ts).toString().padStart(dd.k + 1, '0');
  const tsila = s.slice(0, s.length - dd.k).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const drob = s.slice(s.length - dd.k);
  return (minus ? '−' : '') + tsila + (dd.k ? ',' + drob : '');
}

export function dodaty(a: Desiatkovyi, b: Desiatkovyi): Desiatkovyi {
  const k = Math.max(a.k, b.k);
  return { ts: doK(a, k).ts + doK(b, k).ts, k };
}

export function vidniaty(a: Desiatkovyi, b: Desiatkovyi): Desiatkovyi {
  const k = Math.max(a.k, b.k);
  return { ts: doK(a, k).ts - doK(b, k).ts, k };
}

export function pomnozhyty(a: Desiatkovyi, b: Desiatkovyi): Desiatkovyi {
  return { ts: a.ts * b.ts, k: a.k + b.k };
}

// Множення на 10ⁿ (n > 0) або на 0,1ⁿ (n < 0) — це лише зсув коми.
export function zsunuty(a: Desiatkovyi, n: number): Desiatkovyi {
  if (n >= 0) return a.k >= n ? { ts: a.ts, k: a.k - n } : { ts: a.ts * 10n ** BigInt(n - a.k), k: 0 };
  return { ts: a.ts, k: a.k - n };
}

export const chyslo = (d: Desiatkovyi) => Number(d.ts) / 10 ** d.k;

// Ціле число з пробілами між класами: 1234567 → «1 234 567».
export const tsile = (x: number | bigint) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// Розклад на прості множники: 360 → [2, 2, 2, 3, 3, 5].
export function prostiMnozhnyky(n: number): number[] {
  const r: number[] = [];
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      r.push(p);
      x /= p;
    }
  }
  if (x > 1) r.push(x);
  return r;
}

export function nsd(a: number, b: number): number {
  return b === 0 ? a : nsd(b, a % b);
}

export const nsk = (a: number, b: number) => (a / nsd(a, b)) * b;
