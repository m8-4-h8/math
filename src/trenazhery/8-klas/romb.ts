// Ромб: периметр, половина кута (діагональ — бісектриса), кут між діагоналями (90°), кути трикутника AOB, кут ромба
// за кутом між стороною і діагоналлю, правдиві й хибні твердження (ознаки, «повітряний змій»), ромб з кутом 60°.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { chotyrykutnyk } from '../chotyrykutnyky.ts';

const TN = ['Так', 'Ні'];
const LITERY: [string, string, string, string][] = [
  ['A', 'B', 'C', 'D'],
  ['K', 'L', 'M', 'N'],
  ['M', 'N', 'P', 'K'],
  ['P', 'Q', 'R', 'S'],
];
const nazva = (l: string[]) => l.join('');

function perymetr(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(3, 25);
  if (r.shans()) {
    return {
      pytannia: `Сторона ромба ${nazva(l)} дорівнює ${a} см. Знайди його периметр.`,
      vidpovid: 4 * a,
      odynytsi: 'см',
      pidkazka: 'У ромба чотири рівні сторони.',
      rozviazok: `P = 4 · ${a} = ${4 * a} см.`,
    };
  }
  return {
    pytannia: `Периметр ромба ${nazva(l)} дорівнює ${4 * a} см. Знайди сторону ${l[1]}${l[2]}.`,
    vidpovid: a,
    odynytsi: 'см',
    pidkazka: 'Усі чотири сторони ромба рівні.',
    rozviazok: `${4 * a} : 4 = ${a} см.`,
  };
}

/** Діагональ ділить кут навпіл: ∠BAD = g → ∠BAC = g/2 (за малюнком або текстом). */
function polovynaKuta(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const zMalunkom = r.shans();
  // На малюнку ∠ABD = 60°, тож числа беремо близькі до нього.
  const h = zMalunkom ? r.chyslo(50, 70) : r.chyslo(15, 75);
  const g = 2 * h;
  if (!zMalunkom) {
    return {
      pytannia: `У ромбі ${nazva(l)} ∠${l[1]}${l[0]}${l[3]} = ${g}°. Знайди ∠${l[1]}${l[0]}${l[2]}.`,
      vidpovid: h,
      odynytsi: '°',
      pidkazka: `Діагональ ${l[0]}${l[2]} ділить кут ${l[0]} навпіл.`,
      rozviazok: `Кут ${l[1]}${l[0]}${l[2]} дорівнює ${g}° : 2 = ${h}°.`,
    };
  }
  return {
    pytannia: `${nazva(l)} — ромб, ∠${l[0]}${l[1]}${l[3]} = ${h}°. Знайди ∠${l[0]}${l[1]}${l[2]}.`,
    malunok: chotyrykutnyk({ forma: 'romb', bukvy: l, diahonali: [[1, 3]] }),
    vidpovid: g,
    odynytsi: '°',
    pidkazka: `Діагональ ${l[1]}${l[3]} ділить кут ${l[1]} навпіл.`,
    rozviazok: `Кут ${l[0]}${l[1]}${l[2]} удвічі більший: 2 · ${h}° = ${g}°.`,
  };
}

/** Кут між діагоналями — завжди 90°; або кут, суміжний з ним. */
function kutMizhDiahonaliamy(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const g = r.krim(30, 150, [90]);
  const kut = r.vybir([`${l[0]}O${l[1]}`, `${l[1]}O${l[2]}`, `${l[2]}O${l[3]}`, `${l[0]}O${l[3]}`]);
  return {
    pytannia: `Діагоналі ромба ${nazva(l)} перетинаються в точці O, ∠${l[0]} = ${g}°. Знайди ∠${kut}.`,
    vidpovid: 90,
    odynytsi: '°',
    pidkazka: 'Як розташовані діагоналі ромба одна відносно одної?',
    rozviazok: `Діагоналі ромба перпендикулярні, тож кут ${kut} прямий за будь-якого кута ромба.`,
  };
}

