// Прямокутник: рівні діагоналі (половини діагоналей, малюнок з «?»), кут між діагоналлю і стороною, кут між
// діагоналями (рівнобедрені трикутники AOB і AOD), правдиві й хибні твердження (ознаки), периметр трикутника AOB,
// бісектриса прямого кута, катет проти кута 30°.
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

/** Половина діагоналі: за малюнком (відома одна половина) або за довжиною діагоналі. */
function polovyna(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const h = r.chyslo(3, 15);
  if (r.shans()) {
    const vidoma = r.chyslo(0, 3);
    let shukana = r.chyslo(0, 3);
    if (shukana === vidoma) shukana = (shukana + 1) % 4;
    const nazvy = [`${l[0]}O`, `O${l[2]}`, `${l[1]}O`, `O${l[3]}`];
    const pidpysy = [0, 1, 2, 3].map((i) => (i === vidoma ? `${h}` : i === shukana ? '?' : undefined));
    return {
      pytannia: `${nazva(l)} — прямокутник, O — точка перетину діагоналей. Знайди ${nazvy[shukana]}.`,
      malunok: chotyrykutnyk({ forma: 'priamokutnyk', bukvy: l, peretyn: 'O', pidpysyDiahonalei: pidpysy, priami: [0] }),
      vidpovid: h,
      pidkazka: 'Діагоналі прямокутника рівні й діляться навпіл.',
      rozviazok: `Усі чотири половини діагоналей рівні, тож ${nazvy[shukana]} дорівнює ${nazvy[vidoma]}, тобто ${h}.`,
    };
  }
  return {
    pytannia: `Діагоналі прямокутника ${nazva(l)} перетинаються в точці O, ${l[0]}${l[2]} = ${2 * h} см. Знайди ${l[1]}O.`,
    vidpovid: h,
    odynytsi: 'см',
    pidkazka: `Діагоналі прямокутника рівні: ${l[1]}${l[3]} = ${l[0]}${l[2]}.`,
    rozviazok: `${l[1]}${l[3]} дорівнює ${2 * h} см, а ${l[1]}O — його половина: ${2 * h} : 2 = ${h} см.`,
  };
}

/** Кут між діагоналлю і стороною. */
function kutZiStoronoiu(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const g = r.chyslo(15, 75);
  if (r.shans()) {
    return {
      pytannia: `У прямокутнику ${nazva(l)} ∠${l[1]}${l[0]}${l[2]} = ${g}°. Знайди ∠${l[2]}${l[0]}${l[3]}.`,
      vidpovid: 90 - g,
      odynytsi: '°',
      pidkazka: `Діагональ ${l[0]}${l[2]} ділить прямий кут ${l[0]} на дві частини.`,
      rozviazok: `Кут ${l[0]} прямий, тож кут ${l[2]}${l[0]}${l[3]} дорівнює 90° − ${g}° = ${90 - g}°.`,
    };
  }
  return {
    pytannia: `Діагоналі прямокутника ${nazva(l)} перетинаються в точці O, ∠${l[1]}${l[0]}${l[2]} = ${g}°. Знайди ∠${l[0]}${l[1]}${l[3]}.`,
    vidpovid: g,
    odynytsi: '°',
    pidkazka: `${l[0]}O = ${l[1]}O. Який тоді трикутник ${l[0]}O${l[1]}?`,
    rozviazok: `${l[0]}O = ${l[1]}O, тож трикутник ${l[0]}O${l[1]} рівнобедрений, а кути при основі ${l[0]}${l[1]} рівні: кут ${l[0]}${l[1]}${l[3]} дорівнює ${g}°.`,
  };
}

