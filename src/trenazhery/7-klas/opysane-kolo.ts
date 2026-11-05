// Серединний перпендикуляр і описане коло: точка на серединному перпендикулярі (рівні відстані, периметр), де лежить
// центр описаного кола (за кутами трикутника), радіус описаного кола прямокутного трикутника і медіана до гіпотенузи,
// кут 30°, кути трикутника AOB з радіусами, кути, які медіана до гіпотенузи утворює з катетами.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { kolo } from '../kolo.ts';

const PARY = [['A', 'B', 'P', 'M'], ['C', 'D', 'K', 'H'], ['M', 'N', 'P', 'K'], ['K', 'L', 'S', 'M'], ['E', 'F', 'P', 'H']];
const LITERY = [['A', 'B', 'C'], ['K', 'M', 'N'], ['M', 'N', 'P'], ['D', 'E', 'F'], ['P', 'Q', 'R']];

/** Малюнок: серединний перпендикуляр до AB, точка P на ньому. */
const malunokPerp = (A: string, B: string, P: string, M: string, pidpysy: { PA?: string; PB?: string; AB?: string }) =>
  kolo({
    bezKola: true,
    tochky: { [A]: [-1.2, 0], [B]: [1.2, 0], [P]: [0, 1.4] },
    serednia: { [M]: [A, B] },
    priami: [{ a: M, b: P, dali: 0.4 }],
    vidrizky: [
      { a: P, b: A, k: 2, pidpys: pidpysy.PA, vid: B },
      { a: P, b: B, k: 2, pidpys: pidpysy.PB, vid: A },
      { a: A, b: M, rysky: 2, pidpys: pidpysy.AB, vid: P },
      { a: M, b: B, rysky: 2 },
    ],
    priamiKuty: [[M, B, P]],
    literyKut: { [M]: 300, [P]: 30 },
  });

function rivnoviddalena(r: Vypadok): TrenZavdannia {
  const [A, B, P, M] = r.vybir(PARY);
  const k = r.chyslo(3, 30);
  const c = r.chyslo(2, 2 * k - 1);
  const typ = r.chyslo(0, 2);
  const umova = `Точка ${P} лежить на серединному перпендикулярі до відрізка ${A}${B}`;
  if (typ === 0) {
    return {
      pytannia: `${umova}, ${P}${A} = ${k} см. Знайди ${P}${B}.`,
      malunok: r.shans() ? malunokPerp(A, B, P, M, { PA: `${k} см`, PB: '?' }) : undefined,
      vidpovid: k,
      odynytsi: 'см',
      pidkazka: 'Кожна точка серединного перпендикуляра однаково віддалена від кінців відрізка.',
      rozviazok: `${P} лежить на серединному перпендикулярі, тож ${P}${B} = ${P}${A} = ${k} см.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${umova}, ${P}${A} = ${k} см, ${A}${B} = ${c} см. Знайди периметр трикутника ${P}${A}${B}.`,
      vidpovid: 2 * k + c,
      odynytsi: 'см',
      pidkazka: `${P}${B} = ${P}${A}.`,
      rozviazok: `${P}${B} = ${P}${A} = ${k} см. Периметр: ${k} + ${k} + ${c} = ${2 * k + c} см.`,
    };
  }
  return {
    pytannia: `${umova}, ${A}${B} = ${c} см, периметр трикутника ${P}${A}${B} — ${2 * k + c} см. Знайди ${P}${A}.`,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: `${P}${A} = ${P}${B}. Відніми ${A}${B} від периметра.`,
    rozviazok: `${P}${A} = ${P}${B}, разом ${2 * k + c} − ${c} = ${2 * k} см, тож ${P}${A} дорівнює ${2 * k} : 2 = ${k} см.`,
  };
}

const DE = ['усередині трикутника', 'на середині сторони', 'поза трикутником'];

