// Раціональні вирази: цілий чи дробовий вираз, значення дробу, недопустиме значення змінної (знаменник = 0),
// скільки недопустимих значень, сума недопустимих значень, коли дріб дорівнює нулю (і пастка, коли чисельник
// і знаменник дорівнюють нулю разом), дріб у задачі на рух.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tex } from '../alhebra.ts';

const VYDY = ['цілий', 'дробовий'];
/** Двочлен x + b (або kx + b) для формули: [b, k]. */
const dv = (k: number, b: number, x = 'x') => tex([b, k], x);

function tsilyiChyDrobovyi(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const b = r.krim(-9, 9, [0]);
  const k = r.chyslo(2, 9);
  const x = r.vybir(['x', 'a', 'y', 'm']);
  const drobovyi = r.shans();
  const vyraz = drobovyi
    ? r.vybir([
        `\\frac{${k}}{${dv(1, b, x)}}`,
        `${x} + \\frac{${k}}{${x}}`,
        `\\frac{${dv(a, b, x)}}{${x}^2}`,
        `\\frac{${dv(1, b, x)}}{${dv(a, k, x)}}`,
        `\\frac{${x}^2}{${k}${x}}`,
      ])
    : r.vybir([
        `\\frac{${dv(a, b, x)}}{${k}}`,
        `${tex([b, -k, a], x)}`,
        `\\frac{${x}}{${k}} + ${a}`,
        `\\frac{${x}^2 - ${k}}{${a}}`,
        `(${dv(1, b, x)}) : ${k}`,
      ]);
  return {
    pytannia: `Який це вираз: $${vyraz}$?`,
    vidpovid: VYDY[drobovyi ? 1 : 0],
    varianty: VYDY,
    pidkazka: 'Чи є ділення на вираз зі змінною? Ділення лише на число вираз дробовим не робить.',
    rozviazok: drobovyi ? `Є ділення на вираз зі змінною ${x} — вираз дробовий.` : `Ділимо лише на число (або не ділимо зовсім) — вираз цілий.`,
  };
}

function znachennia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const x = r.chyslo(-6, 8);
    const c = r.chyslo(1, 3);
    const d = r.krim(-9, 9, [0]);
    const zn = c * x + d;
    if (zn === 0 || Math.abs(zn) > 12) continue;
    const q = r.krim(-6, 8, [0]);
    const a = r.krim(1, 5, []);
    const b = q * zn - a * x;
    if (Math.abs(b) > 40) continue;
    const ch_ = a * x + b;
    return {
      pytannia: `Знайди значення дробу $\\frac{${dv(a, b)}}{${dv(c, d)}}$ при $x = ${x}$.`,
      vidpovid: ch(q),
      pidkazka: 'Порахуй окремо чисельник і знаменник, потім поділи.',
      rozviazok: `Чисельник: ${a === 1 ? '' : `${a} · `}${x < 0 ? `(${ch(x)})` : x} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${ch(ch_)}. Знаменник: ${c === 1 ? '' : `${c} · `}${x < 0 ? `(${ch(x)})` : x} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${ch(zn)}. Дріб: ${ch(ch_)} : ${zn < 0 ? `(${ch(zn)})` : zn} = ${ch(q)}.`,
    };
  }
}

function nedopustyme(r: Vypadok): TrenZavdannia {
  const korin = r.krim(-12, 12, [0]);
  const c = r.vybir([1, 1, 2, 3, 4]);
  const d = -c * korin;
  const k = r.krim(-9, 9, [0]);
  const chys = r.shans() ? `${k}` : dv(r.chyslo(1, 5), r.krim(-9, 9, [0]));
  return {
    pytannia: `При якому значенні $x$ дріб $\\frac{${chys}}{${dv(c, d)}}$ не має змісту?`,
    vidpovid: ch(korin),
    nevidome: '$x$',
    pidkazka: 'Дріб не має змісту, коли знаменник дорівнює нулю.',
    rozviazok:
      c === 1
        ? `Знаменник дорівнює нулю: ${tex([d, 1]).replace(/-/g, '−')} = 0, тож x дорівнює ${ch(korin)}.`
        : `Знаменник дорівнює нулю: ${c}x = ${ch(-d)}, тож x дорівнює ${ch(-d)} : ${c} = ${ch(korin)}.`,
  };
}

