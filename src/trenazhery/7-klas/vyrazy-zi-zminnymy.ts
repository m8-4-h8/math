// Вирази зі змінними (7 клас, Істер, алгебра § 4): значення виразу при заданих значеннях змінних (від'ємні — у дужках),
// вираз без змісту (ділення на нуль), цілі й дробові вирази, формули парного, непарного і кратного числа, задачі.
import { ch, des, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tz, tvd } from '../alhebra.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm', 'c'];

/** k·x у формулі: 1 → «x», −1 → «-x». */
const kx = (k: number, x: string) => (k === 1 ? x : k === -1 ? `-${x}` : `${tz(k)}${x}`);
/** «+ 3» / «- 3» після першого члена. */
const pl = (k: number, t: string) => (k < 0 ? ` - ${t.replace(/^-/, '')}` : ` + ${t}`);

// ax + b при цілому x.
function liniinyi(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const a = r.krim(-9, 9, [0, 1, -1]);
  const b = r.krim(-12, 12, [0]);
  const v = r.krim(-6, 6, [0]);
  const rez = a * v + b;
  return {
    pytannia: `Знайди значення виразу $${kx(a, x)}${pl(b, String(Math.abs(b)))}$ при $${x} = ${tz(v)}$.`,
    vidpovid: ch(rez),
    pidkazka: v < 0 ? `Підстав ${ch(v)} у дужках: ${ch(a)} · (${ch(v)}).` : `Між числом і буквою — множення: ${ch(a)} · ${v}.`,
    rozviazok: `${ch(a)} · ${tvd(v)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${ch(rez)}`,
  };
}

// am + bn при двох змінних.
function dviZminni(r: Vypadok): TrenZavdannia {
  const [x, y] = r.rizni(2, 0, BUKVY.length - 1).map((i) => BUKVY[i]);
  const a = r.krim(-6, 9, [0, 1, -1]);
  const b = r.krim(-6, 9, [0, 1, -1]);
  const [vx, vy] = [r.krim(-5, 5, [0]), r.krim(-5, 5, [0])];
  const rez = a * vx + b * vy;
  return {
    pytannia: `Знайди значення виразу $${kx(a, x)}${pl(b, kx(Math.abs(b), y))}$ при $${x} = ${tz(vx)}$, $${y} = ${tz(vy)}$.`,
    vidpovid: ch(rez),
    pidkazka: 'Підстав кожне число замість своєї букви, від’ємні — у дужках.',
    rozviazok: `${ch(a)} · ${tvd(vx)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} · ${tvd(vy)} = ${ch(a * vx)} ${b * vy < 0 ? '−' : '+'} ${Math.abs(b * vy)} = ${ch(rez)}`,
  };
}

// 5x − 3 при x = 1,8: десятковий дріб.
function desiatkovyi(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const a = r.vybir([2, 4, 5]);
  const b = r.krim(-9, 9, [0]);
  const v10 = r.krim(-29, 29, [0, -20, -10, 10, 20]); // x = v10 / 10
  const rez10 = a * v10 + b * 10;
  return {
    pytannia: `Знайди значення виразу $${a}${x}${pl(b, String(Math.abs(b)))}$ при $${x} = ${tdes(v10, 1)}$.`,
    vidpovid: des(rez10, 1),
    pidkazka: `Спершу ${a} · ${v10 < 0 ? `(${des(v10, 1)})` : des(v10, 1)}, потім ${b < 0 ? 'відніми' : 'додай'} ${Math.abs(b)}.`,
    rozviazok: `${a} · ${v10 < 0 ? `(${des(v10, 1)})` : des(v10, 1)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${des(a * v10, 1)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${des(rez10, 1)}`,
  };
}

// Підступ: квадрат від’ємного числа. x² + px, x² − y², −x² + c.
function kvadrat(r: Vypadok): TrenZavdannia {
  const x = r.vybir(['x', 'a', 'b', 'm']);
  const v = r.krim(-6, -1, []);
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    const p = r.krim(-6, 6, [0]);
    const rez = v * v + p * v;
    return {
      pytannia: `Знайди значення виразу $${x}^2${pl(p, kx(Math.abs(p), x))}$ при $${x} = ${tz(v)}$.`,
      vidpovid: ch(rez),
      pidkazka: `Підстав у дужках: (${ch(v)})² — квадрат від’ємного числа додатний.`,
      rozviazok: `${tvd(v)}² ${p < 0 ? '−' : '+'} ${Math.abs(p)} · ${tvd(v)} = ${v * v} ${p * v < 0 ? '−' : '+'} ${Math.abs(p * v)} = ${ch(rez)}`,
    };
  }
  if (vyd === 1) {
    const c = r.krim(-9, 9, [0]);
    const rez = -v * v + c;
    return {
      pytannia: `Знайди значення виразу $-${x}^2${pl(c, String(Math.abs(c)))}$ при $${x} = ${tz(v)}$.`,
      vidpovid: ch(rez),
      pidkazka: `Спершу (${ch(v)})² = ${v * v}, а мінус перед ${x}² — уже після піднесення до квадрата.`,
      rozviazok: `−${tvd(v)}² ${c < 0 ? '−' : '+'} ${Math.abs(c)} = −${v * v} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${ch(rez)}`,
    };
  }
  const y = x === 'x' ? 'y' : 'c';
  const u = r.krim(-6, 6, [0]);
  const rez = u * u - v * v;
  return {
    pytannia: `Знайди значення виразу $${y}^2 - ${x}^2$ при $${y} = ${tz(u)}$, $${x} = ${tz(v)}$.`,
    vidpovid: ch(rez),
    pidkazka: 'Від’ємні числа підставляй у дужках: квадрат від’ємного числа додатний.',
    rozviazok: `${tvd(u)}² − ${tvd(v)}² = ${u * u} − ${v * v} = ${ch(rez)}`,
  };
}

