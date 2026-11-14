// Відсоткове відношення двох чисел (Істер § 21): скільки відсотків a становить від b (a : b · 100), зокрема
// більше за 100 %; на скільки відсотків змінилася величина (зміна ділиться на початкове значення);
// на скільки відсотків одне число більше чи менше за інше (ділимо на те, з чим порівнюємо).
import { ch, nsd, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Ціле b і відсоток p такі, щоб p % від b було цілим. */
function para(r: Vypadok, vidsotky: number[], min: number, max: number) {
  const p = r.vybir(vidsotky);
  const krok = 100 / nsd(p, 100);
  const b = krok * r.chyslo(Math.ceil(min / krok), Math.floor(max / krok));
  return { p, b, x: (b * p) / 100 };
}

const SKILKY: ((x: number, b: number) => string)[] = [
  (x, b) => `Скільки відсотків становить ${ch(x)} від ${ch(b)}?`,
  (x, b) => `У контрольній ${skilky(b, 'завдання', 'завдання', 'завдань')}, Тереза правильно виконала ${x}. Скільки це відсотків?`,
  (x, b) => `У паралелі шостих класів ${skilky(b, 'учень', 'учні', 'учнів')}, з них ${x} займаються плаванням. Скільки відсотків учнів займаються плаванням?`,
  (x, b) => `З ${skilky(b, 'посадженої насінини', 'посаджених насінин', 'посаджених насінин')} зійшло ${x}. Скільки відсотків насінин зійшло?`,
];

function skilkyVidsotkiv(r: Vypadok): TrenZavdannia {
  const b = r.vybir([20, 25, 40, 50]);
  const p = r.vybir([5, 10, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90, 95].filter((v) => (b * v) % 100 === 0));
  const x = (b * p) / 100;
  return {
    pytannia: r.vybir(SKILKY)(x, b),
    vidpovid: p,
    odynytsi: '%',
    pidkazka: `Поділи частину на ціле і помнож на 100: ${x} : ${b} · 100.`,
    rozviazok: `${x} : ${b} · 100 = ${p} (%). Перевірка: ${p}% від ${b} — це ${x} ✓`,
  };
}

/** Число з будь-яким «круглим» відсотком від 1 до 99 або понад 100. */
function skilkyRiznyi(r: Vypadok): TrenZavdannia {
  const bilshe = r.shans(0.4);
  const { p, b, x } = bilshe
    ? para(r, [110, 120, 125, 130, 140, 150, 160, 175, 180, 200, 250, 300], 4, 80)
    : para(r, [2, 4, 8, 12, 16, 24, 28, 36, 44, 48, 52, 64, 68, 76, 88, 92, 96], 20, 200);
  return {
    pytannia: `Скільки відсотків становить ${ch(x)} від ${ch(b)}?`,
    vidpovid: p,
    odynytsi: '%',
    pidkazka: bilshe
      ? `${ch(x)} більше за ${ch(b)}, тож відсотків вийде більше за 100. Поділи ${ch(x)} на ${ch(b)} і помнож на 100.`
      : `Поділи ${ch(x)} на ${ch(b)} і помнож на 100.`,
    rozviazok: `${ch(x)} : ${ch(b)} · 100 = ${p} (%)`,
  };
}

const ZMINY: { pro: (a: number, b: number) => string; shcho: string; od?: string; min: number; max: number }[] = [
  { pro: (a, b) => `Ціна ${a < b ? 'зросла' : 'знизилася'} з ${ch(a)} до ${ch(b)} грн.`, shcho: 'ціна', od: 'грн', min: 100, max: 2000 },
  { pro: (a, b) => `Зарплата ${a < b ? 'зросла' : 'зменшилася'} з ${ch(a)} до ${ch(b)} грн.`, shcho: 'зарплата', od: 'грн', min: 8000, max: 20000 },
  { pro: (a, b) => `У гуртку було ${skilky(a, 'учасник', 'учасники', 'учасників')}, а стало ${b}.`, shcho: 'кількість учасників', min: 20, max: 40 },
  { pro: (a, b) => `За тиждень сайт школи відвідали ${ch(a)} осіб, а наступного тижня — ${ch(b)}.`, shcho: 'кількість відвідувачів', min: 200, max: 3000 },
  { pro: (a, b) => `За місяць у бібліотеці видали ${skilky(a, 'книжку', 'книжки', 'книжок')}, а наступного місяця — ${ch(b)}.`, shcho: 'кількість виданих книжок', min: 200, max: 900 },
];

function naSkilky(r: Vypadok): TrenZavdannia {
  for (;;) {
    const z = r.vybir(ZMINY);
    const { p, b: a, x: zmina } = para(r, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75], z.min, z.max);
    const vgoru = r.shans(0.55);
    if (!vgoru && p > 50) continue;
    const b = vgoru ? a + zmina : a - zmina;
    const od = z.od ? ` (${z.od})` : '';
    return {
      pytannia: `${z.pro(a, b)} На скільки відсотків ${vgoru ? 'зросла' : 'зменшилася'} ${z.shcho}?`,
      vidpovid: p,
      odynytsi: '%',
      pidkazka: 'Знайди зміну і поділи її на ПОЧАТКОВЕ значення.',
      rozviazok: `Зміна: ${vgoru ? `${ch(b)} − ${ch(a)}` : `${ch(a)} − ${ch(b)}`} = ${ch(zmina)}${od}; ${ch(zmina)} : ${ch(a)} · 100 = ${p} (%)`,
    };
  }
}

