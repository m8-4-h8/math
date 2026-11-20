// Одночасний рух двох тіл у різних напрямках (4 клас): назустріч одне одному або з одного місця в протилежних
// напрямках. Відстань s = v1 · t + v2 · t = (v1 + v2) · t; час t = s : (v1 + v2); швидкість v2 = s : t − v1.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { rukhDvokh } from '../rukhDvokh.ts';

interface Para {
  khto: string;
  zvidky: string;
  odne: string;
  v: [number, number];
  krok?: number;
  od: 'км' | 'м';
  chas: 'год' | 'хв' | 'с';
  t: [number, number];
  /** Жіночий рід: «одна … друга». */
  zh?: boolean;
}

const PARY: Para[] = [
  { khto: 'Два велосипедисти', zvidky: 'з двох сіл', odne: 'з одного села', v: [10, 20], od: 'км', chas: 'год', t: [2, 5] },
  { khto: 'Два пішоходи', zvidky: 'з двох сіл', odne: 'з одного місця', v: [3, 6], od: 'км', chas: 'год', t: [2, 5] },
  { khto: 'Два автомобілі', zvidky: 'з двох міст', odne: 'від одного будинку', v: [50, 100], krok: 5, od: 'км', chas: 'год', t: [2, 5] },
  { khto: 'Два потяги', zvidky: 'з двох станцій', odne: 'з однієї станції', v: [50, 100], krok: 5, od: 'км', chas: 'год', t: [2, 6] },
  { khto: 'Два вершники', zvidky: 'з двох селищ', odne: 'з одного селища', v: [10, 18], od: 'км', chas: 'год', t: [2, 4] },
  { khto: 'Два катери', zvidky: 'з двох пристаней', odne: 'від однієї пристані', v: [20, 40], od: 'км', chas: 'год', t: [2, 5] },
  { khto: 'Два літаки', zvidky: 'з двох аеродромів', odne: 'з одного аеродрому', v: [500, 900], krok: 20, od: 'км', chas: 'год', t: [2, 4] },
  { khto: 'Два дельфіни', zvidky: 'з двох кінців затоки', odne: 'з одного місця', v: [6, 15], od: 'м', chas: 'с', t: [10, 40] },
  { khto: 'Дві мурашки', zvidky: 'з двох кінців доріжки', odne: 'з одного місця', v: [2, 6], od: 'м', chas: 'хв', t: [4, 12], zh: true },
];

const CHASU: Record<Para['chas'], [string, string]> = {
  год: ['годин', 'щогодини'],
  хв: ['хвилин', 'щохвилини'],
  с: ['секунд', 'щосекунди'],
};

function dani(r: Vypadok, p: Para) {
  const k = p.krok ?? 1;
  const sh = () => k * r.chyslo(Math.ceil(p.v[0] / k), Math.floor(p.v[1] / k));
  const v1 = sh();
  let v2 = sh();
  if (v2 === v1) v2 = v1 + k;
  return { v1, v2, t: r.chyslo(p.t[0], p.t[1]) };
}

const odV = (p: Para) => `${p.od}/${p.chas}`;
// «Швидкість одного — …, другого — …» / «один зі швидкістю …, другий — …» з урахуванням роду.
const shvydkosti = (p: Para, v1: number, v2: number) =>
  `Швидкість ${p.zh ? 'однієї' : 'одного'} — ${ch(v1)} ${odV(p)}, ${p.zh ? 'другої' : 'другого'} — ${ch(v2)} ${odV(p)}`;
const odynZi = (p: Para, v1: number, v2: number) =>
  `${p.zh ? 'одна' : 'один'} зі швидкістю ${ch(v1)} ${odV(p)}, ${p.zh ? 'друга' : 'другий'} — ${ch(v2)} ${odV(p)}`;
const yak = (nazustrich: boolean, p: Para) =>
  nazustrich ? `${p.zvidky} одночасно вирушили назустріч одне одному` : `${p.odne} одночасно вирушили в протилежних напрямках`;

