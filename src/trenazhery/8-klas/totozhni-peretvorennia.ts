// Тотожні перетворення раціональних виразів: план дій (що виконуємо першим), вирази з двох дій (дужки, потім
// множення чи ділення), пастка порядку дій, допустимі значення початкового виразу, вирази, що не залежать від
// змінної, середня швидкість.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const TN = ['Так', 'Ні'];
const DII = ['додавання', 'віднімання', 'множення', 'ділення', 'піднесення до степеня'];

/** Яку дію виконують першою. */
function pershaDia(r: Vypadok): TrenZavdannia {
  const [x, y] = r.vybir([['x', 'y'], ['a', 'b'], ['m', 'n']]);
  const [p, q, s] = [r.chyslo(1, 9), r.chyslo(1, 9), r.chyslo(2, 9)];
  const vypadky: [string, string, string][] = [
    [`\\frac{${p}}{${x}} + \\frac{${q}}{${x}} \\cdot \\frac{${x}}{${s}}`, 'множення', 'Множення виконують раніше за додавання.'],
    [`\\frac{${p}}{${x}} - \\frac{${q}}{${y}} : \\frac{${s}}{${y}}`, 'ділення', 'Ділення виконують раніше за віднімання.'],
    [`\\left(\\frac{${p}}{${x}} + \\frac{${q}}{${y}}\\right) \\cdot \\frac{${x}${y}}{${s}}`, 'додавання', 'Спершу — дія в дужках.'],
    [`\\left(\\frac{${p}}{${x}} - \\frac{${q}}{${y}}\\right) : \\frac{${s}}{${x}${y}}`, 'віднімання', 'Спершу — дія в дужках.'],
    [`\\frac{${p}}{${x}} : \\frac{${q}}{${y}} \\cdot \\frac{${s}}{${x}}`, 'ділення', 'Множення й ділення — зліва направо, тож спершу ділення.'],
    [`\\frac{${p}}{${x}} + \\left(\\frac{${q}}{${y}}\\right)^2`, 'піднесення до степеня', 'Степінь виконують раніше за додавання.'],
  ];
  const [vyraz, vidp, poiasn] = r.vybir(vypadky);
  const inshi = r.peremishaty(DII.filter((d) => d !== vidp)).slice(0, 2);
  return {
    pytannia: `Яку дію виконують першою у виразі $${vyraz}$?`,
    vidpovid: vidp,
    varianty: r.peremishaty([vidp, ...inshi]),
    pidkazka: 'Порядок той самий, що для чисел: дужки, степінь, множення й ділення, додавання й віднімання.',
    rozviazok: poiasn,
  };
}