/** «На скільки відсотків a більше за b» — ділимо на b; «b менше за a» — ділимо на a. */
function porivniannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const bilshe = r.shans();
    const { p, b: osnova, x: riznytsia } = para(r, [10, 20, 25, 30, 40, 50, 60, 75, 80, 100], 8, 400);
    if (!bilshe && p >= 100) continue;
    const insha = bilshe ? osnova + riznytsia : osnova - riznytsia;
    const [velyke, male] = bilshe ? [insha, osnova] : [osnova, insha];
    return {
      pytannia: bilshe ? `На скільки відсотків ${ch(velyke)} більше за ${ch(male)}?` : `На скільки відсотків ${ch(male)} менше за ${ch(velyke)}?`,
      vidpovid: p,
      odynytsi: '%',
      pidkazka: `Різниця — ${ch(riznytsia)}. Порівнюємо з ${ch(osnova)}, тож ділимо на ${ch(osnova)}.`,
      rozviazok: `${ch(velyke)} − ${ch(male)} = ${ch(riznytsia)}; ${ch(riznytsia)} : ${ch(osnova)} · 100 = ${p} (%)`,
    };
  }
}

/** «Скільки відсотків становить нове від старого» і «скільки відсотків залишилося». */
function zalyshok(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const { p, b: a, x: zmina } = para(r, [10, 15, 20, 25, 30, 40], 100, 2000);
    const b = a - zmina;
    return {
      pytannia: `Ціна знизилася з ${ch(a)} до ${ch(b)} грн. Скільки відсотків старої ціни становить нова?`,
      vidpovid: 100 - p,
      odynytsi: '%',
      pidkazka: `Тут питають не «на скільки», а «скільки відсотків»: поділи нову ціну на стару.`,
      rozviazok: `${ch(b)} : ${ch(a)} · 100 = ${100 - p} (%). А знизилася ціна на 100 − ${100 - p} = ${p} (%).`,
    };
  }
  if (typ === 1) {
    const { p, b, x } = para(r, [20, 25, 30, 35, 40, 45, 60, 65, 70, 75, 80], 40, 300);
    return {
      pytannia: `У книжці ${skilky(b, 'сторінка', 'сторінки', 'сторінок')}. Марко прочитав ${x}. Скільки відсотків книжки йому залишилося прочитати?`,
      vidpovid: 100 - p,
      odynytsi: '%',
      pidkazka: `Спершу знайди, скільки сторінок залишилося: ${b} − ${x}.`,
      rozviazok: `${b} − ${x} = ${b - x} (стор.); ${b - x} : ${b} · 100 = ${100 - p} (%)`,
    };
  }
  const { p, b, x } = para(r, [20, 25, 30, 40, 50, 60, 75], 200, 1200);
  return {
    pytannia: `Площа ділянки ${ch(b)} м². Під картоплю відвели ${ch(x)} м², а решту — під овочі. Скільки відсотків ділянки займають овочі?`,
    vidpovid: 100 - p,
    odynytsi: '%',
    pidkazka: `Знайди площу під овочами: ${ch(b)} − ${ch(x)}.`,
    rozviazok: `${ch(b)} − ${ch(x)} = ${ch(b - x)} (м²); ${ch(b - x)} : ${ch(b)} · 100 = ${100 - p} (%)`,
  };
}

export default {
  rivni: ['скільки відсотків одне число від іншого', 'на скільки відсотків змінилася величина', 'більше чи менше на скільки відсотків; задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([skilkyVidsotkiv, skilkyVidsotkiv, skilkyRiznyi])(r);
    if (riven === 2) return r.vybir([naSkilky, naSkilky, skilkyRiznyi])(r);
    return r.vybir([porivniannia, porivniannia, zalyshok, naSkilky])(r);
  },
} satisfies Henerator;