function vidstan(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const { v1, v2, t } = dani(r, p);
  const nazustrich = r.shans();
  const s = (v1 + v2) * t;
  return {
    pytannia: nazustrich
      ? `${p.khto} ${yak(true, p)} й зустрілися через ${t} ${p.chas}. ${shvydkosti(p, v1, v2)}. Яка відстань була між ними на початку?`
      : `${p.khto} ${yak(false, p)}. ${shvydkosti(p, v1, v2)}. Яка відстань буде між ними через ${t} ${p.chas}?`,
    malunok: rukhDvokh({ v1, v2, t, napriamok: nazustrich ? 'nazustrich' : 'protylezhno', shukaty: 's', odynytsia: p.od, chas: p.chas }),
    vidpovid: s,
    odynytsi: p.od,
    pidkazka: 'Знайди шлях кожного й додай. Час руху в обох однаковий.',
    rozviazok: `${ch(v1)} · ${t} = ${ch(v1 * t)} (${p.od}), ${ch(v2)} · ${t} = ${ch(v2 * t)} (${p.od}), ${ch(v1 * t)} + ${ch(v2 * t)} = ${ch(s)} (${p.od}). Або (${ch(v1)} + ${ch(v2)}) · ${t} = ${ch(s)}`,
  };
}

function zminaZaOdynytsiu(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const { v1, v2 } = dani(r, p);
  const nazustrich = r.shans();
  const [, shcho] = CHASU[p.chas];
  return {
    pytannia: `${p.khto} ${yak(nazustrich, p)}. ${shvydkosti(p, v1, v2)}. На скільки ${p.od === 'км' ? 'кілометрів' : 'метрів'} ${shcho} ${nazustrich ? 'зменшується' : 'збільшується'} відстань між ними?`,
    vidpovid: v1 + v2,
    odynytsi: p.od,
    pidkazka: `За одиницю часу ${p.zh ? 'перша' : 'перший'} долає ${ch(v1)} ${p.od}, а ${p.zh ? 'друга' : 'другий'} — ${ch(v2)} ${p.od}.`,
    rozviazok: `${ch(v1)} + ${ch(v2)} = ${ch(v1 + v2)} (${p.od}) — ${nazustrich ? 'на стільки вони наближаються' : 'на стільки вони віддаляються'} ${shcho}.`,
  };
}

function chas(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const { v1, v2, t } = dani(r, p);
  const nazustrich = r.shans();
  const s = (v1 + v2) * t;
  return {
    pytannia: nazustrich
      ? `${p.khto} ${yak(true, p)}: ${odynZi(p, v1, v2)}. Відстань між ними — ${ch(s)} ${p.od}. Через скільки ${CHASU[p.chas][0]} вони зустрінуться?`
      : `${p.khto} ${yak(false, p)}: ${odynZi(p, v1, v2)}. Через скільки ${CHASU[p.chas][0]} відстань між ними буде ${ch(s)} ${p.od}?`,
    malunok: rukhDvokh({ v1, v2, t, napriamok: nazustrich ? 'nazustrich' : 'protylezhno', shukaty: 't', odynytsia: p.od, chas: p.chas }),
    vidpovid: t,
    odynytsi: p.chas,
    pidkazka: `Спершу: на скільки ${p.od === 'км' ? 'кілометрів' : 'метрів'} змінюється відстань між ними за одиницю часу?`,
    rozviazok: `${ch(v1)} + ${ch(v2)} = ${ch(v1 + v2)} (${p.od}), ${ch(s)} : ${ch(v1 + v2)} = ${t} (${p.chas}). Перевірка: ${ch(v1)} · ${t} + ${ch(v2)} · ${t} = ${ch(s)}`,
  };
}

