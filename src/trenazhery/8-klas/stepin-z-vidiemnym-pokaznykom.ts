// Степінь з цілим від'ємним показником: a⁻ⁿ = 1/aⁿ, a⁰ = 1, 10⁻ⁿ десятковим дробом; підступи (знак основи,
// мінус перед степенем, дріб у від'ємному степені, порівняння); вирази, показник у віконці, одиниці вимірювання.
import { type Henerator, type Vypadok, type TrenZavdannia, des, nsd, rivnyiDrib, tch, tvidpovidDrib, vidpovidDrib } from '../dopomoha.ts';

/** Степінь у TeX; показник 1 не пишемо: st('3', 1) → «3», st('3', 2) → «3^{2}». */
const st = (osnova: string | number, n: number) => (n === 1 ? `${osnova}` : `${osnova}^{${n}}`);
/** Ланцюжок рівностей без повторів і порожніх кроків: lanc('a', 'b', 'b', '') → «a = b». */
const lanc = (...kroky: string[]) => kroky.filter((k, i) => k && k !== kroky[i - 1]).join(' = ');

/** a⁻ⁿ як дріб 1/aⁿ (знаменник до 1000). */
function obchyslyty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(2, 10);
    const n = r.chyslo(1, a === 2 ? 6 : 3);
    const d = a ** n;
    if (d > 1000) continue;
    return {
      pytannia: 'Обчисли. Відповідь запиши дробом через риску.',
      vyraz: `$${a}^{-${n}} =$`,
      vidpovid: vidpovidDrib(1, d),
      perevirka: rivnyiDrib(1, d),
      pokaz: `$${tvidpovidDrib(1, d)}$`,
      pidkazka: `Від'ємний показник означає дріб: $${a}^{-${n}} = \\frac{1}{${st(a, n)}}$.`,
      rozviazok: `$${lanc(`${a}^{-${n}}`, `\\frac{1}{${st(a, n)}}`, `\\frac{1}{${d}}`)}$. Це додатне число, менше за 1.`,
    };
  }
}

