// Відсотки (6 клас, Істер § 1): відсотки ↔ десятковий і звичайний дріб; відсотки від числа множенням на дріб;
// «швидкі» відсотки (50 %, 25 %, 20 %, 10 %); більше за 100 % і дробові відсотки; задачі.
import { ch, des, nsd, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** p % (p — ціле) десятковим дробом: 7 → «0,07». */
const dr = (p: number) => des(p, 2);

/** a таке, щоб p % від a було цілим (p задано в десятих: p10 = 25 — це 2,5 %). */
function chysloDlia(r: Vypadok, p10: number, min: number, max: number) {
  const krok = 1000 / nsd(p10, 1000);
  const vid = Math.ceil(min / krok);
  const do_ = Math.max(vid, Math.floor(max / krok));
  return krok * r.chyslo(vid, do_);
}

function uDesiatkovyi(r: Vypadok): TrenZavdannia {
  const p = r.vybir([r.chyslo(1, 9), r.chyslo(11, 99), r.chyslo(11, 99), r.vybir([110, 120, 125, 130, 150, 175, 200, 250])]);
  return {
    pytannia: `Запиши ${p}% десятковим дробом.`,
    vidpovid: dr(p),
    pidkazka: p < 10 ? `Відсотки — це соті: ${p}% — ${p} сотих.` : 'Кількість відсотків поділи на 100.',
    rozviazok: `${p} : 100 = ${dr(p)}, тож ${p}% = ${dr(p)}.`,
  };
}

function uVidsotky(r: Vypadok): TrenZavdannia {
  const p = r.vybir([r.chyslo(1, 9), r.chyslo(11, 99), 10 * r.chyslo(1, 9), r.vybir([120, 125, 150, 180, 230])]);
  return {
    pytannia: `Запиши десятковий дріб ${dr(p)} у відсотках.`,
    vidpovid: p,
    odynytsi: '%',
    pidkazka: 'Десятковий дріб помнож на 100.',
    rozviazok: `${dr(p)} · 100 = ${p}, тож ${dr(p)} = ${p}%.`,
  };
}

function zDrobu(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.vybir([2, 4, 5, 10, 20, 25, 50]);
    const a = r.chyslo(1, b - 1);
    if (nsd(a, b) !== 1) continue;
    const k = 100 / b;
    const p = a * k;
    return {
      pytannia: `Запиши дріб $\\frac{${a}}{${b}}$ у відсотках.`,
      vidpovid: p,
      odynytsi: '%',
      pidkazka: `Зведи дріб до знаменника 100: помнож чисельник і знаменник на ${k}.`,
      rozviazok: `$\\frac{${a}}{${b}} = \\frac{${a} \\cdot ${k}}{${b} \\cdot ${k}} = \\frac{${p}}{100}$, тобто ${p}%.`,
    };
  }
}

// Задачі: текст, межі числа і найбільший доречний відсоток (знижка 85 % чи моток у 2 км — не з життя).
const KONTEKSTY: { tekst: (p: number, a: number) => string; min: number; max: number; maksP: number }[] = [
  { tekst: (p, a) => `У школі ${skilky(a, 'учень', 'учні', 'учнів')}, ${p}% з них ходять на гуртки. Скільки учнів ходять на гуртки?`, min: 200, max: 1200, maksP: 85 },
  { tekst: (p, a) => `У бібліотеці ${skilky(a, 'книжка', 'книжки', 'книжок')}, ${p}% з них — казки. Скільки казок у бібліотеці?`, min: 400, max: 3000, maksP: 40 },
  { tekst: (p, a) => `Поле має площу ${ch(a)} га, ${p}% поля засіяли пшеницею. Скільки гектарів засіяли пшеницею?`, min: 50, max: 900, maksP: 85 },
  { tekst: (p, a) => `Самокат коштує ${ch(a)} грн. На нього діє знижка ${p}%. Скільки гривень становить знижка?`, min: 1500, max: 6000, maksP: 40 },
  { tekst: (p, a) => `Від мотка дроту завдовжки ${a} м відрізали ${p}%. Скільки метрів відрізали?`, min: 50, max: 500, maksP: 72 },
];

function vidChysla(r: Vypadok, zadacha: boolean): TrenZavdannia {
  const k = r.vybir(KONTEKSTY);
  const p = r.vybir([4, 6, 8, 12, 15, 16, 24, 35, 36, 45, 48, 64, 72, 85].filter((v) => !zadacha || v <= k.maksP));
  const a = zadacha ? chysloDlia(r, p * 10, k.min, k.max) : chysloDlia(r, p * 10, 40, 900);
  const x = (a * p) / 100;
  return {
    pytannia: zadacha ? k.tekst(p, a) : `Знайди ${p}% від ${ch(a)}.`,
    vidpovid: x,
    pidkazka: `${p}% = ${dr(p)}. Помнож ${ch(a)} на ${dr(p)}.`,
    rozviazok: `${p}% = ${dr(p)}; ${ch(a)} · ${dr(p)} = ${ch(x)}`,
  };
}

const SHVYDKI: [number, number, string][] = [
  [50, 2, 'половина'],
  [25, 4, 'чверть'],
  [20, 5, "п'ята частина"],
  [10, 10, 'десята частина'],
  [75, 4, 'три чверті'],
];

