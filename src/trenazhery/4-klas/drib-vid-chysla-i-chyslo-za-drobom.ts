// Дріб від числа (m : b · a) і число за величиною його дробу (k : a · b), 4 клас. Як розрізнити дві задачі
// (що відомо — ціле чи частина), дроби величин; складені задачі: залишок, «від решти», два дроби одного цілого.
import { mnozh, nsd, nsk, osoba, rid, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Нескоротний дріб a/b: знаменник від minD до maxD, чисельник від `vid`. */
function drib(r: Vypadok, minD: number, maxD: number, vid = 1) {
  const d = r.chyslo(Math.max(minD, vid + 1), maxD);
  let n = r.chyslo(vid, d - 1);
  while (nsd(n, d) !== 1) n = r.chyslo(vid, d - 1);
  return { n, d };
}

const D = (n: number, d: number) => `$${tdrib(n, d)}$`;
const stanovyt = (n: number) => (n === 1 ? 'становить' : 'становлять');
const chastyn = (n: number) => `${n} ${mnozh(n, 'частина', 'частини', 'частин')}`;
/** Запис «m : b · a» без зайвого «· 1». */
const vid = (m: number, n: number, d: number) => (n === 1 ? `${m} : ${d}` : `${m} : ${d} · ${n}`);

function vidChysla(r: Vypadok): TrenZavdannia {
  const { n, d } = drib(r, 2, 10);
  const c = r.chyslo(2, 15);
  const m = d * c;
  return {
    pytannia: `Знайди ${D(n, d)} від ${m}.`,
    vidpovid: n * c,
    pidkazka: n === 1 ? `Поділи ${m} на знаменник ${d}.` : `Спершу одна частина: ${m} : ${d}. Потім візьми ${chastyn(n)}.`,
    rozviazok: n === 1 ? `${m} : ${d} = ${c}` : `${m} : ${d} · ${n} = ${c} · ${n} = ${n * c}`,
  };
}

function zaDrobom(r: Vypadok): TrenZavdannia {
  const { n, d } = drib(r, 2, 10);
  const c = r.chyslo(2, 15);
  const k = n * c;
  return {
    pytannia: `Знайди число, якщо його ${D(n, d)} ${stanovyt(n)} ${k}.`,
    vidpovid: d * c,
    pidkazka: n === 1 ? `${k} — це одна частина, а в цілому їх ${d}.` : `${k} — це ${chastyn(n)}. Скільки в одній?`,
    rozviazok:
      n === 1
        ? `${k} · ${d} = ${d * c}. Перевірка: ${d * c} : ${d} = ${k} ✓`
        : `${k} : ${n} · ${d} = ${c} · ${d} = ${d * c}. Перевірка: ${d * c} : ${d} · ${n} = ${k} ✓`,
  };
}

// ——— Пари задач: та сама історія, але відоме то ціле, то частина ———

interface Siuzhet {
  /** Відоме ціле, шукаємо частину. */
  tsile: (N: number, dr: string, o: ReturnType<typeof osoba>) => string;
  /** Відома частина, шукаємо ціле. */
  chastyna: (N: number, dr: string, o: ReturnType<typeof osoba>) => string;
  odynytsi?: string;
  maks: number;
}

const SIUZHETY: Siuzhet[] = [
  {
    tsile: (N, dr, o) => `У книжці ${N} ${mnozh(N, 'сторінка', 'сторінки', 'сторінок')}. ${o.imia} ${rid(o, 'прочитав', 'прочитала')} ${dr} книжки. Скільки сторінок ${rid(o, 'прочитав', 'прочитала')} ${o.imia}?`,
    chastyna: (N, dr, o) => `${o.imia} ${rid(o, 'прочитав', 'прочитала')} ${N} ${mnozh(N, 'сторінку', 'сторінки', 'сторінок')}, що становить ${dr} книжки. Скільки сторінок у книжці?`,
    maks: 480,
  },
  {
    tsile: (N, dr) => `Відстань між містами — ${N} км. Автобус проїхав ${dr} цієї відстані. Скільки кілометрів проїхав автобус?`,
    chastyna: (N, dr) => `Автобус проїхав ${N} км, що становить ${dr} відстані між містами. Яка відстань між містами?`,
    odynytsi: 'км',
    maks: 600,
  },
  {
    tsile: (N, dr) => `До бібліотеки привезли ${N} ${mnozh(N, 'журнал', 'журнали', 'журналів')}. Учні взяли почитати ${dr} цих журналів. Скільки журналів узяли учні?`,
    chastyna: (N, dr) => `Учні взяли почитати ${N} ${mnozh(N, 'журнал', 'журнали', 'журналів')}, що становить ${dr} усіх журналів бібліотеки. Скільки журналів у бібліотеці?`,
    maks: 400,
  },
  {
    tsile: (N, dr) => `У саду зібрали ${N} кг яблук. На сік віддали ${dr} усіх яблук. Скільки кілограмів яблук віддали на сік?`,
    chastyna: (N, dr) => `На сік віддали ${N} кг яблук, що становить ${dr} усього врожаю. Скільки кілограмів яблук зібрали в саду?`,
    odynytsi: 'кг',
    maks: 900,
  },
];

function para(r: Vypadok): TrenZavdannia {
  const s = r.vybir(SIUZHETY);
  const { n, d } = drib(r, 3, 9, 2);
  const o = osoba(r);
  if (r.shans()) {
    const c = r.chyslo(Math.ceil(20 / d), Math.floor(s.maks / d));
    const N = d * c;
    return {
      pytannia: s.tsile(N, D(n, d), o),
      vidpovid: n * c,
      odynytsi: s.odynytsi,
      pidkazka: `Відоме ціле — ${N}. Спершу одна частина: ${N} : ${d}.`,
      rozviazok: `Відоме ціле, шукаємо частину: ${N} : ${d} · ${n} = ${c} · ${n} = ${n * c}.`,
    };
  }
  const c = r.chyslo(Math.ceil(20 / n), Math.floor(s.maks / d));
  const N = n * c;
  return {
    pytannia: s.chastyna(N, D(n, d), o),
    vidpovid: d * c,
    odynytsi: s.odynytsi,
    pidkazka: `${N} — це не все, а лише ${D(n, d)}, тобто ${chastyn(n)}. Скільки в одній частині?`,
    rozviazok: `Відома частина, шукаємо ціле: ${N} : ${n} · ${d} = ${c} · ${d} = ${d * c}. Перевірка: ${d * c} більше за ${N} ✓`,
  };
}

function vybirDii(r: Vypadok): TrenZavdannia {
  const s = r.vybir(SIUZHETY);
  const n = r.chyslo(2, 5);
  let d = r.chyslo(n + 1, 9);
  while (nsd(n, d) !== 1) d = r.chyslo(n + 1, 9);
  // N ділиться і на чисельник, і на знаменник: обидва вирази дають цілі числа, тож вибір не підкаже ділення.
  const cMin = Math.ceil(20 / (n * d));
  const c = r.chyslo(cMin, Math.max(cMin, Math.floor(s.maks / (n * d * d))));
  const N = n * d * c;
  const tsile = r.shans();
  const o = osoba(r);
  const [A, B] = r.shans() ? ['b', 'a'] : ['a', 'b'];
  const vyraz = (pershyi: string) => (pershyi === 'b' ? `$${N} : ${d} \\cdot ${n}$` : `$${N} : ${n} \\cdot ${d}$`);
  const pravylnyi = tsile ? 'b' : 'a';
  return {
    pytannia: `${tsile ? s.tsile(N, D(n, d), o) : s.chastyna(N, D(n, d), o)} Яким виразом розв'язати задачу? А) ${vyraz(A)}  Б) ${vyraz(B)}`,
    vidpovid: A === pravylnyi ? 'А' : 'Б',
    varianty: ['А', 'Б'],
    pidkazka: 'Що відомо: усе ціле чи тільки частина? Ціле ділимо на знаменник, частину — на чисельник.',
    rozviazok: tsile
      ? `Відоме ціле — ділимо на знаменник: ${N} : ${d} · ${n} = ${(N / d) * n}.`
      : `Відома частина — ділимо на чисельник: ${N} : ${n} · ${d} = ${(N / n) * d}.`,
  };
}

const VELYCHYNY = [
  { tsile: 1000, velyka: 'км', mala: 'метрів', od: 'м' },
  { tsile: 100, velyka: 'ц', mala: 'кілограмів', od: 'кг' },
  { tsile: 1000, velyka: 'т', mala: 'кілограмів', od: 'кг' },
  { tsile: 60, velyka: 'год', mala: 'хвилин', od: 'хв' },
  { tsile: 24, velyka: 'доби', mala: 'годин', od: 'год' },
  { tsile: 100, velyka: 'м', mala: 'сантиметрів', od: 'см' },
  { tsile: 1000, velyka: 'кг', mala: 'грамів', od: 'г' },
  { tsile: 60, velyka: 'хв', mala: 'секунд', od: 'с' },
  { tsile: 12, velyka: 'року', mala: 'місяців', od: 'міс.' },
] as const;

function velychyna(r: Vypadok): TrenZavdannia {
  const v = r.vybir(VELYCHYNY);
  const dilnyky = [2, 3, 4, 5, 6, 8, 10, 12, 20, 25].filter((x) => v.tsile % x === 0);
  const d = r.vybir(dilnyky);
  let n = r.chyslo(1, d - 1);
  while (nsd(n, d) !== 1) n = r.chyslo(1, d - 1);
  const odna = v.tsile / d;
  return {
    pytannia: `Скільки ${v.mala} у ${D(n, d)} ${v.velyka}?`,
    vidpovid: odna * n,
    odynytsi: v.od,
    pidkazka: `1 ${v.velyka === 'доби' ? 'доба' : v.velyka === 'року' ? 'рік' : v.velyka} = ${v.tsile} ${v.od}. Знайди ${D(n, d)} від ${v.tsile}.`,
    rozviazok: n === 1 ? `${v.tsile} : ${d} = ${odna} (${v.od})` : `${v.tsile} : ${d} · ${n} = ${odna} · ${n} = ${odna * n} (${v.od})`,
  };
}

function imenovaneZaDrobom(r: Vypadok): TrenZavdannia {
  const od = r.vybir(['хв', 'м', 'кг', 'км', 'грн', 'л']);
  const { n, d } = drib(r, 3, 10, 2);
  const c = r.chyslo(2, 12);
  const k = n * c;
  return {
    pytannia: `Знайди іменоване число, якщо його ${D(n, d)} дорівнюють ${k} ${od}.`,
    vidpovid: d * c,
    odynytsi: od,
    pidkazka: `${k} ${od} — це ${chastyn(n)}. Скільки в одній?`,
    rozviazok: `${k} : ${n} · ${d} = ${c} · ${d} = ${d * c} (${od})`,
  };
}

// ——— Складені задачі ———

function zalyshok(r: Vypadok): TrenZavdannia {
  const { n, d } = drib(r, 3, 9);
  const o = osoba(r);
  const s = r.vybir([
    {
      umova: (N: number) => `Благодійники привезли ${N} кг лимонів. Лікарні віддали ${D(n, d)} цих лимонів. Скільки кілограмів лимонів залишилось?`,
      maks: 400,
      od: 'кг',
    },
    {
      umova: (N: number) => `У книжці ${N} ${mnozh(N, 'сторінка', 'сторінки', 'сторінок')}. ${o.imia} ${rid(o, 'прочитав', 'прочитала')} ${D(n, d)} книжки. Скільки сторінок ${rid(o, 'йому', 'їй')} ще залишилось прочитати?`,
      maks: 480,
      od: undefined,
    },
    {
      umova: (N: number) => `У магазин привезли ${N} кг картоплі. За день продали ${D(n, d)} усієї картоплі. Скільки кілограмів картоплі залишилось?`,
      maks: 900,
      od: 'кг',
    },
  ]);
  const c = r.chyslo(Math.ceil(30 / d), Math.floor(s.maks / d));
  const N = d * c;
  const x = n * c;
  return {
    pytannia: s.umova(N),
    vidpovid: N - x,
    odynytsi: s.od,
    pidkazka: `Спершу знайди ${D(n, d)} від ${N}, а потім відніми від усього.`,
    rozviazok: `1) ${vid(N, n, d)} = ${x}; 2) ${N} − ${x} = ${N - x}.`,
  };
}

function dvaDroby(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { tsile: (N: number) => `У шкільному саду ростуть ${N} ${mnozh(N, 'дерево', 'дерева', 'дерев')}.`, pershi: 'Яблуні', druhi: 'груші', vsi: 'усіх дерев', pershykh: 'яблунь', druhykh: 'груш', min: 40, maks: 300 },
    { tsile: (N: number) => `У букеті ${N} ${mnozh(N, 'квітка', 'квітки', 'квіток')}.`, pershi: 'Троянди', druhi: 'тюльпани', vsi: 'усіх квіток', pershykh: 'троянд', druhykh: 'тюльпанів', min: 12, maks: 60 },
    { tsile: (N: number) => `На полиці ${N} ${mnozh(N, 'книжка', 'книжки', 'книжок')}.`, pershi: 'Казки', druhi: 'енциклопедії', vsi: 'усіх книжок', pershykh: 'казок', druhykh: 'енциклопедій', min: 20, maks: 120 },
  ]);
  for (;;) {
    const a = drib(r, 2, 8);
    const b = drib(r, 2, 8);
    if (a.n * b.d + b.n * a.d >= a.d * b.d || a.n * b.d === b.n * a.d) continue;
    const l = nsk(a.d, b.d);
    if (Math.floor(s.maks / l) < Math.ceil(s.min / l)) continue;
    const N = l * r.chyslo(Math.ceil(s.min / l), Math.floor(s.maks / l));
    const x = (N / a.d) * a.n;
    const y = (N / b.d) * b.n;
    const umova = `${s.tsile(N)} ${s.pershi} становлять ${D(a.n, a.d)}, а ${s.druhi} — ${D(b.n, b.d)} ${s.vsi}.`;
    const kroky = `${vid(N, a.n, a.d)} = ${x}; ${vid(N, b.n, b.d)} = ${y}`;
    if (r.shans()) {
      return {
        pytannia: `${umova} Скільки всього ${s.pershykh} і ${s.druhykh}?`,
        vidpovid: x + y,
        pidkazka: `Знайди окремо кількість ${s.pershykh} і ${s.druhykh}, а потім додай.`,
        rozviazok: `${kroky}; ${x} + ${y} = ${x + y}.`,
      };
    }
    const [bilshe, menshe] = x > y ? [s.pershykh, s.druhykh] : [s.druhykh, s.pershykh];
    return {
      pytannia: `${umova} На скільки більше ${bilshe}, ніж ${menshe}?`,
      vidpovid: Math.abs(x - y),
      pidkazka: `Знайди окремо кількість ${s.pershykh} і ${s.druhykh}, а потім порівняй відніманням.`,
      rozviazok: `${kroky}; ${Math.max(x, y)} − ${Math.min(x, y)} = ${Math.abs(x - y)}.`,
    };
  }
}