// При якому x вираз не має змісту: k / (x − a), k / (bx − ba).
function bezZmistu(r: Vypadok): TrenZavdannia {
  const x = r.vybir(['x', 'a', 'b', 'm']);
  const a = r.krim(-9, 9, [0]);
  const k = r.krim(1, 15, []);
  const b = r.shans() ? 1 : r.vybir([2, 3, 4, 5]);
  const znam = b === 1 ? `${x}${pl(-a, String(Math.abs(a)))}` : `${b}${x}${pl(-a * b, String(Math.abs(a * b)))}`;
  return {
    pytannia: `При якому значенні $${x}$ вираз $\\dfrac{${k}}{${znam}}$ не має змісту?`,
    vidpovid: ch(a),
    pidkazka: 'Ділити на нуль не можна. Знайди, при якому значенні знаменник дорівнює нулю.',
    rozviazok: b === 1 ? `Знаменник ${ch(a)} − ${tvd(a)} = 0, тому при ${x} = ${ch(a)} вираз не має змісту.` : `${b} · ${tvd(a)} − ${tvd(a * b)} = 0: при ${x} = ${ch(a)} знаменник — нуль.`,
  };
}

// Цілий чи дробовий.
const TSILI = ['\\dfrac{a + b}{5}', '2a - m', '\\dfrac{x}{3} + 7', 'x^2 + 2x', '0{,}5mn', '\\dfrac{3x - 1}{4}', '(a - b)^2', '\\dfrac{1}{2}xy'];
const DROBOVI = ['\\dfrac{5}{c + 9}', '\\dfrac{a}{b}', '7 + \\dfrac{1}{x}', '\\dfrac{x + 2}{x - 2}', '\\dfrac{m^2}{2n}', '4 : (a - 1)', '\\dfrac{3}{y} - y'];

function tsilyi(r: Vypadok): TrenZavdannia {
  const tak = r.shans();
  const v = r.vybir(tak ? TSILI : DROBOVI);
  return {
    pytannia: `Вираз $${v}$ — цілий чи дробовий?`,
    vidpovid: tak ? 'цілий' : 'дробовий',
    varianty: ['цілий', 'дробовий'],
    pidkazka: 'Дробовий — якщо є ділення на вираз зі змінною. Ділення на число вираз дробовим не робить.',
    rozviazok: tak ? 'Ділення на вираз зі змінною немає (на число ділити можна) — вираз цілий.' : 'Є ділення на вираз зі змінною — вираз дробовий.',
  };
}

// Формули натуральних чисел: n = 2k, 2k + 1, mk + r.
function formula(r: Vypadok): TrenZavdannia {
  const m = r.vybir([2, 3, 5, 7, 9]);
  const ost = m === 2 ? r.chyslo(0, 1) : r.chyslo(0, m - 1);
  const k = r.chyslo(3, 15);
  const n = m * k + ost;
  const f = ost === 0 ? `n = ${m}k` : `n = ${m}k + ${ost}`;
  return {
    pytannia: `Яке число дає формула $${f}$ при $k = ${k}$?`,
    vidpovid: n,
    pidkazka: `Підстав k = ${k}: спершу множення, потім додавання.`,
    rozviazok:
      `${m} · ${k}${ost ? ` + ${ost}` : ''} = ${n}. ` +
      (m === 2 ? (ost ? 'Це непарне число.' : 'Це парне число.') : ost ? `При діленні на ${m} остача ${ost}.` : `Число кратне ${m}.`),
  };
}

