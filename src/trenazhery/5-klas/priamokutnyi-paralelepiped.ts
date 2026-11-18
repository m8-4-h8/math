// Прямокутний паралелепіпед і куб (Скворцова, 5 клас, с. 151–153): грані, ребра, вершини; сума довжин ребер
// 4(a + b + c), у куба 12a (каркас із дроту); площа поверхні 2(ab + bc + ac), у куба 6a²; площа бічних граней;
// коробка й акваріум без кришки; ребро куба за сумою ребер чи площею поверхні.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const ODYNYTSI = ['см', 'дм', 'м'];

function elementy(r: Vypadok): TrenZavdannia {
  const tilo = r.vybir(['прямокутного паралелепіпеда', 'куба']);
  const [shcho, v, poiasnennia] = r.vybir([
    ['граней', 6, 'Верх, низ, перед, зад і два боки — 6.'],
    ['ребер', 12, '4 ребра зверху, 4 знизу і 4 бічні — 12.'],
    ['вершин', 8, '4 вершини внизу і 4 вгорі — 8.'],
    ['бічних граней', 4, 'Без двох основ: 6 − 2 = 4.'],
  ] as [string, number, string][]);
  return {
    pytannia: `Скільки ${shcho} у ${tilo}?`,
    vidpovid: v,
    pidkazka: 'Уяви коробку: що в неї зверху, знизу і з боків?',
    rozviazok: poiasnennia,
  };
}

function sumaReber(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  if (r.shans(0.35)) {
    const a = r.chyslo(2, 25);
    return {
      pytannia: `Знайди суму довжин усіх ребер куба з ребром ${a} ${o}.`,
      vidpovid: 12 * a,
      odynytsi: o,
      pidkazka: 'У куба 12 однакових ребер.',
      rozviazok: `12 · ${a} = ${12 * a} (${o})`,
    };
  }
  const [a, b, c] = [r.chyslo(2, 30), r.chyslo(2, 20), r.chyslo(1, 15)];
  const karkas = r.shans();
  return {
    pytannia: karkas
      ? `Із дроту роблять каркас прямокутного паралелепіпеда з вимірами ${a} см, ${b} см і ${c} см. Скільки сантиметрів дроту потрібно?`
      : `Знайди суму довжин усіх ребер прямокутного паралелепіпеда з вимірами ${a} ${o}, ${b} ${o} і ${c} ${o}.`,
    vidpovid: 4 * (a + b + c),
    odynytsi: karkas ? 'см' : o,
    pidkazka: 'Ребер кожного виміру — по чотири.',
    rozviazok: `4 · (${a} + ${b} + ${c}) = 4 · ${a + b + c} = ${4 * (a + b + c)} (${karkas ? 'см' : o})`,
  };
}

function ploshcha(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  if (r.shans(0.3)) {
    const a = r.chyslo(2, 12);
    return {
      pytannia: `Знайди площу поверхні куба з ребром ${a} ${o}.`,
      vidpovid: 6 * a * a,
      odynytsi: `${o}²`,
      pidkazka: `Шість однакових квадратів по ${a} · ${a}.`,
      rozviazok: `6 · ${a} · ${a} = 6 · ${a * a} = ${6 * a * a} (${o}²)`,
    };
  }
  const [a, b, c] = [r.chyslo(2, 15), r.chyslo(2, 12), r.chyslo(1, 10)];
  const S = 2 * (a * b + b * c + a * c);
  return {
    pytannia: `Знайди площу поверхні прямокутного паралелепіпеда з вимірами ${a} ${o}, ${b} ${o} і ${c} ${o}.`,
    vidpovid: S,
    odynytsi: `${o}²`,
    pidkazka: `Три пари однакових граней: ${a} · ${b}, ${b} · ${c} і ${a} · ${c}.`,
    rozviazok: `2 · (${a * b} + ${b * c} + ${a * c}) = 2 · ${a * b + b * c + a * c} = ${S} (${o}²)`,
  };
}

