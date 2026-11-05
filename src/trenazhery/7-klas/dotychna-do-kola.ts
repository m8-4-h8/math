// Взаємне розміщення прямої і кола, дотична: скільки спільних точок (d і r, пастка з діаметром), відстань до дотичної,
// дотична ⊥ радіусу (кути трикутника OAP за малюнком), рівні відрізки дотичних і бісектриса PO, кут 30° і OP = 2r,
// кут AOB між радіусами в точки дотику, рівносторонній трикутник APB при куті 60°.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { kolo } from '../kolo.ts';

const VYPADKY = ['дві спільні точки', 'одна спільна точка', 'жодної спільної точки'];

function roztashuvannia(r: Vypadok): TrenZavdannia {
  const rad = r.chyslo(2, 15);
  const typ = r.chyslo(0, 2); // 0 — d < r, 1 — d = r, 2 — d > r
  const d = typ === 0 ? r.chyslo(1, rad - 1) : typ === 1 ? rad : r.chyslo(rad + 1, rad + 8);
  const zDiametrom = r.shans(0.35);
  const znak = typ === 0 ? '<' : typ === 1 ? '=' : '>';
  return {
    pytannia: `${zDiametrom ? `Діаметр кола — ${2 * rad} см` : `Радіус кола — ${rad} см`}, відстань від центра до прямої — ${d} см. Скільки спільних точок мають пряма і коло?`,
    vidpovid: VYPADKY[typ],
    varianty: VYPADKY,
    pidkazka: zDiametrom ? 'Спершу знайди радіус, а тоді порівняй його з відстанню.' : 'Порівняй відстань d з радіусом r.',
    rozviazok:
      `${zDiametrom ? `Радіус дорівнює ${2 * rad} : 2 = ${rad} см. ` : ''}` +
      `d ${znak} r — ${typ === 0 ? 'пряма перетинає коло у двох точках' : typ === 1 ? 'пряма дотикається до кола в одній точці' : 'пряма не має з колом спільних точок'}.`,
  };
}

function vidstanDoDotychnoi(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 25);
  const typ = r.chyslo(0, 2);
  if (typ === 2) {
    return {
      pytannia: `Пряма дотикається до кола, відстань від центра до неї — ${k} см. Знайди діаметр кола.`,
      vidpovid: 2 * k,
      odynytsi: 'см',
      pidkazka: 'Для дотичної відстань від центра дорівнює радіусу.',
      rozviazok: `Пряма дотична, тож радіус дорівнює відстані: ${k} см. Діаметр дорівнює 2 · ${k} = ${2 * k} см.`,
    };
  }
  return {
    pytannia: `${typ === 0 ? `Радіус кола — ${k} см` : `Діаметр кола — ${2 * k} см`}. На якій відстані від центра проходить дотична до цього кола?`,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: 'Пряма дотикається до кола, коли d = r.',
    rozviazok: typ === 0 ? `Для дотичної відстань від центра дорівнює радіусу: ${k} см.` : `Радіус дорівнює ${2 * k} : 2 = ${k} см, і для дотичної відстань від центра дорівнює радіусу: ${k} см.`,
  };
}

const PARY = [['P', 'A'], ['M', 'K'], ['K', 'A'], ['S', 'T'], ['M', 'N'], ['C', 'D']];
const NAPRIAMY = [0, 15, 160, 200, 340];

/** Кут AOP = x: точку P ставимо так, щоб кут на малюнку був схожий (але коло лишалося помітним). */
const vidstanDlia = (x: number) => Math.min(3, Math.max(1.35, 1 / Math.cos((x * Math.PI) / 180)));

function kutyOAP(r: Vypadok): TrenZavdannia {
  const [P, A] = r.vybir(PARY);
  const x = r.chyslo(15, 75); // ∠AOP
  const y = 90 - x; // ∠APO
  const daniVO = r.shans();
  const zMalunkom = r.shans(0.7);
  const malunok = kolo({
    zovnishnia: { l: P, d: vidstanDlia(x), kut: r.vybir(NAPRIAMY), dotyku: [A] },
    vidrizky: [{ a: 'O', b: A, k: 2 }, { a: 'O', b: P }],
    priamiKuty: [[A, 'O', P]],
    kuty: [{ v: 'O', a: A, b: P, pidpys: daniVO ? `${x}°` : '?' }, { v: P, a: A, b: 'O', pidpys: daniVO ? '?' : `${y}°`, r: 30 }],
  });
  return {
    pytannia: `${P}${A} — дотична, ${A} — точка дотику, ${daniVO ? `∠${A}O${P} = ${x}°` : `∠${A}${P}O = ${y}°`}. Знайди ${daniVO ? `∠${A}${P}O` : `∠${A}O${P}`}.`,
    malunok: zMalunkom ? malunok : undefined,
    vidpovid: daniVO ? y : x,
    odynytsi: '°',
    pidkazka: `Дотична перпендикулярна до радіуса O${A}. Який кут у трикутнику O${A}${P} прямий?`,
    rozviazok: `Кут O${A}${P} прямий, тож гострі кути трикутника O${A}${P} разом дають 90°: ${daniVO ? `кут ${A}${P}O дорівнює 90° − ${x}° = ${y}°` : `кут ${A}O${P} дорівнює 90° − ${y}° = ${x}°`}.`,
  };
}