// a − b відоме: значення 4(a − b), b − a.
function vidomaRiznytsia(r: Vypadok): TrenZavdannia {
  // a − b = d / 100
  const d = r.vybir([25, 75, 125, 150, 175, 225, 250, 275, 325, 350]) * (r.shans(0.3) ? -1 : 1);
  const vyd = r.chyslo(0, 2);
  const zapys = tdes(d, 2);
  if (vyd === 0) {
    const k = r.vybir([2, 4, 10]);
    return {
      pytannia: `Для деяких значень $a$ і $b$ значення виразу $a - b$ дорівнює $${zapys}$. Чому дорівнює $${k}(a - b)$ для тих самих $a$ і $b$?`,
      vidpovid: des(k * d, 2),
      pidkazka: `Не шукай a і b: замість (a − b) підстав ${des(d, 2)}.`,
      rozviazok: `${k} · ${d < 0 ? `(${des(d, 2)})` : des(d, 2)} = ${des(k * d, 2)}`,
    };
  }
  if (vyd === 1) {
    return {
      pytannia: `Для деяких значень $a$ і $b$ значення виразу $a - b$ дорівнює $${zapys}$. Чому дорівнює $b - a$?`,
      vidpovid: des(-d, 2),
      pidkazka: 'b − a = −(a − b): переставили зменшуване і від’ємник — змінився знак.',
      rozviazok: `b − a = −(a − b) = ${des(-d, 2)}`,
    };
  }
  const c = r.krim(-9, 9, [0]);
  return {
    pytannia: `Для деяких значень $a$ і $b$ значення виразу $a - b$ дорівнює $${zapys}$. Чому дорівнює $a - b${pl(c, String(Math.abs(c)))}$?`,
    vidpovid: des(d + c * 100, 2),
    pidkazka: `Замість a − b підстав ${des(d, 2)}.`,
    rozviazok: `${des(d, 2)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${des(d + c * 100, 2)}`,
  };
}

// Текстові задачі: склади вираз і обчисли.
function zadacha(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 3);
  if (vyd === 0) {
    const [x, y] = [r.chyslo(8, 15), r.chyslo(3, 7)];
    const [g1, g2] = [r.chyslo(5, 8), r.chyslo(2, 4)];
    return {
      pytannia: `Майстер за годину виготовляє $x$ деталей, а учень — $y$ деталей. Майстер працював ${g1} год, а учень — ${g2} год. Склади вираз для кількості деталей разом і знайди його значення при $x = ${x}$, $y = ${y}$.`,
      vidpovid: g1 * x + g2 * y,
      pidkazka: `Вираз: ${g1}x + ${g2}y. Підстав x і y.`,
      rozviazok: `${g1}x + ${g2}y; ${g1} · ${x} + ${g2} · ${y} = ${g1 * x} + ${g2 * y} = ${g1 * x + g2 * y} (деталей)`,
    };
  }
  if (vyd === 1) {
    const [a, b, c] = [r.chyslo(5, 7), r.chyslo(1, 3), r.chyslo(2, 4)];
    const t = 45 * a + 15 * b + 10 * c;
    return {
      pytannia: `У школяра на день $a$ уроків по 45 хв, $b$ перерв по 15 хв і $c$ перерв по 10 хв. Склади вираз для часу в школі (у хвилинах) і знайди його значення при $a = ${a}$, $b = ${b}$, $c = ${c}$.`,
      vidpovid: t,
      odynytsi: 'хв',
      pidkazka: 'Вираз: 45a + 15b + 10c.',
      rozviazok: `45 · ${a} + 15 · ${b} + 10 · ${c} = ${45 * a} + ${15 * b} + ${10 * c} = ${t} (хв)`,
    };
  }
  if (vyd === 2) {
    const [x, y, z] = [r.chyslo(2, 12) * 2, r.chyslo(3, 15), r.chyslo(5, 25)];
    const s = x / 2 + y + 2 * z;
    return {
      pytannia: `У скарбничці $x$ монет по 50 к., $y$ монет по 1 грн і $z$ монет по 2 грн. Скільки гривень у скарбничці, якщо $x = ${x}$, $y = ${y}$, $z = ${z}$?`,
      vidpovid: s,
      odynytsi: 'грн',
      pidkazka: 'Монета 50 к. — це 0,5 грн. Вираз: 0,5x + y + 2z.',
      rozviazok: `${x} : 2 + ${y} + 2 · ${z} = ${x / 2} + ${y} + ${2 * z} = ${s} (грн)`,
    };
  }
  const [a, b] = [r.chyslo(4, 12), r.chyslo(2, 5)];
  return {
    pytannia: `Ручка коштує $x$ грн, а олівець — $y$ грн. Склади вираз для вартості 3 ручок і 4 олівців і знайди його значення при $x = ${a * 5}$, $y = ${b * 5}$.`,
    vidpovid: 3 * a * 5 + 4 * b * 5,
    odynytsi: 'грн',
    pidkazka: 'Вираз: 3x + 4y.',
    rozviazok: `3 · ${a * 5} + 4 · ${b * 5} = ${15 * a} + ${20 * b} = ${15 * a + 20 * b} (грн)`,
  };
}

export default {
  rivni: ['значення виразу', 'з підступом', 'формули і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([liniinyi, liniinyi, dviZminni, desiatkovyi])(r);
    if (riven === 2) return r.vybir([kvadrat, kvadrat, bezZmistu, tsilyi, dviZminni])(r);
    return r.vybir([zadacha, zadacha, formula, vidomaRiznytsia, kvadrat])(r);
  },
} satisfies Henerator;