/** (x/(x − a) − 1) · (x² − a²)/(am) = (x + a)/m. */
function minusOdyn(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(1, 6);
    const m = r.chyslo(1, 4);
    const v = r.chyslo(1, 12);
    if (a * m < 2 || v === a || (v + a) % m !== 0) continue;
    const vidp = (v + a) / m;
    return {
      pytannia: `Спрости вираз $\\left(\\frac{x}{x - ${a}} - 1\\right) \\cdot \\frac{x^2 - ${a * a}}{${a * m}}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: vidp,
      pidkazka: `Дія 1: 1 = (x − ${a})/(x − ${a}), тож x/(x − ${a}) − 1 = ${a}/(x − ${a}). Дія 2: x² − ${a * a} = (x − ${a})(x + ${a}).`,
      rozviazok: `Дія 1 дає ${a} над x − ${a}. Дія 2: скорочуємо x − ${a} і ${a}, лишається ${m === 1 ? 'x + ' + a : `(x + ${a}) : ${m}`}. При x = ${v}: ${m === 1 ? `${v} + ${a} = ${vidp}` : `(${v} + ${a}) : ${m} = ${vidp}`}.`,
    };
  }
}

/** (1 + a/x) : ((x + a)/(kx²)) = kx. */
function odynPlus(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const k = r.chyslo(2, 5);
  const v = r.chyslo(2, 12);
  const kk = `${k}`;
  return {
    pytannia: `Спрости вираз $\\left(1 + \\frac{${a}}{x}\\right) : \\frac{x + ${a}}{${kk}x^2}$ і знайди його значення при $x = ${v}$.`,
    vidpovid: k * v,
    pidkazka: `Дія 1: 1 + ${a}/x = (x + ${a})/x. Дія 2: переверни дільник.`,
    rozviazok: `(x + ${a})/x · ${kk}x²/(x + ${a}) — скорочуємо x + ${a} і x, лишається ${kk}x. При x = ${v}: ${k} · ${v} = ${k * v}.`,
  };
}

/** p/x + q/x · x/s: спершу множення. */
function poriadok(r: Vypadok): TrenZavdannia {
  for (;;) {
    const v = r.chyslo(2, 9);
    const t = r.chyslo(1, 5);
    const p = v * t;
    const s = r.chyslo(2, 6);
    const u = r.chyslo(1, 5);
    const q = s * u;
    if (p > 40 || q > 40 || (p + q) % s === 0) continue;
    return {
      pytannia: `Знайди значення виразу $\\frac{${p}}{x} + \\frac{${q}}{x} \\cdot \\frac{x}{${s}}$ при $x = ${v}$.`,
      vidpovid: t + u,
      pidkazka: `Спершу множення: ${q}/x · x/${s} — скороти x.`,
      rozviazok: `${q}/x · x/${s} = ${q}/${s} = ${u}, тож вираз дорівнює ${p}/x + ${u}. При x = ${v}: ${p} : ${v} + ${u} = ${t + u}.`,
    };
  }
}

/** Чи має початковий вираз зміст після скорочення. */
function dopustymi(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const typ = r.chyslo(0, 2);
  if (typ === 2) {
    const c = r.shans() ? 0 : r.krim(-9, 9, [0]);
    const tak = c !== 0;
    return {
      pytannia: `Вираз $\\frac{x^2 + ${a}x}{x}$ спростили до $x + ${a}$. Чи має початковий вираз зміст при $x = ${c < 0 ? `-${-c}` : c}$?`,
      vidpovid: tak ? 'Так' : 'Ні',
      varianty: TN,
      pidkazka: 'Підстав це число в знаменник початкового виразу.',
      rozviazok: tak ? `Так: знаменник x не дорівнює нулю.` : 'Ні: при x = 0 знаменник дорівнює нулю, хоч вираз x + ' + a + ' там має значення.',
    };
  }
  const c = typ === 0 ? a : r.shans() ? -a : r.krim(-9, 9, [a, -a]);
  const tak = c !== a;
  return {
    pytannia: `Вираз $\\frac{x^2 - ${a * a}}{x - ${a}}$ спростили до $x + ${a}$. Чи має початковий вираз зміст при $x = ${c < 0 ? `-${-c}` : c}$?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: `Підстав це число в знаменник x − ${a} початкового виразу.`,
    rozviazok: tak
      ? `Так: знаменник x − ${a} при цьому x не дорівнює нулю.`
      : `Ні: при x = ${a} знаменник x − ${a} дорівнює нулю. Вираз x + ${a} рівний початковому лише при x ≠ ${a}.`,
  };
}

