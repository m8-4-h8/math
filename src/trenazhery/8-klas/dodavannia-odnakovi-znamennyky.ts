// Додавання і віднімання раціональних дробів з однаковими знаменниками: число в квадратику, значення після
// спрощення, мінус перед дробом змінює знаки чисельника (вибір правильного чисельника), протилежні знаменники
// a − x і x − a, скорочення результату, текстові задачі на час руху.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tekst, tex } from '../alhebra.ts';

/** «A» і «B» для тексту: A − (B) = A − b₁ − b₂ (знаки членів B змінено). */
const bezDuzhok = (a: number[], b: number[], x: string) => {
  const t = tekst(b.map((k) => -k), x);
  return `${tekst(a, x)} ${t.startsWith('−') ? `− ${t.slice(1)}` : `+ ${t}`}`;
};

const BUKVY: [string, string][] = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']];
/** Коефіцієнт перед буквою: 1 не пишемо. */
const ko = (n: number) => (n === 1 ? '' : `${n}`);

function kvadratyk(r: Vypadok): TrenZavdannia {
  const [x, y] = r.vybir(BUKVY);
  const plus = r.shans();
  const a = r.chyslo(2, 15);
  const b = plus ? r.chyslo(1, 12) : r.chyslo(1, a - 1);
  const v = plus ? a + b : a - b;
  return {
    pytannia: 'Яке число треба вписати в квадратик?',
    vyraz: `$\\frac{${a}${x}}{${y}} ${plus ? '+' : '-'} \\frac{${ko(b)}${x}}{${y}} = \\frac{\\square ${x}}{${y}}$`,
    vidpovid: v,
    pidkazka: `Знаменник той самий — ${plus ? 'додай' : 'відніми'} лише чисельники.`,
    rozviazok: `${a}${x} ${plus ? '+' : '−'} ${ko(b)}${x} = ${v}${x}, знаменник ${y} лишається.`,
  };
}

function znachennia(r: Vypadok): TrenZavdannia {
  const n = r.vybir(['n', 'a', 'x', 'y']);
  const v = r.chyslo(2, 9);
  const t = r.chyslo(1, 6);
  const plus = r.shans();
  const s = t * v;
  const p = plus ? r.chyslo(1, s - 1) : s + r.chyslo(1, 15);
  const q = plus ? s - p : p - s;
  return {
    pytannia: `Спрости вираз $\\frac{${p}}{${n}} ${plus ? '+' : '-'} \\frac{${q}}{${n}}$ і знайди його значення при $${n} = ${v}$.`,
    vidpovid: t,
    pidkazka: `Спершу ${plus ? 'додай' : 'відніми'} чисельники: ${p} ${plus ? '+' : '−'} ${q}.`,
    rozviazok: `Чисельник ${p} ${plus ? '+' : '−'} ${q} = ${s}, тож вираз дорівнює ${s}/${n}. При ${n} = ${v}: ${s} : ${v} = ${t}.`,
  };
}

function dvochleny(r: Vypadok): TrenZavdannia {
  const v = r.chyslo(2, 9);
  const a = r.chyslo(1, 6);
  const c = r.chyslo(1, 6);
  const s = r.chyslo(1, 4);
  const b = r.chyslo(1, s * v - 1);
  const d = s * v - b;
  const vidp = a + c + s;
  return {
    pytannia: `Спрости вираз $\\frac{${tex([b, a])}}{x} + \\frac{${tex([d, c])}}{x}$ і знайди його значення при $x = ${v}$.`,
    vidpovid: vidp,
    pidkazka: 'Додай чисельники й зведи подібні: окремо члени з x, окремо числа.',
    rozviazok: `Чисельник ${tekst([b, a])} + ${tekst([d, c])} = ${tekst([b + d, a + c])}. При x = ${v}: ${(a + c) * v + b + d} : ${v} = ${vidp}.`,
  };
}

