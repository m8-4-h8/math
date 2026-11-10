// Основна властивість раціонального дробу: пропущений чисельник чи знаменник, скорочення дробу з одночленів
// (вибір правильного результату), скоротити і обчислити, чи можна скоротити (доданки не скорочуються), знак
// a − b і b − a, недопустимі значення початкового дробу, скорочення з групуванням і з двома змінними.
import { ch, nsd, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { dobutok, tex, znachennia } from '../alhebra.ts';

/** Двочлен x + b для формули. */
const dv = (b: number, x = 'x') => tex([b, 1], x);
const step = (b: string, e: number) => (e === 0 ? '' : e === 1 ? b : `${b}^{${e}}`);

/** Дріб з одночленів у TeX: коефіцієнти p/q, показники букв (додатний — у чисельнику, від'ємний — у знаменнику). */
function odnochlenDrib(p: number, q: number, ea: number, eb: number, [a, b]: [string, string]) {
  const chys = `${p === 1 && (ea > 0 || eb > 0) ? '' : p}${step(a, Math.max(ea, 0))}${step(b, Math.max(eb, 0))}`;
  const znamL = `${step(a, Math.max(-ea, 0))}${step(b, Math.max(-eb, 0))}`;
  const znam = `${q === 1 && znamL ? '' : q}${znamL}`;
  return znam === '1' ? `$${chys}$` : `$\\frac{${chys}}{${znam}}$`;
}

function propusk(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const k = r.chyslo(2, 9);
  const m = r.chyslo(2, 9);
  const b = r.chyslo(1, 9);
  if (typ === 0) {
    return {
      pytannia: 'Яке число треба вписати замість квадратика?',
      vyraz: `$\\frac{${k}}{x - ${b}} = \\frac{\\square}{${m}(x - ${b})}$`,
      vidpovid: k * m,
      pidkazka: `Знаменник помножили на ${m}. Що треба зробити з чисельником?`,
      rozviazok: `Знаменник помножили на ${m}, тож і чисельник: ${k} · ${m} = ${k * m}.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Яке число треба вписати замість квадратика?',
      vyraz: `$\\frac{x}{${k}} = \\frac{${m}x}{\\square}$`,
      vidpovid: k * m,
      pidkazka: `Чисельник помножили на ${m}.`,
      rozviazok: `Чисельник помножили на ${m}, тож і знаменник: ${k} · ${m} = ${k * m}.`,
    };
  }
  return {
    pytannia: 'Яке число треба вписати замість квадратика?',
    vyraz: `$\\frac{x - ${b}}{${k}} = \\frac{${b} - x}{\\square}$`,
    vidpovid: ch(-k),
    pidkazka: `${b} − x = −(x − ${b}): чисельник помножили на −1.`,
    rozviazok: `Чисельник помножили на −1, тож і знаменник: ${k} · (−1) = ${ch(-k)}.`,
  };
}

function skorotyOdnochlen(r: Vypadok): TrenZavdannia {
  for (;;) {
    const bukvy: [string, string] = r.vybir([['a', 'b'], ['x', 'y'], ['m', 'n']]);
    const p = r.chyslo(1, 7);
    const q = r.chyslo(1, 7);
    if (p === q || nsd(p, q) !== 1) continue;
    const g = r.chyslo(2, 6);
    const [m1, m2, n1, n2] = [r.chyslo(1, 5), r.chyslo(1, 5), r.chyslo(0, 3), r.chyslo(0, 3)];
    if (m1 === m2 || (n1 === 0 && n2 === 0)) continue;
    const [ea, eb] = [m1 - m2, n1 - n2];
    const [A, B] = bukvy;
    const vyh = `\\frac{${g * p}${step(A, m1)}${step(B, n1)}}{${g * q}${step(A, m2)}${step(B, n2)}}`;
    const pravylnyi = odnochlenDrib(p, q, ea, eb, bukvy);
    const varianty = [...new Set([pravylnyi, odnochlenDrib(q, p, ea, eb, bukvy), odnochlenDrib(p, q, ea + Math.sign(ea), eb, bukvy)])];
    if (varianty.length < 3) continue;
    return {
      pytannia: `Скороти дріб $${vyh}$.`,
      vidpovid: pravylnyi,
      varianty: r.peremishaty(varianty),
      pidkazka: `Числа скорочуємо на НСД(${g * p}; ${g * q}) = ${g}, букву — на її найменший степінь.`,
      rozviazok: `Число: ${g * p} : ${g} = ${p}, ${g * q} : ${g} = ${q}. Букви: від ${A} лишається степінь ${Math.abs(ea)} у ${ea > 0 ? 'чисельнику' : 'знаменнику'}${eb === 0 ? `, ${B} скорочується повністю` : `, від ${B} — степінь ${Math.abs(eb)} у ${eb > 0 ? 'чисельнику' : 'знаменнику'}`}.`,
    };
  }
}

/** Коефіцієнт перед змінною: 1 не пишемо. */
const ko = (n: number) => (n === 1 ? '' : `${n}`);

/** Скоротити і обчислити: дріб, що скорочується до двочлена x ± a (або числа). */
function znachenniaPislia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const k = r.chyslo(2, 9);
  const v = r.chyslo(1, 9) * 10 + r.vybir([a, -a, 3, 7]);
  const typ = r.chyslo(0, 4);
  const vypadky: [string, string, number, string][] = [
    [`\\frac{x^2 - ${a * a}}{x - ${a}}`, `x + ${a}`, v + a, `x² − ${a * a} = (x − ${a})(x + ${a})`],
    [`\\frac{x^2 - ${a * a}}{x + ${a}}`, `x − ${a}`, v - a, `x² − ${a * a} = (x − ${a})(x + ${a})`],
    [`\\frac{${k}x + ${k * a}}{x + ${a}}`, `${k}`, k, `${k}x + ${k * a} = ${k}(x + ${a})`],
    [`\\frac{x^2 + ${ko(a)}x}{x}`, `x + ${a}`, v + a, `x² + ${ko(a)}x = x(x + ${a})`],
    [`\\frac{x^2 - ${2 * a}x + ${a * a}}{x - ${a}}`, `x − ${a}`, v - a, `x² − ${2 * a}x + ${a * a} = (x − ${a})²`],
  ];
  const [drib, rez, zn, rozklad] = vypadky[typ];
  if ([a, -a, 0].includes(v)) return znachenniaPislia(r);
  return {
    pytannia: `Скороти дріб $${drib}$ і знайди його значення при $x = ${v}$.`,
    vidpovid: ch(zn),
    pidkazka: 'Спершу розклади чисельник на множники.',
    rozviazok: `${rozklad}, тож дріб дорівнює ${rez}. При x = ${v}: ${rez === `${k}` ? `${k}` : `${v} ${rez.includes('+') ? '+' : '−'} ${a} = ${ch(zn)}`}.`,
  };
}

function chyMozhna(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  let b = r.chyslo(1, 9);
  if (b === a) b = a + 1;
  const k = r.chyslo(2, 7);
  const vypadky: [string, boolean, string][] = [
    [`\\frac{x + ${a}}{x + ${b}}`, false, `x, ${a} і ${b} — доданки, спільного множника немає.`],
    [`\\frac{x + ${a}}{${k}x + ${k * a}}`, true, `${k}x + ${k * a} = ${k}(x + ${a}), спільний множник (x + ${a}).`],
    [`\\frac{x^2 + ${a}}{x}`, false, `x² + ${a} не ділиться на x: ${a} — доданок без x.`],
    [`\\frac{x^2 + ${ko(a)}x}{${k}x}`, true, `x² + ${ko(a)}x = x(x + ${a}), спільний множник x.`],
    [`\\frac{${k}a + b}{${k}a}`, false, `${k}a і b — доданки, b не містить множника ${k}a.`],
    [`\\frac{a^2 - b^2}{a - b}`, true, 'a² − b² = (a − b)(a + b), спільний множник (a − b).'],
  ];
  const [drib, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи можна скоротити дріб $${drib}$?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Скорочуються лише спільні множники. Спробуй розкласти чисельник і знаменник на множники.',
    rozviazok: `${tak ? 'Так' : 'Ні'}: ${poiasn}`,
  };
}

function znak(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 12);
  const k = r.chyslo(2, 9);
  let x = r.chyslo(-9, 30);
  if (x === a) x += 1;
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Знайди значення дробу $\\frac{${a} - x}{x - ${a}}$ при $x = ${x}$.`,
      vidpovid: -1,
      pidkazka: `${a} − x = −(x − ${a}).`,
      rozviazok: `${a} − x = −(x − ${a}), тож дріб дорівнює −1 при будь-якому x ≠ ${a}.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Знайди значення дробу $\\frac{${k}x - ${k * a}}{${a} - x}$ при $x = ${x}$.`,
      vidpovid: ch(-k),
      pidkazka: `${k}x − ${k * a} = ${k}(x − ${a}), а ${a} − x = −(x − ${a}).`,
      rozviazok: `${k}(x − ${a}) : (−(x − ${a})) — дріб дорівнює ${ch(-k)} при будь-якому x ≠ ${a}.`,
    };
  }
  return {
    pytannia: `Знайди значення дробу $\\frac{(${a} - x)^2}{(x - ${a})^2}$ при $x = ${x}$.`,
    vidpovid: 1,
    pidkazka: 'Квадрати протилежних чисел рівні.',
    rozviazok: `(${a} − x)² = (x − ${a})², бо квадрати протилежних чисел рівні. Дріб дорівнює 1 при будь-якому x ≠ ${a}.`,
  };
}

function nedopustymiPochatkovoho(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const vypadky: [string, number, string][] = [
    [`\\frac{x^2 - ${a * a}}{x^2 - ${ko(a)}x}`, 2, `x² − ${ko(a)}x = x(x − ${a}) = 0 при x = 0 і x = ${a}`],
    [`\\frac{x + ${a}}{x^2 - ${a * a}}`, 2, `x² − ${a * a} = (x − ${a})(x + ${a}) = 0 при x = ${a} і x = −${a}`],
    [`\\frac{x^2 - ${ko(a)}x}{x}`, 1, 'x = 0 лише при x = 0'],
    [`\\frac{(x - ${a})^2}{x - ${a}}`, 1, `x − ${a} = 0 лише при x = ${a}`],
    [`\\frac{x^2 + ${ko(a)}x}{x^2 + ${a * a}}`, 0, `x² + ${a * a} ≥ ${a * a}, тобто ніколи не дорівнює нулю`],
  ];
  const [drib, n, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Скільки недопустимих значень змінної має дріб $${drib}$?`,
    vidpovid: n,
    pidkazka: 'Шукай у початковому знаменнику — до скорочення.',
    rozviazok: `Знаменник ${poiasn}. Недопустимих значень: ${n}. Після скорочення частина з них «ховається», але не зникає.`,
  };
}

/** Спільний множник (x + p), решта — двочлени або числа; значення в точці v — ціле. */
function skladnyi(r: Vypadok): TrenZavdannia {
  for (let s = 0; ; s++) {
    const p = r.krim(-9, 9, [0]);
    const N: number[] = r.shans() ? [r.krim(-9, 9, [0]), 1] : [r.chyslo(2, 9)];
    const D: number[] = r.shans() ? [r.krim(-9, 9, [0]), 1] : [r.chyslo(2, 5)];
    if (N.length === 1 && D.length === 1) continue;
    if (N.length === 2 && D.length === 2 && N[0] === D[0]) continue;
    if ((N.length === 2 && N[0] === p) || (D.length === 2 && D[0] === p)) continue;
    const v = r.chyslo(-6, 15);
    const dv_ = znachennia(D, v);
    const nv = znachennia(N, v);
    if (v + p === 0 || dv_ === 0 || nv % dv_ !== 0) continue;
    const chys = dobutok([p, 1], N);
    const znam = dobutok([p, 1], D);
    const zapys = (q: number[]) => (q.length === 1 ? `${q[0]}` : `(${tex(q)})`);
    return {
      pytannia: `Скороти дріб $\\frac{${tex(chys)}}{${tex(znam)}}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: ch(nv / dv_),
      pidkazka: `Розклади чисельник і знаменник на множники — спільний множник ${tex([p, 1]).replace(/-/g, '−')}.`,
      rozviazok: `Дріб дорівнює ${zapys(N).replace(/-/g, '−')} : ${zapys(D).replace(/-/g, '−')} після скорочення на ${tex([p, 1]).replace(/-/g, '−')}. При x = ${v}: ${ch(nv)} : ${dv_ < 0 ? `(${ch(dv_)})` : dv_} = ${ch(nv / dv_)}.`,
    };
  }
}

