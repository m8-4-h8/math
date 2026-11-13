// Множення раціональних чисел (Істер § 36): однакові знаки — добуток додатний, різні — від'ємний; кілька
// множників — парна кількість мінусів дає «+», непарна — «−»; десяткові та звичайні дроби; степінь від'ємного числа.
import { ch, des, tdes, mnozh, neskorotnyiChyselnyk, skorotyty, tdrib, tvidpovidDrib, vidpovidDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const vd = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);
const tvd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);
const znakSlovom = (odnakovi: boolean) => (odnakovi ? 'знаки однакові — плюс' : 'знаки різні — мінус');

function dva(r: Vypadok, max: number): TrenZavdannia {
  for (;;) {
    const [a, b] = [r.krim(-max, max, [0]), r.krim(-max, max, [0, 1, -1])];
    if (a > 0 && b > 0) continue;
    const p = a * b;
    const odnakovi = a < 0 === b < 0;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${a < 0 && r.shans(0.3) ? tz(a) : vd(a)} \\cdot ${vd(b)} =$`,
      vidpovid: ch(p),
      pidkazka: odnakovi ? 'Мінус на мінус дає плюс.' : 'Знаки різні — відповідь від’ємна.',
      rozviazok: `${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(p)}, ${znakSlovom(odnakovi)}: ${ch(p)}`,
    };
  }
}

function znakDobutku(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 6);
  const chysla = Array.from({ length: n }, () => r.krim(-9, 9, [0]));
  if (chysla.filter((x) => x < 0).length < 2) return znakDobutku(r);
  const minusiv = chysla.filter((x) => x < 0).length;
  const znak = minusiv % 2 ? '−' : '+';
  return {
    pytannia: `Який знак матиме добуток $${chysla.map(vd).join(' \\cdot ')}$?`,
    vidpovid: znak,
    varianty: ['+', '−'],
    pidkazka: 'Не множ — просто порахуй мінуси.',
    rozviazok: `${minusiv} ${mnozh(minusiv, 'мінус', 'мінуси', 'мінусів')} — ${minusiv % 2 ? 'непарна кількість, добуток від’ємний' : 'парна кількість, добуток додатний'}.`,
  };
}

function tryMnozhnyky(r: Vypadok): TrenZavdannia {
  const ch3 = [r.krim(-9, 9, [0, 1, -1]), r.krim(-6, 6, [0, 1, -1]), r.krim(-5, 5, [0, 1])];
  if (ch3.filter((n) => n < 0).length < 2 && !(ch3.filter((n) => n < 0).length === 1 && r.shans(0.3))) return tryMnozhnyky(r);
  const p = ch3.reduce((a, b) => a * b, 1);
  const minusiv = ch3.filter((n) => n < 0).length;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${ch3.map(vd).join(' \\cdot ')} =$`,
    vidpovid: ch(p),
    pidkazka: 'Перемнож модулі, потім порахуй мінуси: парна кількість — плюс, непарна — мінус.',
    rozviazok: `Модулі: ${ch3.map(Math.abs).join(' · ')} = ${Math.abs(p)}; ${minusiv} ${mnozh(minusiv, 'мінус', 'мінуси', 'мінусів')} — ${minusiv % 2 ? 'непарна кількість, мінус' : 'парна кількість, плюс'}: ${ch(p)}.`,
  };
}