const TRIIKY = [['P', 'A', 'B'], ['M', 'K', 'N'], ['S', 'A', 'B'], ['K', 'C', 'D'], ['T', 'M', 'N']];

function rivniVidrizky(r: Vypadok): TrenZavdannia {
  const [P, A, B] = r.vybir(TRIIKY);
  const k = r.chyslo(3, 25);
  const c = r.chyslo(2, 2 * k - 1);
  if (r.shans()) {
    return {
      pytannia: `${P}${A} і ${P}${B} — дотичні до кола, ${A} і ${B} — точки дотику, ${P}${A} + ${P}${B} = ${2 * k} см. Знайди ${P}${B}.`,
      vidpovid: k,
      odynytsi: 'см',
      pidkazka: 'Відрізки дотичних, проведених з однієї точки, рівні.',
      rozviazok: `${P}${A} = ${P}${B}, тож кожен дорівнює ${2 * k} : 2 = ${k} см.`,
    };
  }
  return {
    pytannia: `${P}${A} і ${P}${B} — дотичні до кола, ${A} і ${B} — точки дотику, ${A}${B} = ${c} см, периметр трикутника ${A}${P}${B} — ${2 * k + c} см. Знайди ${P}${A}.`,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: `Відніми ${A}${B} від периметра — лишаться два рівні відрізки дотичних.`,
    rozviazok: `${P}${A} = ${P}${B}, а разом вони ${2 * k + c} − ${c} = ${2 * k} см. Кожен: ${2 * k} : 2 = ${k} см.`,
  };
}

function bisektrysa(r: Vypadok): TrenZavdannia {
  const [P, A, B] = r.vybir(TRIIKY);
  const y = r.chyslo(10, 70); // ∠APO
  const zTsiloho = r.shans();
  const zMalunkom = r.shans(0.6);
  const d = Math.min(3, Math.max(1.4, 1 / Math.sin((y * Math.PI) / 180)));
  const malunok = kolo({
    zovnishnia: { l: P, d, kut: r.vybir([0, 180]), dotyku: [A, B] },
    vidrizky: [{ a: 'O', b: A, k: 2 }, { a: 'O', b: B, k: 2 }],
    priamiKuty: [[A, 'O', P], [B, 'O', P]],
    kuty: [{ v: P, a: A, b: B, pidpys: zTsiloho ? `${2 * y}°` : '?', r: 30 }],
  });
  return {
    pytannia: zTsiloho
      ? `${P}${A} і ${P}${B} — дотичні, O — центр кола, ∠${A}${P}${B} = ${2 * y}°. Знайди ∠${A}${P}O.`
      : `${P}${A} і ${P}${B} — дотичні, O — центр кола, ∠${A}${P}O = ${y}°. Знайди ∠${A}${P}${B}.`,
    malunok: zMalunkom ? malunok : undefined,
    vidpovid: zTsiloho ? y : 2 * y,
    odynytsi: '°',
    pidkazka: `${P}O — бісектриса кута ${A}${P}${B}.`,
    rozviazok: zTsiloho
      ? `Трикутники O${A}${P} і O${B}${P} рівні, тож ${P}O ділить кут ${A}${P}${B} навпіл: ${2 * y}° : 2 = ${y}°.`
      : `Трикутники O${A}${P} і O${B}${P} рівні, тож кут ${A}${P}${B} удвічі більший: 2 · ${y}° = ${2 * y}°.`,
  };
}

