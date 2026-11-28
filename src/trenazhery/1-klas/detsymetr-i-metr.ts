// Дециметр і метр (1 клас, Скворцова с. 113, 126, 140): 1 дм = 10 см, 1 м = 10 дм = 100 см; дециметри і сантиметри
// разом (1 дм 4 см = 14 см); порівняння довжин в однакових одиницях; дії з дм і м; задачі про газон, дерева, стрічки.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { liniika, metr } from '../vymiriuvannia.ts';

const desiatky = (n: number) => `${n} ${mnozh(n, 'десяток', 'десятки', 'десятків')}`;

// n дм = □ см і n0 см = □ дм.
function dmICm(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 9);
  if (r.shans()) {
    return {
      pytannia: 'Заміни дециметри сантиметрами.',
      vyraz: `${n} дм = □ см`,
      vidpovid: n * 10,
      odynytsi: 'см',
      pidkazka: `1 дм = 10 см. Скільки одиниць у ${n} десятках?`,
      rozviazok: `${desiatky(n)} — це ${n * 10} одиниць, тому ${n} дм = ${n * 10} см.`,
    };
  }
  return {
    pytannia: 'Заміни сантиметри дециметрами.',
    vyraz: `${n * 10} см = □ дм`,
    vidpovid: n,
    odynytsi: 'дм',
    pidkazka: `Кожні 10 см — це 1 дм. Скільки десятків у числі ${n * 10}?`,
    rozviazok: `У числі ${n * 10} — ${desiatky(n)}, тому ${n * 10} см = ${n} дм.`,
  };
}

// Дециметри і сантиметри разом: 3 дм 8 см = □ см, 38 см = □ дм 8 см, 38 см = 3 дм □ см.
function dmTaCm(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(1, 9);
  const c = r.chyslo(1, 9);
  const vse = d * 10 + c;
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    return {
      pytannia: 'Подай у сантиметрах.',
      vyraz: `${d} дм ${c} см = □ см`,
      vidpovid: vse,
      odynytsi: 'см',
      pidkazka: `Спершу заміни ${d} дм сантиметрами, а потім додай ${c} см.`,
      rozviazok: `${d} дм = ${d * 10} см; ${d * 10} + ${c} = ${vse} (см)`,
    };
  }
  if (vyd === 1) {
    return {
      pytannia: 'Подай у дециметрах і сантиметрах.',
      vyraz: `${vse} см = □ дм ${c} см`,
      vidpovid: d,
      odynytsi: 'дм',
      pidkazka: `Скільки десятків у числі ${vse}? Кожен десяток сантиметрів — це 1 дм.`,
      rozviazok: `${vse} = ${d * 10} + ${c}, а ${d * 10} см = ${d} дм. Тому ${vse} см = ${d} дм ${c} см.`,
    };
  }
  return {
    pytannia: 'Подай у дециметрах і сантиметрах.',
    vyraz: `${vse} см = ${d} дм □ см`,
    vidpovid: c,
    odynytsi: 'см',
    pidkazka: `${d} дм — це ${d * 10} см. Скільки сантиметрів ще до ${vse}?`,
    rozviazok: `${vse} − ${d * 10} = ${c} (см), тому ${vse} см = ${d} дм ${c} см.`,
  };
}

// Метр: 1 м = □ см, 10 дм = □ м …
const METR: [string, number, string][] = [
  ['1 м = □ см', 100, 'см'],
  ['1 м = □ дм', 10, 'дм'],
  ['10 дм = □ м', 1, 'м'],
  ['10 дм = □ см', 100, 'см'],
  ['100 см = □ дм', 10, 'дм'],
  ['100 см = □ м', 1, 'м'],
];

function metrZnaty(r: Vypadok): TrenZavdannia {
  const [vyraz, vidpovid, odynytsi] = r.vybir(METR);
  return {
    pytannia: 'Заміни одиниці довжини.',
    vyraz,
    vidpovid,
    odynytsi,
    pidkazka: 'Згадай смужку-метр: у ній 10 дециметрів, а в кожному дециметрі 10 см.',
    rozviazok: '1 м = 10 дм = 100 см: 10 дециметрів, у кожному 10 см — це 10 десятків, сотня сантиметрів.',
  };
}

// Малюнок: зафарбована частина метра, без сантиметрів під смужкою.
function chastynaMetra(r: Vypadok): TrenZavdannia {
  const v = r.chyslo(2, 9);
  return {
    pytannia: 'Смужка завдовжки 1 м поділена на дециметри. Яка довжина зафарбованої частини в сантиметрах?',
    malunok: metr({ vydilyty: v, bez_chysel: true, opys: 'Смужка завдовжки 1 метр з 10 дециметрів, частина від початку зафарбована' }),
    vidpovid: v * 10,
    odynytsi: 'см',
    pidkazka: 'Полічи зафарбовані дециметри. Кожен — 10 см.',
    rozviazok: `Зафарбовано ${v} дм, а ${v} дм = ${v * 10} см.`,
  };
}

