// Середня лінія трапеції: півсума основ (за малюнком і без), обернена задача (друга основа), основи з різницею,
// твердження, периметр рівнобічної; діагональ ділить середню лінію на половини основ, відношення основ, драбина.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { chotyrykutnyk, type FormaChotyrykutnyka } from '../chotyrykutnyky.ts';

const TN = ['Так', 'Ні'];
/** Вершини трапеції, середини бічних сторін і точка перетину з діагоналлю — без збігів букв. */
const LITERY: { v: [string, string, string, string]; s: [string, string]; k: string }[] = [
  { v: ['A', 'B', 'C', 'D'], s: ['M', 'N'], k: 'K' },
  { v: ['K', 'L', 'M', 'N'], s: ['E', 'F'], k: 'O' },
  { v: ['M', 'N', 'P', 'K'], s: ['E', 'F'], k: 'O' },
  { v: ['P', 'Q', 'R', 'S'], s: ['M', 'N'], k: 'K' },
];
const FORMY: FormaChotyrykutnyka[] = ['trapetsiia', 'rivnobichna', 'priamokutna'];
const nazva = (l: string[]) => l.join('');
const PIDKAZKA = 'Середня лінія трапеції — півсума основ: додай основи й поділи на 2.';

/** Основи a < b однакової парності, щоб середня лінія була цілою. */
function osnovy(r: Vypadok, vid = 2, do_ = 20) {
  const a = r.chyslo(vid, do_);
  const b = a + 2 * r.chyslo(1, 9);
  return { a, b, m: (a + b) / 2 };
}

/** Півсума основ — за малюнком або лише текстом. */
function polusuma(r: Vypadok, zMalunkom: boolean): TrenZavdannia {
  const { v, s } = r.vybir(LITERY);
  const [A, B, C, D] = v;
  const [M, N] = s;
  const { a, b, m } = osnovy(r);
  return {
    pytannia: `${nazva(v)} — трапеція з основами ${A}${D} = ${b} см і ${B}${C} = ${a} см, ${M}${N} — середня лінія. Знайди ${M}${N}.`,
    malunok: zMalunkom
      ? chotyrykutnyk({ forma: r.vybir(FORMY), bukvy: v, strilky: [0, 1, 0, 1], serednia: s, storony: [undefined, `${a}`, undefined, `${b}`], pidpysSerednoi: '?' })
      : undefined,
    vidpovid: m,
    odynytsi: 'см',
    pidkazka: PIDKAZKA,
    rozviazok: `${M}${N} = (${b} + ${a}) : 2 = ${m} см. Середня лінія лежить між основами: ${a} < ${m} < ${b}.`,
  };
}

/** Вибір з варіантів: півсума, піврізниця чи сума основ. */
function vybir(r: Vypadok): TrenZavdannia {
  const { a, b, m } = osnovy(r);
  const varianty = [m, (b - a) / 2, a + b].sort((x, y) => x - y).map((x) => `${x} см`);
  return {
    pytannia: `Чому дорівнює середня лінія трапеції з основами ${a} см і ${b} см?`,
    vidpovid: `${m} см`,
    varianty,
    pidkazka: 'Середня лінія лежить між основами: вона довша за меншу основу й коротша за більшу.',
    rozviazok: `(${a} + ${b}) : 2 = ${m} см. ${(b - a) / 2} см — це піврізниця основ, а ${a + b} см — їх сума.`,
  };
}

