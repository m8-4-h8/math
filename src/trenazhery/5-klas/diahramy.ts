// Стовпчасті діаграми: прочитати висоту стовпчика за шкалою (і посередині між лініями), найбільше й
// найменше, «на скільки більше», «разом», «у скільки разів». Числа на стовпчиках не пишемо — їх треба
// прочитати за шкалою, інакше відповідь видно на малюнку.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { diahrama } from '../malunky.ts';

interface Nabir {
  opys: string;
  pidpysy: string[];
  /** Назви для варіантів відповіді. */
  povni: string[];
  /** Крок шкали; значення — кратні половині кроку, щоб їх можна було прочитати. */
  krok: number;
  max: number;
  odynytsi?: string;
  skilky: (i: number) => string;
  naibilshe: string;
  naimenshe: string;
  bilshe: (i: number, j: number) => string;
  razom: string;
  raziv: (i: number, j: number) => string;
}

const DNI = ['у понеділок', 'у вівторок', 'у середу', 'у четвер'];
const MISIATSI = ['у березні', 'у квітні', 'у травні', 'у червні'];
const KLASY = ['5-А', '5-Б', '5-В', '5-Г'];
const FRUKTY = ['яблук', 'груш', 'слив', 'персиків'];

const NABORY: Nabir[] = [
  {
    opys: 'Діаграма показує, скільки книжок узяли в шкільній бібліотеці.',
    pidpysy: ['Пн', 'Вт', 'Ср', 'Чт'],
    povni: ['понеділок', 'вівторок', 'середа', 'четвер'],
    krok: 10,
    max: 60,
    skilky: (i) => `Скільки книжок узяли ${DNI[i]}?`,
    naibilshe: 'Якого дня взяли найбільше книжок?',
    naimenshe: 'Якого дня взяли найменше книжок?',
    bilshe: (i, j) => `На скільки більше книжок узяли ${DNI[i]}, ніж ${DNI[j]}?`,
    razom: 'Скільки книжок узяли за ці чотири дні разом?',
    raziv: (i, j) => `У скільки разів більше книжок узяли ${DNI[i]}, ніж ${DNI[j]}?`,
  },
  {
    opys: 'Діаграма показує, скільки кілограмів макулатури зібрали п’яті класи.',
    pidpysy: KLASY,
    povni: KLASY,
    krok: 20,
    max: 120,
    odynytsi: 'кг',
    skilky: (i) => `Скільки кілограмів макулатури зібрав ${KLASY[i]} клас?`,
    naibilshe: 'Який клас зібрав найбільше макулатури?',
    naimenshe: 'Який клас зібрав найменше макулатури?',
    bilshe: (i, j) => `На скільки кілограмів більше зібрав ${KLASY[i]} клас, ніж ${KLASY[j]}?`,
    razom: 'Скільки кілограмів макулатури зібрали всі чотири класи разом?',
    raziv: (i, j) => `У скільки разів більше макулатури зібрав ${KLASY[i]} клас, ніж ${KLASY[j]}?`,
  },
  {
    opys: 'Діаграма показує, скільки дощових днів було навесні й на початку літа.',
    pidpysy: ['бер.', 'квіт.', 'трав.', 'черв.'],
    povni: ['березень', 'квітень', 'травень', 'червень'],
    krok: 2,
    max: 14,
    skilky: (i) => `Скільки дощових днів було ${MISIATSI[i]}?`,
    naibilshe: 'У якому місяці було найбільше дощових днів?',
    naimenshe: 'У якому місяці було найменше дощових днів?',
    bilshe: (i, j) => `На скільки більше дощових днів було ${MISIATSI[i]}, ніж ${MISIATSI[j]}?`,
    razom: 'Скільки дощових днів було за ці чотири місяці разом?',
    raziv: (i, j) => `У скільки разів більше дощових днів було ${MISIATSI[i]}, ніж ${MISIATSI[j]}?`,
  },
  {
    opys: 'Діаграма показує, скільки кілограмів фруктів продали на ринку за день.',
    pidpysy: ['яблука', 'груші', 'сливи', 'персики'],
    povni: ['яблука', 'груші', 'сливи', 'персики'],
    krok: 10,
    max: 70,
    odynytsi: 'кг',
    skilky: (i) => `Скільки кілограмів ${FRUKTY[i]} продали?`,
    naibilshe: 'Яких фруктів продали найбільше?',
    naimenshe: 'Яких фруктів продали найменше?',
    bilshe: (i, j) => `На скільки кілограмів більше продали ${FRUKTY[i]}, ніж ${FRUKTY[j]}?`,
    razom: 'Скільки кілограмів фруктів продали разом?',
    raziv: (i, j) => `У скільки разів більше продали ${FRUKTY[i]}, ніж ${FRUKTY[j]}?`,
  },
];

