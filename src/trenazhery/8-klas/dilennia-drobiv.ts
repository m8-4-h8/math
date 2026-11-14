// Ділення раціональних дробів: множимо ділене на дріб, обернений до дільника; пастка «перевернули ділене»,
// многочлен-дільник іде в знаменник, недопустимі значення (і нуль дільника), задачі на шматки й швидкість.
import { vidpovidDrib, rivnyiDrib, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const PARY = [['a', 'b'], ['x', 'y'], ['m', 'n']];

/** (px/y) : (x/(qy)) = pq. */
function chastka(r: Vypadok): TrenZavdannia {
  const [x, y] = r.vybir(PARY);
  const p = r.chyslo(2, 9);
  const q = r.chyslo(2, 9);
  return {
    pytannia: `Знайди частку $\\frac{${p}${x}}{${y}} : \\frac{${x}}{${q}${y}}$.`,
    vidpovid: p * q,
    pidkazka: `Переверни дільник: ${x}/(${q}${y}) → ${q}${y}/${x}.`,
    rozviazok: `${p}${x} · ${q}${y} над ${y} · ${x} — скорочуємо ${x} і ${y}, лишається ${p} · ${q} = ${p * q}.`,
  };
}

/** (ka²/b) : (a/b²) = kab; значення при a, b. */
function obernenyi(r: Vypadok): TrenZavdannia {
  const [a, b] = r.vybir(PARY);
  const k = r.vybir([1, 1, 2, 3, 4, 5]);
  const u = r.chyslo(2, 9);
  const w = r.chyslo(2, 9);
  const kk = k === 1 ? '' : `${k}`;
  const vidp = k * u * w;
  return {
    pytannia: `Спрости вираз $\\frac{${kk}${a}^2}{${b}} : \\frac{${a}}{${b}^2}$ і знайди його значення при $${a} = ${u}$, $${b} = ${w}$.`,
    vidpovid: vidp,
    pidkazka: `Після перевертання дільника: ${kk}${a}²/${b} · ${b}²/${a}.`,
    rozviazok: `${kk}${a}² · ${b}² над ${b} · ${a} — це ${kk}${a}${b}. При ${a} = ${u}, ${b} = ${w}: ${k === 1 ? '' : `${k} · `}${u} · ${w} = ${vidp}.`,
  };
}

/** Який дріб обернений до (x − a)/k. */
function obernenyiDrib(r: Vypadok): TrenZavdannia {
  const [x] = r.vybir(PARY);
  const a = r.chyslo(1, 9);
  const k = r.chyslo(2, 9);
  const minus = r.shans();
  const z = minus ? '-' : '+';
  const vidp = `$\\frac{${k}}{${x} ${z} ${a}}$`;
  const hybni = [
    `$\\frac{${x} ${z} ${a}}{${k}}$`,
    `$-\\frac{${x} ${z} ${a}}{${k}}$`,
    `$\\frac{${k}}{${x}} ${z} ${a}$`,
  ];
  return {
    pytannia: `Який дріб обернений до дробу $\\frac{${x} ${z} ${a}}{${k}}$?`,
    vidpovid: vidp,
    varianty: r.peremishaty([vidp, ...hybni]),
    pidkazka: 'В оберненому дробі чисельник і знаменник міняються місцями.',
    rozviazok: `Міняємо місцями чисельник ${x} ${minus ? '−' : '+'} ${a} і знаменник ${k}. Добуток дробу й оберненого дорівнює 1.`,
  };
}

/** x/p : x/q = q/p — пастка: перевернули ділене й отримали p/q. */
function pastka(r: Vypadok): TrenZavdannia {
  const x = r.vybir(['x', 'a', 'm']);
  const [p, q] = r.rizni(2, 2, 9);
  const vidp = vidpovidDrib(q, p);
  return {
    pytannia: `Знайди частку $\\frac{${x}}{${p}} : \\frac{${x}}{${q}}$. Відповідь запиши числом або дробом через риску.`,
    vidpovid: vidp,
    perevirka: rivnyiDrib(q, p),
    pidkazka: `Перевертаємо лише дільник: ${x}/${q} → ${q}/${x}.`,
    rozviazok: `${x}/${p} · ${q}/${x} = ${q}/${p}${vidp[0] === `${q}/${p}` ? '' : ` = ${vidp[0]}`}. ${p < q ? 'Ділене більше за дільник' : 'Ділене менше за дільник'}, тож частка ${p < q ? 'більша' : 'менша'} за 1.`,
  };
}

/** (x² − a²)/x : (x − a) = (x + a)/x; значення при x = v, v — дільник a. */
function mnohochlenDilnyk(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(2, 12);
    const v = r.chyslo(1, a - 1);
    if (a % v !== 0) continue;
    const vidp = (v + a) / v;
    return {
      pytannia: `Спрости вираз $\\frac{x^2 - ${a * a}}{x} : (x - ${a})$ і знайди його значення при $x = ${v}$.`,
      vidpovid: vidp,
      pidkazka: `Многочлен-дільник іде в знаменник: (x² − ${a * a}) над x(x − ${a}). Далі x² − ${a * a} = (x − ${a})(x + ${a}).`,
      rozviazok: `(x − ${a})(x + ${a}) над x(x − ${a}): скорочуємо x − ${a}, лишається x + ${a} над x. При x = ${v}: ${v + a} : ${v} = ${vidp}.`,
    };
  }
}