function dviZminni(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(51, 99);
  const b = r.chyslo(11, 49);
  const typ = r.chyslo(0, 3);
  if (typ === 3) {
    const k = r.chyslo(2, 9);
    const [m, n] = [r.chyslo(2, 7), r.chyslo(1, 7)];
    return {
      pytannia: `Знайди значення дробу $\\frac{${k * m}a - ${k * n}b}{${m}a - ${n}b}$ при будь-яких допустимих $a$ і $b$.`,
      vidpovid: k,
      pidkazka: 'Винеси спільний множник у чисельнику.',
      rozviazok: `${k * m}a − ${k * n}b = ${k}(${m}a − ${n}b), тож дріб дорівнює ${k}.`,
    };
  }
  const vypadky: [string, number, string][] = [
    ['\\frac{a^2 - b^2}{a + b}', a - b, `(a − b)(a + b) : (a + b) = a − b = ${a} − ${b} = ${a - b}`],
    ['\\frac{a^2 - b^2}{a - b}', a + b, `(a − b)(a + b) : (a − b) = a + b = ${a} + ${b} = ${a + b}`],
    ['\\frac{a^2 + 2ab + b^2}{a + b}', a + b, `(a + b)² : (a + b) = a + b = ${a} + ${b} = ${a + b}`],
  ];
  const [drib, zn, roz] = vypadky[typ];
  return {
    pytannia: `Скороти дріб $${drib}$ і знайди його значення при $a = ${a}$, $b = ${b}$.`,
    vidpovid: zn,
    pidkazka: 'Застосуй формулу скороченого множення до чисельника.',
    rozviazok: roz.replace(/^\(a − b\)\(a \+ b\) : \(a [+−] b\) = /, (m) => m),
  };
}

export default {
  rivni: ['пропуск, скорочення одночленів, скороти й обчисли', 'чи скорочується, знак, недопустимі значення', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([propusk, skorotyOdnochlen, znachenniaPislia])(r);
    if (riven === 2) return r.vybir([chyMozhna, znak, nedopustymiPochatkovoho, propusk])(r);
    return r.vybir([skladnyi, skladnyi, dviZminni, znachenniaPislia])(r);
  },
} satisfies Henerator;
