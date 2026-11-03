// Додавання і віднімання в межах 1000: круглі числа десятками, розряд з розрядом, перехід через розряд.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

function kruhli(r: Vypadok): TrenZavdannia {
  if (r.shans(0.4)) {
    const a = r.chyslo(1, 8);
    const b = r.chyslo(1, 9 - a);
    return r.shans()
      ? { vyraz: `${a * 100} + ${b * 100} =`, vidpovid: (a + b) * 100, pidkazka: `${a} сот. + ${b} сот.`, rozviazok: `${a + b} сотень = ${(a + b) * 100}` }
      : { vyraz: `${(a + b) * 100} − ${b * 100} =`, vidpovid: a * 100, pidkazka: `${a + b} сот. − ${b} сот.`, rozviazok: `${a} сотень = ${a * 100}` };
  }
  const a = r.chyslo(11, 89);
  const b = r.chyslo(2, 99 - a);
  return r.shans()
    ? { vyraz: `${a * 10} + ${b * 10} =`, vidpovid: (a + b) * 10, pidkazka: `Рахуй десятками: ${a} + ${b}.`, rozviazok: `${a} + ${b} = ${a + b} десятків, тобто ${(a + b) * 10}.` }
    : { vyraz: `${(a + b) * 10} − ${b * 10} =`, vidpovid: a * 10, pidkazka: `Рахуй десятками: ${a + b} − ${b}.`, rozviazok: `${a + b} − ${b} = ${a} десятків, тобто ${a * 10}.` };
}

const rozryady = (n: number) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];

function bezPerekhodu(r: Vypadok): TrenZavdannia {
  const [s1, d1, o1] = [r.chyslo(1, 8), r.chyslo(0, 8), r.chyslo(0, 8)];
  const [s2, d2, o2] = [r.chyslo(1, 9 - s1), r.chyslo(0, 9 - d1), r.chyslo(0, 9 - o1)];
  const a = 100 * s1 + 10 * d1 + o1;
  const b = 100 * s2 + 10 * d2 + o2;
  if (r.shans()) {
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: 'Сотні з сотнями, десятки з десятками, одиниці з одиницями.',
      rozviazok: `${100 * (s1 + s2)} + ${10 * (d1 + d2)} + ${o1 + o2} = ${a + b}`,
    };
  }
  const [s, d, o] = rozryady(a + b);
  return {
    vyraz: `${a + b} − ${b} =`,
    vidpovid: a,
    pidkazka: 'Віднімай розряд з розрядом: сотні, десятки, одиниці.',
    rozviazok: `${s} − ${s2} = ${s1} сот., ${d} − ${d2} = ${d1} дес., ${o} − ${o2} = ${o1} од.: ${a}.`,
  };
}

function zPerekhodom(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    let a: number;
    let b: number;
    do {
      a = r.chyslo(105, 795);
      b = r.chyslo(105, 995 - a);
    } while ((a % 10) + (b % 10) < 10 && (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) < 10);
    const pereklad = (a % 10) + (b % 10) >= 10;
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: pereklad ? `Одиниці: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)} — 1 десяток переходить у десятки.` : 'Десятків більше ніж 10 — 1 сотня переходить у сотні.',
      rozviazok: `${a} + ${b} = ${a + b}. Перевірка: ${a + b} − ${b} = ${a} ✓`,
    };
  }
  let a: number;
  let b: number;
  do {
    a = r.chyslo(200, 999);
    b = r.chyslo(101, a - 50);
  } while (a % 10 >= b % 10 && Math.floor(a / 10) % 10 >= Math.floor(b / 10) % 10);
  const pozychaiemo = a % 10 < b % 10;
  return {
    vyraz: `${a} − ${b} =`,
    vidpovid: a - b,
    pidkazka: pozychaiemo ? `Одиниць ${a % 10} менше, ніж ${b % 10}: позич 1 десяток.` : `Десятків ${Math.floor(a / 10) % 10} менше, ніж ${Math.floor(b / 10) % 10}: позич 1 сотню.`,
    rozviazok: `${a} − ${b} = ${a - b}. Перевірка: ${a - b} + ${b} = ${a} ✓`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const a = 10 * r.chyslo(11, 60);
  const b = 10 * r.chyslo(5, 99 - a / 10);
  return r.shans()
    ? { pytannia: 'Яке число у віконці?', vyraz: `□ + ${b} = ${a + b}`, vidpovid: a, pidkazka: 'Невідомий доданок: від суми віднімаємо відомий доданок.', rozviazok: `${a + b} − ${b} = ${a}` }
    : { pytannia: 'Яке число у віконці?', vyraz: `${a + b} − □ = ${a}`, vidpovid: b, pidkazka: 'Невідомий від’ємник: від зменшуваного віднімаємо різницю.', rozviazok: `${a + b} − ${a} = ${b}` };
}

export default {
  rivni: ['круглі сотні й десятки', 'розряд з розрядом, без переходу', 'з переходом через розряд і віконця'],
  zavdannia(r, riven) {
    if (riven === 1) return kruhli(r);
    if (riven === 2) return r.shans(0.7) ? bezPerekhodu(r) : kruhli(r);
    return r.vybir([zPerekhodom, zPerekhodom, zPerekhodom, vikontse])(r);
  },
} satisfies Henerator;
