// Множення раціональних дробів і піднесення дробу до степеня: скорочення до множення, число в квадратику,
// степінь дробу (до степеня — і число), знак мінус і парність степеня, многочлен на дріб (різниця квадратів),
// пастка «скорочуємо доданок», задачі на площу.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const TN = ['Так', 'Ні'];
const PARY = [['a', 'b'], ['x', 'y'], ['m', 'n']];
const STEPIN = ['', '', '²', '³', '⁴'];

/** (ka/b) · (b/m) = a/□, m = kt. */
function kvadratyk(r: Vypadok): TrenZavdannia {
  const [a, b] = r.vybir(PARY);
  const k = r.chyslo(2, 9);
  const t = r.chyslo(2, 9);
  const m = k * t;
  return {
    pytannia: 'Яке число треба вписати в квадратик?',
    vyraz: `$\\frac{${k}${a}}{${b}} \\cdot \\frac{${b}}{${m}} = \\frac{${a}}{\\square}$`,
    vidpovid: t,
    pidkazka: `Скороти ${b}, а ${k} і ${m} — на ${k}.`,
    rozviazok: `${k}${a} · ${b} над ${b} · ${m}: скорочуємо ${b}, і ${m} : ${k} = ${t}. Виходить ${a} над ${t}.`,
  };
}

/** (px/y²) · (y³/(qx)) = y/t, q = pt; значення при y = ts. */
function znachennia(r: Vypadok): TrenZavdannia {
  const [x, y] = r.vybir(PARY);
  const p = r.chyslo(2, 6);
  const t = r.chyslo(2, 5);
  const s = r.chyslo(1, 9);
  const q = p * t;
  const v = t * s;
  return {
    pytannia: `Спрости вираз $\\frac{${p}${x}}{${y}^2} \\cdot \\frac{${y}^3}{${q}${x}}$ і знайди його значення при $${y} = ${v}$.`,
    vidpovid: s,
    pidkazka: `Спершу скороти: ${p} і ${q} — на ${p}, ${x} і ${x}, ${y}² і ${y}³ — на ${y}².`,
    rozviazok: `${p}${x} · ${y}³ над ${y}² · ${q}${x} — після скорочення ${y} над ${t}. При ${y} = ${v}: ${v} : ${t} = ${s}.`,
  };
}

/** (ka/b^m)^n = □a^n/b^(mn) або a^n/b^□. */
function stepin(r: Vypadok): TrenZavdannia {
  const [a, b] = r.vybir(PARY);
  const n = r.chyslo(2, 3);
  const k = n === 2 ? r.chyslo(2, 9) : r.chyslo(2, 5);
  const m = r.chyslo(2, 4);
  if (r.shans()) {
    return {
      pytannia: 'Яке число треба вписати в квадратик?',
      vyraz: `$\\left(\\frac{${k}${a}}{${b}^${m}}\\right)^${n} = \\frac{\\square ${a}^${n}}{${b}^{${m * n}}}$`,
      vidpovid: k ** n,
      pidkazka: `До ${n === 2 ? 'квадрата' : 'куба'} підносимо і число ${k}, і ${a}.`,
      rozviazok: `(${k}${a})${STEPIN[n]} = ${k}${STEPIN[n]} · ${a}${STEPIN[n]}, а ${k}${STEPIN[n]} = ${k ** n}.`,
    };
  }
  return {
    pytannia: 'Яке число треба вписати в квадратик?',
    vyraz: `$\\left(\\frac{${a}}{${b}^${m}}\\right)^${n} = \\frac{${a}^${n}}{${b}^{\\square}}$`,
    vidpovid: m * n,
    pidkazka: 'Під час піднесення степеня до степеня показники множать.',
    rozviazok: `(${b}${STEPIN[m]})${STEPIN[n]} — це ${b} з показником ${m} · ${n} = ${m * n}.`,
  };
}

/** (−k/x)^n при x = v, k = tv: (−t)^n. */
function znak(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 3);
  const t = n === 2 ? r.chyslo(2, 9) : r.chyslo(2, 5);
  const v = r.chyslo(2, 6);
  const k = t * v;
  const vidp = (-t) ** n;
  return {
    pytannia: `Знайди значення виразу $\\left(-\\frac{${k}}{x}\\right)^${n}$ при $x = ${v}$.`,
    vidpovid: ch(vidp),
    pidkazka: `Спершу обчисли дріб у дужках. ${n === 2 ? 'Парний' : 'Непарний'} степінь ${n === 2 ? '«з\'їдає»' : 'залишає'} мінус.`,
    rozviazok: `У дужках ${ch(-k)} : ${v}, тобто ${ch(-t)}. ${n === 2 ? 'Квадрат' : 'Куб'} числа ${ch(-t)} дорівнює ${ch(vidp)}.`,
  };
}

