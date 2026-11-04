// Коло і круг: хорда і діаметр. Який відрізок — хорда, діаметр чи радіус (за малюнком), чи може хорда бути такою
// довгою, найбільша хорда, діаметр ⊥ хорді ділить її навпіл, кути рівнобедреного трикутника AOB, хорда, що дорівнює
// радіусу, зовнішній кут при центрі, периметр трикутника AOB, відстань від центра до хорди при куті 120°.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { kolo } from '../kolo.ts';

const LITERY = ['A', 'B', 'C', 'D', 'E', 'F', 'K', 'L', 'M', 'N', 'P', 'Q'];
/** Хорда AB, діаметр CD, середина хорди M. */
const NABORY = [['A', 'B', 'C', 'D', 'M'], ['K', 'L', 'P', 'Q', 'H'], ['M', 'N', 'E', 'F', 'K'], ['C', 'D', 'A', 'B', 'E'], ['P', 'Q', 'M', 'N', 'K']];
const TN = ['так', 'ні'];

function yakyiVidrizok(r: Vypadok): TrenZavdannia {
  const [h1, h2, d1, d2, p] = r.peremishaty(LITERY).slice(0, 5);
  const t = r.chyslo(0, 17) * 10; // напрям діаметра
  const a1 = r.chyslo(25, 60);
  const a2 = r.chyslo(a1 + 50, 155);
  const khorda = [h1, h2].sort().join('');
  const diametr = [d1, d2].sort().join('');
  const radius = `O${p}`;
  const typ = r.chyslo(0, 2);
  const malunok = kolo({
    naKoli: { [h1]: t + a1, [h2]: t + a2, [d1]: t, [d2]: t + 180, [p]: t + 180 + r.chyslo(50, 130) },
    vidrizky: [{ a: h1, b: h2 }, { a: d1, b: d2 }, { a: 'O', b: p }],
    literyKut: { O: t + 90 },
  });
  const pytannia = ['Який відрізок на малюнку — діаметр?', 'Який відрізок на малюнку — хорда, але не діаметр?', 'Який відрізок на малюнку — радіус?'][typ];
  return {
    pytannia,
    malunok,
    vidpovid: [diametr, khorda, radius][typ],
    varianty: r.peremishaty([khorda, diametr, radius]),
    pidkazka: ['Діаметр сполучає дві точки кола і проходить через центр O.', 'Хорда сполучає дві точки кола. Яка з таких не проходить через центр?', 'Радіус іде від центра O до точки кола.'][typ],
    rozviazok: `${diametr} проходить через центр — це діаметр. ${khorda} сполучає дві точки кола, але не проходить через центр — це хорда. ${radius} іде від центра до кола — це радіус.`,
  };
}

function chyMozhe(r: Vypadok): TrenZavdannia {
  const rad = r.chyslo(2, 15);
  const typ = r.vybir([0, 1, 2, 2]); // 0 — коротша за діаметр, 1 — дорівнює діаметру, 2 — довша
  const L = typ === 0 ? r.chyslo(Math.max(1, rad), 2 * rad - 1) : typ === 1 ? 2 * rad : 2 * rad + r.chyslo(1, 6);
  const zDiametrom = r.shans(0.3);
  return {
    pytannia: zDiametrom
      ? `Діаметр кола — ${2 * rad} см. Чи може хорда цього кола дорівнювати ${L} см?`
      : `Радіус кола — ${rad} см. Чи може хорда цього кола дорівнювати ${L} см?`,
    vidpovid: typ === 2 ? 'ні' : 'так',
    varianty: TN,
    pidkazka: 'Яка найбільша хорда кола?',
    rozviazok:
      `${zDiametrom ? '' : `Найбільша хорда — діаметр: 2 · ${rad} = ${2 * rad} см. `}` +
      (typ === 0
        ? `${L} см менше за діаметр ${2 * rad} см — така хорда є.`
        : typ === 1
          ? `${L} см — це саме діаметр, а діаметр теж хорда.`
          : `${L} см більше за діаметр ${2 * rad} см — такої хорди немає.`),
  };
}