/** Набір і чотири різні значення, кратні половині кроку шкали. */
function dani(r: Vypadok, zKratnymy = false) {
  const n = r.vybir(NABORY);
  const pol = n.krok / 2;
  for (;;) {
    const z = r.rizni(4, 1, n.max / pol).map((k) => k * pol);
    if (!zKratnymy) return { n, z, para: [0, 1] as [number, number] };
    const pary: [number, number][] = [];
    z.forEach((a, i) => z.forEach((b, j) => i !== j && a % b === 0 && pary.push([i, j])));
    if (pary.length) return { n, z, para: r.vybir(pary) };
  }
}

const malunok = (n: Nabir, z: number[]) =>
  diahrama(
    n.pidpysy.map((p, i) => [p, z[i]]),
    n.krok,
    n.odynytsi,
  );

/** Як прочитати висоту стовпчика: на лінії шкали чи посередині між двома лініями. */
function yakChytaty(n: Nabir, i: number, v: number) {
  const nyzhche = Math.floor(v / n.krok) * n.krok;
  return v === nyzhche
    ? `верх стовпчика «${n.pidpysy[i]}» — на лінії ${v}`
    : `верх стовпчика «${n.pidpysy[i]}» — посередині між ${nyzhche} і ${nyzhche + n.krok}, тобто ${v}`;
}

function chytaty(r: Vypadok): TrenZavdannia {
  const { n, z } = dani(r);
  const i = r.chyslo(0, 3);
  return {
    pytannia: `${n.opys} ${n.skilky(i)}`,
    malunok: malunok(n, z),
    vidpovid: z[i],
    odynytsi: n.odynytsi,
    pidkazka: `Знайди верх стовпчика і подивись на шкалу ліворуч. Лінії йдуть через ${n.krok}.`,
    rozviazok: `Лінії шкали йдуть через ${n.krok}; ${yakChytaty(n, i, z[i])}.`,
  };
}

function naibilshe(r: Vypadok): TrenZavdannia {
  const { n, z } = dani(r);
  const bilshe = r.shans();
  const v = bilshe ? Math.max(...z) : Math.min(...z);
  const i = z.indexOf(v);
  return {
    pytannia: `${n.opys} ${bilshe ? n.naibilshe : n.naimenshe}`,
    malunok: malunok(n, z),
    vidpovid: n.povni[i],
    varianty: n.povni,
    pidkazka: bilshe ? 'Шукай найвищий стовпчик.' : 'Шукай найнижчий стовпчик.',
    rozviazok: `${bilshe ? 'Найвищий' : 'Найнижчий'} стовпчик — «${n.pidpysy[i]}» (${v}${n.odynytsi ? ' ' + n.odynytsi : ''}).`,
  };
}

function bilshe(r: Vypadok): TrenZavdannia {
  const { n, z } = dani(r);
  const [p, q] = r.rizni(2, 0, 3);
  const [i, j] = z[p] > z[q] ? [p, q] : [q, p];
  return {
    pytannia: `${n.opys} ${n.bilshe(i, j)}`,
    malunok: malunok(n, z),
    vidpovid: z[i] - z[j],
    odynytsi: n.odynytsi,
    pidkazka: '«На скільки більше» — від більшого числа відніми менше.',
    rozviazok: `«${n.pidpysy[i]}» — ${z[i]}, «${n.pidpysy[j]}» — ${z[j]}; ${z[i]} − ${z[j]} = ${z[i] - z[j]}.`,
  };
}

function razom(r: Vypadok): TrenZavdannia {
  const { n, z } = dani(r);
  const s = z.reduce((a, b) => a + b, 0);
  return {
    pytannia: `${n.opys} ${n.razom}`,
    malunok: malunok(n, z),
    vidpovid: s,
    odynytsi: n.odynytsi,
    pidkazka: 'Прочитай висоту кожного стовпчика і додай усі чотири числа.',
    rozviazok: `${z.join(' + ')} = ${s}`,
  };
}

function raziv(r: Vypadok): TrenZavdannia {
  const { n, z, para } = dani(r, true);
  const [i, j] = para;
  return {
    pytannia: `${n.opys} ${n.raziv(i, j)}`,
    malunok: malunok(n, z),
    vidpovid: z[i] / z[j],
    pidkazka: '«У скільки разів» — більше число поділи на менше.',
    rozviazok: `«${n.pidpysy[i]}» — ${z[i]}, «${n.pidpysy[j]}» — ${z[j]}; ${z[i]} : ${z[j]} = ${z[i] / z[j]}. Не плутай з «на скільки»: ${z[i]} − ${z[j]} = ${z[i] - z[j]}.`,
  };
}

export default {
  rivni: ['читаємо діаграму', 'на скільки більше і разом', 'у скільки разів'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.65) ? chytaty(r) : naibilshe(r);
    if (riven === 2) return r.vybir([bilshe, bilshe, razom, chytaty])(r);
    return r.vybir([raziv, raziv, bilshe, razom])(r);
  },
} satisfies Henerator;