/** (x + a) · c/(x² − a²) = c/(x − a); значення при x = v. */
function mnohochlenNaDrib(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(1, 6);
    const d = r.chyslo(1, 6);
    const t = r.chyslo(1, 6);
    const v = a + d;
    const c = d * t;
    if (c < 2 || c > 30) continue;
    return {
      pytannia: `Спрости вираз $(x + ${a}) \\cdot \\frac{${c}}{x^2 - ${a * a}}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: t,
      pidkazka: `x² − ${a * a} = (x − ${a})(x + ${a}). Многочлен x + ${a} — це дріб зі знаменником 1.`,
      rozviazok: `${c}(x + ${a}) над (x − ${a})(x + ${a}): скорочуємо x + ${a}, лишається ${c} над x − ${a}. При x = ${v}: ${c} : ${d} = ${t}.`,
    };
  }
}

/** Чи правильна рівність: скорочення доданка, число в степені, мінус і парність. */
function chyPravylno(r: Vypadok): TrenZavdannia {
  const [x, y] = r.vybir(PARY);
  const a = r.chyslo(1, 9);
  const k = r.chyslo(2, 9);
  const m = r.chyslo(2, 9);
  const vypadky: [string, boolean, string][] = [
    [`\\frac{${x} + ${a}}{${k}} \\cdot \\frac{${k * m}}{${x} + ${a}} = ${m}`, true, `${x} + ${a} — спільний множник чисельника і знаменника, його можна скоротити; ${k * m} : ${k} = ${m}.`],
    [`\\frac{${x} + ${a}}{${k}} \\cdot \\frac{${k}}{${x}} = ${a}`, false, `У ${x} + ${a} змінна ${x} — лише доданок, скорочувати її не можна. Правильно: (${x} + ${a}) над ${x}.`],
    [`\\left(\\frac{${k}${x}}{${y}}\\right)^2 = \\frac{${k}${x}^2}{${y}^2}`, false, `До квадрата підносимо і число: (${k}${x})² = ${k * k}${x}².`],
    [`\\left(\\frac{${k}${x}}{${y}}\\right)^2 = \\frac{${k * k}${x}^2}{${y}^2}`, true, `(${k}${x})² = ${k * k}${x}², а знаменник — ${y}².`],
    [`\\left(-\\frac{${x}}{${y}}\\right)^3 = \\frac{${x}^3}{${y}^3}`, false, `Непарний степінь залишає мінус: має бути −${x}³ над ${y}³.`],
    [`\\left(-\\frac{${x}}{${y}}\\right)^2 = \\frac{${x}^2}{${y}^2}`, true, `Парний степінь «з'їдає» мінус.`],
  ];
  const [rivnist, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильна рівність $${rivnist}$?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Скорочувати можна лише множники. До степеня підносимо все: число, змінні, знак.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** (x² + ax)/(x − b) · (x² − b²)/(x + a) = x(x + b); значення при x = v. */
function dvaMnohochleny(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(1, 6);
    const b = r.chyslo(1, 6);
    const v = r.chyslo(2, 9);
    if (v === b) continue;
    return {
      pytannia: `Спрости вираз $\\frac{x^2 + ${a}x}{x - ${b}} \\cdot \\frac{x^2 - ${b * b}}{x + ${a}}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: v * (v + b),
      pidkazka: `x² + ${a}x = x(x + ${a}), x² − ${b * b} = (x − ${b})(x + ${b}).`,
      rozviazok: `Скорочуємо x + ${a} і x − ${b}, лишається x(x + ${b}). При x = ${v}: ${v} · ${v + b} = ${v * (v + b)}.`,
    };
  }
}

/** Площа прямокутника a²/b · b²/a = ab або квадрата (x²/y)². */
function ploshcha(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const a = r.chyslo(2, 9);
    const b = r.krim(2, 9, [a]);
    return {
      pytannia: `Сторони прямокутника — $\\frac{a^2}{b}$ см і $\\frac{b^2}{a}$ см. Знайди його площу при $a = ${a}$, $b = ${b}$.`,
      vidpovid: a * b,
      odynytsi: 'см²',
      pidkazka: 'Площа прямокутника — добуток сторін. Скороти a і b ще до підстановки.',
      rozviazok: `a²b² над ab — це ab. При a = ${a}, b = ${b}: ${a} · ${b} = ${a * b} см².`,
    };
  }
  const [x, y] = r.vybir([[2, 2], [2, 4], [3, 3], [3, 9], [4, 2], [4, 8], [5, 5], [6, 4], [6, 9], [6, 12], [4, 4], [6, 6]]);
  const s = (x * x) / y;
  return {
    pytannia: `Сторона квадрата — $\\frac{x^2}{y}$ см. Знайди його площу при $x = ${x}$, $y = ${y}$.`,
    vidpovid: s * s,
    odynytsi: 'см²',
    pidkazka: 'Площа квадрата — квадрат сторони: (x²/y)² = x⁴/y².',
    rozviazok: `Сторона ${x * x} : ${y} = ${s} см, площа ${s} · ${s} = ${s * s} см².`,
  };
}

/** (x²/y)² · y³/x³ = xy. */
function stepinIDobutok(r: Vypadok): TrenZavdannia {
  const [a, b] = r.vybir(PARY);
  const u = r.chyslo(2, 9);
  const w = r.chyslo(2, 9);
  return {
    pytannia: `Спрости вираз $\\left(\\frac{${a}^2}{${b}}\\right)^2 \\cdot \\frac{${b}^3}{${a}^3}$ і знайди його значення при $${a} = ${u}$, $${b} = ${w}$.`,
    vidpovid: u * w,
    pidkazka: `Спершу степінь: (${a}²/${b})² = ${a}⁴/${b}². Потім скороти ${a}⁴ і ${a}³, ${b}³ і ${b}².`,
    rozviazok: `${a}⁴ · ${b}³ над ${b}² · ${a}³ — це ${a}${b}. При ${a} = ${u}, ${b} = ${w}: ${u} · ${w} = ${u * w}.`,
  };
}

export default {
  rivni: ['як у прикладі', 'знак і пастки', 'многочлени й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([kvadratyk, znachennia, stepin])(r);
    if (riven === 2) return r.vybir([znak, mnohochlenNaDrib, chyPravylno, stepin])(r);
    return r.vybir([dvaMnohochleny, ploshcha, stepinIDobutok, mnohochlenNaDrib])(r);
  },
} satisfies Henerator;
