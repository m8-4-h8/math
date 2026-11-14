// Паралелограм і його властивості: протилежні й сусідні кути (за малюнком і текстом), периметр, половина діагоналі,
// сума двох кутів (протилежні чи сусідні), «на … більший» і відношення кутів, правдиві й хибні твердження,
// бісектриса кута відтинає рівнобедрений трикутник, периметр трикутника AOB.
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
const storona = (l: string[], i: number) => l[i] + l[(i + 1) % 4];

/** Гострий кут паралелограма, близький до кута малюнка (63°), щоб підписи не суперечили тому, що видно. */
const hostryi = (r: Vypadok) => r.chyslo(45, 85);

function kutZaMalunkom(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = hostryi(r);
  const k = [a, 180 - a, a, 180 - a];
  const vidomyi = r.chyslo(0, 3);
  let shukanyi = r.chyslo(0, 3);
  if (shukanyi === vidomyi) shukanyi = (shukanyi + 1) % 4;
  const kuty = [0, 1, 2, 3].map((i) => (i === vidomyi ? `${k[i]}°` : i === shukanyi ? '?' : ''));
  const protylezhni = (vidomyi + 2) % 4 === shukanyi;
  return {
    pytannia: `${nazva(l)} — паралелограм. Знайди кут ${l[shukanyi]}.`,
    malunok: chotyrykutnyk({ forma: 'paralelohram', bukvy: l, kuty }),
    vidpovid: k[shukanyi],
    odynytsi: '°',
    pidkazka: protylezhni ? 'Ці кути протилежні.' : 'Ці кути прилеглі до однієї сторони — сусідні.',
    rozviazok: protylezhni
      ? `Протилежні кути паралелограма рівні: кут ${l[shukanyi]} дорівнює ${k[vidomyi]}°.`
      : `Сусідні кути разом 180°, тож кут ${l[shukanyi]} дорівнює 180° − ${k[vidomyi]}° = ${k[shukanyi]}°.`,
  };
}

function kutTekstom(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const g = r.krim(20, 160, [90]);
  const v = r.chyslo(0, 3);
  const sus = r.shans();
  const n = sus ? (v + 1) % 4 : (v + 2) % 4;
  const vidp = sus ? 180 - g : g;
  return {
    pytannia: `У паралелограмі ${nazva(l)} ∠${l[v]} = ${g}°. Знайди ∠${l[n]}.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `${l[v]} і ${l[n]} — ${sus ? 'сусідні вершини' : 'протилежні вершини'}.`,
    rozviazok: sus ? `Сусідні кути разом 180°: кут ${l[n]} дорівнює 180° − ${g}° = ${vidp}°.` : `Протилежні кути рівні: кут ${l[n]} дорівнює ${g}°.`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(3, 25);
  const b = r.krim(3, 30, [a]);
  const P = 2 * (a + b);
  if (r.shans()) {
    return {
      pytannia: `Сусідні сторони паралелограма ${nazva(l)}: ${storona(l, 0)} = ${a} см, ${storona(l, 1)} = ${b} см. Знайди його периметр.`,
      vidpovid: P,
      odynytsi: 'см',
      pidkazka: 'Протилежні сторони рівні: P = 2(a + b).',
      rozviazok: `Периметр 2 · (${a} + ${b}) = ${P} см.`,
    };
  }
  return {
    pytannia: `Периметр паралелограма ${nazva(l)} дорівнює ${P} см, ${storona(l, 0)} = ${a} см. Знайди ${storona(l, 1)}.`,
    malunok: chotyrykutnyk({ forma: 'paralelohram', bukvy: l, storony: [`${a} см`, '?', undefined, undefined] }),
    vidpovid: b,
    odynytsi: 'см',
    pidkazka: `Дві сусідні сторони разом — половина периметра.`,
    rozviazok: `${storona(l, 0)} + ${storona(l, 1)} = ${P} : 2 = ${a + b} см, тож ${storona(l, 1)} = ${a + b} − ${a} = ${b} см.`,
  };
}

function diahonal(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const O = 'O';
  const d1 = 2 * r.chyslo(3, 15);
  const d2 = 2 * r.chyslo(3, 15);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Діагоналі паралелограма ${nazva(l)} перетинаються в точці O. ${l[0]}${l[2]} = ${d1}, ${l[1]}${l[3]} = ${d2}. Знайди ${l[1]}O.`,
      malunok: chotyrykutnyk({ forma: 'paralelohram', bukvy: l, peretyn: O, pidpysyDiahonalei: [undefined, undefined, '?', undefined] }),
      vidpovid: d2 / 2,
      pidkazka: `Точка перетину ділить кожну діагональ навпіл.`,
      rozviazok: `O — середина ${l[1]}${l[3]}: ${l[1]}O = ${d2} : 2 = ${d2 / 2}.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Діагоналі паралелограма ${nazva(l)} перетинаються в точці O, ${l[0]}O = ${d1 / 2}. Знайди діагональ ${l[0]}${l[2]}.`,
      malunok: chotyrykutnyk({ forma: 'paralelohram', bukvy: l, peretyn: O, pidpysyDiahonalei: [`${d1 / 2}`, undefined, undefined, undefined] }),
      vidpovid: d1,
      pidkazka: `${l[0]}O — половина діагоналі ${l[0]}${l[2]}.`,
      rozviazok: `${l[0]}O = O${l[2]}, тож ${l[0]}${l[2]} = 2 · ${d1 / 2} = ${d1}.`,
    };
  }
  // Пастка: половинки різних діагоналей не рівні.
  return {
    pytannia: `Діагоналі паралелограма ${nazva(l)} перетинаються в точці O, ${l[0]}O = ${d1 / 2}, ${l[1]}${l[3]} = ${d2}. Знайди O${l[3]}.`,
    vidpovid: d2 / 2,
    pidkazka: `O${l[3]} — половина діагоналі ${l[1]}${l[3]}, а не ${l[0]}${l[2]}.`,
    rozviazok: `O${l[3]} = ${l[1]}${l[3]} : 2 = ${d2} : 2 = ${d2 / 2}. Довжина ${l[0]}O тут не потрібна: діагоналі паралелограма можуть бути різними.`,
  };
}