function skilkyNedopustymykh(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const b = r.chyslo(1, 9);
  const k = r.chyslo(1, 9);
  const vypadky: [string, number, string][] = [
    [`x^2 + ${a * a}`, 0, `x² ≥ 0, тож x² + ${a * a} ≥ ${a * a} — знаменник ніколи не дорівнює нулю.`],
    [`x^2 - ${a * a}`, 2, `x² − ${a * a} = (x − ${a})(x + ${a}) = 0 при x = ${a} і x = −${a}.`],
    [`x(x - ${b})`, 2, `x(x − ${b}) = 0 при x = 0 і x = ${b}.`],
    [`(x + ${b})^2`, 1, `(x + ${b})² = 0 лише при x = −${b}.`],
    [`${k + 1}`, 0, `Знаменник — число ${k + 1}, він не дорівнює нулю: вираз цілий.`],
    [`(x - ${a})(x + ${b + 10})`, 2, `(x − ${a})(x + ${b + 10}) = 0 при x = ${a} і x = −${b + 10}.`],
    [`x^2`, 1, 'x² = 0 лише при x = 0.'],
  ];
  const [znam, n, poiasn] = r.vybir(vypadky);
  const chys = r.vybir([...(/x/.test(znam) ? ['1'] : []), `x + ${k}`, `${k}x`, `x^2 - ${k}`]);
  return {
    pytannia: `Скільки недопустимих значень змінної має дріб $\\frac{${chys}}{${znam}}$?`,
    vidpovid: n,
    pidkazka: 'Недопустимі значення — ті, при яких знаменник дорівнює нулю. Скільки таких x?',
    rozviazok: `${poiasn} Недопустимих значень: ${n}.`,
  };
}

function sumaNedopustymykh(r: Vypadok): TrenZavdannia {
  const a = r.krim(-9, 9, [0]);
  let b = r.krim(-9, 9, [0]);
  if (b === a) b = a === 9 ? -9 : a + 1;
  const mn = (v: number) => `(x ${v < 0 ? '+' : '-'} ${Math.abs(v)})`;
  return {
    pytannia: `Знайди суму недопустимих значень змінної дробу $\\frac{${r.chyslo(1, 9)}}{${mn(a)}${mn(b)}}$.`,
    vidpovid: ch(a + b),
    pidkazka: 'Добуток дорівнює нулю, коли один з множників дорівнює нулю.',
    rozviazok: `Знаменник дорівнює нулю при x = ${ch(a)} і x = ${ch(b)}. Сума: ${ch(a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${ch(a + b)}.`,
  };
}

function nulChyNemaie(r: Vypadok): TrenZavdannia {
  const a = r.krim(-9, 9, [0]);
  let b = r.krim(-9, 9, [0]);
  if (b === -a) b = -a + 1 || 1;
  const VAR = ['дорівнює нулю', 'не має змісту', 'дорівнює одиниці'];
  const chys = dv(1, -a);
  const znam = dv(1, b);
  const vNul = r.shans();
  const x = vNul ? a : -b;
  return {
    pytannia: `Що можна сказати про дріб $\\frac{${chys}}{${znam}}$ при $x = ${x}$?`,
    vidpovid: vNul ? VAR[0] : VAR[1],
    varianty: VAR,
    pidkazka: 'Підстав x окремо в чисельник і в знаменник.',
    rozviazok: vNul
      ? `Чисельник: ${ch(x)} ${a < 0 ? '+' : '−'} ${Math.abs(a)} = 0, знаменник: ${ch(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${ch(x + b)} — не нуль. Дріб дорівнює нулю.`
      : `Знаменник: ${ch(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = 0, а на нуль ділити не можна. Дріб не має змісту.`,
  };
}

