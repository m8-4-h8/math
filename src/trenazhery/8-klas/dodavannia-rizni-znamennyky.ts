// Додавання і віднімання раціональних дробів з різними знаменниками: найпростіший спільний знаменник, додатковий
// множник, число в квадратику, «чи правильна рівність» (не додаємо знаменники), знаменники-многочлени (різниця
// квадратів, винесення множника), ціле мінус дріб, задачі на спільну роботу.
import { ch, nsd, nsk, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const TN = ['Так', 'Ні'];
const BUKVA = ['x', 'a', 'y', 'm'];

function spilnyi(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVA);
  for (;;) {
    const a = r.chyslo(2, 12);
    const b = r.chyslo(2, 12);
    const L = nsk(a, b);
    if (a === b || L === a * b || L === Math.max(a, b)) continue;
    return {
      pytannia: `Найпростіший спільний знаменник дробів $\\frac{1}{${a}${x}}$ і $\\frac{1}{${b}${x}}$ — це $k${x}$. Знайди $k$.`,
      vidpovid: L,
      pidkazka: `Число k — найменше спільне кратне ${a} і ${b}.`,
      rozviazok: `НСК(${a}; ${b}) = ${L}, тож спільний знаменник ${L}${x}. Добуток ${a * b}${x} теж підходить, але він не найпростіший.`,
    };
  }
}

function dodatkovyi(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVA);
  for (;;) {
    const a = r.chyslo(2, 12);
    const b = r.chyslo(2, 12);
    const L = nsk(a, b);
    if (a === b || L === a) continue;
    const p = r.chyslo(1, 9);
    return {
      pytannia: `Спільний знаменник дробів $\\frac{${p}}{${a}${x}}$ і $\\frac{1}{${b}${x}}$ — $${L}${x}$. На яке число треба помножити чисельник першого дробу?`,
      vidpovid: L / a,
      pidkazka: `Додатковий множник — це ${L}${x} : ${a}${x}.`,
      rozviazok: `${L} : ${a} = ${L / a}, тож додатковий множник ${L / a}, а чисельник стає ${p} · ${L / a} = ${p * (L / a)}.`,
    };
  }
}

function kvadratyk(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVA);
  for (;;) {
    const a = r.chyslo(2, 10);
    const b = r.chyslo(2, 10);
    if (a === b) continue;
    const L = nsk(a, b);
    const p = r.chyslo(1, 9);
    const q = r.chyslo(1, 9);
    const plus = r.shans();
    const n = plus ? p * (L / a) + q * (L / b) : p * (L / a) - q * (L / b);
    if (n <= 0 || nsd(p, a) !== 1 || nsd(q, b) !== 1) continue;
    return {
      pytannia: 'Яке число треба вписати в квадратик?',
      vyraz: `$\\frac{${p}}{${a}${x}} ${plus ? '+' : '-'} \\frac{${q}}{${b}${x}} = \\frac{\\square}{${L}${x}}$`,
      vidpovid: n,
      pidkazka: `Додаткові множники: ${L} : ${a} = ${L / a} і ${L} : ${b} = ${L / b}.`,
      rozviazok: `Чисельник ${p} · ${L / a} ${plus ? '+' : '−'} ${q} · ${L / b} = ${n}.`,
    };
  }
}