function vidReshty(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    {
      umova: (N: number, a: string, b: string) => `Музиканти випустили ${N} ${mnozh(N, 'диск', 'диски', 'дисків')}. Собі залишили ${a} усіх дисків, а друзям подарували ${b} решти. Скільки дисків подарували друзям?`,
      maks: 600,
      od: undefined,
    },
    {
      umova: (N: number, a: string, b: string) => `У магазин привезли ${N} кг картоплі. Першого дня продали ${a} усієї картоплі, а другого — ${b} решти. Скільки кілограмів картоплі продали другого дня?`,
      maks: 900,
      od: 'кг',
    },
  ]);
  for (;;) {
    const p = drib(r, 3, 8);
    const q = drib(r, 2, 6);
    // N ділиться на p.d, а решта (p.d − p.n) · N / p.d — на q.d.
    const krok = p.d * (q.d / nsd(p.d - p.n, q.d));
    const maksT = Math.floor(s.maks / krok);
    if (maksT < 1) continue;
    const N = krok * r.chyslo(Math.max(1, Math.ceil(40 / krok)), Math.max(1, maksT));
    if (N > s.maks) continue;
    const x = (N / p.d) * p.n;
    const reshta = N - x;
    const y = (reshta / q.d) * q.n;
    return {
      pytannia: s.umova(N, D(p.n, p.d), D(q.n, q.d)),
      vidpovid: y,
      odynytsi: s.od,
      pidkazka: `«Решти» — від того, що залишилось. Спершу знайди ${D(p.n, p.d)} від ${N} і решту.`,
      rozviazok: `1) ${vid(N, p.n, p.d)} = ${x}; 2) ${N} − ${x} = ${reshta}; 3) ${vid(reshta, q.n, q.d)} = ${y}.`,
    };
  }
}