/** a⁰ = 1 для будь-якого a ≠ 0: цілі, від'ємні, дроби, десяткові. */
function nulovyi(r: Vypadok): TrenZavdannia {
  const osnovy = [
    () => String(r.chyslo(2, 99)),
    () => `(-${r.chyslo(2, 30)})`,
    () => {
      const [p, q] = r.rizni(2, 1, 9);
      return `\\left(\\frac{${p}}{${q}}\\right)`;
    },
    () => `(${r.chyslo(0, 9)}{,}${r.chyslo(1, 9)})`,
  ];
  const osnova = r.vybir(osnovy)();
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${osnova}^0 =$`,
    vidpovid: 1,
    pidkazka: 'Будь-яке число, крім нуля, у нульовому степені дорівнює одному й тому самому числу.',
    rozviazok: `Для будь-якого $a \\ne 0$ маємо $a^0 = 1$, тож $${osnova}^0 = 1$.`,
  };
}

/** 10⁻ⁿ — десятковим дробом. */
function desiatky(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(1, 5);
  const k = r.shans(0.4) ? 1 : r.chyslo(2, 9);
  const vidp = des(k, n);
  return {
    pytannia: 'Обчисли. Відповідь запиши десятковим дробом.',
    vyraz: k === 1 ? `$10^{-${n}} =$` : `$${k} \\cdot 10^{-${n}} =$`,
    vidpovid: vidp,
    pidkazka: `$10^{-${n}} = \\frac{1}{10^{${n}}}$: одиниця стоїть на ${n}-му місці після коми.`,
    rozviazok: `$10^{-${n}} = \\frac{1}{${tch(10 ** n)}}$${k === 1 ? '' : `, тож $${k} \\cdot 10^{-${n}} = \\frac{${k}}{${tch(10 ** n)}}$`}, це ${vidp}.`,
  };
}

/** (−a)⁻ⁿ і −a⁻ⁿ: де знак, а де ні. */
function znak(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(2, 6);
    const n = r.chyslo(1, 3);
    const d = a ** n;
    if (d > 216) continue;
    const vDuzhkakh = r.shans();
    const chys = vDuzhkakh ? (n % 2 ? -1 : 1) : -1;
    const zapys = vDuzhkakh ? `(-${a})^{-${n}}` : `-${a}^{-${n}}`;
    return {
      pytannia: 'Обчисли. Відповідь запиши дробом через риску.',
      vyraz: `$${zapys} =$`,
      vidpovid: vidpovidDrib(chys, d),
      perevirka: rivnyiDrib(chys, d),
      pokaz: `$${tvidpovidDrib(chys, d)}$`,
      pidkazka: vDuzhkakh
        ? `Основа — $-${a}$ разом з мінусом. Яким буде знак $${st(`(-${a})`, n)}$ при ${n % 2 ? 'непарному' : 'парному'} показнику?`
        : `Мінус стоїть перед степенем і не входить в основу: спершу знайди $${a}^{-${n}}$.`,
      rozviazok: vDuzhkakh
        ? `$(-${a})^{-${n}} = \\frac{1}{${st(`(-${a})`, n)}} = ${tvidpovidDrib(chys, d)}$: ${n % 2 ? 'непарний показник зберігає мінус' : 'парний показник «з\'їдає» мінус'}.`
        : `$${lanc(`-${a}^{-${n}}`, `-\\frac{1}{${st(a, n)}}`, tvidpovidDrib(-1, d))}$: мінус перед степенем лишається.`,
    };
  }
}

/** (p/q)⁻ⁿ = (q/p)ⁿ — дріб перевертаємо. */
function drib(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q] = r.rizni(2, 1, 7);
    const n = r.chyslo(1, 3);
    if (nsd(p, q) !== 1 || q ** n > 343 || p ** n > 343 || (n === 1 && p === 1)) continue;
    return {
      pytannia: 'Обчисли. Відповідь запиши числом або дробом через риску.',
      vyraz: `$\\left(\\frac{${p}}{${q}}\\right)^{-${n}} =$`,
      vidpovid: vidpovidDrib(q ** n, p ** n),
      perevirka: rivnyiDrib(q ** n, p ** n),
      pokaz: `$${tvidpovidDrib(q ** n, p ** n)}$`,
      pidkazka: 'Дріб у від\'ємному степені: переверни дріб, а показник зроби додатним.',
      rozviazok: `$${lanc(`\\left(\\frac{${p}}{${q}}\\right)^{-${n}}`, n === 1 ? '' : `\\left(\\frac{${q}}{${p}}\\right)^{${n}}`, tvidpovidDrib(q ** n, p ** n, false))}$.`,
    };
  }
}

/** Що більше: a⁻ⁿ чи b⁻ᵐ? Менший знаменник — більший дріб. */
function porivniannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [a, b] = [r.chyslo(2, 10), r.chyslo(2, 10)];
    const [n, m] = [r.chyslo(1, 4), r.chyslo(1, 4)];
    const [da, db] = [a ** n, b ** m];
    if (da > 10000 || db > 10000 || (a === b && n === m)) continue;
    // Рівні значення (2⁻⁴ і 4⁻²) лишаємо — це гарний підступ, але не частіше, ніж вони випадають самі.
    const vidp = da < db ? '>' : da > db ? '<' : '=';
    return {
      pytannia: 'Порівняй.',
      vyraz: `$${a}^{-${n}} \\square ${b}^{-${m}}$`,
      vidpovid: vidp,
      varianty: ['>', '<', '='],
      pidkazka: 'Запиши обидва числа дробами з чисельником 1: більший той, у якого менший знаменник.',
      rozviazok: `$${a}^{-${n}} = \\frac{1}{${da}}$, $${b}^{-${m}} = \\frac{1}{${db}}$. ${
        da === db ? 'Знаменники рівні, тож і числа рівні.' : `Знаменник ${Math.min(da, db)} менший, тож ${da < db ? 'перше' : 'друге'} число більше.`
      }`,
    };
  }
}

/** −a⁰ = −1, а (−a)⁰ = 1. */
function nulPastka(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 50);
  const vDuzhkakh = r.shans();
  return {
    pytannia: 'Обчисли.',
    vyraz: vDuzhkakh ? `$(-${a})^0 =$` : `$-${a}^0 =$`,
    vidpovid: vDuzhkakh ? 1 : '−1',
    pidkazka: vDuzhkakh ? 'Основа — усе число в дужках, разом з мінусом.' : 'Мінус перед степенем не входить в основу.',
    rozviazok: vDuzhkakh ? `$(-${a})^0 = 1$: будь-яке ненульове число в нульовому степені дорівнює 1.` : `$-${a}^0 = -(${a}^0) = -1$: у степінь підносимо лише ${a}.`,
  };
}

/** a⁻ⁿ · k ± b⁰ − (1/c)⁻ᵐ з цілою відповіддю. */
function vyraz(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(2, 5);
    const n = r.chyslo(1, 2);
    const k = a ** n * r.chyslo(1, 5);
    const b = r.chyslo(2, 20);
    const c = r.chyslo(2, 4);
    const m = r.chyslo(1, 2);
    const plus = r.shans();
    const vidp = k / a ** n + (plus ? 1 : -1) - c ** m;
    if (k === a ** n && n === 1) continue;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${a}^{-${n}} \\cdot ${k} ${plus ? '+' : '-'} ${b}^0 - \\left(\\frac{1}{${c}}\\right)^{-${m}} =$`,
      vidpovid: vidp < 0 ? `−${-vidp}` : vidp,
      pidkazka: `Обчисли кожен степінь окремо: $${a}^{-${n}} = \\frac{1}{${a ** n}}$, $${b}^0 = 1$, $\\left(\\frac{1}{${c}}\\right)^{-${m}} = ${st(c, m)}$.`,
      rozviazok: `$${a}^{-${n}} \\cdot ${k} = \\frac{${k}}{${a ** n}} = ${k / a ** n}$; $${b}^0 = 1$; $${lanc(`\\left(\\frac{1}{${c}}\\right)^{-${m}}`, st(c, m), String(c ** m))}$. Разом: $${k / a ** n} ${plus ? '+' : '-'} 1 - ${c ** m} = ${vidp}$.`,
    };
  }
}