/** Скільки недопустимих значень має p/(x − a) : (x ± b)/(x + c). */
function nedopustymi(r: Vypadok): TrenZavdannia {
  const p = r.chyslo(1, 9);
  const a = r.chyslo(0, 6);
  const b = r.chyslo(1, 6);
  const c = r.chyslo(1, 6);
  const plus = r.shans();
  const nulDilnyka = plus ? -b : b;
  const znachennia = new Set([a, -c, nulDilnyka]);
  const zn1 = a === 0 ? 'x' : `x - ${a}`;
  const ch1 = `x ${plus ? '+' : '-'} ${b}`;
  const ne = (n: number) => `x ≠ ${n < 0 ? '−' : ''}${Math.abs(n)}`;
  const vidp = znachennia.size;
  const spivpadaiut = vidp < 3 ? ' Два з них збігаються, тож рахуємо одне.' : '';
  return {
    pytannia: `Скільки недопустимих значень $x$ має вираз $\\frac{${p}}{${zn1}} : \\frac{${ch1}}{x + ${c}}$?`,
    vidpovid: vidp,
    pidkazka: 'Знаменники обох дробів не нуль, і дільник теж не нуль — тобто його чисельник не нуль.',
    rozviazok: `Знаменники: ${ne(a)}, ${ne(-c)}. Дільник не нуль: ${ne(nulDilnyka)}.${spivpadaiut} Разом ${vidp}.`,
  };
}

/** (x² − a²)/(kx) : (x + a)/(mx²), m = kt: tx(x − a). */
function skladne(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(1, 6);
    const k = r.chyslo(2, 5);
    const t = r.chyslo(1, 3);
    const m = k * t;
    const v = r.chyslo(1, 9);
    if (v === a) continue;
    const vidp = t * v * (v - a);
    const tt = t === 1 ? '' : `${t}`;
    return {
      pytannia: `Спрости вираз $\\frac{x^2 - ${a * a}}{${k}x} : \\frac{x + ${a}}{${m}x^2}$ і знайди його значення при $x = ${v}$.`,
      vidpovid: vidp < 0 ? `−${-vidp}` : vidp,
      pidkazka: `Переверни дільник: · ${m}x²/(x + ${a}). Далі x² − ${a * a} = (x − ${a})(x + ${a}).`,
      rozviazok: `(x − ${a})(x + ${a}) · ${m}x² над ${k}x(x + ${a}) — це ${tt}x(x − ${a}). При x = ${v}: ${t === 1 ? '' : `${t} · `}${v} · ${v - a < 0 ? `(−${a - v})` : v - a} = ${vidp < 0 ? '−' : ''}${Math.abs(vidp)}.`,
    };
  }
}

/** Стрічку a²/p м ріжуть на шматки по a/q м, q = pt: ta шматків. */
function shmatky(r: Vypadok): TrenZavdannia {
  const [shcho, rid] = r.vybir([['Стрічку', 'розрізали'], ['Дріт', 'розрізали'], ['Мотузку', 'розрізали']]);
  const p = r.chyslo(2, 5);
  const t = r.chyslo(2, 4);
  const q = p * t;
  const a = r.chyslo(2, 9);
  return {
    pytannia: `${shcho} довжиною $\\frac{a^2}{${p}}$ м ${rid} на шматки по $\\frac{a}{${q}}$ м. Скільки вийшло шматків при $a = ${a}$?`,
    vidpovid: t * a,
    pidkazka: 'Кількість шматків = довжина : довжина шматка. Переверни дільник.',
    rozviazok: `Перевертаємо дільник: a²/${p} · ${q}/a. Скорочуємо a, а ${q} : ${p} = ${t}, тож ${t}a. При a = ${a}: ${t} · ${a} = ${t * a}, тобто ${skilky(t * a, 'шматок', 'шматки', 'шматків')}.`,
  };
}

/** Човен пройшов (a² − b²)/p км за (a + b)/q год, q = pt: швидкість t(a − b). */
function shvydkist(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(1, 4);
  const d = r.chyslo(2, 7);
  const p = r.chyslo(2, 3);
  const t = r.chyslo(2, 3);
  const q = p * t;
  const a = b + d;
  const vidp = t * d;
  return {
    pytannia: `Човен пройшов $\\frac{x^2 - ${b * b}}{${p}}$ км за $\\frac{x + ${b}}{${q}}$ год. Знайди його швидкість при $x = ${a}$.`,
    vidpovid: vidp,
    odynytsi: 'км/год',
    pidkazka: `Швидкість = відстань : час. x² − ${b * b} = (x − ${b})(x + ${b}).`,
    rozviazok: `(x − ${b})(x + ${b})/${p} · ${q}/(x + ${b}). Скорочуємо x + ${b}, а ${q} : ${p} = ${t}, тож ${t}(x − ${b}). При x = ${a}: ${t} · ${d} = ${vidp} км/год.`,
  };
}

export default {
  rivni: ['як у прикладі', 'пастки й многочлени', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([chastka, obernenyi, obernenyiDrib])(r);
    if (riven === 2) return r.vybir([pastka, mnohochlenDilnyk, nedopustymi, pastka])(r);
    return r.vybir([skladne, shmatky, shvydkist, nedopustymi])(r);
  },
} satisfies Henerator;
