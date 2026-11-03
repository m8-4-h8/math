// Розв'язування рівнянь: доданки переносимо з протилежним знаком (невідомі — ліворуч, числа — праворуч),
// ділимо на коефіцієнт; спершу розкриваємо дужки; перевірка підстановкою.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const koef = (k: number) => (k === 1 ? 'x' : k === -1 ? '-x' : `${tz(k)}x`);
const dalі = (k: number, x = '') => (k < 0 ? ` - ${k === -1 && x ? '' : -k}${x}` : ` + ${k === 1 && x ? '' : k}${x}`);
const vd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);

function prosti(r: Vypadok): TrenZavdannia {
  const x = r.krim(-12, 12, [0]);
  if (r.shans()) {
    const a = r.krim(-9, 9, [0, 1]);
    return {
      pytannia: 'Розв’яжи рівняння.',
      vyraz: `$${koef(a)} = ${tz(a * x)}$`,
      vidpovid: ch(x),
      pidkazka: `Поділи ${ch(a * x)} на ${ch(a)}.`,
      rozviazok: `x = ${ch(a * x)} : ${vd(a)} = ${ch(x)}`,
    };
  }
  const b = r.krim(-15, 15, [0]);
  return {
    pytannia: 'Розв’яжи рівняння.',
    vyraz: `$x${dalі(b)} = ${tz(x + b)}$`,
    vidpovid: ch(x),
    pidkazka: `Перенеси ${ch(b)} праворуч з протилежним знаком.`,
    rozviazok: `x = ${ch(x + b)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${ch(x)}`,
  };
}

function dviChastyny(r: Vypadok): TrenZavdannia {
  const x = r.krim(-9, 9, [0]);
  const a = r.krim(-9, 9, [0]);
  const c = r.krim(-9, 9, [0, a]);
  const b = r.krim(-15, 15, [0]);
  const d = a * x + b - c * x;
  return {
    pytannia: 'Розв’яжи рівняння.',
    vyraz: `$${koef(a)}${dalі(b)} = ${koef(c)}${d ? dalі(d) : ''}$`,
    vidpovid: ch(x),
    pidkazka: `Невідомі — ліворуч, числа — праворуч: ${ch(a)}x − ${vd(c)}x = ${ch(d)} − ${vd(b)}.`,
    rozviazok: `${ch(a - c)}x = ${ch(d - b)}; x = ${ch(d - b)} : ${vd(a - c)} = ${ch(x)}`,
  };
}

function zDuzhkamy(r: Vypadok): TrenZavdannia {
  const x = r.krim(-9, 9, [0]);
  const k = r.krim(-6, 6, [0, 1, -1]);
  const m = r.krim(-8, 8, [0]);
  const c = r.krim(-9, 9, [0, k]);
  // k(x + m) = cx + d
  const d = k * (x + m) - c * x;
  return {
    pytannia: 'Розв’яжи рівняння.',
    vyraz: `$${tz(k)}(x${dalі(m)}) = ${koef(c)}${d ? dalі(d) : ''}$`,
    vidpovid: ch(x),
    pidkazka: `Розкрий дужки: ${ch(k)}x ${k * m < 0 ? '−' : '+'} ${Math.abs(k * m)}.`,
    rozviazok: `${ch(k)}x ${k * m < 0 ? '−' : '+'} ${Math.abs(k * m)} = ${ch(c)}x ${d < 0 ? '−' : '+'} ${Math.abs(d)}; ${ch(k - c)}x = ${ch(d - k * m)}; x = ${ch(x)}. Перевірка: ${ch(k)} · ${vd(x + m)} = ${ch(k * (x + m))} і ${ch(c)} · ${vd(x)} + ${vd(d)} = ${ch(c * x + d)} ✓`,
  };
}

export default {
  rivni: ['ax = b і x + b = c', 'невідомі з обох боків', 'рівняння з дужками'],
  zavdannia(r, riven) {
    if (riven === 1) return prosti(r);
    if (riven === 2) return r.shans(0.8) ? dviChastyny(r) : prosti(r);
    return r.shans(0.7) ? zDuzhkamy(r) : dviChastyny(r);
  },
} satisfies Henerator;