function zaDrobomZalyshok(r: Vypadok): TrenZavdannia {
  const { n, d } = drib(r, 3, 9);
  const o = osoba(r);
  const s = r.vybir([
    {
      umova: (k: number) => `${o.imia} ${rid(o, 'прочитав', 'прочитала')} ${k} ${mnozh(k, 'сторінку', 'сторінки', 'сторінок')}, що становить ${D(n, d)} книжки. Скільки сторінок ${rid(o, 'йому', 'їй')} ще залишилось прочитати?`,
      min: 8,
      maks: 480,
      od: undefined,
    },
    {
      umova: (k: number) => `Туристи пройшли ${k} км, що становить ${D(n, d)} маршруту. Скільки кілометрів їм залишилось пройти?`,
      min: 4,
      maks: 60,
      od: 'км',
    },
    {
      umova: (k: number) => `За перший день відремонтували ${k} м дороги, що становить ${D(n, d)} усієї дороги. Скільки метрів дороги залишилось відремонтувати?`,
      min: 100,
      maks: 2000,
      od: 'м',
    },
  ]);
  // Відома частина k = n · c не менша за min, а все ціле d · c — не більше за maks.
  const c = r.chyslo(Math.ceil(s.min / n), Math.max(Math.ceil(s.min / n), Math.floor(s.maks / d)));
  const k = n * c;
  const W = d * c;
  return {
    pytannia: s.umova(k),
    vidpovid: W - k,
    odynytsi: s.od,
    pidkazka: `${k} — це лише ${D(n, d)}. Спершу знайди все ціле: ${k} : ${n} · ${d}.`,
    rozviazok: `1) ${k} : ${n} · ${d} = ${W}; 2) ${W} − ${k} = ${W - k}.`,
  };
}

export default {
  rivni: ['дріб від числа і число за дробом', 'з підступом: ціле чи частина?', 'складені задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([vidChysla, zaDrobom])(r);
    if (riven === 2) return r.vybir([para, para, vybirDii, velychyna, imenovaneZaDrobom])(r);
    return r.vybir([zalyshok, dvaDroby, vidReshty, zaDrobomZalyshok, para])(r);
  },
} satisfies Henerator;