function shvydkistDruhoho(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const { v1, v2, t } = dani(r, p);
  const nazustrich = r.shans();
  const s = (v1 + v2) * t;
  return {
    pytannia: nazustrich
      ? `${p.khto} ${yak(true, p)}. Відстань між ними була ${ch(s)} ${p.od}, зустрілися вони через ${t} ${p.chas}. Швидкість ${p.zh ? 'однієї' : 'одного'} — ${ch(v1)} ${odV(p)}. Яка швидкість ${p.zh ? 'другої' : 'другого'}?`
      : `${p.khto} ${yak(false, p)} і через ${t} ${p.chas} були на відстані ${ch(s)} ${p.od} одне від одного. Швидкість ${p.zh ? 'однієї' : 'одного'} — ${ch(v1)} ${odV(p)}. Яка швидкість ${p.zh ? 'другої' : 'другого'}?`,
    malunok: rukhDvokh({ v1, v2, t, napriamok: nazustrich ? 'nazustrich' : 'protylezhno', shukaty: 'v2', odynytsia: p.od, chas: p.chas }),
    vidpovid: v2,
    odynytsi: odV(p),
    pidkazka: `Спершу шлях ${p.zh ? 'першої' : 'першого'}: ${ch(v1)} · ${t}. Решту відстані ${p.zh ? 'подолала друга' : 'подолав другий'}.`,
    rozviazok: `${ch(v1)} · ${t} = ${ch(v1 * t)} (${p.od}), ${ch(s)} − ${ch(v1 * t)} = ${ch(v2 * t)} (${p.od}), ${ch(v2 * t)} : ${t} = ${ch(v2)} (${odV(p)})`,
  };
}

// Підступ: час руху кожного — той самий, його не додаємо.
function skilkyChasu(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY.filter((x) => x.chas === 'год'));
  const t = r.chyslo(2, 5);
  const pravylno = `${t} год`;
  return {
    pytannia: `${p.khto} ${yak(true, p)} й зустрілися через ${t} год. Скільки часу до зустрічі був у дорозі кожен?`,
    vidpovid: pravylno,
    varianty: [`${t - 1} год`, pravylno, `${2 * t} год`],
    pidkazka: 'Вони вирушили одночасно й зустрілися в одну мить.',
    rozviazok: `Кожен — ${t} год. Час руху однаковий, його не додаємо: ${t} + ${t} = ${2 * t} — це помилка.`,
  };
}

function riznytsiaShliakhiv(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PARY);
  const { v1, v2, t } = dani(r, p);
  const [shv, pov] = [Math.max(v1, v2), Math.min(v1, v2)];
  return {
    pytannia: `${p.khto} ${yak(true, p)} й зустрілися через ${t} ${p.chas}. ${shvydkosti(p, v1, v2)}. На скільки ${p.od === 'км' ? 'кілометрів' : 'метрів'} більше ${p.zh ? 'подолала швидша' : 'подолав швидший'}?`,
    vidpovid: (shv - pov) * t,
    odynytsi: p.od,
    pidkazka: 'Знайди шлях кожного до зустрічі.',
    rozviazok: `${ch(shv)} · ${t} = ${ch(shv * t)} (${p.od}), ${ch(pov)} · ${t} = ${ch(pov * t)} (${p.od}), ${ch(shv * t)} − ${ch(pov * t)} = ${ch((shv - pov) * t)} (${p.od})`,
  };
}

// Ще не зустрілися: яка відстань між ними залишилась.
function zalyshok(r: Vypadok): TrenZavdannia {
  for (;;) {
    const p = r.vybir(PARY.filter((x) => x.od === 'км' && x.krok !== 20));
    const { v1, v2, t } = dani(r, p);
    const s = (v1 + v2) * t;
    const t1 = r.chyslo(1, t - 1);
    if (t1 >= t) continue;
    const proishly = (v1 + v2) * t1;
    return {
      pytannia: `${p.khto} ${yak(true, p)}: один зі швидкістю ${v1} км/год, другий — ${v2} км/год. Відстань між ними — ${ch(s)} км. Яка відстань буде між ними через ${t1} год?`,
      vidpovid: s - proishly,
      odynytsi: 'км',
      pidkazka: `Скільки кілометрів разом вони подолають за ${t1} год?`,
      rozviazok: `(${v1} + ${v2}) · ${t1} = ${ch(proishly)} (км) — разом; ${ch(s)} − ${ch(proishly)} = ${ch(s - proishly)} (км) — ще залишилося між ними.`,
    };
  }
}

export default {
  rivni: ['знайди відстань', 'час, швидкість і підступи', 'складені задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([vidstan, vidstan, zminaZaOdynytsiu])(r);
    if (riven === 2) return r.vybir([chas, chas, shvydkistDruhoho, skilkyChasu])(r);
    return r.vybir([riznytsiaShliakhiv, zalyshok, shvydkistDruhoho, chas])(r);
  },
} satisfies Henerator;
