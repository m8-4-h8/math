// Бісектриса кута і вписане коло: точка бісектриси однаково віддалена від сторін, перетин чого — центр вписаного
// (і описаного) кола, кути при центрі вписаного кола (половина кута, кут AOB), відрізки дотичних: периметр, сторона,
// рівнобедрений трикутник.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { kolo } from '../kolo.ts';

const LITERY = [['A', 'B', 'C'], ['K', 'M', 'N'], ['M', 'N', 'P'], ['D', 'E', 'F'], ['P', 'Q', 'R']];
/** Трикутник і точки дотику на сторонах [AB, BC, CA]. */
const Z_DOTYKOM = [
  [['A', 'B', 'C'], ['K', 'L', 'M']],
  [['D', 'E', 'F'], ['K', 'L', 'M']],
  [['M', 'N', 'P'], ['A', 'B', 'C']],
  [['P', 'Q', 'R'], ['K', 'L', 'M']],
  [['A', 'B', 'C'], ['D', 'E', 'F']],
];

function vidstan(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  const k = r.chyslo(2, 30);
  if (r.shans()) {
    return {
      pytannia: `Точка O лежить на бісектрисі кута ${A} і віддалена від сторони ${A}${B} на ${k} см. На скільки сантиметрів вона віддалена від сторони ${A}${C}?`,
      malunok: kolo({
        bezKola: true,
        tochky: { [A]: [0, 0], [B]: [2.6, 0], [C]: [1.67, 1.99], O: [1.63, 0.76] },
        proektsii: { H: ['O', A, B], T: ['O', A, C] },
        promeni: [{ a: A, b: B, dali: 0.2 }, { a: A, b: C, dali: 0.2 }],
        vidrizky: [{ a: A, b: 'O', k: 2, shtrykh: true }, { a: 'O', b: 'H', pidpys: `${k} см`, vid: A }, { a: 'O', b: 'T', pidpys: '?', vid: A }],
        priamiKuty: [['H', 'O', A], ['T', 'O', A]],
        kuty: [{ v: A, a: B, b: 'O', n: 1, r: 34 }, { v: A, a: 'O', b: C, n: 1, r: 34 }],
        literyKut: { [A]: 200, O: 0, [B]: 300, [C]: 120 },
        bezLiter: ['H', 'T'],
      }),
      vidpovid: k,
      odynytsi: 'см',
      pidkazka: 'Кожна точка бісектриси однаково віддалена від сторін кута.',
      rozviazok: `O лежить на бісектрисі кута ${A}, тож від обох сторін кута вона на тій самій відстані: ${k} см.`,
    };
  }
  return {
    pytannia: `Радіус кола, вписаного в трикутник ${A}${B}${C}, — ${k} см. На якій відстані від сторони ${B}${C} лежить його центр?`,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: 'Радіус, проведений у точку дотику, перпендикулярний до сторони.',
    rozviazok: `Радіус у точку дотику перпендикулярний до сторони ${B}${C}, тож відстань від центра до неї дорівнює радіусу: ${k} см.`,
  };
}

const TOCHKY = ['бісектрис', 'медіан', 'висот', 'серединних перпендикулярів'];

function shchoPeretyn(r: Vypadok): TrenZavdannia {
  const vpysane = r.shans(0.6);
  return {
    pytannia: `Центр кола, ${vpysane ? 'вписаного в трикутник' : 'описаного навколо трикутника'}, — це точка перетину…`,
    vidpovid: vpysane ? TOCHKY[0] : TOCHKY[3],
    varianty: TOCHKY,
    pidkazka: vpysane ? 'Центр однаково віддалений від усіх сторін трикутника.' : 'Центр однаково віддалений від усіх вершин трикутника.',
    rozviazok: vpysane
      ? 'Центр вписаного кола однаково віддалений від сторін — він лежить на бісектрисах усіх кутів.'
      : 'Центр описаного кола однаково віддалений від вершин — він лежить на серединних перпендикулярах до всіх сторін.',
  };
}