/** Пастка: мінус перед дробом змінює знаки всіх членів чисельника. */
function minus(r: Vypadok): TrenZavdannia {
  for (;;) {
    const x = r.vybir(['x', 'a', 'm', 'y']);
    const a = r.chyslo(3, 9);
    const c = r.chyslo(1, a - 1);
    const b = r.krim(-9, 9, [0]);
    const e = r.krim(-9, 9, [0]);
    const pravylnyi = `$${tex([b - e, a - c], x)}$`;
    const varianty = [...new Set([pravylnyi, `$${tex([b + e, a - c], x)}$`, `$${tex([b - e, a + c], x)}$`])];
    if (varianty.length < 3) continue;
    return {
      pytannia: `Який чисельник отримаємо: $\\frac{${tex([b, a], x)}}{${x}} - \\frac{${tex([e, c], x)}}{${x}}$?`,
      vidpovid: pravylnyi,
      varianty: r.peremishaty(varianty),
      pidkazka: `Візьми від'ємник у дужки: (${tekst([e, c], x)}). Мінус перед дужками змінює знак кожного члена.`,
      rozviazok: `${tekst([b, a], x)} − (${tekst([e, c], x)}) = ${bezDuzhok([b, a], [e, c], x)} = ${tekst([b - e, a - c], x)}.`,
    };
  }
}

function protylezhni(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const s = r.krim(-5, 5, [0]);
  const v = a + s;
  const t = r.krim(-6, 9, [0]);
  const plus = r.shans();
  // plus: p/(x − a) + q/(a − x) = (p − q)/(x − a); інакше p/(x − a) − q/(a − x) = (p + q)/(x − a).
  let p: number;
  let q: number;
  if (plus) {
    q = r.chyslo(1, 12);
    p = t * s + q;
    if (p <= 0) return protylezhni(r);
  } else {
    if (t * s < 2) return protylezhni(r);
    p = r.chyslo(1, t * s - 1);
    q = t * s - p;
  }
  return {
    pytannia: `Знайди значення виразу $\\frac{${p}}{x - ${a}} ${plus ? '+' : '-'} \\frac{${q}}{${a} - x}$ при $x = ${v}$.`,
    vidpovid: ch(t),
    pidkazka: `${a} − x = −(x − ${a}): винеси мінус перед дріб, і знаменники стануть однаковими.`,
    rozviazok: `${a} − x = −(x − ${a}), тож вираз дорівнює ${plus ? `(${p} − ${q})` : `(${p} + ${q})`} : (x − ${a}) = ${t * s} : (x − ${a}). При x = ${v}: ${ch(t * s)} : ${s < 0 ? `(${ch(s)})` : s} = ${ch(t)}.`,
  };
}