/** Площа бічних граней: основа a × b, висота c. */
function bichni(r: Vypadok): TrenZavdannia {
  const [a, b, c] = [r.chyslo(3, 15), r.chyslo(2, 12), r.chyslo(2, 12)];
  const o = r.vybir(['см', 'дм']);
  const S = 2 * (a * c + b * c);
  return {
    pytannia: `Основа прямокутного паралелепіпеда — прямокутник ${a} ${o} на ${b} ${o}, висота — ${c} ${o}. Знайди суму площ його бічних граней.`,
    vidpovid: S,
    odynytsi: `${o}²`,
    pidkazka: `Бічних граней чотири: дві ${a} · ${c} і дві ${b} · ${c}. Основи не рахуємо.`,
    rozviazok: `2 · ${a} · ${c} + 2 · ${b} · ${c} = ${2 * a * c} + ${2 * b * c} = ${S} (${o}²)`,
  };
}

function obernena(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  const a = r.chyslo(2, 12);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Сума довжин усіх ребер куба — ${12 * a} ${o}. Знайди довжину ребра.`,
      vidpovid: a,
      odynytsi: o,
      pidkazka: 'У куба 12 однакових ребер.',
      rozviazok: `${12 * a} : 12 = ${a} (${o})`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Площа поверхні куба — ${6 * a * a} ${o}². Знайди площу однієї грані.`,
      vidpovid: a * a,
      odynytsi: `${o}²`,
      pidkazka: 'У куба шість однакових граней.',
      rozviazok: `${6 * a * a} : 6 = ${a * a} (${o}²)`,
    };
  }
  return {
    pytannia: `Площа поверхні куба — ${6 * a * a} ${o}². Знайди довжину ребра.`,
    vidpovid: a,
    odynytsi: o,
    pidkazka: 'Спершу площа однієї грані: поділи на 6. Потім — яке число, помножене саме на себе, дає її?',
    rozviazok: `${6 * a * a} : 6 = ${a * a}; ${a} · ${a} = ${a * a}, тож ребро ${a} ${o}`,
  };
}

/** Коробка чи акваріум без кришки, фарбування куба. */
function zadacha(r: Vypadok): TrenZavdannia {
  if (r.shans(0.7)) {
    const b = r.chyslo(8, 30);
    const a = r.chyslo(b + 2, 45); // довжина більша за ширину
    const c = r.chyslo(5, 25);
    const S = a * b + 2 * (a * c + b * c);
    const shcho = r.vybir(['акваріум без кришки', 'коробку без кришки']);
    const z = shcho.startsWith('акваріум') ? 'скла' : 'картону';
    return {
      pytannia: `Скільки квадратних сантиметрів ${z} піде на ${shcho} довжиною ${a} см, шириною ${b} см і висотою ${c} см?`,
      vidpovid: S,
      odynytsi: 'см²',
      pidkazka: 'Без кришки — п’ять граней: дно і чотири бічні.',
      rozviazok: `Дно ${a} · ${b} = ${ch(a * b)}; бічні 2 · ${a} · ${c} + 2 · ${b} · ${c} = ${ch(2 * (a * c + b * c))}; разом ${ch(a * b)} + ${ch(2 * (a * c + b * c))} = ${ch(S)} (см²)`,
    };
  }
  const a = r.chyslo(2, 9); // дм
  const farba = r.vybir([2, 3, 4, 5]); // г на 1 дм²
  const S = 6 * a * a;
  return {
    pytannia: `Куб з ребром ${a} дм фарбують з усіх боків. На 1 дм² іде ${farba} г фарби. Скільки грамів фарби потрібно?`,
    vidpovid: S * farba,
    odynytsi: 'г',
    pidkazka: 'Спершу площа поверхні куба.',
    rozviazok: `S = 6 · ${a} · ${a} = ${S} (дм²); ${S} · ${farba} = ${S * farba} (г)`,
  };
}

export default {
  rivni: ['грані, ребра, вершини; сума ребер', 'площа поверхні й бічних граней', 'без кришки, фарба, обернені задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.3) ? elementy(r) : sumaReber(r);
    if (riven === 2) return r.vybir([ploshcha, ploshcha, bichni, sumaReber])(r);
    return r.vybir([zadacha, zadacha, obernena, bichni])(r);
  },
} satisfies Henerator;