/** Обернена задача: середня лінія й одна основа — знайди другу. */
function druhaOsnova(r: Vypadok): TrenZavdannia {
  const { v, s } = r.vybir(LITERY);
  const [A, B, C, D] = v;
  const [M, N] = s;
  const { a, b, m } = osnovy(r, 3, 20);
  const vidomaMensha = r.shans();
  const [vidoma, shukana] = vidomaMensha ? [a, b] : [b, a];
  const [nV, nSh] = vidomaMensha ? [`${B}${C}`, `${A}${D}`] : [`${A}${D}`, `${B}${C}`];
  const storony = vidomaMensha ? [undefined, `${a}`, undefined, '?'] : [undefined, '?', undefined, `${b}`];
  return {
    pytannia: `${M}${N} — середня лінія трапеції ${nazva(v)} з основами ${A}${D} і ${B}${C}. ${M}${N} = ${m} см, ${nV} = ${vidoma} см. Знайди ${nSh}.`,
    malunok: chotyrykutnyk({ forma: r.vybir(FORMY), bukvy: v, strilky: [0, 1, 0, 1], serednia: s, storony, pidpysSerednoi: `${m}` }),
    vidpovid: shukana,
    odynytsi: 'см',
    pidkazka: `Сума основ удвічі більша за середню лінію: 2 · ${m}.`,
    rozviazok: `${A}${D} + ${B}${C} = 2 · ${m} = ${2 * m} см, тож ${nSh} = ${2 * m} − ${vidoma} = ${shukana} см. Перевірка: (${b} + ${a}) : 2 = ${m}.`,
  };
}

