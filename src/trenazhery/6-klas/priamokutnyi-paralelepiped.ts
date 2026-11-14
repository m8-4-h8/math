// Прямокутний паралелепіпед. Куб. Розгортка (Істер § 48): 6 граней, 12 ребер, 8 вершин; сума довжин ребер 4(a + b + c),
// у куба 12a; площа поверхні S = 2(ab + bc + ac), у куба 6a²; обернені задачі (ребро куба за площею поверхні чи сумою
// ребер); коробка без кришки.
import { ch, des, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const ODYNYTSI = ['см', 'дм', 'м'];

function elementy(r: Vypadok): TrenZavdannia {
  const tilo = r.vybir(['прямокутного паралелепіпеда', 'куба']);
  const [shcho, v, ch_] = r.vybir([
    ['граней', 6, 'Верх, низ, перед, зад і два боки — 6.'],
    ['ребер', 12, '4 ребра зверху, 4 знизу і 4 бічні — 12.'],
    ['вершин', 8, '4 вершини внизу і 4 вгорі — 8.'],
  ] as [string, number, string][]);
  return {
    pytannia: `Скільки ${shcho} у ${tilo}?`,
    vidpovid: v,
    pidkazka: 'Уяви коробку: що в неї зверху, знизу і з боків?',
    rozviazok: ch_,
  };
}

function sumaReber(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  if (r.shans(0.35)) {
    const a = r.chyslo(2, 15);
    if (r.shans()) {
      return {
        pytannia: `Знайди суму довжин усіх ребер куба з ребром ${a} ${o}.`,
        vidpovid: 12 * a,
        odynytsi: o,
        pidkazka: 'У куба 12 однакових ребер.',
        rozviazok: `12 · ${a} = ${12 * a} (${o})`,
      };
    }
    return {
      pytannia: `Сума довжин усіх ребер куба — ${12 * a} ${o}. Знайди довжину ребра.`,
      vidpovid: a,
      odynytsi: o,
      pidkazka: 'У куба 12 однакових ребер.',
      rozviazok: `${12 * a} : 12 = ${a} (${o})`,
    };
  }
  const [a, b, c] = [r.chyslo(2, 15), r.chyslo(2, 12), r.chyslo(1, 10)];
  return {
    pytannia: `Знайди суму довжин усіх ребер прямокутного паралелепіпеда з вимірами ${a} ${o}, ${b} ${o} і ${c} ${o}.`,
    vidpovid: 4 * (a + b + c),
    odynytsi: o,
    pidkazka: 'Ребер кожного виміру — по чотири.',
    rozviazok: `4 · (${a} + ${b} + ${c}) = 4 · ${a + b + c} = ${4 * (a + b + c)} (${o})`,
  };
}

function ploshcha(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  if (r.shans(0.35)) {
    const a = r.chyslo(2, 12);
    return {
      pytannia: `Знайди площу поверхні куба з ребром ${a} ${o}.`,
      vidpovid: 6 * a * a,
      odynytsi: `${o}²`,
      pidkazka: `Шість однакових квадратів по ${a} · ${a}.`,
      rozviazok: `6 · ${a} · ${a} = 6 · ${a * a} = ${6 * a * a} (${o}²)`,
    };
  }
  const [a, b, c] = [r.chyslo(2, 12), r.chyslo(2, 10), r.chyslo(1, 9)];
  const S = 2 * (a * b + b * c + a * c);
  return {
    pytannia: `Знайди площу поверхні прямокутного паралелепіпеда з вимірами ${a} ${o}, ${b} ${o} і ${c} ${o}.`,
    vidpovid: S,
    odynytsi: `${o}²`,
    pidkazka: `Три пари однакових граней: ${a} · ${b}, ${b} · ${c} і ${a} · ${c}.`,
    rozviazok: `2 · (${a * b} + ${b * c} + ${a * c}) = 2 · ${a * b + b * c + a * c} = ${S} (${o}²)`,
  };
}

function obernena(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  const a = r.chyslo(2, 12);
  if (r.shans()) {
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

/** Коробка без кришки, фарбування, десяткові виміри. */
function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const [a, b, c] = [r.chyslo(10, 40), r.chyslo(10, 30), r.chyslo(5, 20)];
    const S = a * b + 2 * (a * c + b * c);
    return {
      pytannia: `Скільки квадратних сантиметрів картону піде на коробку без кришки довжиною ${a} см, шириною ${b} см і висотою ${c} см?`,
      vidpovid: S,
      odynytsi: 'см²',
      pidkazka: 'Без кришки — п’ять граней: дно і чотири бічні.',
      rozviazok: `Дно ${a} · ${b} = ${a * b}; бічні 2 · (${a} · ${c} + ${b} · ${c}) = ${2 * (a * c + b * c)}; разом ${S} (см²)`,
    };
  }
  if (typ === 1) {
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
  // куб з десятковим ребром
  const a = r.krim(11, 39, [20, 30]); // десяті
  const S = 6 * a * a; // соті
  return {
    pytannia: `Знайди площу поверхні куба з ребром ${des(a, 1)} см.`,
    vidpovid: des(S, 2),
    odynytsi: 'см²',
    pidkazka: `Площа грані — ${des(a, 1)} · ${des(a, 1)}, граней шість.`,
    rozviazok: `${des(a, 1)} · ${des(a, 1)} = ${des(a * a, 2)}; 6 · ${des(a * a, 2)} = ${des(S, 2)} (см²)`,
  };
}

export default {
  rivni: ['грані, ребра, вершини; сума ребер', 'площа поверхні', 'обернені задачі, коробки, фарба'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.3) ? elementy(r) : sumaReber(r);
    if (riven === 2) return r.vybir([ploshcha, ploshcha, ploshcha, sumaReber])(r);
    return r.vybir([obernena, zadacha, zadacha, ploshcha])(r);
  },
} satisfies Henerator;