function deTsentr(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2); // 0 — гострокутний, 1 — прямокутний, 2 — тупокутний
  let k: number[];
  for (;;) {
    const a = typ === 1 ? 90 : typ === 2 ? r.chyslo(95, 150) : r.chyslo(46, 88);
    const b = r.chyslo(10, 180 - a - 10);
    const c = 180 - a - b;
    if (c >= 10 && Math.max(a, b, c) === a && (typ !== 0 || a < 90)) {
      k = r.peremishaty([a, b, c]);
      break;
    }
  }
  const tretii = r.shans(0.4);
  const dani = tretii ? k.slice(0, 2) : k;
  const naib = Math.max(...k);
  return {
    pytannia: `${tretii ? 'Два кути трикутника' : 'Кути трикутника'} — ${dani.map((x) => `${x}°`).join(tretii ? ' і ' : ', ')}. Де лежить центр описаного кола?`,
    vidpovid: DE[typ],
    varianty: DE,
    pidkazka: 'Знайди найбільший кут. Він гострий, прямий чи тупий?',
    rozviazok:
      `${tretii ? `Третій кут дорівнює 180° − ${dani[0]}° − ${dani[1]}° = ${k[2]}°. ` : ''}` +
      `Найбільший кут — ${naib}°, ` +
      (typ === 0 ? 'усі кути гострі, тож центр описаного кола всередині трикутника.' : typ === 1 ? 'трикутник прямокутний, тож центр — середина гіпотенузи.' : 'кут тупий, тож центр описаного кола лежить поза трикутником.'),
  };
}

/** Прямокутний трикутник у колі: прямий кут при вершині C (l[2]), гіпотенуза AB — діаметр. */
const malunokPriam = (l: string[], O: string, pidpysy: { AB?: string; OC?: string }) =>
  kolo({
    tsentr: O,
    naKoli: { [l[0]]: 180, [l[1]]: 0, [l[2]]: 118 },
    mnohokutnyk: [l[0], l[2], l[1]],
    kolirKola: 3,
    vidrizky: [
      { a: l[0], b: O, pidpys: pidpysy.AB, vid: l[2] },
      { a: O, b: l[2], k: 2, shtrykh: true, pidpys: pidpysy.OC, vid: l[1] },
    ],
    priamiKuty: [[l[2], l[0], l[1]]],
    literyKut: { [O]: 270 },
  });

function radiusPriamokutnoho(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [A, B, C] = l;
  const AB = `${A}${B}`;
  const k = r.chyslo(2, 30);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `У трикутнику ${A}${B}${C} ∠${C} = 90°, ${AB} = ${2 * k} см. Знайди радіус описаного кола.`,
      vidpovid: k,
      odynytsi: 'см',
      pidkazka: 'Центр кола, описаного навколо прямокутного трикутника, — середина гіпотенузи.',
      rozviazok: `Центр описаного кола — середина гіпотенузи ${AB}, тож радіус дорівнює ${2 * k} : 2 = ${k} см.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Радіус кола, описаного навколо прямокутного трикутника, — ${k} см. Знайди гіпотенузу.`,
      vidpovid: 2 * k,
      odynytsi: 'см',
      pidkazka: 'Гіпотенуза — діаметр описаного кола.',
      rozviazok: `Центр описаного кола — середина гіпотенузи, тож гіпотенуза — це два радіуси: 2 · ${k} = ${2 * k} см.`,
    };
  }
  const M = A === 'M' || B === 'M' || C === 'M' ? 'O' : 'M';
  return {
    pytannia: `У трикутнику ${A}${B}${C} ∠${C} = 90°, ${C}${M} — медіана, ${AB} = ${2 * k} см. Знайди ${C}${M}.`,
    malunok: r.shans() ? malunokPriam(l, M, { AB: undefined, OC: '?' }) : undefined,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: `${M} — середина гіпотенузи, тобто центр описаного кола.`,
    rozviazok: `${M} — середина гіпотенузи і центр описаного кола, тож ${C}${M} — радіус: ${2 * k} : 2 = ${k} см.`,
  };
}

