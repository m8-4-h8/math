// Числа від 11 до 20: десяток і одиниці, сусіди, порівняння, додавання й віднімання без переходу.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function sklad(r: Vypadok): TrenZavdannia {
  const o = r.chyslo(1, 9);
  const n = 10 + o;
  return r.vybir<() => TrenZavdannia>([
    () => ({ vyraz: `10 + ${o} =`, vidpovid: n, pidkazka: 'Десяток і ще кілька одиниць.', rozviazok: `1 десяток і ${o} од. — це ${n}.` }),
    () => ({
      pytannia: 'Яке число сховалось у віконці?',
      vyraz: `${n} = 10 + □`,
      vidpovid: o,
      pidkazka: 'Друга цифра показує одиниці.',
      rozviazok: `${n} — це 1 десяток і ${o} од.: ${n} = 10 + ${o}.`,
    }),
    () => ({
      pytannia: `${n} — це 1 десяток і скільки одиниць?`,
      vidpovid: o,
      pidkazka: 'Подивись на другу цифру.',
      rozviazok: `${n} = 10 + ${o}`,
    }),
    () => ({
      pytannia: `1 десяток і ${o} ${mnozh(o, 'одиниця', 'одиниці', 'одиниць')} — яке це число?`,
      vidpovid: n,
      pidkazka: 'Спершу пиши десяток (1), потім одиниці.',
      rozviazok: `10 + ${o} = ${n}`,
    }),
  ])();
}

function susid(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(11, 19);
  return r.vybir<() => TrenZavdannia>([
    () => ({ pytannia: `Яке число йде одразу після ${n}?`, vidpovid: n + 1, pidkazka: 'На 1 більше.', rozviazok: `${n} + 1 = ${n + 1}` }),
    () => ({ pytannia: `Яке число стоїть одразу перед ${n}?`, vidpovid: n - 1, pidkazka: 'На 1 менше.', rozviazok: `${n} − 1 = ${n - 1}` }),
    () => ({ pytannia: `Яке число стоїть між ${n - 1} і ${n + 1}?`, vidpovid: n, pidkazka: `Після ${n - 1} одразу йде…`, rozviazok: `${n - 1}, ${n}, ${n + 1}` }),
  ])();
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(10, 20);
  const b = r.shans(0.15) ? a : r.shans(0.3) ? r.chyslo(1, 9) : r.krim(10, 20, [a]);
  const znak = a > b ? '>' : a < b ? '<' : '=';
  return {
    pytannia: 'Який знак поставити замість віконця?',
    vyraz: `${a} □ ${b}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Спершу порівняй десятки, потім одиниці.',
    rozviazok: znak === '=' ? `Числа однакові.` : `${Math.max(a, b)} більше за ${Math.min(a, b)}: ${a} ${znak} ${b}.`,
  };
}

function dii(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const o = r.chyslo(0, 8);
    const b = r.chyslo(1, 9 - o);
    return {
      vyraz: `${10 + o} + ${b} =`,
      vidpovid: 10 + o + b,
      pidkazka: 'Десяток не чіпай, додай одиниці до одиниць.',
      rozviazok: `${o} + ${b} = ${o + b} од., і ще десяток: ${10 + o + b}.`,
    };
  }
  const o = r.chyslo(1, 9);
  const vse = r.shans(0.2);
  const b = vse ? 10 : r.chyslo(1, o);
  const n = 10 + o;
  return {
    vyraz: `${n} − ${b} =`,
    vidpovid: n - b,
    pidkazka: vse ? 'Забираємо цілий десяток — лишаються одиниці.' : 'Від одиниць відніми одиниці, десяток не чіпай.',
    rozviazok: vse ? `${n} − 10 = ${o}` : `${o} − ${b} = ${o - b} од., і ще десяток: ${n - b}.`,
  };
}

export default {
  rivni: ['десяток і одиниці', 'сусіди й порівняння', 'додавання і віднімання до 20'],
  zavdannia(r, riven) {
    if (riven === 1) return sklad(r);
    if (riven === 2) return r.vybir([sklad, susid, porivniannia])(r);
    return r.vybir([dii, dii, susid, porivniannia])(r);
  },
} satisfies Henerator;