/** Одна основа більша за другу на d, середня лінія відома. */
function riznytsia(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(3, 20);
  const d = 2 * r.chyslo(1, 6);
  const m = x + d / 2;
  const bilshu = r.shans();
  return {
    pytannia: `Одна основа трапеції на ${d} см більша за другу, а середня лінія дорівнює ${m} см. Знайди ${bilshu ? 'більшу' : 'меншу'} основу.`,
    vidpovid: bilshu ? x + d : x,
    odynytsi: 'см',
    pidkazka: `Позначь меншу основу x, тоді більша — x + ${d}, а їх сума — 2 · ${m}.`,
    rozviazok: `Сума основ 2 · ${m} = ${2 * m} см: x + x + ${d} = ${2 * m}, 2x = ${2 * m - d}, x = ${x}. Основи ${x} см і ${x + d} см. Перевірка: (${x} + ${x + d}) : 2 = ${m}.`,
  };
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Середня лінія трапеції паралельна основам.', true, 'Це властивість середньої лінії.'],
    ['Середня лінія трапеції дорівнює півсумі основ.', true, 'MN = (AD + BC) : 2.'],
    ['Середня лінія трапеції довша за меншу основу й коротша за більшу.', true, 'Півсума двох різних чисел лежить між ними.'],
    ['У трапеції лише одна середня лінія.', true, 'Вона сполучає середини бічних сторін, а бічних сторін дві.'],
    ['Середня лінія трапеції сполучає середини основ.', false, 'Вона сполучає середини бічних сторін.'],
    ['Середня лінія трапеції дорівнює піврізниці основ.', false, 'Вона дорівнює півсумі основ.'],
    ['Середня лінія трапеції дорівнює половині більшої основи.', false, 'Вона дорівнює півсумі обох основ.'],
    ['Середня лінія трапеції дорівнює сумі основ.', false, 'Суму основ ще треба поділити на 2.'],
    ['У трапеції дві середні лінії.', false, 'Середня лінія трапеції одна: вона сполучає середини бічних сторін.'],
    ['Середня лінія трапеції може бути довшою за більшу основу.', false, 'Півсума основ завжди менша за більшу основу.'],
  ];
  const [tekst, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження? ${tekst}`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Середня лінія трапеції сполучає середини бічних сторін і дорівнює півсумі основ.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** Периметр рівнобічної трапеції через середню лінію, або бічна сторона за периметром. */
function perymetr(r: Vypadok): TrenZavdannia {
  for (;;) {
    const { a, b, m } = osnovy(r);
    const c = r.chyslo(3, 20);
    if (2 * c <= b - a) continue; // інакше такої трапеції немає
    const P = 2 * m + 2 * c;
    if (r.shans()) {
      return {
        pytannia: `У рівнобічній трапеції бічна сторона ${c} см, а середня лінія ${m} см. Знайди периметр трапеції.`,
        vidpovid: P,
        odynytsi: 'см',
        pidkazka: `Сума основ — 2 · ${m}, а бічні сторони рівні.`,
        rozviazok: `Сума основ: 2 · ${m} = ${2 * m} см. P = ${2 * m} + ${c} + ${c} = ${P} см.`,
      };
    }
    return {
      pytannia: `Периметр рівнобічної трапеції ${P} см, а її середня лінія ${m} см. Знайди бічну сторону.`,
      vidpovid: c,
      odynytsi: 'см',
      pidkazka: `Сума основ — 2 · ${m}. Що лишається від периметра на дві бічні сторони?`,
      rozviazok: `Сума основ: 2 · ${m} = ${2 * m} см. Дві бічні сторони: ${P} − ${2 * m} = ${2 * c} см, одна — ${2 * c} : 2 = ${c} см.`,
    };
  }
}

/** Діагональ ділить середню лінію на половини основ (за малюнком). */
function diahonal(r: Vypadok): TrenZavdannia {
  const { v, s, k } = r.vybir(LITERY);
  const [A, B, C, D] = v;
  const [M, N] = s;
  const a = 2 * r.chyslo(2, 10);
  const b = a + 2 * r.chyslo(1, 8);
  const [mk, kn] = [a / 2, b / 2];
  const umova = `${M}${N} — середня лінія трапеції ${nazva(v)} з основами ${A}${D} і ${B}${C}, діагональ ${A}${C} перетинає її в точці ${k}.`;
  const pidkazka = `${M}${k} — середня лінія трикутника ${A}${B}${C}, а ${k}${N} — трикутника ${A}${C}${D}. Якій стороні паралельна кожна з них?`;
  const forma = r.vybir(FORMY);
  const typ = r.chyslo(1, 3);
  if (typ === 1) {
    const pytatyMK = r.shans();
    return {
      pytannia: `${umova} ${B}${C} = ${a} см, ${A}${D} = ${b} см. Знайди ${pytatyMK ? `${M}${k}` : `${k}${N}`}.`,
      malunok: chotyrykutnyk({ forma, bukvy: v, strilky: [0, 1, 0, 1], serednia: s, diahonalSerednoi: k, storony: [undefined, `${a}`, undefined, `${b}`], pidpysyChastyn: pytatyMK ? ['?', undefined] : [undefined, '?'] }),
      vidpovid: pytatyMK ? mk : kn,
      odynytsi: 'см',
      pidkazka,
      rozviazok: pytatyMK
        ? `${M}${k} — середня лінія трикутника ${A}${B}${C}, паралельна ${B}${C}: ${M}${k} = ${a} : 2 = ${mk} см.`
        : `${k}${N} — середня лінія трикутника ${A}${C}${D}, паралельна ${A}${D}: ${k}${N} = ${b} : 2 = ${kn} см.`,
    };
  }
  if (typ === 2) {
    const pytatyAD = r.shans();
    return {
      pytannia: `${umova} ${M}${k} = ${mk} см, ${k}${N} = ${kn} см. Знайди ${pytatyAD ? `${A}${D}` : `${B}${C}`}.`,
      malunok: chotyrykutnyk({ forma, bukvy: v, strilky: [0, 1, 0, 1], serednia: s, diahonalSerednoi: k, storony: pytatyAD ? [undefined, undefined, undefined, '?'] : [undefined, '?'], pidpysyChastyn: [`${mk}`, `${kn}`] }),
      vidpovid: pytatyAD ? b : a,
      odynytsi: 'см',
      pidkazka,
      rozviazok: pytatyAD
        ? `${k}${N} — середня лінія трикутника ${A}${C}${D}, тож ${A}${D} удвічі більша: ${A}${D} = 2 · ${kn} = ${b} см.`
        : `${M}${k} — середня лінія трикутника ${A}${B}${C}, тож ${B}${C} удвічі більша: ${B}${C} = 2 · ${mk} = ${a} см.`,
    };
  }
  return {
    pytannia: `${umova} ${B}${C} = ${a} см, ${A}${D} = ${b} см. На скільки сантиметрів ${k}${N} довший за ${M}${k}?`,
    malunok: chotyrykutnyk({ forma, bukvy: v, strilky: [0, 1, 0, 1], serednia: s, diahonalSerednoi: k, storony: [undefined, `${a}`, undefined, `${b}`] }),
    vidpovid: kn - mk,
    odynytsi: 'см',
    pidkazka,
    rozviazok: `${M}${k} = ${a} : 2 = ${mk} см, ${k}${N} = ${b} : 2 = ${kn} см. Різниця: ${kn} − ${mk} = ${kn - mk} см.`,
  };
}

/** Основи відносяться як p : q, середня лінія відома. */
function vidnoshennia(r: Vypadok): TrenZavdannia {
  const [p, q] = r.vybir([[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [1, 3], [4, 5]]);
  const k = (p + q) % 2 ? 2 * r.chyslo(1, 3) : r.chyslo(1, 5);
  const m = ((p + q) * k) / 2;
  const bilshu = r.shans();
  return {
    pytannia: `Основи трапеції відносяться як ${p} : ${q}, а середня лінія дорівнює ${m} см. Знайди ${bilshu ? 'більшу' : 'меншу'} основу.`,
    vidpovid: bilshu ? q * k : p * k,
    odynytsi: 'см',
    pidkazka: `Основи — ${p}x і ${q}x, а їх сума — 2 · ${m}.`,
    rozviazok: `Сума основ 2 · ${m} = ${2 * m} см: ${p}x + ${q}x = ${2 * m}, ${p + q}x = ${2 * m}, x = ${k}. Основи ${p * k} см і ${q * k} см. Перевірка: (${p * k} + ${q * k}) : 2 = ${m}.`,
  };
}

/** Драбина, що звужується догори: перекладини на однаковій відстані — середні лінії трапецій. */
function drabyna(r: Vypadok): TrenZavdannia {
  const t = r.chyslo(28, 40);
  const b = t + 4 * r.chyslo(2, 6);
  const s = (t + b) / 2;
  const typ = r.chyslo(1, 3);
  if (typ === 1) {
    return {
      pytannia: `Драбина звужується догори. Перекладина рівно посередині має довжину ${s} см, нижня — ${b} см. Яка довжина верхньої перекладини?`,
      vidpovid: t,
      odynytsi: 'см',
      pidkazka: `Середня перекладина — середня лінія трапеції: сума верхньої й нижньої — 2 · ${s}.`,
      rozviazok: `Верхня + нижня = 2 · ${s} = ${2 * s} см, тож верхня — ${2 * s} − ${b} = ${t} см.`,
    };
  }
  const druhaZnyzu = typ === 2;
  const x = druhaZnyzu ? (s + b) / 2 : (t + s) / 2;
  return {
    pytannia: `Драбина має 5 перекладин на однаковій відстані одна від одної. Верхня перекладина ${t} см, нижня — ${b} см. Знайди довжину ${druhaZnyzu ? 'другої знизу' : 'другої згори'} перекладини.`,
    vidpovid: x,
    odynytsi: 'см',
    pidkazka: 'Спершу знайди середню (третю) перекладину як середню лінію трапеції, а потім — ще одну середню лінію.',
    rozviazok: `Третя перекладина: (${t} + ${b}) : 2 = ${s} см. ${druhaZnyzu ? `Друга знизу — посередині між третьою й нижньою: (${s} + ${b}) : 2` : `Друга згори — посередині між верхньою й третьою: (${t} + ${s}) : 2`} = ${x} см.`,
  };
}

export default {
  rivni: ['півсума основ', 'обернені задачі', 'діагональ і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(q: Vypadok) => polusuma(q, true), (q: Vypadok) => polusuma(q, false), vybir])(r);
    if (riven === 2) return r.vybir([druhaOsnova, druhaOsnova, riznytsia, tverdzhennia, perymetr])(r);
    return r.vybir([diahonal, diahonal, vidnoshennia, drabyna])(r);
  },
} satisfies Henerator;