// Малюнок: лінійка з дужкою «1 дм», відрізок довший за дециметр.
function vidrizokDmCm(r: Vypadok): TrenZavdannia {
  const [A, B] = r.vybir([
    ['A', 'B'],
    ['C', 'D'],
    ['K', 'M'],
    ['P', 'T'],
  ]);
  const c = r.chyslo(1, 4);
  return {
    pytannia: `Яка довжина відрізка ${A}${B}? Запиши в дециметрах і сантиметрах.`,
    malunok: liniika({ dovzhyna: 10 + c, bukvy: [A, B], do: 15, detsymetr: true }),
    vyraz: `${A}${B} = 1 дм □ см`,
    nevidome: '□',
    vidpovid: c,
    odynytsi: 'см',
    pidkazka: `Подивись, навпроти якого числа точка ${B}. Перші 10 см — це 1 дм.`,
    rozviazok: `${A}${B} = ${10 + c} см; ${10 + c} − 10 = ${c} (см), тому ${A}${B} = 1 дм ${c} см.`,
  };
}

const znakPor = (a: number, b: number) => (a > b ? '>' : a < b ? '<' : '=');

// a дм □ b см: числа «обманюють» — 4 менше за 38, а 4 дм довше.
function porivniannia(r: Vypadok): TrenZavdannia {
  if (r.shans(0.3)) {
    const [pravyi, cm] = r.vybir<[string, number]>([
      ['10 см', 10],
      ['10 дм', 100],
      ['100 см', 100],
      [`${r.chyslo(5, 9)} дм`, 0],
      [`${r.chyslo(50, 99)} см`, 0],
    ]);
    const vCm = cm || (pravyi.endsWith('дм') ? Number(pravyi.split(' ')[0]) * 10 : Number(pravyi.split(' ')[0]));
    const znak = znakPor(100, vCm);
    return {
      pytannia: 'Порівняй довжини.',
      vyraz: `1 м □ ${pravyi}`,
      vidpovid: znak,
      varianty: ['>', '<', '='],
      pidkazka: 'Спершу запиши обидві довжини в сантиметрах: 1 м = 100 см.',
      rozviazok: `1 м = 100 см${pravyi.endsWith('дм') ? `, ${pravyi} = ${vCm} см` : ''}; 100 ${znak} ${vCm}, тому 1 м ${znak} ${pravyi}.`,
    };
  }
  const a = r.chyslo(1, 9);
  const b = r.shans(0.2) ? a * 10 : r.krim(Math.max(11, a * 10 - 9), Math.min(99, a * 10 + 9), [a * 10]);
  const znak = znakPor(a * 10, b);
  const dmZliva = r.shans();
  return {
    pytannia: 'Порівняй довжини.',
    vyraz: dmZliva ? `${a} дм □ ${b} см` : `${b} см □ ${a} дм`,
    vidpovid: dmZliva ? znak : znakPor(b, a * 10),
    varianty: ['>', '<', '='],
    pidkazka: `Одиниці різні. Спершу заміни ${a} дм сантиметрами.`,
    rozviazok: dmZliva
      ? `${a} дм = ${a * 10} см; ${a * 10} ${znak} ${b}, тому ${a} дм ${znak} ${b} см.`
      : `${a} дм = ${a * 10} см; ${b} ${znakPor(b, a * 10)} ${a * 10}, тому ${b} см ${znakPor(b, a * 10)} ${a} дм.`,
  };
}

/** Двоцифрові числа без переходу через десяток: a + b ≤ 99 і одиниці разом менше 10. */
const bezPerekhodu = (a: number, b: number) => a + b <= 99 && (a % 10) + (b % 10) < 10;

// a дм ± b дм, a м ± b м, a дм + b см = □ см.
function dii(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 3);
  if (vyd === 0) {
    const a = r.chyslo(1, 8);
    const b = r.chyslo(1, 9 - a);
    if (r.shans()) {
      return {
        pytannia: 'Обчисли.',
        vyraz: `${a} дм + ${b} дм =`,
        vidpovid: a + b,
        odynytsi: 'дм',
        pidkazka: 'Одиниці однакові: додай числа, а одиницю допиши.',
        rozviazok: `${a} + ${b} = ${a + b} (дм)`,
      };
    }
    return {
      pytannia: 'Обчисли.',
      vyraz: `${a + b} дм − ${b} дм =`,
      vidpovid: a,
      odynytsi: 'дм',
      pidkazka: 'Одиниці однакові: відніми числа, а одиницю допиши.',
      rozviazok: `${a + b} − ${b} = ${a} (дм)`,
    };
  }
  if (vyd === 1) {
    let a = 0;
    let b = 0;
    do {
      a = r.chyslo(1, 8) * 10;
      b = r.shans() ? r.chyslo(1, 9) : r.chyslo(1, 8) * 10;
    } while (!bezPerekhodu(a, b));
    return {
      pytannia: 'Обчисли.',
      vyraz: `${a} м + ${b} м =`,
      vidpovid: a + b,
      odynytsi: 'м',
      pidkazka: b < 10 ? 'Додай одиниці до десятків.' : 'Додай десятки до десятків.',
      rozviazok: `${a} + ${b} = ${a + b} (м)`,
    };
  }
  if (vyd === 2) {
    const v = r.chyslo(21, 99);
    const m = r.shans() ? r.chyslo(1, v % 10 || 1) : r.chyslo(1, Math.floor(v / 10) - 1) * 10;
    if (v % 10 === 0 && m < 10) return dii(r);
    return {
      pytannia: 'Обчисли.',
      vyraz: `${v} м − ${m} м =`,
      vidpovid: v - m,
      odynytsi: 'м',
      pidkazka: m < 10 ? 'Відніми одиниці від одиниць.' : 'Відніми десятки від десятків.',
      rozviazok: `${v} − ${m} = ${v - m} (м)`,
    };
  }
  const a = r.chyslo(1, 9);
  const b = r.chyslo(1, 9);
  return {
    pytannia: 'Обчисли в сантиметрах.',
    vyraz: `${a} дм + ${b} см = □ см`,
    vidpovid: a * 10 + b,
    odynytsi: 'см',
    pidkazka: `Одиниці різні — не додавай ${a} і ${b} одразу. Спершу заміни ${a} дм сантиметрами.`,
    rozviazok: `${a} дм = ${a * 10} см; ${a * 10} + ${b} = ${a * 10 + b} (см)`,
  };
}