function skorochennia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const v = r.chyslo(1, 9) * 10 + r.chyslo(0, 9);
  if (v === a || v === -a) return skorochennia(r);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Спрости вираз $\\frac{x^2}{x - ${a}} - \\frac{${a * a}}{x - ${a}}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: v + a,
      pidkazka: `x² − ${a * a} = (x − ${a})(x + ${a}).`,
      rozviazok: `Чисельник x² − ${a * a} = (x − ${a})(x + ${a}), тож вираз дорівнює x + ${a}. При x = ${v}: ${v} + ${a} = ${v + a}.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Спрости вираз $\\frac{x^2}{x + ${a}} - \\frac{${a * a}}{x + ${a}}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: v - a,
      pidkazka: `x² − ${a * a} = (x − ${a})(x + ${a}).`,
      rozviazok: `Чисельник x² − ${a * a} = (x − ${a})(x + ${a}), тож вираз дорівнює x − ${a}. При x = ${v}: ${v} − ${a} = ${v - a}.`,
    };
  }
  // (k1·x + b)/(x + p) + (k2·x + d)/(x + p) = k, коли k1 + k2 = k і b + d = k·p.
  const k = r.chyslo(2, 6);
  const k1 = r.chyslo(1, k - 1);
  const p = r.chyslo(1, 6);
  const b = r.chyslo(1, k * p - 1);
  return {
    pytannia: `Спрости вираз $\\frac{${tex([b, k1])}}{x + ${p}} + \\frac{${tex([k * p - b, k - k1])}}{x + ${p}}$. Яке число вийшло?`,
    vidpovid: k,
    pidkazka: `Додай чисельники. Чи не ділиться сума на x + ${p}?`,
    rozviazok: `Чисельник ${tekst([b, k1])} + ${tekst([k * p - b, k - k1])} = ${tekst([k * p, k])} = ${k}(x + ${p}), тож дріб дорівнює ${k}.`,
  };
}

function rukh(r: Vypadok): TrenZavdannia {
  const [khto, de1, de2] = r.vybir([
    ['Турист пройшов', 'лісом', 'полем'],
    ['Велосипедист проїхав', 'шосе', 'ґрунтовою дорогою'],
    ['Човен проплив', 'річкою', 'озером'],
  ]);
  const v = khto.startsWith('Тур') ? r.chyslo(3, 5) : r.chyslo(8, 20);
  const plus = r.shans();
  if (plus) {
    const t = r.chyslo(2, 6);
    const s1 = r.chyslo(1, t * v - 1);
    const s2 = t * v - s1;
    return {
      pytannia: `${khto} ${s1} км ${de1} і ${s2} км ${de2} з однаковою швидкістю v км/год. Скільки годин тривала вся дорога при v = ${v}?`,
      vidpovid: t,
      odynytsi: 'год',
      pidkazka: 'Час = відстань : швидкість. Додай два дроби зі знаменником v.',
      rozviazok: `Час ${s1}/v + ${s2}/v = ${t * v}/v. При v = ${v}: ${t * v} : ${v} = ${t} год.`,
    };
  }
  const t = r.chyslo(1, 4);
  const s2 = r.chyslo(2, 30);
  const s1 = s2 + t * v;
  return {
    pytannia: `${khto} ${s1} км ${de1} і ${s2} км ${de2} з однаковою швидкістю v км/год. На скільки годин довше тривала перша частина дороги при v = ${v}?`,
    vidpovid: t,
    odynytsi: 'год',
    pidkazka: 'Різниця часу: s₁/v − s₂/v. Знаменники однакові.',
    rozviazok: `Різниця ${s1}/v − ${s2}/v = ${s1 - s2}/v. При v = ${v}: ${s1 - s2} : ${v} = ${t} год.`,
  };
}

function tryDroby(r: Vypadok): TrenZavdannia {
  const n = r.vybir(['x', 'a', 'y']);
  const v = r.chyslo(2, 9);
  const t = r.chyslo(1, 5);
  const c = r.chyslo(1, 20);
  const s = t * v + c;
  const a = r.chyslo(1, s - 1);
  const b = s - a;
  return {
    pytannia: `Спрости вираз $\\frac{${a}}{${n}} + \\frac{${b}}{${n}} - \\frac{${c}}{${n}}$ і знайди його значення при $${n} = ${v}$.`,
    vidpovid: t,
    pidkazka: 'Знаменник у всіх трьох дробів однаковий — працюй лише з чисельниками.',
    rozviazok: `Чисельник ${a} + ${b} − ${c} = ${t * v}. При ${n} = ${v}: ${t * v} : ${v} = ${t}.`,
  };
}

/** (x² + k)/(x − a) − (2ax + k − a²)/(x − a) = (x − a)²/(x − a) = x − a. */
function kvadratRiznytsi(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 8);
  const k = r.krim(1, 30, [a * a]);
  const v = r.chyslo(11, 99);
  const druhyi = tex([k - a * a, 2 * a]);
  return {
    pytannia: `Спрости вираз $\\frac{x^2 + ${k}}{x - ${a}} - \\frac{${druhyi}}{x - ${a}}$ і знайди його значення при $x = ${v}$.`,
    vidpovid: v - a,
    pidkazka: `Візьми другий чисельник у дужки. Що виходить у чисельнику — чи не квадрат різниці?`,
    rozviazok: `Чисельник x² + ${k} − (${tekst([k - a * a, 2 * a])}) = ${tekst([a * a, -2 * a, 1])} = (x − ${a})², тож вираз дорівнює x − ${a}. При x = ${v}: ${v} − ${a} = ${v - a}.`,
  };
}

export default {
  rivni: ['як у прикладі', 'мінус і протилежні знаменники', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([kvadratyk, znachennia, dvochleny])(r);
    if (riven === 2) return r.vybir([minus, protylezhni, skorochennia, minus])(r);
    return r.vybir([rukh, tryDroby, kvadratRiznytsi, skorochennia])(r);
  },
} satisfies Henerator;
