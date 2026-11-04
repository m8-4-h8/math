// Функція: кожному x — одне y; значення функції за формулою (підставляємо x, від’ємне — в дужках);
// аргумент за значенням (розв’язуємо рівняння); область визначення (знаменник не дорівнює нулю).
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tex, tvd, tz, znachennia, type Mnohochlen } from '../alhebra.ts';

function liniina(r: Vypadok): Mnohochlen {
  return [r.krim(-9, 9, [0]), r.krim(-6, 6, [0])];
}

function znachenniaF(r: Vypadok, kvadratna: boolean): TrenZavdannia {
  const p: Mnohochlen = kvadratna ? [r.krim(-9, 9, [0]), r.vybir([0, 0, r.krim(-4, 4, [0])]), r.vybir([1, 1, -1, 2])] : liniina(r);
  const x = r.krim(-6, 6, [0]);
  const y = znachennia(p, x);
  return {
    pytannia: `$y = ${tex(p)}$. Знайди $y(${tz(x)})$.`,
    vidpovid: ch(y),
    pidkazka: `Підстав x = ${ch(x)} у формулу${x < 0 ? ' — у дужках' : ''}.`,
    rozviazok: kvadratna
      ? `${ch(p[2])} · ${tvd(x)}² ${p[1] ? `+ ${tvd(p[1])} · ${tvd(x)} ` : ''}+ ${tvd(p[0])} = ${ch(p[2] * x * x)} ${p[1] ? `+ ${tvd(p[1] * x)} ` : ''}+ ${tvd(p[0])} = ${ch(y)}`
      : `${ch(p[1])} · ${tvd(x)} + ${tvd(p[0])} = ${ch(p[1] * x)} + ${tvd(p[0])} = ${ch(y)}`,
  };
}

function arhument(r: Vypadok): TrenZavdannia {
  const p = liniina(r);
  const x = r.krim(-8, 8, [0]);
  const y = znachennia(p, x);
  return {
    pytannia: `$y = ${tex(p)}$. При якому $x$ значення функції дорівнює $${tz(y)}$?`,
    vidpovid: ch(x),
    pidkazka: `Розв’яжи рівняння ${tex(p).replace(/-/g, '−')} = ${ch(y)}.`,
    rozviazok: `${ch(p[1])}x = ${ch(y)} − ${tvd(p[0])} = ${ch(y - p[0])}; x = ${ch(y - p[0])} : ${tvd(p[1])} = ${ch(x)}`,
  };
}

function oblast(r: Vypadok): TrenZavdannia {
  const a = r.krim(-9, 9, [0]);
  const k = r.krim(-12, 12, [0]);
  const typ = r.chyslo(0, 1);
  // Знаменник x − a або −x + a: нуль саме при x = a.
  const znamennyk = typ === 0 ? `x ${a < 0 ? '+' : '-'} ${Math.abs(a)}` : `-x ${a < 0 ? '-' : '+'} ${Math.abs(a)}`;
  return {
    pytannia: `Яке значення $x$ не входить в область визначення функції $y = \\dfrac{${k}}{${znamennyk}}$?`,
    vidpovid: ch(a),
    nevidome: '$x$',
    pidkazka: 'На нуль ділити не можна. При якому x знаменник стане нулем?',
    rozviazok: `${znamennyk.replace(/-/g, '−')} = 0 при x = ${ch(a)}.`,
  };
}

function tochka(r: Vypadok): TrenZavdannia {
  const p = liniina(r);
  const x = r.krim(-5, 5, [0]);
  const y = znachennia(p, x);
  const nalezhyt = r.shans();
  const yy = nalezhyt ? y : y + r.vybir([-2, -1, 1, 2]);
  return {
    pytannia: `Чи належить графіку функції $y = ${tex(p)}$ точка $(${tz(x)};\\, ${tz(yy)})$?`,
    vidpovid: nalezhyt ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: `Підстав x = ${ch(x)} і порівняй результат з ${ch(yy)}.`,
    rozviazok: `y(${ch(x)}) = ${ch(y)}${nalezhyt ? ' — збігається, належить.' : ` ≠ ${ch(yy)} — не належить.`}`,
  };
}

export default {
  rivni: ['значення лінійної функції', 'аргумент за значенням, точка на графіку', 'квадрати й область визначення'],
  zavdannia(r, riven) {
    if (riven === 1) return znachenniaF(r, false);
    if (riven === 2) return r.vybir([arhument, arhument, tochka, (rr: Vypadok) => znachenniaF(rr, false)])(r);
    return r.vybir([(rr: Vypadok) => znachenniaF(rr, true), (rr: Vypadok) => znachenniaF(rr, true), oblast, arhument])(r);
  },
} satisfies Henerator;