const DEREVA: [string, string, string][] = [
  // [вище (родовий), нижче (родовий), нижче (називний)]
  ['сосни', 'ялини', 'ялина'],
  ['дуба', 'берези', 'береза'],
  ['тополі', 'липи', 'липа'],
  ['ялини', 'горобини', 'горобина'],
];

// Задачі з метрами й дециметрами.
function zadacha(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 3);
  if (vyd === 0) {
    let c = 0;
    let b = 0;
    do {
      c = r.chyslo(3, 30);
      b = r.chyslo(2, 9);
    } while (!bezPerekhodu(c, b));
    return {
      pytannia: `Довжина газону ${c + b} м, а клумби — на ${b} м менше. Яка довжина клумби?`,
      vidpovid: c,
      odynytsi: 'м',
      pidkazka: 'Клумба коротша, «на … менше» — віднімай.',
      rozviazok: `${c + b} − ${b} = ${c} (м)`,
    };
  }
  if (vyd === 1) {
    const [vyshche, nyzhche, nyzhcheN] = r.vybir(DEREVA);
    let v = 0;
    let m = 0;
    do {
      v = r.chyslo(12, 30);
      m = r.chyslo(5, v - 2);
    } while (v % 10 < m % 10);
    return {
      pytannia: `Висота ${vyshche} ${v} м, а ${nyzhche} — ${m} м. На скільки метрів ${nyzhcheN} нижча від ${vyshche}?`,
      vidpovid: v - m,
      odynytsi: 'м',
      pidkazka: 'На скільки нижча — від більшого числа відніми менше.',
      rozviazok: `${v} − ${m} = ${v - m} (м)`,
    };
  }
  if (vyd === 2) {
    const b = r.chyslo(1, 9);
    const [khto, mav, vidrizav] = r.vybir([
      ['Мама', 'мала', 'відрізала'],
      ['Бабуся', 'мала', 'відрізала'],
      ['Тато', 'мав', 'відрізав'],
    ]);
    return {
      pytannia: `${khto} ${mav} стрічку завдовжки 1 м і ${vidrizav} від неї ${b} дм. Скільки дециметрів стрічки залишилося?`,
      vidpovid: 10 - b,
      odynytsi: 'дм',
      pidkazka: 'Спершу заміни 1 м дециметрами.',
      rozviazok: `1 м = 10 дм; 10 − ${b} = ${10 - b} (дм)`,
    };
  }
  const a = r.chyslo(2, 9);
  const b = r.shans(0.2) ? a * 10 : r.krim(Math.max(11, a * 10 - 9), Math.min(99, a * 10 + 9), [a * 10]);
  const vidp = a * 10 > b ? 'червона' : a * 10 < b ? 'синя' : 'однакові';
  return {
    pytannia: `Червона стрічка завдовжки ${a} дм, а синя — ${b} см. Яка стрічка довша?`,
    vidpovid: vidp,
    varianty: ['червона', 'синя', 'однакові'],
    pidkazka: `Порівнюй в однакових одиницях: скільки сантиметрів у ${a} дм?`,
    rozviazok: `${a} дм = ${a * 10} см; ${a * 10} ${znakPor(a * 10, b)} ${b}. ${vidp === 'однакові' ? 'Стрічки однакові.' : `Довша ${vidp} стрічка.`}`,
  };
}

export default {
  rivni: ['дециметри і сантиметри', 'порівняння і дії', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([dmICm, dmICm, dmTaCm, metrZnaty, chastynaMetra, vidrizokDmCm])(r);
    if (riven === 2) return r.vybir([porivniannia, porivniannia, dii, dii, dmTaCm])(r);
    return r.vybir([zadacha, zadacha, zadacha, porivniannia, dii])(r);
  },
} satisfies Henerator;
