// Раціональні рівняння: дріб дорівнює нулю (чисельник нуль, знаменник — ні), пропорція, однакові знаменники,
// сторонні корені й рівняння без коренів («скільки коренів», «чи є число коренем»), задачі на рух і спільну роботу.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const TN = ['Так', 'Ні'];
/** x − a або x + a для запису в TeX і тексті. */
const tex = (a: number) => (a === 0 ? 'x' : a > 0 ? `x - ${a}` : `x + ${-a}`);
const tx = (a: number) => (a === 0 ? 'x' : a > 0 ? `x − ${a}` : `x + ${-a}`);

/** (x − a)/(x − b) = 0 → x = a. */
function dribNul(r: Vypadok): TrenZavdannia {
  const a = r.krim(-9, 9, [0]);
  const b = r.krim(-9, 9, [a]);
  return {
    pytannia: 'Розв\'яжи рівняння.',
    vyraz: `$\\frac{${tex(a)}}{${tex(b)}} = 0$`,
    nevidome: '$x$',
    vidpovid: ch(a),
    pidkazka: 'Дріб дорівнює нулю, коли чисельник нуль, а знаменник — ні.',
    rozviazok: `${tx(a)} = 0, тож x = ${ch(a)}. Знаменник при цьому не нуль, корінь підходить.`,
  };
}

/** kx − m над (x + c) = 0 → x = m/k. */
function liniinyiChyselnyk(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 9);
  const v = r.krim(-9, 9, [0]);
  const m = k * v;
  const c = r.krim(-9, 9, [-v, 0]);
  const zn = c > 0 ? `x + ${c}` : `x - ${-c}`;
  return {
    pytannia: 'Розв\'яжи рівняння.',
    vyraz: `$\\frac{${k}x ${m > 0 ? '-' : '+'} ${Math.abs(m)}}{${zn}} = 0$`,
    nevidome: '$x$',
    vidpovid: ch(v),
    pidkazka: 'Прирівняй чисельник до нуля.',
    rozviazok: `${k}x ${m > 0 ? '−' : '+'} ${Math.abs(m)} = 0, тож x = ${ch(v)}. Знаменник при цьому не нуль.`,
  };
}

/** p/x = q/(x + c) → p(x + c) = qx → x = v. */
function proportsiia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const p = r.chyslo(1, 9);
    const e = r.chyslo(1, 9);
    const q = p + e;
    const v = r.chyslo(1, 12);
    if ((e * v) % p !== 0) continue;
    const c = (e * v) / p;
    if (c > 20) continue;
    return {
      pytannia: 'Розв\'яжи рівняння.',
      vyraz: `$\\frac{${p}}{x} = \\frac{${q}}{x + ${c}}$`,
      nevidome: '$x$',
      vidpovid: v,
      pidkazka: `Основна властивість пропорції: ${p}(x + ${c}) = ${q}x.`,
      rozviazok: `${p === 1 ? '' : p}x + ${p * c} = ${q}x, тож ${e === 1 ? `x = ${p * c}` : `${e}x = ${p * c}, x = ${v}`}. Знаменники ${v} і ${v + c} не нуль.`,
    };
  }
}

/** (x² − a²)/(x − a) = 0 → лише −a; (x² − ax)/(x − a) = 0 → лише 0. */
function storonnii(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  if (r.shans()) {
    return {
      pytannia: 'Розв\'яжи рівняння.',
      vyraz: `$\\frac{x^2 - ${a * a}}{x - ${a}} = 0$`,
      nevidome: '$x$',
      vidpovid: ch(-a),
      pidkazka: `x² − ${a * a} = (x − ${a})(x + ${a}). Одне з двох чисел обнуляє знаменник.`,
      rozviazok: `Чисельник нуль при x = ${a} і при x = −${a}. При x = ${a} знаменник теж нуль — це сторонній корінь. Відповідь: −${a}.`,
    };
  }
  return {
    pytannia: 'Розв\'яжи рівняння.',
    vyraz: `$\\frac{x^2 - ${a}x}{x - ${a}} = 0$`,
    nevidome: '$x$',
    vidpovid: 0,
    pidkazka: `x² − ${a}x = x(x − ${a}). Котрий множник можна прирівняти до нуля?`,
    rozviazok: `Чисельник x(x − ${a}) нуль при x = 0 і при x = ${a}. Але x = ${a} обнуляє знаменник — сторонній корінь. Відповідь: 0.`,
  };
}

