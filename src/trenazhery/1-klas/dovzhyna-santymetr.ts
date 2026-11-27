// Довжина. Сантиметр (1 клас, Скворцова с. 55, 71, 90–91): виміряти відрізок лінійкою від нуля і не від нуля;
// додавання, віднімання і порівняння довжин у сантиметрах; відрізок з точкою — ціле і частини; задачі про стрічки.
import { skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { liniika } from '../vymiriuvannia.ts';

const BUKVY: [string, string][] = [
  ['A', 'B'],
  ['C', 'D'],
  ['K', 'M'],
  ['M', 'N'],
  ['P', 'T'],
  ['O', 'K'],
];

// Яка довжина відрізка — за малюнком лінійки.
function vymiriaty(r: Vypadok, zNulia: boolean): TrenZavdannia {
  const [A, B] = r.vybir(BUKVY);
  const p = zNulia ? 0 : r.chyslo(1, 5);
  const d = zNulia ? r.chyslo(2, 10) : r.chyslo(2, 12 - p);
  return {
    pytannia: `Яка довжина відрізка ${A}${B}?`,
    malunok: liniika({ dovzhyna: d, pochatok: p, bukvy: [A, B] }),
    vidpovid: d,
    odynytsi: 'см',
    pidkazka: zNulia
      ? `Нуль лінійки — під точкою ${A}. Подивись, навпроти якого числа точка ${B}.`
      : `Відрізок починається не з нуля, а з ${p}. Від числа під точкою ${B} відніми ${p}.`,
    rozviazok: zNulia ? `Від 0 до ${d} — ${skilky(d, 'сантиметр', 'сантиметри', 'сантиметрів')}.` : `${p + d} − ${p} = ${d} (см)`,
  };
}

// a см + b см, a см − b см.
function dii(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const b = r.chyslo(1, 9);
  if (r.shans() && a + b <= 10) {
    return {
      pytannia: 'Обчисли.',
      vyraz: `${a} см + ${b} см =`,
      vidpovid: a + b,
      odynytsi: 'см',
      pidkazka: 'Додай числа, а одиницю допиши.',
      rozviazok: `${a} + ${b} = ${a + b} (см)`,
    };
  }
  const [v, m] = a >= b ? [a, b] : [b, a];
  if (v === m) return dii(r);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${v} см − ${m} см =`,
    vidpovid: v - m,
    odynytsi: 'см',
    pidkazka: 'Відніми числа, а одиницю допиши.',
    rozviazok: `${v} − ${m} = ${v - m} (см)`,
  };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 10);
  const b = r.shans(0.2) ? a : r.chyslo(1, 10);
  const znak = a > b ? '>' : a < b ? '<' : '=';
  return {
    pytannia: 'Порівняй довжини.',
    vyraz: `${a} см □ ${b} см`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: `Порівняй числа ${a} і ${b}.`,
    rozviazok: `${a} ${znak} ${b}, тому ${a} см ${znak} ${b} см.`,
  };
}

// Точка на відрізку: ціле — весь відрізок, частини — два менші відрізки.
function tochkaNaVidrizku(r: Vypadok): TrenZavdannia {
  const [A, C] = r.vybir(BUKVY);
  const B = r.vybir(['E', 'F', 'L', 'S'].filter((x) => x !== A && x !== C));
  const a = r.chyslo(1, 8);
  const b = r.chyslo(1, 9 - a);
  const tsile = a + b;
  if (r.shans()) {
    return {
      pytannia: `Точка ${B} лежить на відрізку ${A}${C}. ${A}${B} = ${a} см, ${B}${C} = ${b} см. Знайди довжину відрізка ${A}${C}.`,
      vidpovid: tsile,
      odynytsi: 'см',
      pidkazka: `${A}${C} — весь відрізок, ціле. Частини додаємо.`,
      rozviazok: `${a} + ${b} = ${tsile} (см)`,
    };
  }
  return {
    pytannia: `Точка ${B} лежить на відрізку ${A}${C}. ${A}${C} = ${tsile} см, ${A}${B} = ${a} см. Знайди довжину відрізка ${B}${C}.`,
    vidpovid: b,
    odynytsi: 'см',
    pidkazka: `${A}${C} — ціле, ${A}${B} — частина. Від цілого відніми відому частину.`,
    rozviazok: `${tsile} − ${a} = ${b} (см). Перевірка: ${a} + ${b} = ${tsile}`,
  };
}

// Задачі про стрічки, олівці і лінійку.
function zadacha(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 3);
  if (vyd === 0) {
    const a = r.chyslo(3, 10);
    const b = r.chyslo(1, a - 1);
    return {
      pytannia: `Стрічка мала довжину ${a} см. Від неї відрізали ${b} см. Якої довжини стрічка залишилась?`,
      vidpovid: a - b,
      odynytsi: 'см',
      pidkazka: 'Відрізали — стрічка стала коротшою. Віднімай.',
      rozviazok: `${a} − ${b} = ${a - b} (см)`,
    };
  }
  if (vyd === 1) {
    const a = r.chyslo(2, 8);
    const b = r.chyslo(2, 10 - a);
    return {
      pytannia: `Червона стрічка завдовжки ${a} см, синя — ${b} см. Їх поклали в одну лінію, кінець до кінця. Яка довжина обох стрічок разом?`,
      vidpovid: a + b,
      odynytsi: 'см',
      pidkazka: 'Разом — це ціле. Додавай.',
      rozviazok: `${a} + ${b} = ${a + b} (см)`,
    };
  }
  if (vyd === 2) {
    const v = r.chyslo(5, 10);
    const m = r.chyslo(2, 4);
    return {
      pytannia: `Олівець завдовжки ${v} см, а гумка — ${m} см. На скільки сантиметрів олівець довший за гумку?`,
      vidpovid: v - m,
      odynytsi: 'см',
      pidkazka: 'На скільки довший — від більшого числа відніми менше.',
      rozviazok: `${v} − ${m} = ${v - m} (см)`,
    };
  }
  const p = r.chyslo(1, 5);
  const d = r.chyslo(2, 10 - p);
  return {
    pytannia: `Олівець завдовжки ${d} см поклали на лінійку так, що один його кінець навпроти числа ${p}. Навпроти якого числа другий кінець?`,
    vidpovid: p + d,
    pidkazka: `Від числа ${p} відрахуй ще ${d} см.`,
    rozviazok: `${p} + ${d} = ${p + d}. Перевірка: ${p + d} − ${p} = ${d} (см)`,
  };
}

export default {
  rivni: ['виміряй лінійкою', 'дії з сантиметрами', 'відрізки і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(x: Vypadok) => vymiriaty(x, true), (x: Vypadok) => vymiriaty(x, true), (x: Vypadok) => vymiriaty(x, false)])(r);
    if (riven === 2) return r.vybir([dii, dii, porivniannia, (x: Vypadok) => vymiriaty(x, false)])(r);
    return r.vybir([zadacha, zadacha, tochkaNaVidrizku, (x: Vypadok) => vymiriaty(x, false)])(r);
  },
} satisfies Henerator;