function z30(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  const k = r.chyslo(2, 25);
  const z60 = r.shans();
  return {
    pytannia: `У трикутнику ${A}${B}${C} ∠${C} = 90°, ${z60 ? `∠${B} = 60°` : `∠${A} = 30°`}, ${B}${C} = ${k} см. Знайди радіус описаного кола.`,
    vidpovid: k,
    odynytsi: 'см',
    pidkazka: `Знайди гіпотенузу: катет ${B}${C} лежить навпроти кута 30°.`,
    rozviazok:
      `${z60 ? `Кут ${A} дорівнює 90° − 60° = 30°. ` : ''}Катет ${B}${C} лежить навпроти кута ${A} (30°), тож гіпотенуза ${A}${B} дорівнює 2 · ${k} = ${2 * k} см. ` +
      `Центр описаного кола — її середина: радіус дорівнює ${2 * k} : 2 = ${k} см.`,
  };
}

function kutAOB(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  const y = r.chyslo(10, 80); // ∠OAB
  const x = 180 - 2 * y; // ∠AOB
  const zTsentru = r.shans();
  return {
    pytannia: zTsentru
      ? `O — центр кола, описаного навколо трикутника ${A}${B}${C}, ∠${A}O${B} = ${x}°. Знайди ∠O${A}${B}.`
      : `O — центр кола, описаного навколо трикутника ${A}${B}${C}, ∠O${A}${B} = ${y}°. Знайди ∠${A}O${B}.`,
    malunok: kolo({
      naKoli: { [A]: 270 - x / 2 - 15, [B]: 270 + x / 2 - 15, [C]: 90 + r.chyslo(-30, 30) },
      mnohokutnyk: [A, B, C],
      kolirKola: 3,
      vidrizky: [{ a: 'O', b: A, k: 2, rysky: 1 }, { a: 'O', b: B, k: 2, rysky: 1 }],
    }),
    vidpovid: zTsentru ? y : x,
    odynytsi: '°',
    pidkazka: `O${A} і O${B} — радіуси описаного кола.`,
    rozviazok: zTsentru
      ? `O${A} = O${B}, тож трикутник ${A}O${B} рівнобедрений: кути при основі по (180° − ${x}°) : 2 = ${y}°.`
      : `O${A} = O${B}, тож трикутник ${A}O${B} рівнобедрений, кут O${B}${A} теж ${y}°. Кут ${A}O${B} дорівнює 180° − ${y}° − ${y}° = ${x}°.`,
  };
}

function medianaKuty(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  const M = A === 'M' || B === 'M' || C === 'M' ? 'O' : 'M';
  const x = r.chyslo(15, 75); // ∠A
  const typ = r.chyslo(0, 2);
  const krok = `${M} — середина гіпотенузи і центр описаного кола, тож ${M}${A} = ${M}${C}, і трикутник ${A}${M}${C} рівнобедрений.`;
  return {
    pytannia: `У трикутнику ${A}${B}${C} ∠${C} = 90°, ∠${A} = ${x}°, ${C}${M} — медіана. Знайди ${typ === 0 ? `∠${M}${C}${A}` : typ === 1 ? `∠${M}${C}${B}` : `∠${B}${M}${C}`}.`,
    vidpovid: typ === 0 ? x : typ === 1 ? 90 - x : 2 * x,
    odynytsi: '°',
    pidkazka: `${M}${A} = ${M}${C} — радіуси описаного кола. Який трикутник рівнобедрений?`,
    rozviazok:
      typ === 0
        ? `${krok} Кут ${M}${C}${A} дорівнює куту ${A}: ${x}°.`
        : typ === 1
          ? `${krok} Кут ${M}${C}${A} дорівнює ${x}°, тоді кут ${M}${C}${B} дорівнює 90° − ${x}° = ${90 - x}°.`
          : `${krok} Кут ${M}${C}${A} дорівнює ${x}°. Зовнішній кут ${B}${M}${C} трикутника ${A}${M}${C} дорівнює ${x}° + ${x}° = ${2 * x}°.`,
  };
}

export default {
  rivni: ['серединний перпендикуляр', 'прямокутний трикутник і центр кола', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([rivnoviddalena, rivnoviddalena, deTsentr])(r);
    if (riven === 2) return r.vybir([radiusPriamokutnoho, radiusPriamokutnoho, deTsentr, z30])(r);
    return r.vybir([kutAOB, medianaKuty, medianaKuty, z30, rivnoviddalena])(r);
  },
} satisfies Henerator;