function naibilsha(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 30);
  if (r.shans()) {
    return {
      pytannia: `Радіус кола — ${k} см. Яку найбільшу довжину може мати хорда цього кола?`,
      vidpovid: 2 * k,
      odynytsi: 'см',
      pidkazka: 'Найбільша хорда проходить через центр.',
      rozviazok: `Найбільша хорда — діаметр, тобто два радіуси: 2 · ${k} = ${2 * k} см.`,
    };
  }
  return {
    pytannia: `Найбільша хорда кола — ${2 * k} см. Знайди радіус кола.`,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: 'Найбільша хорда — діаметр. Яка частина діаметра — радіус?',
    rozviazok: `Найбільша хорда — діаметр. Радіус — його половина: ${2 * k} : 2 = ${k} см.`,
  };
}

/** Малюнок: діаметр CD ⊥ хорді AB, M — середина AB. */
const malunokPerpendykuliar = ([A, B, C, D, M]: string[], radiusy = false) =>
  kolo({
    naKoli: { [A]: 215, [B]: 325, [C]: 90, [D]: 270 },
    serednia: { [M]: [A, B] },
    vidrizky: [{ a: A, b: B }, { a: C, b: D, k: 2 }, ...(radiusy ? [{ a: 'O', b: A, shtrykh: true }, { a: 'O', b: B, shtrykh: true }] : [])],
    priamiKuty: [[M, B, 'O']],
    literyKut: { [M]: 300, O: 160 },
  });

function polovyna(r: Vypadok): TrenZavdannia {
  const l = r.vybir(NABORY);
  const [A, B, C, D, M] = l;
  const k = r.chyslo(2, 25);
  const shukaiemoPolovynu = r.shans();
  const AB = `${A}${B}`;
  const AM = r.shans() ? `${A}${M}` : `${M}${B}`;
  return {
    pytannia: `Діаметр ${C}${D} перпендикулярний до хорди ${AB} і перетинає її в точці ${M}, ${shukaiemoPolovynu ? `${AB} = ${2 * k}` : `${AM} = ${k}`} см. Знайди ${shukaiemoPolovynu ? AM : AB}.`,
    malunok: malunokPerpendykuliar(l),
    vidpovid: shukaiemoPolovynu ? k : 2 * k,
    odynytsi: 'см',
    pidkazka: 'Діаметр, перпендикулярний до хорди, ділить її навпіл.',
    rozviazok: shukaiemoPolovynu
      ? `Діаметр, перпендикулярний до хорди, ділить її навпіл: ${AM} дорівнює ${2 * k} : 2 = ${k} см.`
      : `Діаметр, перпендикулярний до хорди, ділить її навпіл, тож ${M} — середина ${AB}: ${AB} дорівнює 2 · ${k} = ${2 * k} см.`,
  };
}

const PARY = [['A', 'B'], ['M', 'N'], ['K', 'L'], ['C', 'D'], ['P', 'Q']];

/** Трикутник AOB: центральний кут x, підпис — або при O, або при A. */
const malunokAOB = (A: string, B: string, x: number, pidpys: { O?: string; A?: string }) =>
  kolo({
    naKoli: { [A]: 270 - x / 2, [B]: 270 + x / 2 },
    vidrizky: [{ a: 'O', b: A, rysky: 1 }, { a: 'O', b: B, rysky: 1 }, { a: A, b: B }],
    kuty: [
      ...(pidpys.O ? [{ v: 'O', a: A, b: B, pidpys: pidpys.O }] : []),
      ...(pidpys.A ? [{ v: A, a: 'O', b: B, pidpys: pidpys.A, r: 26 }] : []),
    ],
  });

function kutAOB(r: Vypadok): TrenZavdannia {
  const [A, B] = r.vybir(PARY);
  const y = r.chyslo(12, 75); // кут при основі
  const x = 180 - 2 * y; // центральний кут
  const zTsentru = r.shans();
  const zMalunkom = r.shans();
  return {
    pytannia: zTsentru
      ? `O${A} і O${B} — радіуси, ∠${A}O${B} = ${x}°. Знайди ∠O${A}${B}.`
      : `O${A} і O${B} — радіуси, ∠O${A}${B} = ${y}°. Знайди ∠${A}O${B}.`,
    malunok: zMalunkom ? malunokAOB(A, B, x, zTsentru ? { O: `${x}°` } : { A: `${y}°` }) : undefined,
    vidpovid: zTsentru ? y : x,
    odynytsi: '°',
    pidkazka: `O${A} = O${B}, тож трикутник ${A}O${B} рівнобедрений.`,
    rozviazok: zTsentru
      ? `Трикутник ${A}O${B} рівнобедрений, кути при основі ${A}${B} рівні: (180° − ${x}°) : 2 = ${y}°.`
      : `Трикутник ${A}O${B} рівнобедрений, тож кут O${B}${A} теж ${y}°. Кут ${A}O${B} дорівнює 180° − ${y}° − ${y}° = ${x}°.`,
  };
}