/** Кути трикутника AOB: ∠BAD = g → ∠ABO = 90 − g/2; навпаки ∠ABD = h → ∠BAD = 180 − 2h. */
function trykutnykAOB(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const h = r.krim(15, 75, [45]);
  if (r.shans()) {
    const g = 2 * h;
    return {
      pytannia: `Діагоналі ромба ${nazva(l)} перетинаються в точці O, ∠${l[1]}${l[0]}${l[3]} = ${g}°. Знайди ∠${l[0]}${l[1]}O.`,
      vidpovid: 90 - h,
      odynytsi: '°',
      pidkazka: `${l[0]}${l[2]} ділить кут ${l[0]} навпіл, а кут ${l[0]}O${l[1]} прямий.`,
      rozviazok: `Кут ${l[1]}${l[0]}O дорівнює ${g}° : 2 = ${h}°, кут ${l[0]}O${l[1]} — 90°, тож кут ${l[0]}${l[1]}O дорівнює 90° − ${h}° = ${90 - h}°.`,
    };
  }
  return {
    pytannia: `У ромбі ${nazva(l)} ∠${l[0]}${l[1]}${l[3]} = ${h}°. Знайди ∠${l[1]}${l[0]}${l[3]}.`,
    vidpovid: 180 - 2 * h,
    odynytsi: '°',
    pidkazka: `${l[1]}${l[3]} ділить кут ${l[1]} навпіл. Сусідні кути ромба разом 180°.`,
    rozviazok: `Кут ${l[1]} дорівнює 2 · ${h}° = ${2 * h}°, тож кут ${l[0]} дорівнює 180° − ${2 * h}° = ${180 - 2 * h}°.`,
  };
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Діагоналі будь-якого ромба перпендикулярні.', true, 'Це властивість ромба.'],
    ['Діагоналі будь-якого ромба рівні.', false, 'Рівні вони лише в квадрата.'],
    ['Діагональ ромба ділить його кути навпіл.', true, 'Це властивість ромба: діагональ — бісектриса кутів, з яких виходить.'],
    ['Чотирикутник з перпендикулярними діагоналями — обов\'язково ромб.', false, 'У «повітряного змія» діагоналі теж перпендикулярні. Ознака діє лише для паралелограма.'],
    ['Паралелограм з перпендикулярними діагоналями — ромб.', true, 'Це ознака ромба.'],
    ['Паралелограм з рівними сусідніми сторонами — ромб.', true, 'Протилежні сторони паралелограма рівні, тож рівні всі чотири.'],
    ['Чотирикутник з двома парами рівних сусідніх сторін — ромб.', false, 'Так виглядає «повітряний змій»: AB = AD, CB = CD, але AB ≠ BC.'],
    ['Квадрат — це ромб.', true, 'У квадрата всі сторони рівні.'],
    ['Будь-який ромб — квадрат.', false, 'Кути ромба можуть бути не прямими.'],
    ['Усі кути ромба рівні.', false, 'Рівні лише протилежні кути; сусідні разом дають 180°.'],
  ];
  const [tekst, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження? ${tekst}`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Властивість стосується будь-якого ромба, ознака — лише паралелограма.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** Ромб з кутом 60° (або 120°): коротша діагональ дорівнює стороні. */
function kut60(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(3, 20);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Периметр ромба ${nazva(l)} дорівнює ${4 * a} см, ∠${l[0]} = 60°. Знайди діагональ ${l[1]}${l[3]}.`,
      vidpovid: a,
      odynytsi: 'см',
      pidkazka: `Сторона — ${4 * a} : 4. Який трикутник ${l[0]}${l[1]}${l[3]} при куті 60°?`,
      rozviazok: `Сторона ${4 * a} : 4 = ${a} см. Трикутник ${l[0]}${l[1]}${l[3]} рівнобедрений з кутом 60° при вершині — рівносторонній, тож ${l[1]}${l[3]} дорівнює ${a} см.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `У ромбі ${nazva(l)} ∠${l[1]} = 120°, діагональ ${l[1]}${l[3]} = ${a} см. Знайди периметр ромба.`,
      vidpovid: 4 * a,
      odynytsi: 'см',
      pidkazka: `Знайди кут ${l[0]}. Який тоді трикутник ${l[0]}${l[1]}${l[3]}?`,
      rozviazok: `Кут ${l[0]} дорівнює 180° − 120° = 60°, тож рівнобедрений трикутник ${l[0]}${l[1]}${l[3]} рівносторонній і сторона ромба дорівнює ${a} см. Периметр 4 · ${a} = ${4 * a} см.`,
    };
  }
  const P = 3 * a;
  return {
    pytannia: `У ромбі ${nazva(l)} ∠${l[0]} = 60°. Периметр трикутника ${l[0]}${l[1]}${l[3]} дорівнює ${P} см. Знайди периметр ромба.`,
    vidpovid: 4 * a,
    odynytsi: 'см',
    pidkazka: `Трикутник ${l[0]}${l[1]}${l[3]} рівносторонній, а його сторона — сторона ромба.`,
    rozviazok: `Трикутник ${l[0]}${l[1]}${l[3]} рівнобедрений з кутом 60° — рівносторонній, його сторона ${P} : 3 = ${a} см. Периметр ромба 4 · ${a} = ${4 * a} см.`,
  };
}

/** Кут між стороною і діагоналлю → більший або менший кут ромба. */
function kutRomba(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const h = r.krim(15, 75, [45]);
  const g = 2 * h;
  const bilshyi = Math.max(g, 180 - g);
  const menshyi = Math.min(g, 180 - g);
  const shukaiemo = r.shans();
  return {
    pytannia: `Діагональ ${l[0]}${l[2]} ромба ${nazva(l)} утворює зі стороною ${l[0]}${l[1]} кут ${h}°. Знайди ${shukaiemo ? 'більший' : 'менший'} кут ромба.`,
    vidpovid: shukaiemo ? bilshyi : menshyi,
    odynytsi: '°',
    pidkazka: `${l[0]}${l[2]} ділить кут ${l[0]} навпіл, тож кут ${l[0]} — це 2 · ${h}°.`,
    rozviazok: `Кут ${l[0]} дорівнює 2 · ${h}° = ${g}°, сусідній кут — 180° − ${g}° = ${180 - g}°. ${shukaiemo ? 'Більший' : 'Менший'} з них — ${shukaiemo ? bilshyi : menshyi}°.`,
  };
}

export default {
  rivni: ['сторони й кути', 'з підступом', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([perymetr, polovynaKuta, kutMizhDiahonaliamy])(r);
    if (riven === 2) return r.vybir([tverdzhennia, trykutnykAOB, polovynaKuta])(r);
    return r.vybir([kut60, kutRomba, trykutnykAOB])(r);
  },
} satisfies Henerator;