/** Вирази, що не залежать від x. */
function nezalezhnyi(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  if (r.shans()) {
    return {
      pytannia: `Доведи, що значення виразу $\\left(\\frac{x}{x - ${a}} - \\frac{x}{x + ${a}}\\right) : \\frac{x}{x^2 - ${a * a}}$ не залежить від $x$. Чому воно дорівнює?`,
      vidpovid: 2 * a,
      pidkazka: `Дія 1: спільний знаменник (x − ${a})(x + ${a}) = x² − ${a * a}.`,
      rozviazok: `Дія 1: x(x + ${a}) − x(x − ${a}) = ${2 * a}x, тож різниця дорівнює ${2 * a}x/(x² − ${a * a}). Дія 2: ${2 * a}x/(x² − ${a * a}) · (x² − ${a * a})/x — лишається ${2 * a}.`,
    };
  }
  const k = r.chyslo(2, 6);
  return {
    pytannia: `Доведи, що значення виразу $\\frac{${k}x}{x - ${a}} + \\frac{${k * a}}{${a} - x}$ не залежить від $x$. Чому воно дорівнює?`,
    vidpovid: k,
    pidkazka: `${a} − x = −(x − ${a}), тож другий дріб дорівнює −${k * a}/(x − ${a}).`,
    rozviazok: `${k}x/(x − ${a}) − ${k * a}/(x − ${a}) = (${k}x − ${k * a})/(x − ${a}) = ${k}(x − ${a})/(x − ${a}), тобто ${k}.`,
  };
}

/** Середня швидкість на двох однакових ділянках: 2s : (s/v + s/(kv)) = 2kv/(k + 1). */
function serednia(r: Vypadok): TrenZavdannia {
  const [khto, dia, vid, do_] = r.vybir([
    ['Автобус', 'проїхав', 20, 60],
    ['Велосипедист', 'проїхав', 6, 20],
    ['Катер', 'пройшов', 10, 40],
  ] as const);
  for (;;) {
    const k = r.chyslo(2, 4);
    const v = r.chyslo(vid, do_);
    if ((2 * k * v) % (k + 1) !== 0) continue;
    const vidp = (2 * k * v) / (k + 1);
    return {
      pytannia: `${khto} ${dia} $s$ км зі швидкістю $v$ км/год, а ще $s$ км — зі швидкістю $${k}v$ км/год. Середня швидкість — це $2s : \\left(\\frac{s}{v} + \\frac{s}{${k}v}\\right)$. Спрости вираз і знайди її при $v = ${v}$.`,
      vidpovid: vidp,
      odynytsi: 'км/год',
      pidkazka: `Дія 1: s/v + s/(${k}v) = (${k}s + s)/(${k}v). Дія 2: переверни дільник.`,
      rozviazok: `Дія 1: ${k + 1}s/(${k}v). Дія 2: 2s · ${k}v/(${k + 1}s) = ${2 * k}v/${k + 1}. При v = ${v}: ${2 * k} · ${v} : ${k + 1} = ${vidp} км/год — не середнє арифметичне швидкостей.`,
    };
  }
}

/** ((x + b)/x) · (x/(x + b) + x/(x − b)) = 2x/(x − b). */
function dvaDroby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.chyslo(1, 6);
    const v = r.chyslo(1, 15);
    if (v === b || (2 * v) % (v - b) !== 0) continue;
    const vidp = (2 * v) / (v - b);
    return {
      pytannia: `Спрости вираз $\\frac{x + ${b}}{x} \\cdot \\left(\\frac{x}{x + ${b}} + \\frac{x}{x - ${b}}\\right)$ і знайди його значення при $x = ${v}$.`,
      vidpovid: vidp < 0 ? `−${-vidp}` : vidp,
      pidkazka: `Дія 1: спільний знаменник (x + ${b})(x − ${b}); чисельник x(x − ${b}) + x(x + ${b}) = 2x².`,
      rozviazok: `Дія 1: 2x²/((x + ${b})(x − ${b})). Дія 2: скорочуємо x і x + ${b}, лишається 2x/(x − ${b}). При x = ${v}: ${2 * v} : ${v - b < 0 ? `(−${b - v})` : v - b} = ${vidp < 0 ? `−${-vidp}` : vidp}.`,
    };
  }
}

export default {
  rivni: ['план і дві дії', 'пастки й тотожності', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([pershaDia, minusOdyn, odynPlus])(r);
    if (riven === 2) return r.vybir([poriadok, dopustymi, nezalezhnyi, pershaDia])(r);
    return r.vybir([serednia, dvaDroby, minusOdyn, nezalezhnyi])(r);
  },
} satisfies Henerator;