/** Чи правильна рівність: пастки «додати чисельники й знаменники» та правильні записи. */
function chyPravylno(r: Vypadok): TrenZavdannia {
  const [x, y] = r.vybir([['x', 'y'], ['a', 'b'], ['m', 'n']]);
  const p = r.chyslo(1, 7);
  const q = r.chyslo(1, 7);
  const k = (n: number) => (n === 1 ? '' : `${n}`);
  const vypadky: [string, boolean, string][] = [
    [`\\frac{${p}}{${x}} + \\frac{${q}}{${y}} = \\frac{${p + q}}{${x} + ${y}}`, false, `Додавати знаменники не можна. Правильно: (${k(p)}${y} + ${k(q)}${x}) : ${x}${y}.`],
    [`\\frac{${p}}{${x}} + \\frac{${q}}{${y}} = \\frac{${k(p)}${y} + ${k(q)}${x}}{${x}${y}}`, true, `Спільний знаменник ${x}${y}, додаткові множники ${y} і ${x}.`],
    [`\\frac{${p}}{${x}} + \\frac{${q}}{${y}} = \\frac{${p + q}}{${x}${y}}`, false, `Чисельники теж треба помножити на додаткові множники: (${k(p)}${y} + ${k(q)}${x}) : ${x}${y}.`],
    [`\\frac{${p}}{${x}} - \\frac{${q}}{${y}} = \\frac{${k(p)}${y} - ${k(q)}${x}}{${x}${y}}`, true, `Спільний знаменник ${x}${y}, додаткові множники ${y} і ${x}.`],
    [`${x} + \\frac{${p}}{${x}} = \\frac{${x}^2 + ${p}}{${x}}`, true, `${x} = ${x}² : ${x}, тож ${x}² + ${p} над ${x}.`],
    [`${x} + \\frac{${p}}{${x}} = \\frac{${x} + ${p}}{${x}}`, false, `Ціле ${x} треба записати зі знаменником ${x}: це ${x}² : ${x}. Правильно: (${x}² + ${p}) : ${x}.`],
  ];
  const [rivnist, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильна рівність $${rivnist}$?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: `Перевір на числах, наприклад ${x} = 1, ${y} = 2.`,
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** k/(x − a) − 2ak/(x² − a²) = k/(x + a); значення при x = v ціле. */
function riznytsiaKvadrativ(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(1, 6);
    const t = r.krim(-4, 5, [0]);
    const s = r.krim(-9, 9, [0]);
    const v = s - a;
    if (v === a || v === -a) continue;
    const k = t * s;
    if (k <= 0 || k > 40) continue;
    return {
      pytannia: `Спрости вираз $\\frac{${k}}{x - ${a}} - \\frac{${2 * a * k}}{x^2 - ${a * a}}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: ch(t),
      pidkazka: `x² − ${a * a} = (x − ${a})(x + ${a}). Додатковий множник першого дробу — x + ${a}.`,
      rozviazok: `Чисельник ${k}(x + ${a}) − ${2 * a * k} = ${k}x − ${a * k} = ${k}(x − ${a}), тож вираз дорівнює ${k} : (x + ${a}). При x = ${ch(v)}: ${k} : ${s < 0 ? `(${ch(s)})` : s} = ${ch(t)}.`,
    };
  }
}

/** p/x − pa/(x² + ax) = p/(x + a). */
function vynesennia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(1, 9);
    const t = r.chyslo(1, 6);
    const v = r.chyslo(1, 15);
    const s = v + a;
    const p = t * s;
    if (p > 60 || v === a) continue;
    return {
      pytannia: `Спрости вираз $\\frac{${p}}{x} - \\frac{${p * a}}{x^2 + ${a}x}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: t,
      pidkazka: `x² + ${a}x = x(x + ${a}). Додатковий множник першого дробу — x + ${a}.`,
      rozviazok: `Чисельник ${p}(x + ${a}) − ${p * a} = ${p}x, тож вираз дорівнює ${p}x : (x(x + ${a})) = ${p} : (x + ${a}). При x = ${v}: ${p} : ${s} = ${t}.`,
    };
  }
}

function dodatkovyiMnohochlen(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const p = r.chyslo(2, 9);
  const typ = r.chyslo(0, 2);
  const vypadky: [string, string, string, string[]][] = [
    [`x(x - ${a})`, `\\frac{${p}}{x - ${a}}`, 'x', [`$x$`, `$x - ${a}$`, `$${p}$`]],
    [`x(x - ${a})`, `\\frac{${p}}{x}`, `x - ${a}`, [`$x$`, `$x - ${a}$`, `$${p}x$`]],
    [`(x - ${a})(x + ${a})`, `\\frac{${p}}{x + ${a}}`, `x - ${a}`, [`$x - ${a}$`, `$x + ${a}$`, `$x^2 - ${a * a}$`]],
  ];
  const [zn, drib, vidp, varianty] = vypadky[typ];
  return {
    pytannia: `Спільний знаменник — $${zn}$. Який додатковий множник у дробу $${drib}$?`,
    vidpovid: `$${vidp}$`,
    varianty: r.peremishaty(varianty),
    pidkazka: 'Чого бракує знаменнику цього дробу до спільного?',
    rozviazok: `У спільному знаменнику ${zn.replace(/-/g, '−')} вже є знаменник дробу, бракує множника ${vidp.replace(/-/g, '−')}.`,
  };
}

/** x − (x² − c)/x = c/x. */
function tsileMinusDrib(r: Vypadok): TrenZavdannia {
  for (;;) {
    const v = r.chyslo(1, 12);
    const t = r.chyslo(1, 9);
    const c = t * v;
    if (c > 60) continue;
    const plus = r.shans();
    if (plus) {
      // (x² + c)/x − x = c/x
      return {
        pytannia: `Спрости вираз $\\frac{x^2 + ${c}}{x} - x$ і знайди його значення при $x = ${v}$.`,
        vidpovid: t,
        pidkazka: 'Запиши x як дріб зі знаменником x: x = x²/x.',
        rozviazok: `(x² + ${c} − x²) : x = ${c} : x. При x = ${v}: ${c} : ${v} = ${t}.`,
      };
    }
    return {
      pytannia: `Спрости вираз $x - \\frac{x^2 - ${c}}{x}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: t,
      pidkazka: 'x = x²/x. Віднімаємо весь чисельник — він у дужках.',
      rozviazok: `(x² − (x² − ${c})) : x = ${c} : x. При x = ${v}: ${c} : ${v} = ${t}.`,
    };
  }
}

/** Спільна робота: 1/x + 1/(kx) = (k + 1)/(kx); разом — kx/(k + 1) год. */
function robota(r: Vypadok): TrenZavdannia {
  const [khto, shcho] = r.vybir([
    ['Перша труба наповнює басейн', 'наповнять басейн'],
    ['Мама прибирає квартиру', 'приберуть квартиру'],
    ['Перший принтер друкує тираж', 'надрукують тираж'],
  ]);
  const k = r.chyslo(2, 4);
  const m = r.chyslo(1, 4);
  const x = (k + 1) * m;
  const druhyi = khto.startsWith('Мама') ? 'син' : khto.startsWith('Перша') ? 'друга' : 'другий';
  const vidp = k * m;
  return {
    pytannia: `${khto} за x год, а ${druhyi} — за ${k}x год. За скільки годин вони ${shcho} разом, якщо x = ${x}?`,
    vidpovid: vidp,
    odynytsi: 'год',
    pidkazka: `За 1 год разом: 1/x + 1/(${k}x). Спільний знаменник ${k}x.`,
    rozviazok: `За годину разом ${k}/(${k}x) + 1/(${k}x) = ${k + 1}/(${k}x) роботи. При x = ${x}: ${k + 1}/${k * x}, тож уся робота — за ${k * x} : ${k + 1} = ${vidp} год.`,
  };
}

export default {
  rivni: ['спільний знаменник', 'многочлени й пастки', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([spilnyi, dodatkovyi, kvadratyk, kvadratyk])(r);
    if (riven === 2) return r.vybir([chyPravylno, dodatkovyiMnohochlen, vynesennia, riznytsiaKvadrativ])(r);
    return r.vybir([riznytsiaKvadrativ, vynesennia, tsileMinusDrib, robota])(r);
  },
} satisfies Henerator;