/** Скільки коренів: 0 (чисельник — число або той самий множник), 1 (сторонній відкинули) чи 2. */
function skilkyKoreniv(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const b = r.krim(1, 9, [a]);
  const p = r.chyslo(1, 9);
  const vypadky: [string, number, string][] = [
    [`\\frac{${p}}{x - ${a}} = 0`, 0, `Чисельник ${p} ніколи не дорівнює нулю.`],
    [`\\frac{x - ${a}}{x - ${a}} = 0`, 0, `Чисельник нуль лише при x = ${a}, але тоді й знаменник нуль.`],
    [`\\frac{x^2 - ${a * a}}{x - ${a}} = 0`, 1, `Чисельник нуль при x = ±${a}, але x = ${a} обнуляє знаменник. Лишається один корінь.`],
    [`\\frac{(x - ${a})(x + ${b})}{x - ${b}} = 0`, 2, `Чисельник нуль при x = ${a} і x = −${b}, знаменник при цьому не нуль. Два корені.`],
    [`\\frac{(x - ${a})(x - ${b})}{x - ${b}} = 0`, 1, `Чисельник нуль при x = ${a} і x = ${b}, але x = ${b} обнуляє знаменник. Один корінь.`],
  ];
  const [rivn, vidp, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Скільки коренів має рівняння $${rivn}$?`,
    vidpovid: vidp,
    pidkazka: 'Знайди, коли чисельник нуль, і відкинь числа, що обнуляють знаменник.',
    rozviazok: poiasn,
  };
}

/** Чи є число коренем рівняння. */
function chyKorin(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const b = r.krim(1, 9, [a]);
  const vypadky: [string, number, boolean, string][] = [
    [`\\frac{x^2 - ${a * a}}{x - ${a}} = 0`, a, false, `При x = ${a} знаменник нуль, дріб не має змісту.`],
    [`\\frac{x^2 - ${a * a}}{x - ${a}} = 0`, -a, true, `Чисельник ${a * a} − ${a * a} = 0, знаменник −${2 * a} не нуль.`],
    [`\\frac{x - ${a}}{x + ${b}} = 0`, a, true, `Чисельник нуль, знаменник ${a + b} не нуль.`],
    [`\\frac{x - ${a}}{x + ${b}} = 0`, -b, false, `При x = −${b} знаменник нуль — це недопустиме значення, а не корінь.`],
  ];
  const [rivn, chyslo, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи є число $${chyslo < 0 ? `-${-chyslo}` : chyslo}$ коренем рівняння $${rivn}$?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Підстав число і в чисельник, і в знаменник.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** (x + p)/(x − a) = q/(x − a): корінь q − p, якщо він не дорівнює a. */
function odnakoviZnamennyky(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  const p = r.chyslo(1, 9);
  if (r.shans()) {
    // корінь збігається з a — коренів немає
    const q = a + p;
    return {
      pytannia: `Скільки коренів має рівняння $\\frac{x + ${p}}{x - ${a}} = \\frac{${q}}{x - ${a}}$?`,
      vidpovid: 0,
      pidkazka: 'Прирівняй чисельники, а потім перевір знаменник.',
      rozviazok: `x + ${p} = ${q}, тож x = ${a}. Але при x = ${a} знаменник нуль — коренів немає.`,
    };
  }
  const v = r.krim(-9, 12, [a]);
  const q = v + p;
  return {
    pytannia: 'Розв\'яжи рівняння.',
    vyraz: `$\\frac{x + ${p}}{x - ${a}} = \\frac{${q < 0 ? `-${-q}` : q}}{x - ${a}}$`,
    nevidome: '$x$',
    vidpovid: ch(v),
    pidkazka: 'Знаменники однакові — прирівняй чисельники, а потім перевір знаменник.',
    rozviazok: `x + ${p} = ${ch(q)}, тож x = ${ch(v)}. Знаменник при цьому не нуль.`,
  };
}

/** Пішохід a км, велосипедист b км за той самий час; швидкість більша на d: a/x = b/(x + d). */
function rukh(r: Vypadok): TrenZavdannia {
  for (;;) {
    const v = r.chyslo(3, 6);
    const t2 = r.chyslo(1, 4);
    const a = v * t2;
    const d = r.chyslo(4, 14);
    const b = (v + d) * t2;
    return {
      pytannia: `Пішохід пройшов ${a} км, а велосипедист за той самий час проїхав ${b} км. Швидкість велосипедиста на ${d} км/год більша. Знайди швидкість пішохода з рівняння $\\frac{${a}}{x} = \\frac{${b}}{x + ${d}}$.`,
      vidpovid: v,
      odynytsi: 'км/год',
      pidkazka: `Основна властивість пропорції: ${a}(x + ${d}) = ${b}x.`,
      rozviazok: `${a}x + ${a * d} = ${b}x, тож ${b - a}x = ${a * d}, x = ${v} км/год. Перевірка: ${a} : ${v} = ${t2} год і ${b} : ${v + d} = ${t2} год.`,
    };
  }
}

/** Труби: 1/x + 1/(kx) = 1/t → x = t(k + 1)/k. */
function truby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const k = r.chyslo(2, 4);
    const t = r.chyslo(1, 12);
    if ((t * (k + 1)) % k !== 0) continue;
    const x = (t * (k + 1)) / k;
    return {
      pytannia: `Перша труба наповнює басейн за $x$ год, друга — за $${k}x$ год, а разом — за ${t} год. Розв'яжи рівняння $\\frac{1}{x} + \\frac{1}{${k}x} = \\frac{1}{${t}}$ і знайди $x$.`,
      vidpovid: x,
      odynytsi: 'год',
      pidkazka: `Спільний знаменник ${k}x: ліва частина дорівнює ${k + 1}/(${k}x).`,
      rozviazok: `${k + 1}/(${k}x) = 1/${t}, тож ${k}x = ${k + 1} · ${t} = ${(k + 1) * t}, x = ${(k + 1) * t} : ${k} = ${x} год.`,
    };
  }
}

export default {
  rivni: ['дріб дорівнює нулю', 'сторонні корені', 'пропорції й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([dribNul, liniinyiChyselnyk, proportsiia])(r);
    if (riven === 2) return r.vybir([storonnii, skilkyKoreniv, chyKorin, odnakoviZnamennyky])(r);
    return r.vybir([proportsiia, rukh, truby, odnakoviZnamennyky])(r);
  },
} satisfies Henerator;
