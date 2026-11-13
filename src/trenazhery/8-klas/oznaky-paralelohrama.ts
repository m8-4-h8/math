// Ознаки паралелограма: за якою ознакою чотирикутник — паралелограм; «чи обов'язково паралелограм» (пастки:
// трапеція, рівні діагоналі, «повітряний змій», навпіл лише одна діагональ); спершу ознака, потім властивості —
// сторони, кути, периметр, периметр трикутника COD, відношення кутів.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

const TN = ['Так', 'Ні'];
const LITERY: [string, string, string, string][] = [
  ['A', 'B', 'C', 'D'],
  ['K', 'L', 'M', 'N'],
  ['M', 'N', 'P', 'K'],
  ['P', 'Q', 'R', 'S'],
];
const OZNAKY = ['дві сторони паралельні й рівні', 'протилежні сторони попарно рівні', 'діагоналі діляться навпіл'];
const nazva = (l: string[]) => l.join('');
/** Сторона i: AB, BC, CD, AD (а не DA — як пишуть у підручнику). */
const st = (l: string[], i: number) => (i === 3 ? l[0] + l[3] : l[i] + l[i + 1]);

/** Дані до ознаки n (0, 1, 2) для чотирикутника з вершинами l. */
function dani(r: Vypadok, l: string[], n: number) {
  const a = r.chyslo(3, 15);
  const b = r.krim(3, 18, [a]);
  if (n === 0) {
    const i = r.chyslo(0, 1);
    return `${st(l, i)} ∥ ${st(l, i + 2)}, ${st(l, i)} = ${st(l, i + 2)} = ${a} см`;
  }
  if (n === 1) return `${st(l, 0)} = ${st(l, 2)} = ${a} см, ${st(l, 1)} = ${st(l, 3)} = ${b} см`;
  return `діагоналі ${l[0]}${l[2]} і ${l[1]}${l[3]} перетинаються в точці O, ${l[0]}O = O${l[2]} = ${a} см, ${l[1]}O = O${l[3]} = ${b} см`;
}

function yakaOznaka(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const n = r.chyslo(0, 2);
  return {
    pytannia: `У чотирикутнику ${nazva(l)} ${dani(r, l, n)}. За якою ознакою ${nazva(l)} — паралелограм?`,
    vidpovid: OZNAKY[n],
    varianty: OZNAKY,
    pidkazka: n === 2 ? 'Дано про діагоналі, а не про сторони.' : 'Подивися, скільки пар сторін згадано і що про них сказано.',
    rozviazok: `Ознака ${n + 1}: ${OZNAKY[n]}.`,
  };
}

