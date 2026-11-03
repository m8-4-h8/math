// Множення і ділення раціональних чисел: однакові знаки — плюс, різні — мінус; кілька множників — парна
// кількість мінусів дає плюс; десяткові дроби; степінь від’ємного числа.
import { ch, des, tdes, mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const vd = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);
const tvd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);

function dva(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.krim(-12, 12, [0]), r.krim(-12, 12, [0, 1, -1])];
  if (a > 0 && b > 0) return dva(r);
  const dilennia = r.shans(0.4);
  const p = a * b;
  const odnakovi = a < 0 === b < 0;
  if (dilennia) {
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${tz(p)} : ${vd(b)} =$`,
      vidpovid: ch(a),
      pidkazka: odnakovi ? 'Знаки однакові — відповідь додатна.' : 'Знаки різні — відповідь від’ємна.',
      rozviazok: `${Math.abs(p)} : ${Math.abs(b)} = ${Math.abs(a)}, ${odnakovi ? 'знаки однакові — плюс' : 'знаки різні — мінус'}: ${ch(a)}`,
    };
  }
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${vd(a)} \\cdot ${vd(b)} =$`,
    vidpovid: ch(p),
    pidkazka: odnakovi ? 'Мінус на мінус дає плюс.' : 'Знаки різні — відповідь від’ємна.',
    rozviazok: `${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(p)}, ${odnakovi ? 'знаки однакові — плюс' : 'знаки різні — мінус'}: ${ch(p)}`,
  };
}

function tryMnozhnyky(r: Vypadok): TrenZavdannia {
  const ch3 = [r.krim(-9, 9, [0, 1]), r.krim(-6, 6, [0, 1]), r.krim(-5, 5, [0, 1])];
  if (ch3.every((n) => n > 0)) return tryMnozhnyky(r);
  const p = ch3.reduce((a, b) => a * b, 1);
  const minusiv = ch3.filter((n) => n < 0).length;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${ch3.map(vd).join(' \\cdot ')} =$`,
    vidpovid: ch(p),
    pidkazka: 'Спершу перемнож модулі, потім порахуй мінуси: парна кількість — плюс, непарна — мінус.',
    rozviazok: `Модулі: ${ch3.map(Math.abs).join(' · ')} = ${Math.abs(p)}; ${minusiv} ${mnozh(minusiv, 'мінус', 'мінуси', 'мінусів')} — ${minusiv % 2 ? 'непарна кількість, мінус' : 'парна кількість, плюс'}: ${ch(p)}.`,
  };
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  const a = r.krim(-9, 9, [0]); // десяті
  const b = r.krim(-12, 12, [0, 1, -1]);
  if (a > 0 && b > 0) return desiatkovi(r);
  const p = a * b;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${a < 0 ? `(${tdes(a, 1)})` : tdes(a, 1)} \\cdot ${vd(b)} =$`,
    vidpovid: des(p, 1),
    pidkazka: 'Спершу знак, потім множимо як звичайні числа.',
    rozviazok: `${des(Math.abs(a), 1)} · ${Math.abs(b)} = ${des(Math.abs(p), 1)}, знак: ${des(p, 1)}`,
  };
}

function stepin(r: Vypadok): TrenZavdannia {
  const a = -r.chyslo(1, 5);
  const n = a === -1 ? r.chyslo(2, 9) : r.chyslo(2, a < -3 ? 3 : 4);
  const p = a ** n;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$(${tz(a)})^{${n}} =$`,
    vidpovid: ch(p),
    pidkazka: `Перемнож ${n} ${mnozh(n, 'раз', 'рази', 'разів')}. Парний показник — плюс, непарний — мінус.`,
    rozviazok: `${Array(n).fill(tvd(a)).join(' · ')} = ${ch(p)}`,
  };
}

export default {
  rivni: ['два множники і ділення', 'три множники', 'десяткові дроби і степені'],
  zavdannia(r, riven) {
    if (riven === 1) return dva(r);
    if (riven === 2) return r.shans(0.6) ? tryMnozhnyky(r) : dva(r);
    return r.vybir([desiatkovi, stepin, tryMnozhnyky])(r);
  },
} satisfies Henerator;