function tryTsiat(r: Vypadok): TrenZavdannia {
  const [P, A] = r.vybir(PARY);
  const k = r.chyslo(2, 25);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `${P}${A} — дотична, ${A} — точка дотику, радіус кола — ${k} см, O${P} = ${2 * k} см. Знайди ∠${A}${P}O.`,
      vidpovid: 30,
      odynytsi: '°',
      pidkazka: `Трикутник O${A}${P} прямокутний. Порівняй катет O${A} з гіпотенузою O${P}.`,
      rozviazok: `Кут O${A}${P} прямий. Катет O${A} дорівнює половині гіпотенузи O${P}: ${2 * k} : 2 = ${k}. Тому кут навпроти нього — кут ${A}${P}O — дорівнює 30°.`,
    };
  }
  const daniP = typ === 1;
  return {
    pytannia: `${P}${A} — дотична, ${A} — точка дотику, O${A} = ${k} см, ${daniP ? `∠${A}${P}O = 30°` : `∠${A}O${P} = 60°`}. Знайди O${P}.`,
    malunok: kolo({
      zovnishnia: { l: P, d: 2, kut: r.vybir(NAPRIAMY), dotyku: [A] },
      vidrizky: [{ a: 'O', b: A, k: 2, pidpys: `${k} см`, vid: P }, { a: 'O', b: P, pidpys: '?', vid: A, t: 0.75 }],
      priamiKuty: [[A, 'O', P]],
      kuty: [daniP ? { v: P, a: A, b: 'O', pidpys: '30°' } : { v: 'O', a: A, b: P, pidpys: '60°' }],
    }),
    vidpovid: 2 * k,
    odynytsi: 'см',
    pidkazka: 'Знайди кут навпроти катета OA. Трикутник OAP прямокутний.',
    rozviazok: `${daniP ? '' : `Кут ${A}${P}O дорівнює 90° − 60° = 30°. `}Катет O${A} лежить навпроти кута 30°, тож гіпотенуза O${P} удвічі більша: 2 · ${k} = ${2 * k} см.`,
  };
}

function kutAOB(r: Vypadok): TrenZavdannia {
  const [P, A, B] = r.vybir(TRIIKY);
  const y = r.chyslo(10, 75); // ∠APO
  const z = 180 - 2 * y; // ∠AOB
  const zP = r.shans();
  return {
    pytannia: zP
      ? `${P}${A} і ${P}${B} — дотичні, O — центр кола, ∠${A}${P}${B} = ${2 * y}°. Знайди ∠${A}O${B}.`
      : `${P}${A} і ${P}${B} — дотичні, O — центр кола, ∠${A}O${B} = ${z}°. Знайди ∠${A}${P}${B}.`,
    vidpovid: zP ? z : 2 * y,
    odynytsi: '°',
    pidkazka: `Розглянь прямокутні трикутники O${A}${P} і O${B}${P}: кожен з кутів при ${P} і при O — половина.`,
    rozviazok: zP
      ? `Кут ${A}${P}O дорівнює ${2 * y}° : 2 = ${y}°, тоді кут ${A}O${P} дорівнює 90° − ${y}° = ${90 - y}°. Кут ${A}O${B} — два такі кути: 2 · ${90 - y}° = ${z}°.`
      : `Кут ${A}O${P} дорівнює ${z}° : 2 = ${90 - y}°, тоді кут ${A}${P}O дорівнює 90° − ${90 - y}° = ${y}°. Кут ${A}${P}${B} — два такі кути: 2 · ${y}° = ${2 * y}°.`,
  };
}

function rivnostoronnii(r: Vypadok): TrenZavdannia {
  const [P, A, B] = r.vybir(TRIIKY);
  const k = r.chyslo(2, 25);
  const typ = r.chyslo(0, 1);
  const kryok = `${P}${A} = ${P}${B}, тож трикутник ${A}${P}${B} рівнобедрений, і кути при основі по (180° − 60°) : 2 = 60°. Він рівносторонній`;
  return {
    pytannia:
      typ === 0
        ? `${P}${A} і ${P}${B} — дотичні, ∠${A}${P}${B} = 60°, ${P}${A} = ${k} см. Знайди ${A}${B}.`
        : `${P}${A} і ${P}${B} — дотичні, ∠${A}${P}${B} = 60°, ${A}${B} = ${k} см. Знайди периметр трикутника ${A}${P}${B}.`,
    malunok: kolo({
      zovnishnia: { l: P, d: 2, kut: r.vybir([0, 180]), dotyku: [A, B] },
      vidrizky: [{ a: A, b: B, pidpys: typ === 1 ? `${k} см` : '?' }, ...(typ === 0 ? [{ a: P, b: A, pidpys: `${k} см`, vid: B }] : [])],
      kuty: [{ v: P, a: A, b: B, pidpys: '60°', r: 22 }],
    }),
    vidpovid: typ === 0 ? k : 3 * k,
    odynytsi: 'см',
    pidkazka: `${P}${A} = ${P}${B}, а кут між ними 60°. Який це трикутник?`,
    rozviazok: typ === 0 ? `${kryok}: ${A}${B} = ${P}${A} = ${k} см.` : `${kryok}: усі сторони по ${k} см. Периметр: 3 · ${k} = ${3 * k} см.`,
  };
}

export default {
  rivni: ['пряма і коло: d і r', 'дотична ⊥ радіусу, дві дотичні', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([roztashuvannia, roztashuvannia, vidstanDoDotychnoi])(r);
    if (riven === 2) return r.vybir([kutyOAP, kutyOAP, rivniVidrizky, bisektrysa])(r);
    return r.vybir([tryTsiat, kutAOB, rivnostoronnii, bisektrysa, kutyOAP])(r);
  },
} satisfies Henerator;