function polovynaKuta(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  const x = r.chyslo(10, 70);
  const vidCilogo = r.shans();
  const [s1, s2] = r.shans() ? [B, C] : [C, B];
  return {
    pytannia: vidCilogo
      ? `O — центр кола, вписаного в трикутник ${A}${B}${C}, ∠${A} = ${2 * x}°. Знайди ∠O${A}${s1}.`
      : `O — центр кола, вписаного в трикутник ${A}${B}${C}, ∠O${A}${s1} = ${x}°. Знайди ∠${A}.`,
    vidpovid: vidCilogo ? x : 2 * x,
    odynytsi: '°',
    pidkazka: `${A}O — бісектриса кута ${A}.`,
    rozviazok: vidCilogo
      ? `${A}O — бісектриса, тож кут O${A}${s1} дорівнює ${2 * x}° : 2 = ${x}°.`
      : `${A}O — бісектриса, тож кут O${A}${s2} теж ${x}°, а весь кут ${A} дорівнює 2 · ${x}° = ${2 * x}°.`,
  };
}

/** Малюнок вписаного кола з рисочками на рівних відрізках дотичних. */
const malunokDotychni = ([A, B, C]: string[], [K, L, M]: string[], pidpysy: Record<string, string> = {}) =>
  kolo({
    opysanyi: { vershyny: [C, B, A], dotyku: [M, L, K], kuty: [270, 20, 140] },
    kolirKola: 3,
    tochkaTsentru: false,
    tsentr: '',
    vidrizky: [
      { a: A, b: K, k: 1, rysky: 1, pidpys: pidpysy[`${A}${K}`] },
      { a: A, b: M, k: 1, rysky: 1 },
      { a: B, b: K, k: 1, rysky: 2 },
      { a: B, b: L, k: 1, rysky: 2, pidpys: pidpysy[`${B}${L}`] },
      { a: C, b: L, k: 1, rysky: 3 },
      { a: C, b: M, k: 1, rysky: 3, pidpys: pidpysy[`${C}${M}`] },
    ],
    H: 240,
  });

function perymetr(r: Vypadok): TrenZavdannia {
  const [[A, B, C], [K, L, M]] = r.vybir(Z_DOTYKOM);
  const [a, b, c] = [r.chyslo(1, 12), r.chyslo(1, 12), r.chyslo(1, 12)];
  const zMalunkom = r.shans();
  return {
    pytannia: `Коло, вписане в трикутник ${A}${B}${C}, дотикається до сторін ${A}${B}, ${B}${C}, ${C}${A} у точках ${K}, ${L}, ${M}. ${A}${K} = ${a} см, ${B}${L} = ${b} см, ${C}${M} = ${c} см. Знайди периметр трикутника.`,
    malunok: zMalunkom ? malunokDotychni([A, B, C], [K, L, M], { [`${A}${K}`]: `${a}`, [`${B}${L}`]: `${b}`, [`${C}${M}`]: `${c}` }) : undefined,
    vidpovid: 2 * (a + b + c),
    odynytsi: 'см',
    pidkazka: 'Відрізки дотичних з однієї вершини рівні. Кожен такий відрізок входить у периметр двічі.',
    rozviazok:
      `${A}${M} = ${A}${K} = ${a}, ${B}${K} = ${B}${L} = ${b}, ${C}${L} = ${C}${M} = ${c}. ` +
      `${A}${B} дорівнює ${a} + ${b} = ${a + b} см, ${B}${C} дорівнює ${b} + ${c} = ${b + c} см, ${C}${A} дорівнює ${c} + ${a} = ${c + a} см. ` +
      `Периметр: ${a + b} + ${b + c} + ${c + a} = ${2 * (a + b + c)} см.`,
  };
}