/** Показник у віконці: 1/32 = 2^□, 0,001 = 10^□, 1 = 7^□. */
function pokaznyk(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(1, 4);
  if (typ === 4) {
    const a = r.chyslo(2, 30);
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$1 = ${a}^{\\square}$`,
      vidpovid: 0,
      pidkazka: 'Яке число в нульовому степені дорівнює 1?',
      rozviazok: `$${a}^0 = 1$, тож у віконці 0.`,
    };
  }
  if (typ === 3) {
    const n = r.chyslo(1, 5);
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$${des(1, n).replace(',', '{,}')} = 10^{\\square}$`,
      vidpovid: `−${n}`,
      pidkazka: `${des(1, n)} — це одиниця, поділена на 10 стільки разів, скільки знаків після коми.`,
      rozviazok: `$${des(1, n).replace(',', '{,}')} = \\frac{1}{${tch(10 ** n)}} = \\frac{1}{10^{${n}}} = 10^{-${n}}$.`,
    };
  }
  for (;;) {
    const a = r.chyslo(2, 9);
    const n = r.chyslo(2, 6);
    if (a ** n > 1000) continue;
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$\\frac{1}{${a ** n}} = ${a}^{\\square}$`,
      vidpovid: `−${n}`,
      pidkazka: `Спершу запиши ${a ** n} як степінь числа ${a}.`,
      rozviazok: `$${a ** n} = ${st(a, n)}$, тож $\\frac{1}{${a ** n}} = \\frac{1}{${st(a, n)}} = ${a}^{-${n}}$.`,
    };
  }
}

/** Одиниці вимірювання й «малі» величини в житті. */
function zhyttia(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(1, 3);
  if (typ === 1) {
    const sotni = r.chyslo(1, 10);
    const n = sotni * 100;
    return {
      pytannia: `Товщина аркуша паперу — $10^{-4}$ м. Яка товщина пачки з ${n} аркушів?`,
      vidpovid: sotni,
      odynytsi: 'см',
      pidkazka: '$10^{-4}$ м $= \\frac{1}{10\\ 000}$ м. Пам\'ятай: 1 м = 100 см.',
      rozviazok: `${n} · 10⁻⁴ м = ${n} : 10 000 м = ${des(n, 4)} м, тобто ${sotni} см.`,
    };
  }
  if (typ === 2) {
    const k = r.chyslo(2, 9);
    const p = r.chyslo(1, 3);
    const vMm = k * 10 ** (3 - p);
    return {
      pytannia: `Скільки міліметрів у $${k} \\cdot 10^{-${p}}$ м?`,
      vidpovid: vMm,
      odynytsi: 'мм',
      pidkazka: `1 м = 1000 мм, а $10^{-${p}}$ м — це $\\frac{1}{${tch(10 ** p)}}$ м.`,
      rozviazok: `$10^{-${p}}$ м $= \\frac{1000}{${10 ** p}}$ мм $= ${10 ** (3 - p)}$ мм, тож ${k} · ${10 ** (3 - p)} = ${vMm} мм.`,
    };
  }
  const k = r.chyslo(2, 9);
  const kr = r.chyslo(2, 20);
  return {
    pytannia: `Маса краплі води — $${k} \\cdot 10^{-2}$ г. Яка маса ${kr} таких крапель? Відповідь запиши десятковим дробом.`,
    vidpovid: des(k * kr, 2),
    odynytsi: 'г',
    pidkazka: `$${k} \\cdot 10^{-2} = \\frac{${k}}{100} = ${des(k, 2).replace(',', '{,}')}$.`,
    rozviazok: `Одна крапля — ${des(k, 2)} г, тож ${kr} крапель — ${des(k * kr, 2)} г.`,
  };
}

export default {
  rivni: ['обчисли степінь', 'з підступом', 'вирази й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([obchyslyty, obchyslyty, nulovyi, desiatky])(r);
    if (riven === 2) return r.vybir([znak, drib, porivniannia, nulPastka])(r);
    return r.vybir([vyraz, pokaznyk, zhyttia, drib])(r);
  },
} satisfies Henerator;
