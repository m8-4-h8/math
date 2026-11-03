// Перехід через десяток: доповнюємо до 10 і додаємо решту; забираємо до 10 і віднімаємо решту.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

function doDesiaty(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1, 9);
  return {
    pytannia: 'Скільки бракує до десяти?',
    vyraz: `${a} + □ = 10`,
    vidpovid: 10 - a,
    pidkazka: 'Пари до десяти: 1 і 9, 2 і 8, 3 і 7…',
    rozviazok: `${a} + ${10 - a} = 10`,
  };
}

function rozklad(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(5, 9);
  const b = r.chyslo(11 - a, 9);
  const doDes = 10 - a;
  return {
    pytannia: 'Доповни до десятка: яке число у віконці?',
    vyraz: `${a} + ${b} = ${a} + ${doDes} + □`,
    vidpovid: b - doDes,
    pidkazka: `${b} розклали на ${doDes} і ще скільки?`,
    rozviazok: `${a} + ${doDes} = 10, і ще ${b - doDes}: ${a} + ${b} = ${a + b}.`,
  };
}

function dodavannia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const b = r.chyslo(Math.max(2, 11 - a), 9);
  const [v, m] = a >= b ? [a, b] : [b, a];
  const doDes = 10 - v;
  return {
    vyraz: `${a} + ${b} =`,
    vidpovid: a + b,
    pidkazka: `Доповни ${v} до десятка: ${v} + ${doDes} = 10, і ще ${m - doDes}.`,
    rozviazok: `${v} + ${doDes} + ${m - doDes} = 10 + ${m - doDes} = ${a + b}`,
  };
}

function vidnimannia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(11, 18);
  const o = a - 10;
  const b = r.chyslo(o + 1, 9);
  return {
    vyraz: `${a} − ${b} =`,
    vidpovid: a - b,
    pidkazka: `Спершу відніми ${o}, щоб вийшло 10, потім ще ${b - o}.`,
    rozviazok: `${a} − ${o} − ${b - o} = 10 − ${b - o} = ${a - b}`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(3, 9);
  const b = r.chyslo(11 - a, 9);
  return r.shans()
    ? { pytannia: 'Яке число у віконці?', vyraz: `${a} + □ = ${a + b}`, vidpovid: b, pidkazka: `Від ${a} до 10 — ${10 - a}, від 10 до ${a + b} — ${a + b - 10}.`, rozviazok: `${10 - a} + ${a + b - 10} = ${b}` }
    : { pytannia: 'Яке число у віконці?', vyraz: `${a + b} − □ = ${a}`, vidpovid: b, pidkazka: `Скільки треба забрати від ${a + b}, щоб лишилось ${a}?`, rozviazok: `${a + b} − ${b} = ${a}` };
}

export default {
  rivni: ['доповни до десятка', 'додавання з переходом', 'віднімання з переходом і віконця'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? doDesiaty(r) : rozklad(r);
    if (riven === 2) return r.shans(0.75) ? dodavannia(r) : rozklad(r);
    return r.vybir([vidnimannia, vidnimannia, dodavannia, vikontse])(r);
  },
} satisfies Henerator;