/** Спершу ознака, потім властивість: сторона, кут або периметр. */
function znachennia(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const typ = r.chyslo(0, 2);
  const a = r.chyslo(3, 15);
  const b = r.krim(3, 18, [a]);
  if (typ === 0) {
    // BC ∥ AD, BC = AD = a, AB = b → периметр
    return {
      pytannia: `У чотирикутнику ${nazva(l)} ${st(l, 1)} ∥ ${st(l, 3)}, ${st(l, 1)} = ${st(l, 3)} = ${a} см, ${st(l, 0)} = ${b} см. Знайди периметр ${nazva(l)}.`,
      vidpovid: 2 * (a + b),
      odynytsi: 'см',
      pidkazka: `Пара ${st(l, 1)}, ${st(l, 3)} паралельна й рівна — це ознака 1. Тоді ${st(l, 2)} = ${st(l, 0)}.`,
      rozviazok: `${nazva(l)} — паралелограм, тож ${st(l, 2)} дорівнює ${b} см. P = 2 · (${a} + ${b}) = ${2 * (a + b)} см.`,
    };
  }
  if (typ === 1) {
    // AO = OC, BO = OD, AB = a → CD
    return {
      pytannia: `Діагоналі чотирикутника ${nazva(l)} перетинаються в точці O, ${l[0]}O = O${l[2]}, ${l[1]}O = O${l[3]}, ${st(l, 0)} = ${a} см. Знайди ${st(l, 2)}.`,
      vidpovid: a,
      odynytsi: 'см',
      pidkazka: 'Спершу з\'ясуй, що це за чотирикутник.',
      rozviazok: `Діагоналі діляться навпіл, тож за ознакою 3 ${nazva(l)} — паралелограм, а протилежні сторони рівні: ${st(l, 2)} дорівнює ${a} см.`,
    };
  }
  // AB = CD, BC = AD, ∠A = g → ∠B або ∠C
  const g = r.krim(30, 150, [90]);
  const sus = r.shans();
  const k = sus ? 1 : 2;
  const vidp = sus ? 180 - g : g;
  return {
    pytannia: `У чотирикутнику ${nazva(l)} ${st(l, 0)} = ${st(l, 2)}, ${st(l, 1)} = ${st(l, 3)}, ∠${l[0]} = ${g}°. Знайди ∠${l[k]}.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `Протилежні сторони попарно рівні — це паралелограм. ${l[0]} і ${l[k]} — ${sus ? 'сусідні' : 'протилежні'} вершини.`,
    rozviazok: sus
      ? `${nazva(l)} — паралелограм (ознака 2). Сусідні кути разом 180°, тож кут ${l[k]} дорівнює 180° − ${g}° = ${vidp}°.`
      : `${nazva(l)} — паралелограм (ознака 2). Протилежні кути рівні: кут ${l[k]} дорівнює ${g}°.`,
  };
}

/** Чи обов'язково чотирикутник — паралелограм. */
function chyParalelohram(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(3, 15);
  const b = r.krim(3, 18, [a]);
  const [A, B, C, D] = l;
  const vypadky: [string, boolean, string][] = [
    [`${A}${B} = ${C}${D} = ${a} см, ${B}${C} = ${A}${D} = ${b} см`, true, 'Протилежні сторони попарно рівні — ознака 2.'],
    [`${B}${C} ∥ ${A}${D}, ${B}${C} = ${A}${D} = ${a} см`, true, 'Одна пара сторін паралельна й рівна — ознака 1.'],
    [`діагоналі перетинаються в точці O, ${A}O = O${C} = ${a} см, ${B}O = O${D} = ${b} см`, true, 'Обидві діагоналі діляться навпіл — ознака 3.'],
    [`${A}${B} ∥ ${C}${D}, ${B}${C} ∥ ${A}${D}`, true, 'Протилежні сторони попарно паралельні — це означення паралелограма.'],
    [`${B}${C} ∥ ${A}${D}, ${A}${B} = ${C}${D} = ${a} см`, false, 'Паралельна одна пара, а рівна інша — так буває в рівнобічній трапеції.'],
    [`діагоналі ${A}${C} і ${B}${D} рівні: по ${a} см`, false, 'Рівні діагоналі — не ознака паралелограма: вони рівні й у рівнобічної трапеції.'],
    [`діагоналі перетинаються в точці O, ${A}O = O${C} = ${a} см`, false, `Навпіл ділиться лише ${A}${C}. Про ${B}O і O${D} нічого не відомо — це може бути «повітряний змій».`],
    [`${A}${B} = ${A}${D} = ${a} см, ${C}${B} = ${C}${D} = ${b} см`, false, 'Рівні сусідні сторони, а не протилежні, — це «повітряний змій».'],
    [`${B}${C} ∥ ${A}${D}, ${B}${C} = ${a} см, ${A}${D} = ${b} см`, false, 'Паралельні сторони різної довжини — це трапеція.'],
  ];
  const [umova, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `У чотирикутнику ${nazva(l)} ${umova}. Чи обов'язково ${nazva(l)} — паралелограм?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Порівняй з трьома ознаками. Паралельна й рівна має бути одна й та сама пара сторін.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** AO = OC, BO = OD (ознака 3), AC = p, BD = q, AB = c → периметр трикутника COD. */
function trykutnykCOD(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  for (;;) {
    const h1 = r.chyslo(3, 12);
    const h2 = r.krim(3, 12, [h1]);
    const c = r.chyslo(3, 20);
    if (c >= h1 + h2 || c <= Math.abs(h1 - h2)) continue;
    const p = 2 * h1;
    const q = 2 * h2;
    const P = c + h1 + h2;
    return {
      pytannia: `Діагоналі чотирикутника ${nazva(l)} перетинаються в точці O і діляться нею навпіл. ${l[0]}${l[2]} = ${p} см, ${l[1]}${l[3]} = ${q} см, ${st(l, 0)} = ${c} см. Знайди периметр трикутника ${l[2]}O${l[3]}.`,
      vidpovid: P,
      odynytsi: 'см',
      pidkazka: `За ознакою 3 це паралелограм, тож ${st(l, 2)} = ${st(l, 0)}. O${l[2]} і O${l[3]} — половини діагоналей.`,
      rozviazok: `O${l[2]} = ${p} : 2 = ${h1}, O${l[3]} = ${q} : 2 = ${h2}, ${st(l, 2)} = ${st(l, 0)} = ${c}. Периметр ${c} + ${h1} + ${h2} = ${P} см.`,
    };
  }
}

/** AB = CD, BC = AD, периметр P, AB = a → BC. */
function storonaZPerymetra(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(3, 20);
  const b = r.krim(3, 25, [a]);
  const P = 2 * (a + b);
  return {
    pytannia: `У чотирикутнику ${nazva(l)} ${st(l, 0)} = ${st(l, 2)}, ${st(l, 1)} = ${st(l, 3)}. Периметр дорівнює ${P} см, ${st(l, 0)} = ${a} см. Знайди ${st(l, 1)}.`,
    vidpovid: b,
    odynytsi: 'см',
    pidkazka: `Дві сусідні сторони разом — половина периметра: ${P} : 2.`,
    rozviazok: `${st(l, 0)} + ${st(l, 1)} = ${P} : 2 = ${a + b}, тож ${st(l, 1)} дорівнює ${a + b} − ${a} = ${b} см.`,
  };
}

/** BC ∥ AD і BC = AD; ∠A : ∠B = m : n → ∠A, або ∠B на d більший → ∠B. */
function kuty(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const umova = `${st(l, 1)} ∥ ${st(l, 3)} і ${st(l, 1)} = ${st(l, 3)}`;
  if (r.shans()) {
    for (;;) {
      const m = r.chyslo(1, 8);
      const n = r.chyslo(m + 1, 9);
      if (180 % (m + n) !== 0) continue;
      const ch = 180 / (m + n);
      return {
        pytannia: `У чотирикутнику ${nazva(l)} ${umova}, а ∠${l[0]} : ∠${l[1]} = ${m} : ${n}. Знайди ∠${l[0]}.`,
        vidpovid: m * ch,
        odynytsi: '°',
        pidkazka: `Це паралелограм (ознака 1), тож ∠${l[0]} + ∠${l[1]} = 180°. Одна частина — 180° : ${m + n}.`,
        rozviazok: `Сусідні кути паралелограма разом 180°. Частин ${m + n}, одна частина 180° : ${m + n} = ${ch}°, кут ${l[0]} дорівнює ${m} · ${ch}° = ${m * ch}°.`,
      };
    }
  }
  const d = 2 * r.chyslo(5, 60);
  const menshyi = (180 - d) / 2;
  return {
    pytannia: `У чотирикутнику ${nazva(l)} ${umova}, а ∠${l[1]} на ${d}° більший за ∠${l[0]}. Знайди ∠${l[1]}.`,
    vidpovid: menshyi + d,
    odynytsi: '°',
    pidkazka: `Це паралелограм (ознака 1), тож ∠${l[0]} + ∠${l[1]} = 180°.`,
    rozviazok: `Кут ${l[0]} дорівнює (180° − ${d}°) : 2 = ${menshyi}°, кут ${l[1]} дорівнює ${menshyi}° + ${d}° = ${menshyi + d}°.`,
  };
}

export default {
  rivni: ['ознака і властивості', 'чи паралелограм', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([yakaOznaka, znachennia, znachennia])(r);
    if (riven === 2) return r.vybir([chyParalelohram, chyParalelohram, yakaOznaka])(r);
    return r.vybir([trykutnykCOD, storonaZPerymetra, kuty, znachennia])(r);
  },
} satisfies Henerator;
