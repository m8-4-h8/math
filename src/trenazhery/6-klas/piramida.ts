// Піраміда (Істер, додаткові теми): у n-кутної піраміди n + 1 граней, 2n ребер, n + 1 вершин; обернені задачі
// (скільки сторін в основі); чи існує піраміда з такою кількістю ребер; сума довжин ребер правильної піраміди.
import { ch, skilky, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const NAZVY: Record<number, string> = {
  3: 'трикутної',
  4: 'чотирикутної',
  5: 'п’ятикутної',
  6: 'шестикутної',
  7: 'семикутної',
  8: 'восьмикутної',
  9: 'дев’ятикутної',
  10: 'десятикутної',
  12: 'дванадцятикутної',
  20: 'двадцятикутної',
};
const SHCHO: [string, (n: number) => number, (n: number) => string, string][] = [
  ['граней', (n) => n + 1, (n) => `${n} + 1 = ${n + 1}`, 'бічних граней стільки, скільки сторін в основі, і ще сама основа'],
  ['ребер', (n) => 2 * n, (n) => `2 · ${n} = ${2 * n}`, 'ребра є в основі й бічні — їх порівну'],
  ['вершин', (n) => n + 1, (n) => `${n} + 1 = ${n + 1}`, 'вершини основи і ще вершина піраміди'],
  ['бічних граней', (n) => n, (n) => `${n}`, 'бічних граней стільки, скільки сторін в основі'],
];

function poriakhuvaty(r: Vypadok): TrenZavdannia {
  const n = Number(r.vybir(Object.keys(NAZVY)));
  const [shcho, f, formula, poiasnennia] = r.vybir(SHCHO);
  return {
    pytannia: `Скільки ${shcho} у ${NAZVY[n]} піраміди?`,
    vidpovid: f(n),
    pidkazka: `Основа має ${skilky(n, 'сторону', 'сторони', 'сторін')}: ${poiasnennia}.`,
    rozviazok: `${zVelykoi(poiasnennia)}: ${formula(n)}`,
  };
}

function obernena(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 40);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Піраміда має ${2 * n} ребер. Скільки сторін має многокутник в її основі?`,
      vidpovid: n,
      pidkazka: 'Ребер 2n.',
      rozviazok: `2n = ${2 * n}, n = ${2 * n} : 2 = ${n}`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Піраміда має ${n + 1} граней. Скільки сторін має многокутник в її основі?`,
      vidpovid: n,
      pidkazka: 'Граней n + 1: бічні й основа.',
      rozviazok: `n + 1 = ${n + 1}, n = ${n}`,
    };
  }
  return {
    pytannia: `Основа піраміди має ${n} сторін. Скільки всього граней, ребер і вершин разом?`,
    vidpovid: n + 1 + 2 * n + n + 1,
    pidkazka: 'Граней n + 1, ребер 2n, вершин n + 1.',
    rozviazok: `${n + 1} + ${2 * n} + ${n + 1} = ${4 * n + 2}`,
  };
}

function isnuie(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(3, 120);
  const tak = k % 2 === 0 && k >= 6;
  return {
    pytannia: `Чи існує піраміда, яка має ${k} ребер?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Ребер у піраміди 2n, де n — кількість сторін основи (n ≥ 3).',
    rozviazok: tak ? `Так: 2n = ${k}, n = ${k / 2} — ${k / 2}-кутна піраміда.` : k % 2 ? `Ні: ${k} — непарне число, а ребер завжди парна кількість.` : `Ні: найменше — 6 ребер у трикутної піраміди.`,
  };
}

/** Правильна піраміда: усі сторони основи — a, усі бічні ребра — b. */
function sumaReber(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 8);
  const [a, b] = [r.chyslo(2, 12), r.chyslo(3, 15)];
  return {
    pytannia: `У ${NAZVY[n]} піраміди кожна сторона основи — ${a} см, а кожне бічне ребро — ${b} см. Знайди суму довжин усіх ребер.`,
    vidpovid: n * (a + b),
    odynytsi: 'см',
    pidkazka: `${n} ребер основи по ${a} см і ${n} бічних по ${b} см.`,
    rozviazok: `${n} · ${a} + ${n} · ${b} = ${n * a} + ${n * b} = ${ch(n * (a + b))} (см)`,
  };
}

export default {
  rivni: ['грані, ребра, вершини', 'скільки сторін в основі', 'чи існує; сума довжин ребер'],
  zavdannia(r, riven) {
    if (riven === 1) return poriakhuvaty(r);
    if (riven === 2) return r.vybir([obernena, obernena, poriakhuvaty])(r);
    return r.vybir([isnuie, sumaReber, sumaReber, obernena])(r);
  },
} satisfies Henerator;