function rivnoRadiusu(r: Vypadok): TrenZavdannia {
  const [A, B] = r.vybir(PARY);
  const k = r.chyslo(2, 25);
  const typ = r.chyslo(0, 2);
  const umova = `Хорда ${A}${B} дорівнює радіусу кола`;
  if (typ === 0) {
    return {
      pytannia: `${umova}, радіус — ${k} см. Знайди периметр трикутника ${A}O${B}.`,
      vidpovid: 3 * k,
      odynytsi: 'см',
      pidkazka: `Які сторони має трикутник ${A}O${B}? Дві з них — радіуси.`,
      rozviazok: `O${A} = O${B} = ${k} см — радіуси, ${A}${B} = ${k} см за умовою. Периметр: ${k} + ${k} + ${k} = ${3 * k} см.`,
    };
  }
  return {
    pytannia: `${umova}. Знайди ${typ === 1 ? `∠${A}O${B}` : `∠O${A}${B}`}.`,
    vidpovid: 60,
    odynytsi: '°',
    pidkazka: `Порівняй сторони трикутника ${A}O${B}: O${A}, O${B} і ${A}${B}.`,
    rozviazok: `O${A} = O${B} — радіуси, і ${A}${B} дорівнює радіусу. Усі сторони трикутника ${A}O${B} рівні — він рівносторонній, і кожен його кут дорівнює 180° : 3 = 60°.`,
  };
}

const TRIIKY = [['A', 'B', 'C'], ['M', 'N', 'K'], ['C', 'D', 'E'], ['P', 'K', 'M'], ['D', 'E', 'F']];