function sumaDvokh(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const g = r.krim(25, 155, [90]);
  const S = 2 * g;
  const naib = r.shans();
  const vidp = naib ? Math.max(g, 180 - g) : Math.min(g, 180 - g);
  return {
    pytannia: `Сума двох кутів паралелограма ${nazva(l)} дорівнює ${S}°. Знайди ${naib ? 'більший' : 'менший'} кут паралелограма.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: 'Сусідні кути разом дають 180°. Якщо сума інша — це протилежні (рівні) кути.',
    rozviazok: `${S}° ≠ 180°, тож це протилежні кути, кожен ${S} : 2 = ${g}°. Інший кут 180° − ${g}° = ${180 - g}°, ${naib ? 'більший' : 'менший'} з них — ${vidp}°.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const x = r.chyslo(25, 85);
  const d = 180 - 2 * x;
  if (d <= 0) return naBilshe(r);
  const naib = r.shans();
  const vidp = naib ? x + d : x;
  return {
    pytannia: `Один з кутів паралелограма на ${d}° більший за інший. Знайди ${naib ? 'більший' : 'менший'} кут.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `Різні кути паралелограма — сусідні: разом 180°. Позначимо менший x, тоді x + x + ${d} = 180.`,
    rozviazok: `2x + ${d} = 180, тож 2x = 180 − ${d} = ${2 * x}, x = ${x}. ${naib ? `Більший кут ${x}° + ${d}° = ${vidp}°.` : `Менший кут ${x}°.`}`,
  };
}

const PARY = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [3, 7], [4, 5], [5, 7], [1, 8], [2, 7], [7, 8], [5, 13], [4, 11]].filter(([m, n]) => 180 % (m + n) === 0);

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [m, n] = r.vybir(PARY);
  const x = 180 / (m + n);
  const naib = r.shans();
  return {
    pytannia: `Два кути паралелограма ${nazva(l)} відносяться як ${m} : ${n}. Знайди ${naib ? 'більший' : 'менший'} кут.`,
    vidpovid: (naib ? n : m) * x,
    odynytsi: '°',
    pidkazka: `Різні кути паралелограма — сусідні, разом 180°.`,
    rozviazok: `Разом ${m} + ${n} = ${m + n} частин, одна частина 180 : ${m + n} = ${x}°. ${naib ? 'Більший' : 'Менший'} кут ${naib ? n : m} · ${x}° = ${(naib ? n : m) * x}°.`,
  };
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Діагоналі будь-якого паралелограма рівні.', false, 'Діагоналі рівні лише в прямокутника.'],
    ['Протилежні кути паралелограма рівні.', true, 'Це властивість паралелограма.'],
    ['Діагональ паралелограма ділить його кут навпіл.', false, 'Так буває лише в ромба.'],
    ['Сума кутів, прилеглих до однієї сторони паралелограма, — 180°.', true, 'Це внутрішні односторонні кути при паралельних прямих.'],
    ['Діагоналі паралелограма точкою перетину діляться навпіл.', true, 'Це властивість паралелограма.'],
    ['Протилежні сторони паралелограма рівні.', true, 'Це властивість паралелограма.'],
    ['Усі сторони паралелограма рівні.', false, 'Рівні лише протилежні сторони.'],
    ['Сусідні кути паралелограма рівні.', false, 'Сусідні кути разом 180°; рівні вони лише тоді, коли обидва прямі.'],
    ['Паралелограм може мати три гострі кути.', false, 'Гострі кути — лише протилежні, тож їх два (або жодного).'],
    ['Периметр паралелограма зі сторонами a і b дорівнює 2(a + b).', true, 'Протилежні сторони рівні: a + b + a + b.'],
  ];
  const [t, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження: «${t}»`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Пригадай чотири властивості паралелограма. Подумки намалюй «перекошений» паралелограм.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

function bisektrysa(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(3, 12);
  const b = a + r.chyslo(2, 10);
  const typ = r.chyslo(0, 2);
  const kartynka = chotyrykutnyk({ forma: 'paralelohram', bukvy: l, vidrizok: [0, 1, Math.min(0.8, Math.max(0.3, a / b)), 'T'] });
  const pochatok = `Бісектриса кута ${l[0]} паралелограма ${nazva(l)} перетинає сторону ${storona(l, 1)} в точці T.`;
  const chomu = `Кут ${l[1]}T${l[0]} дорівнює куту T${l[0]}${l[3]} (внутрішні різносторонні), а той — куту ${l[1]}${l[0]}T (бісектриса). Тому трикутник ${l[0]}${l[1]}T рівнобедрений: ${l[1]}T = ${l[0]}${l[1]} = ${a}.`;
  if (typ === 0) {
    return {
      pytannia: `${pochatok} ${storona(l, 0)} = ${a}, ${storona(l, 3)} = ${b}. Знайди T${l[2]}.`,
      malunok: kartynka,
      vidpovid: b - a,
      pidkazka: `Який трикутник утворюють ${l[0]}, ${l[1]} і T?`,
      rozviazok: `${chomu} ${storona(l, 1)} = ${storona(l, 3)} = ${b}, тож T${l[2]} = ${b} − ${a} = ${b - a}.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${pochatok} ${storona(l, 0)} = ${a}, T${l[2]} = ${b - a}. Знайди периметр паралелограма.`,
      malunok: kartynka,
      vidpovid: 2 * (a + b),
      pidkazka: `Знайди ${l[1]}T: трикутник ${l[0]}${l[1]}T рівнобедрений.`,
      rozviazok: `${chomu} Тоді ${storona(l, 1)} = ${a} + ${b - a} = ${b}, периметр 2 · (${a} + ${b}) = ${2 * (a + b)}.`,
    };
  }
  return {
    pytannia: `${pochatok} ${storona(l, 0)} = ${a}, а периметр паралелограма дорівнює ${2 * (a + b)}. Знайди T${l[2]}.`,
    malunok: kartynka,
    vidpovid: b - a,
    pidkazka: `Знайди ${storona(l, 1)} з периметра, а ${l[1]}T — з рівнобедреного трикутника ${l[0]}${l[1]}T.`,
    rozviazok: `${storona(l, 0)} + ${storona(l, 1)} = ${2 * (a + b)} : 2 = ${a + b}, тож ${storona(l, 1)} = ${a + b} − ${a} = ${b}. ${chomu} T${l[2]} = ${b} − ${a} = ${b - a}.`,
  };
}

function trykutnykAOB(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const d1 = 2 * r.chyslo(4, 15);
  const d2 = 2 * r.chyslo(3, 12);
  const c = r.chyslo(Math.abs(d1 - d2) / 2 + 1, (d1 + d2) / 2 - 1);
  const P = d1 / 2 + d2 / 2 + c;
  return {
    pytannia: `Діагоналі паралелограма ${nazva(l)} дорівнюють ${d1} см і ${d2} см і перетинаються в точці O. ${storona(l, 0)} = ${c} см. Знайди периметр трикутника ${l[0]}O${l[1]}.`,
    malunok: chotyrykutnyk({ forma: 'paralelohram', bukvy: l, peretyn: 'O' }),
    vidpovid: P,
    odynytsi: 'см',
    pidkazka: `${l[0]}O і O${l[1]} — половини діагоналей.`,
    rozviazok: `${l[0]}O = ${d1} : 2 = ${d1 / 2}, ${l[1]}O = ${d2} : 2 = ${d2 / 2}. Периметр ${d1 / 2} + ${d2 / 2} + ${c} = ${P} см.`,
  };
}

export default {
  rivni: ['кути, сторони, діагоналі', 'з підступом', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([kutZaMalunkom, kutZaMalunkom, kutTekstom, perymetr, diahonal])(r);
    if (riven === 2) return r.vybir([sumaDvokh, naBilshe, vidnoshennia, tverdzhennia, diahonal])(r);
    return r.vybir([bisektrysa, bisektrysa, trykutnykAOB, naBilshe, perymetr])(r);
  },
} satisfies Henerator;