/** a · (−1), a · 0 — особливі множники. */
function osoblyvi(r: Vypadok): TrenZavdannia {
  const a = r.krim(-50, 50, [0, 1, -1]);
  if (r.shans()) {
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${vd(a)} \\cdot (-1) =$`,
      vidpovid: ch(-a),
      pidkazka: 'Множення на −1 змінює знак числа.',
      rozviazok: `Множення на −1 дає протилежне число: ${ch(-a)}`,
    };
  }
  const b = r.krim(-9, 9, [0]);
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${vd(a)} \\cdot ${vd(b)} \\cdot 0 =$`,
    vidpovid: 0,
    pidkazka: 'Подивись на всі множники.',
    rozviazok: 'Один із множників — нуль, тому добуток дорівнює 0.',
  };
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.krim(-99, 99, [0, 10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60, 70, -70, 80, -80, 90, -90]); // десяті
    const b = r.krim(-12, 12, [0, 1, -1]);
    if (a > 0 && b > 0) continue;
    const p = a * b;
    const odnakovi = a < 0 === b < 0;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${a < 0 ? `(${tdes(a, 1)})` : tdes(a, 1)} \\cdot ${vd(b)} =$`,
      vidpovid: des(p, 1),
      pidkazka: 'Спершу визнач знак, потім множ модулі як десяткові дроби.',
      rozviazok: `${des(Math.abs(a), 1)} · ${Math.abs(b)} = ${des(Math.abs(p), 1)}, ${znakSlovom(odnakovi)}: ${des(p, 1)}`,
    };
  }
}

function droby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [q1, q2] = [r.chyslo(2, 9), r.chyslo(2, 9)];
    const [p1, p2] = [neskorotnyiChyselnyk(r, q1), neskorotnyiChyselnyk(r, q2)];
    const [z1, z2] = [r.shans() ? -1 : 1, r.shans() ? -1 : 1];
    if (z1 > 0 && z2 > 0) continue;
    const [n, d] = [p1 * p2, q1 * q2];
    const [sp, sq] = skorotyty(n, d);
    if (sq === 1) continue;
    const z = z1 * z2;
    const persha = `${z1 < 0 ? '-' : ''}${tdrib(p1, q1)}`;
    const druhyi = z2 < 0 ? `\\left(-${tdrib(p2, q2)}\\right)` : tdrib(p2, q2);
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${persha} \\cdot ${druhyi} =$`,
      vidpovid: vidpovidDrib(z * n, d),
      pokaz: `$${tvidpovidDrib(z * n, d, false)}$`,
      pidkazka: `Чисельник множ на чисельник, знаменник — на знаменник. ${z > 0 ? 'Знаки однакові.' : 'Знаки різні.'}`,
      rozviazok: `${p1}/${q1} · ${p2}/${q2} = ${n}/${d}${sq !== d ? ` = ${sp}/${sq}` : ''}, ${znakSlovom(z > 0)}: ${z < 0 ? '−' : ''}${sp}/${sq}`,
    };
  }
}

function stepin(r: Vypadok): TrenZavdannia {
  const a = -r.chyslo(1, 5);
  const n = a === -1 ? r.chyslo(2, 9) : r.chyslo(2, a < -3 ? 3 : 4);
  const p = a ** n;
  if (r.shans(0.25) && a !== -1) {
    // −a^n: мінус перед степенем, а не в основі
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${tz(a)}^{${n}} =$`,
      vidpovid: ch(-(Math.abs(a) ** n)),
      pidkazka: 'Тут дужок немає: до степеня підносять лише число без мінуса.',
      rozviazok: `${Array(n).fill(Math.abs(a)).join(' · ')} = ${Math.abs(a) ** n}, а мінус стоїть перед результатом: ${ch(-(Math.abs(a) ** n))}`,
    };
  }
  return {
    pytannia: 'Обчисли.',
    vyraz: `$(${tz(a)})^{${n}} =$`,
    vidpovid: ch(p),
    pidkazka: `Перемнож ${n} ${mnozh(n, 'раз', 'рази', 'разів')}. Парний показник — плюс, непарний — мінус.`,
    rozviazok: `${Array(n).fill(tvd(a)).join(' · ')} = ${ch(p)}`,
  };
}

export default {
  rivni: ['два цілі множники', 'кілька множників, знак добутку', 'десяткові й звичайні дроби, степені'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.85) ? dva(r, 10) : osoblyvi(r);
    if (riven === 2) return r.vybir([tryMnozhnyky, tryMnozhnyky, znakDobutku, osoblyvi, (rr: Vypadok) => dva(rr, 25)])(r);
    return r.vybir([desiatkovi, droby, droby, stepin, stepin])(r);
  },
} satisfies Henerator;