function zovnishnii(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(TRIIKY); // AC — діаметр, B — точка кола
  const x = r.chyslo(15, 70); // ∠BAO
  const typ = r.chyslo(0, 2);
  const kuty =
    typ === 0
      ? [{ v: A, a: B, b: 'O', pidpys: `${x}°` }, { v: 'O', a: B, b: C, pidpys: '?' }]
      : typ === 1
        ? [{ v: 'O', a: B, b: C, pidpys: `${2 * x}°` }, { v: A, a: B, b: 'O', pidpys: '?' }]
        : [{ v: A, a: B, b: 'O', pidpys: `${x}°` }, { v: 'O', a: A, b: B, pidpys: '?' }];
  const malunok = kolo({ naKoli: { [A]: 180, [C]: 0, [B]: 2 * x }, vidrizky: [{ a: A, b: C }, { a: A, b: B }, { a: 'O', b: B }], kuty });
  const rivni = `O${A} = O${B}, тож кут ${A}${B}O дорівнює куту ${B}${A}O.`;
  return {
    pytannia:
      typ === 0
        ? `${A}${C} — діаметр, ${B} — точка кола, ∠${B}${A}O = ${x}°. Знайди ∠${B}O${C}.`
        : typ === 1
          ? `${A}${C} — діаметр, ${B} — точка кола, ∠${B}O${C} = ${2 * x}°. Знайди ∠${B}${A}O.`
          : `${A}${C} — діаметр, ${B} — точка кола, ∠${B}${A}O = ${x}°. Знайди ∠${A}O${B}.`,
    malunok,
    vidpovid: typ === 0 ? 2 * x : typ === 1 ? x : 180 - 2 * x,
    odynytsi: '°',
    pidkazka: typ === 2 ? `Трикутник ${A}O${B} рівнобедрений.` : `Кут ${B}O${C} — зовнішній кут рівнобедреного трикутника ${A}O${B}.`,
    rozviazok:
      typ === 0
        ? `${rivni} Зовнішній кут ${B}O${C} дорівнює сумі двох кутів, не суміжних з ним: ${x}° + ${x}° = ${2 * x}°.`
        : typ === 1
          ? `${rivni} Зовнішній кут ${B}O${C} — сума цих двох рівних кутів, тож кожен дорівнює ${2 * x}° : 2 = ${x}°.`
          : `${rivni} Кут ${A}O${B} дорівнює 180° − ${x}° − ${x}° = ${180 - 2 * x}°.`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const [A, B] = r.vybir(PARY);
  const rad = r.chyslo(3, 15);
  const c = r.chyslo(2, 2 * rad - 1);
  const P = 2 * rad + c;
  if (r.shans()) {
    return {
      pytannia: `Радіус кола — ${rad} см, хорда ${A}${B} — ${c} см. Знайди периметр трикутника ${A}O${B}.`,
      vidpovid: P,
      odynytsi: 'см',
      pidkazka: `Сторони O${A} і O${B} — радіуси.`,
      rozviazok: `O${A} = O${B} = ${rad} см — радіуси. Периметр: ${rad} + ${rad} + ${c} = ${P} см.`,
    };
  }
  return {
    pytannia: `Периметр трикутника ${A}O${B} — ${P} см, радіус кола — ${rad} см. Знайди хорду ${A}${B}.`,
    vidpovid: c,
    odynytsi: 'см',
    pidkazka: `Дві сторони трикутника ${A}O${B} — радіуси. Відніми їх від периметра.`,
    rozviazok: `O${A} = O${B} = ${rad} см — радіуси. ${A}${B} дорівнює ${P} − ${rad} − ${rad} = ${c} см.`,
  };
}

function diametr60(r: Vypadok): TrenZavdannia {
  const [A, B] = r.vybir(PARY);
  const k = r.chyslo(2, 25);
  return {
    pytannia: `Хорда ${A}${B} — ${k} см, ∠${A}O${B} = 60°, O — центр кола. Знайди діаметр кола.`,
    vidpovid: 2 * k,
    odynytsi: 'см',
    pidkazka: `Знайди кути трикутника ${A}O${B}. Який це трикутник?`,
    rozviazok: `O${A} = O${B}, тож кути при основі по (180° − 60°) : 2 = 60°. Трикутник ${A}O${B} рівносторонній: радіус дорівнює ${A}${B} = ${k} см. Діаметр дорівнює 2 · ${k} = ${2 * k} см.`,
  };
}

function vidstan120(r: Vypadok): TrenZavdannia {
  const l = r.vybir(NABORY);
  const [A, B, , , M] = l;
  const k = r.chyslo(2, 15);
  const shukaiemoOM = r.shans();
  return {
    pytannia: shukaiemoOM
      ? `${A}${B} — хорда, ∠${A}O${B} = 120°, O${M} ⊥ ${A}${B}, радіус кола — ${2 * k} см. Знайди O${M}.`
      : `${A}${B} — хорда, ∠${A}O${B} = 120°, O${M} ⊥ ${A}${B}, O${M} = ${k} см. Знайди діаметр кола.`,
    malunok: kolo({
      naKoli: { [A]: 210, [B]: 330 },
      serednia: { [M]: [A, B] },
      vidrizky: [{ a: 'O', b: A }, { a: 'O', b: B }, { a: A, b: B }, { a: 'O', b: M, k: 2 }],
      priamiKuty: [[M, B, 'O']],
      literyKut: { O: 90 },
    }),
    vidpovid: shukaiemoOM ? k : 4 * k,
    odynytsi: 'см',
    pidkazka: `Знайди кут O${A}${B}. У прямокутному трикутнику ${A}O${M} відрізок O${M} — катет навпроти нього.`,
    rozviazok:
      `Трикутник ${A}O${B} рівнобедрений, кути при основі по (180° − 120°) : 2 = 30°. ` +
      `У прямокутному трикутнику ${A}O${M} катет O${M} лежить навпроти кута ${A} (30°), тож він — половина гіпотенузи O${A}. ` +
      (shukaiemoOM ? `O${M} дорівнює ${2 * k} : 2 = ${k} см.` : `Радіус O${A} дорівнює 2 · ${k} = ${2 * k} см, діаметр — 2 · ${2 * k} = ${4 * k} см.`),
  };
}

export default {
  rivni: ['хорда, діаметр, радіус', 'діаметр ⊥ хорді, трикутник AOB', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([yakyiVidrizok, yakyiVidrizok, chyMozhe, naibilsha])(r);
    if (riven === 2) return r.vybir([polovyna, kutAOB, kutAOB, rivnoRadiusu])(r);
    return r.vybir([zovnishnii, zovnishnii, perymetr, diametr60, vidstan120])(r);
  },
} satisfies Henerator;
