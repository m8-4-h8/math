// Закони додавання і віднімання: переставний, сполучний, віднімання суми від числа і числа від суми.
// Головне — побачити «круглі» пари й рахувати зручно.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Пара, що дає кругле число: 38 + 62 = 100, 25 + 75 = 100, 17 + 3 = 20.
function para(r: Vypadok, kruhle: number) {
  const a = r.chyslo(Math.ceil(kruhle * 0.1), Math.floor(kruhle * 0.9));
  const a2 = a % 10 === 0 ? a + r.chyslo(1, 9) : a;
  return [a2, kruhle - a2] as const;
}

function vikontse(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(12, 99);
  const b = r.krim(12, 99, [a]);
  const c = r.chyslo(2, 40);
  return r.shans()
    ? {
        pytannia: 'Переставний закон. Яке число у віконці?',
        vyraz: `${a} + ${b} = ${b} + □`,
        vidpovid: a,
        pidkazka: 'Від перестановки доданків сума не змінюється.',
        rozviazok: `${a} + ${b} = ${b} + ${a}`,
      }
    : {
        pytannia: 'Сполучний закон. Яке число у віконці?',
        vyraz: `(${a} + ${b}) + ${c} = ${a} + (□ + ${c})`,
        vidpovid: b,
        pidkazka: 'Сусідні доданки можна об’єднати в дужки — сума не зміниться.',
        rozviazok: `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c}) = ${a + b + c}`,
      };
}

function trySuma(r: Vypadok, kruhle: number): TrenZavdannia {
  const [a, c] = para(r, kruhle);
  const b = r.chyslo(11, kruhle >= 100 ? kruhle - 1 : 59);
  const poriadok = r.vybir([
    [a, b, c],
    [b, a, c],
    [a, c, b],
  ]);
  return {
    pytannia: 'Обчисли зручно.',
    vyraz: `${poriadok.join(' + ')} =`,
    vidpovid: a + b + c,
    pidkazka: `Знайди два доданки, що разом дають кругле число.`,
    rozviazok: `${a} + ${c} = ${kruhle}; ${kruhle} + ${b} = ${a + b + c}`,
  };
}

function chotyrySuma(r: Vypadok): TrenZavdannia {
  const [a, b] = para(r, 100);
  const [c, d] = para(r, r.vybir([50, 100, 200]));
  const s = r.peremishaty([a, b, c, d]);
  // Пари не мають стояти поруч — інакше нема що переставляти.
  return {
    pytannia: 'Обчисли зручно: знайди пари.',
    vyraz: `${s.join(' + ')} =`,
    vidpovid: a + b + c + d,
    pidkazka: 'Шукай доданки, у яких одиниці разом дають 10.',
    rozviazok: `(${a} + ${b}) + (${c} + ${d}) = ${a + b} + ${c + d} = ${a + b + c + d}`,
  };
}

// a − (b + c) = a − b − c; зручно, коли a − b кругле.
function vidnimanniaSumy(r: Vypadok, max: number): TrenZavdannia {
  const b = r.chyslo(11, max / 2);
  const kruhle = r.chyslo(2, 9) * (max >= 500 ? 100 : 10);
  const a = b + kruhle;
  const c = r.chyslo(3, kruhle - 1);
  return {
    pytannia: 'Відніми суму зручно: по одному доданку.',
    vyraz: `${a} − (${b} + ${c}) =`,
    vidpovid: a - b - c,
    pidkazka: `Спершу відніми ${b} — вийде кругле число, потім ${c}.`,
    rozviazok: `${a} − ${b} = ${kruhle}; ${kruhle} − ${c} = ${a - b - c}`,
  };
}

// (a + b) − c = a + (b − c) або (a − c) + b — віднімаємо від того доданка, від якого зручніше.
function vidnimanniaVidSumy(r: Vypadok): TrenZavdannia {
  const kruhle = 10 * r.chyslo(2, 9);
  const b = 10 * r.chyslo(1, 8) + r.chyslo(1, 8);
  const odyn = b % 10;
  const vidB = r.shans(); // c не більше за одиниці b — віднімаємо від b, інакше — від круглого
  const c = vidB ? r.chyslo(1, odyn) : r.chyslo(odyn + 1, 9);
  const [x, y] = r.shans() ? [kruhle, b] : [b, kruhle];
  return {
    pytannia: 'Відніми число від суми зручно.',
    vyraz: `(${x} + ${y}) − ${c} =`,
    vidpovid: kruhle + b - c,
    pidkazka: 'Відніми від того доданка, від якого легше, а другий просто додай.',
    rozviazok: vidB
      ? `${b} − ${c} = ${b - c}; ${kruhle} + ${b - c} = ${kruhle + b - c}`
      : `${kruhle} − ${c} = ${kruhle - c}; ${kruhle - c} + ${b} = ${kruhle + b - c}`,
  };
}

const PRAVYLA = [
  { pytannia: (a: number, b: number, c: number) => `${a} − (${b} + ${c}) = ${a} − ${b} + ${c}`, vidpovid: 'Ні', chomu: () => 'після мінуса перед дужками віднімаються обидва доданки' },
  { pytannia: (a: number, b: number, c: number) => `${a} − (${b} + ${c}) = ${a} − ${b} − ${c}`, vidpovid: 'Так', chomu: () => 'відняти суму — відняти кожен доданок' },
  { pytannia: (a: number, b: number, c: number) => `(${a} + ${b}) − ${c} = ${a} + (${b} − ${c})`, vidpovid: 'Так', chomu: () => 'відняти можна від будь-якого доданка' },
  { pytannia: (a: number, b: number, c: number) => `(${a} + ${b}) − ${c} = ${a} − ${c} − ${b}`, vidpovid: 'Ні', chomu: (b: number) => `доданок ${b} треба додати, а не відняти` },
];

function chyPravylno(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PRAVYLA);
  const a = 10 * r.chyslo(6, 12);
  const b = r.chyslo(11, 29);
  const c = r.chyslo(2, 9);
  return {
    pytannia: `Чи правильно: ${p.pytannia(a, b, c)}?`,
    vidpovid: p.vidpovid,
    varianty: ['Так', 'Ні'],
    pidkazka: 'Порахуй обидві частини або згадай правило про мінус перед дужками.',
    rozviazok: `${p.vidpovid}: ${p.chomu(b)}.`,
  };
}

export default {
  rivni: ['переставний і сполучний закони', 'зручне додавання і віднімання суми', 'віднімання від суми, більші числа'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.4) ? vikontse(r) : trySuma(r, r.vybir([10, 20, 100]));
    if (riven === 2) return r.vybir([() => trySuma(r, 100), () => vidnimanniaSumy(r, 100), () => chotyrySuma(r), () => vikontse(r)])();
    return r.vybir([
      () => vidnimanniaVidSumy(r),
      () => vidnimanniaSumy(r, 1000),
      () => trySuma(r, r.vybir([100, 200, 1000])),
      () => chotyrySuma(r),
      () => chyPravylno(r),
    ])();
  },
} satisfies Henerator;