/** Кут між діагоналями за кутом між діагоналлю і стороною, і навпаки. */
function kutMizhDiahonaliamy(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const g = r.krim(15, 75, [45]);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Діагоналі прямокутника ${nazva(l)} перетинаються в точці O, ∠${l[2]}${l[0]}${l[3]} = ${g}°. Знайди ∠${l[0]}O${l[3]}.`,
      vidpovid: 180 - 2 * g,
      odynytsi: '°',
      pidkazka: `${l[0]}O = O${l[3]}: трикутник ${l[0]}O${l[3]} рівнобедрений.`,
      rozviazok: `Кути при основі ${l[0]}${l[3]} рівні по ${g}°, тож кут ${l[0]}O${l[3]} дорівнює 180° − ${g}° − ${g}° = ${180 - 2 * g}°.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Діагоналі прямокутника ${nazva(l)} перетинаються в точці O, ∠${l[2]}${l[0]}${l[3]} = ${g}°. Знайди ∠${l[0]}O${l[1]}.`,
      vidpovid: 2 * g,
      odynytsi: '°',
      pidkazka: `Спершу знайди ∠${l[0]}O${l[3]} з рівнобедреного трикутника ${l[0]}O${l[3]}. Кути ${l[0]}O${l[1]} і ${l[0]}O${l[3]} суміжні.`,
      rozviazok: `Кут ${l[0]}O${l[3]} дорівнює 180° − ${g}° − ${g}° = ${180 - 2 * g}°, а суміжний кут ${l[0]}O${l[1]} дорівнює 180° − ${180 - 2 * g}° = ${2 * g}°.`,
    };
  }
  const w = 2 * r.chyslo(20, 70);
  return {
    pytannia: `Діагоналі прямокутника ${nazva(l)} перетинаються в точці O, ∠${l[0]}O${l[1]} = ${w}°. Знайди ∠O${l[0]}${l[1]}.`,
    vidpovid: (180 - w) / 2,
    odynytsi: '°',
    pidkazka: `${l[0]}O = ${l[1]}O: кути при основі ${l[0]}${l[1]} рівні.`,
    rozviazok: `Кут O${l[0]}${l[1]} дорівнює (180° − ${w}°) : 2 = ${(180 - w) / 2}°.`,
  };
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Діагоналі будь-якого прямокутника рівні.', true, 'Це властивість прямокутника.'],
    ['Діагоналі будь-якого прямокутника перпендикулярні.', false, 'Перпендикулярні вони лише в квадрата.'],
    ['Діагональ прямокутника ділить його кут навпіл.', false, 'Так буває лише в квадрата: якщо сторони різні, частини кута різні.'],
    ['Паралелограм з рівними діагоналями — прямокутник.', true, 'Це ознака прямокутника.'],
    ['Чотирикутник з рівними діагоналями — обов\'язково прямокутник.', false, 'У рівнобічної трапеції діагоналі теж рівні.'],
    ['Паралелограм з одним прямим кутом — прямокутник.', true, 'Сусідні кути разом 180°, тож усі кути прямі.'],
    ['Чотирикутник з одним прямим кутом — прямокутник.', false, 'Інші кути можуть бути не прямими. Ознака діє лише для паралелограма.'],
    ['Точка перетину діагоналей прямокутника однаково віддалена від усіх його вершин.', true, 'AO = BO = CO = DO — половини рівних діагоналей.'],
    ['Квадрат — це прямокутник.', true, 'У квадрата всі кути прямі.'],
    ['Будь-який прямокутник — квадрат.', false, 'Сусідні сторони прямокутника можуть бути різними.'],
  ];
  const [tekst, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження? ${tekst}`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Властивість стосується будь-якого прямокутника, ознака — лише паралелограма.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** Периметр трикутника AOB або AOD. */
function perymetrTrykutnyka(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  for (;;) {
    const h = r.chyslo(3, 15);
    const a = r.chyslo(2, 2 * h - 1);
    const storona = r.shans() ? [l[0], l[1]] : [l[0], l[3]];
    const P = 2 * h + a;
    return {
      pytannia: `Діагональ прямокутника ${nazva(l)} дорівнює ${2 * h} см, ${storona.join('')} = ${a} см. O — точка перетину діагоналей. Знайди периметр трикутника ${storona[0]}O${storona[1]}.`,
      vidpovid: P,
      odynytsi: 'см',
      pidkazka: `${storona[0]}O і O${storona[1]} — половини рівних діагоналей.`,
      rozviazok: `${storona[0]}O = O${storona[1]} = ${2 * h} : 2 = ${h} см. Периметр ${h} + ${h} + ${a} = ${P} см.`,
    };
  }
}

/** Бісектриса кута A ділить BC на BK = a і KC = b. */
function bisektrysa(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(2, 15);
  const b = r.chyslo(1, 12);
  const P = 2 * (a + a + b);
  return {
    pytannia: `Бісектриса кута ${l[0]} прямокутника ${nazva(l)} перетинає сторону ${l[1]}${l[2]} у точці T, ${l[1]}T = ${a} см, T${l[2]} = ${b} см. Знайди периметр прямокутника.`,
    vidpovid: P,
    odynytsi: 'см',
    pidkazka: `Бісектриса прямого кута утворює зі стороною кут 45°. Який тоді трикутник ${l[0]}${l[1]}T?`,
    rozviazok: `У прямокутному трикутнику ${l[0]}${l[1]}T обидва гострі кути по 45°, тож ${l[0]}${l[1]} = ${l[1]}T = ${a} см. ${l[1]}${l[2]} = ${a} + ${b} = ${a + b} см, P = 2 · (${a} + ${a + b}) = ${P} см.`,
  };
}

/** ∠CAD = 30°, CD = c → BD = AC = 2c; або ∠AOB = 60°, AC = 2h → AB = h. */
function trydtsiat(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const c = r.chyslo(3, 20);
  if (r.shans()) {
    return {
      pytannia: `У прямокутнику ${nazva(l)} ∠${l[2]}${l[0]}${l[3]} = 30°, ${l[2]}${l[3]} = ${c} см. Знайди діагональ ${l[1]}${l[3]}.`,
      vidpovid: 2 * c,
      odynytsi: 'см',
      pidkazka: `У прямокутному трикутнику ${l[0]}${l[2]}${l[3]} катет ${l[2]}${l[3]} лежить проти кута 30°.`,
      rozviazok: `Катет проти кута 30° дорівнює половині гіпотенузи, тож ${l[0]}${l[2]} = 2 · ${c} = ${2 * c} см. Діагоналі прямокутника рівні: ${l[1]}${l[3]} теж ${2 * c} см.`,
    };
  }
  return {
    pytannia: `Діагоналі прямокутника ${nazva(l)} перетинаються в точці O, ${l[0]}${l[2]} = ${2 * c} см, ∠${l[0]}O${l[1]} = 60°. Знайди ${l[0]}${l[1]}.`,
    vidpovid: c,
    odynytsi: 'см',
    pidkazka: `${l[0]}O = ${l[1]}O. Який трикутник ${l[0]}O${l[1]}, якщо кут при вершині 60°?`,
    rozviazok: `${l[0]}O = ${l[1]}O = ${2 * c} : 2 = ${c} см. Кути при основі (180° − 60°) : 2 = 60°, тож трикутник рівносторонній і ${l[0]}${l[1]} дорівнює ${c} см.`,
  };
}

export default {
  rivni: ['діагоналі й кути', 'з підступом', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([polovyna, kutZiStoronoiu, polovyna])(r);
    if (riven === 2) return r.vybir([tverdzhennia, kutMizhDiahonaliamy, kutZiStoronoiu])(r);
    return r.vybir([perymetrTrykutnyka, bisektrysa, trydtsiat, kutMizhDiahonaliamy])(r);
  },
} satisfies Henerator;