function dribNul(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const a = r.chyslo(1, 9);
  if (typ === 0) {
    let b = r.krim(-9, 9, [0]);
    const c = r.krim(-9, 9, [0]);
    if (b === c) b = c === 9 ? -9 : c + 1;
    return {
      pytannia: `При якому значенні $x$ дріб $\\frac{${dv(1, -b)}}{${dv(1, -c)}}$ дорівнює нулю?`,
      vidpovid: ch(b),
      nevidome: '$x$',
      pidkazka: 'Чисельник має дорівнювати нулю, а знаменник — ні.',
      rozviazok: `Чисельник дорівнює нулю при x = ${ch(b)}. Знаменник при цьому: ${ch(b)} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${ch(b - c)} — не нуль.`,
    };
  }
  if (typ === 1) {
    const znak = r.shans();
    return {
      pytannia: `При якому значенні $x$ дріб $\\frac{x^2 - ${a * a}}{x ${znak ? '-' : '+'} ${a}}$ дорівнює нулю?`,
      vidpovid: ch(znak ? -a : a),
      nevidome: '$x$',
      pidkazka: 'Чисельник дорівнює нулю при двох значеннях x. Перевір, чи не стає нулем знаменник.',
      rozviazok: `x² − ${a * a} = 0 при x = ${a} і x = −${a}. Але при x = ${znak ? a : `−${a}`} знаменник теж нуль — там дріб не має змісту. Лишається x = ${ch(znak ? -a : a)}.`,
    };
  }
  return {
    pytannia: `При якому значенні $x$ дріб $\\frac{x^2 - ${a}x}{x - ${a}}$ дорівнює нулю?`,
    vidpovid: 0,
    nevidome: '$x$',
    pidkazka: 'Розклади чисельник: x² − ' + a + 'x = x(x − ' + a + '). Який з коренів не підходить?',
    rozviazok: `x(x − ${a}) = 0 при x = 0 і x = ${a}. При x = ${a} знаменник нуль — не підходить. Лишається x = 0.`,
  };
}

function rukh(r: Vypadok): TrenZavdannia {
  const t = r.chyslo(1, 4);
  const v = r.chyslo(t + 4, 30);
  const typ = r.chyslo(0, 2);
  if (typ === 2) {
    const s = r.chyslo(2, 9) * 6;
    return {
      pytannia: `Власна швидкість човна — $x$ км/год, швидкість течії — ${t} км/год. Проти течії він пройшов ${s} км за $\\frac{${s}}{x - ${t}}$ год. Яке значення $x$ для цього виразу недопустиме?`,
      vidpovid: t,
      nevidome: '$x$',
      pidkazka: 'Коли знаменник x − ' + t + ' дорівнює нулю?',
      rozviazok: `x − ${t} = 0 при x = ${t}. За змістом: з такою власною швидкістю човен стоїть на місці відносно берега і проти течії не просунеться.`,
    };
  }
  const zaTechiieiu = typ === 0;
  const shv = zaTechiieiu ? v + t : v - t;
  const chas = r.chyslo(2, 6);
  const s = shv * chas;
  return {
    pytannia: `Власна швидкість човна — $x$ км/год, швидкість течії — ${t} км/год. ${zaTechiieiu ? 'За течією' : 'Проти течії'} він пройшов ${s} км. Час у дорозі — $\\frac{${s}}{x ${zaTechiieiu ? '+' : '-'} ${t}}$ год. Знайди час при $x = ${v}$.`,
    vidpovid: chas,
    odynytsi: 'год',
    pidkazka: zaTechiieiu ? 'За течією швидкості додаються.' : 'Проти течії від власної швидкості віднімаємо швидкість течії.',
    rozviazok: `${v} ${zaTechiieiu ? '+' : '−'} ${t} = ${shv} км/год, ${s} : ${shv} = ${chas} год.`,
  };
}

function dviZminni(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(-9, 12);
    const b = r.krim(-9, 12, [a]);
    const s = a + b;
    const d = a - b;
    if (s % d !== 0) continue;
    return {
      pytannia: `Знайди значення дробу $\\frac{a + b}{a - b}$ при $a = ${a}$, $b = ${b}$.`,
      vidpovid: ch(s / d),
      pidkazka: 'Порахуй окремо суму і різницю.',
      rozviazok: `Чисельник: ${ch(a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${ch(s)}, знаменник: ${ch(a)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${ch(d)}. Дріб: ${ch(s)} : ${d < 0 ? `(${ch(d)})` : d} = ${ch(s / d)}.`,
    };
  }
}

export default {
  rivni: ['цілий чи дробовий, значення, недопустиме x', 'скільки недопустимих, нуль чи без змісту', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([tsilyiChyDrobovyi, znachennia, nedopustyme])(r);
    if (riven === 2) return r.vybir([skilkyNedopustymykh, sumaNedopustymykh, nulChyNemaie, nedopustyme])(r);
    return r.vybir([dribNul, dribNul, rukh, dviZminni])(r);
  },
} satisfies Henerator;