function shvydki(r: Vypadok): TrenZavdannia {
  const [p, d, nazva] = r.vybir(SHVYDKI);
  const n = p === 75 ? 3 : 1;
  const a = d * r.chyslo(3, 60);
  const x = (a / d) * n;
  return {
    pytannia: `Знайди усно ${p}% від ${ch(a)}.`,
    vidpovid: x,
    pidkazka: `${p}% — це ${nazva} числа.`,
    rozviazok: n === 1 ? `${p}% — ${nazva}: ${ch(a)} : ${d} = ${ch(x)}` : `${p}% — ${nazva}: ${ch(a)} : ${d} · ${n} = ${ch(x)}`,
  };
}

function bilshe100(r: Vypadok): TrenZavdannia {
  const p = r.vybir([110, 120, 125, 130, 140, 150, 175, 200, 250, 300]);
  const a = chysloDlia(r, p * 10, 20, 800);
  const x = (a * p) / 100;
  return {
    pytannia: `Знайди ${p}% від ${ch(a)}.`,
    vidpovid: x,
    pidkazka: `${p}% = ${dr(p)} — це більше, ніж усе число.`,
    rozviazok: `${p}% = ${dr(p)}; ${ch(a)} · ${dr(p)} = ${ch(x)}`,
  };
}

function drobovi(r: Vypadok): TrenZavdannia {
  const p10 = r.vybir([5, 15, 25, 35, 75, 125]); // 0,5 %, 1,5 %, 2,5 %, 3,5 %, 7,5 %, 12,5 %
  const a = chysloDlia(r, p10, 100, 4000);
  const x = (a * p10) / 1000;
  const p = des(p10, 1);
  const d = des(p10, 3);
  return {
    pytannia: `Знайди ${p}% від ${ch(a)}.`,
    vidpovid: x,
    pidkazka: `${p}% = ${p} : 100 = ${d}.`,
    rozviazok: `${p}% = ${d}; ${ch(a)} · ${d} = ${ch(x)}`,
  };
}

// Жирність продуктів — як на пакетах: молоко 1,5–3,6 %, кефір 1–3,2 %, вершки 10–20 %, сметана 15–20 %.
const PRODUKTY: [string, string, number[]][] = [
  ['Молоко', 'молока', [15, 25, 32, 36]],
  ['Кефір', 'кефіру', [10, 25, 32]],
  ['Йогурт', 'йогурту', [15, 25, 40]],
  ['Вершки', 'вершків', [100, 150, 200]],
  ['Сметана', 'сметани', [150, 200]],
];

function zhyrnist(r: Vypadok): TrenZavdannia {
  const [nazva, rodovyi, zhyry] = r.vybir(PRODUKTY);
  const p10 = r.vybir(zhyry);
  const m = 100 * r.chyslo(2, 10);
  const x10 = (m * p10) / 100; // жир у десятих грама
  const p = des(p10, 1);
  const d = des(p10, 3);
  return {
    pytannia: `${nazva} ${nazva === 'Вершки' ? 'мають' : 'має'} жирність ${p}%. Скільки грамів жиру в ${m} г ${rodovyi}?`,
    vidpovid: des(x10, 1),
    odynytsi: 'г',
    pidkazka: `${p}% = ${d}. Помнож масу на ${d}.`,
    rozviazok: `${m} · ${d} = ${des(x10, 1)} (г)`,
  };
}

function shchoBilshe(r: Vypadok): TrenZavdannia {
  for (;;) {
    let [p, a] = [10 * r.chyslo(1, 9), 10 * r.chyslo(2, 40)];
    let [q, b] = [10 * r.chyslo(1, 9), 10 * r.chyslo(2, 40)];
    if (r.shans(0.3)) {
      // p % від a = a % від p (від перестановки множників добуток не змінюється)
      a = 10 * r.chyslo(1, 9);
      [q, b] = [a, p];
    }
    const x = (a * p) / 100;
    const y = (b * q) / 100;
    if (x !== y && Math.abs(x - y) > 0.3 * Math.max(x, y)) continue; // близькі — щоб треба було рахувати
    const l = `${p} % від ${ch(a)}`;
    const pr = `${q} % від ${ch(b)}`;
    if (l === pr) continue;
    return {
      pytannia: `Що більше: ${l} чи ${pr}?`,
      vidpovid: x > y ? l : x < y ? pr : 'однаково',
      varianty: [l, pr, 'однаково'],
      pidkazka: `Порахуй обидва: ${ch(a)} · ${dr(p)} і ${ch(b)} · ${dr(q)}.`,
      rozviazok: `${ch(a)} · ${dr(p)} = ${des(a * p, 2)}; ${ch(b)} · ${dr(q)} = ${des(b * q, 2)}.`,
    };
  }
}

export default {
  rivni: ['відсотки ↔ дроби', 'відсотки від числа', 'більше за 100 %, дробові відсотки, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([uDesiatkovyi, uVidsotky, zDrobu])(r);
    if (riven === 2) return r.vybir([(v: Vypadok) => vidChysla(v, false), (v: Vypadok) => vidChysla(v, true), shvydki])(r);
    return r.vybir([bilshe100, drobovi, zhyrnist, shchoBilshe, (v: Vypadok) => vidChysla(v, true)])(r);
  },
} satisfies Henerator;