function storona(r: Vypadok): TrenZavdannia {
  const [[A, B, C], [K, L, M]] = r.vybir(Z_DOTYKOM);
  const [a, b, c] = [r.chyslo(1, 12), r.chyslo(1, 12), r.chyslo(1, 12)]; // AK, BL, CM
  return {
    pytannia: `Коло, вписане в трикутник ${A}${B}${C}, дотикається до ${A}${B} у точці ${K}, до ${B}${C} — у точці ${L}, до ${C}${A} — у точці ${M}. ${A}${B} = ${a + b} см, ${B}${C} = ${b + c} см, ${A}${K} = ${a} см. Знайди ${C}${M}.`,
    vidpovid: c,
    odynytsi: 'см',
    pidkazka: `Спершу знайди ${B}${K}, потім ${B}${L} і ${C}${L}.`,
    rozviazok: `${B}${K} дорівнює ${a + b} − ${a} = ${b} см, ${B}${L} = ${B}${K} = ${b} см, ${C}${L} дорівнює ${b + c} − ${b} = ${c} см. ${C}${M} = ${C}${L} = ${c} см.`,
  };
}

function rivnobedrenyi(r: Vypadok): TrenZavdannia {
  const [[A, B, C], [K]] = r.vybir(Z_DOTYKOM);
  const a = r.chyslo(1, 12); // AK
  const b = r.chyslo(1, 12); // BK
  return {
    pytannia: `Коло вписане в рівнобедрений трикутник ${A}${B}${C} (${A}${B} = ${B}${C}) і дотикається до ${A}${B} у точці ${K}. ${B}${K} = ${b} см, ${A}${K} = ${a} см. Знайди периметр трикутника.`,
    vidpovid: 4 * a + 2 * b,
    odynytsi: 'см',
    pidkazka: `${A}${B} = ${B}${C} = ${a + b} см. Основу складають два відрізки дотичних з вершин ${A} і ${C}.`,
    rozviazok:
      `${A}${B} = ${B}${C} дорівнює ${b} + ${a} = ${a + b} см. Від вершини ${A} до точок дотику — по ${a} см, від ${C} — теж: ${a + b} − ${b} = ${a} см. ` +
      `Основа ${A}${C} дорівнює ${a} + ${a} = ${2 * a} см. Периметр: ${a + b} + ${a + b} + ${2 * a} = ${4 * a + 2 * b} см.`,
  };
}

function kutAOB(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  if (r.shans()) {
    const x = r.chyslo(10, 60);
    const y = r.chyslo(10, 80 - x);
    return {
      pytannia: `O — центр кола, вписаного в трикутник ${A}${B}${C}, ∠${A} = ${2 * x}°, ∠${B} = ${2 * y}°. Знайди ∠${A}O${B}.`,
      vidpovid: 180 - x - y,
      odynytsi: '°',
      pidkazka: `${A}O і ${B}O — бісектриси. Знайди кути O${A}${B} і O${B}${A}.`,
      rozviazok: `Кут O${A}${B} дорівнює ${2 * x}° : 2 = ${x}°, кут O${B}${A} дорівнює ${2 * y}° : 2 = ${y}°. Кут ${A}O${B} дорівнює 180° − ${x}° − ${y}° = ${180 - x - y}°.`,
    };
  }
  const z = 2 * r.chyslo(10, 70); // ∠C
  const pol = (180 - z) / 2;
  return {
    pytannia: `O — центр кола, вписаного в трикутник ${A}${B}${C}, ∠${C} = ${z}°. Знайди ∠${A}O${B}.`,
    vidpovid: 180 - pol,
    odynytsi: '°',
    pidkazka: `Кути ${A} і ${B} разом дають 180° − ${z}°. А кути O${A}${B} і O${B}${A} — їхні половинки.`,
    rozviazok: `Кути ${A} і ${B} разом дорівнюють 180° − ${z}° = ${180 - z}°, а їхні половинки O${A}${B} і O${B}${A} разом — ${180 - z}° : 2 = ${pol}°. Кут ${A}O${B} дорівнює 180° − ${pol}° = ${180 - pol}°.`,
  };
}

export default {
  rivni: ['бісектриса і центр вписаного кола', 'відрізки дотичних', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([vidstan, shchoPeretyn, polovynaKuta])(r);
    if (riven === 2) return r.vybir([perymetr, perymetr, storona, polovynaKuta])(r);
    return r.vybir([kutAOB, kutAOB, rivnobedrenyi, storona])(r);
  },
} satisfies Henerator;
