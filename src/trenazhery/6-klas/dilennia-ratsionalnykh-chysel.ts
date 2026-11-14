// Ділення раціональних чисел (Істер § 40): модуль частки — частка модулів, знак — як у множенні; десяткові та
// звичайні дроби; особливі випадки (0 : a, a : a, a : (−1), на нуль ділити не можна); рівняння k·x = b.
import { ch, des, tdes, zrazok, neskorotnyiChyselnyk, skorotyty, tdrib, tvidpovidDrib, vidpovidDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const vd = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);
const znakSlovom = (odnakovi: boolean) => (odnakovi ? 'знаки однакові — плюс' : 'знаки різні — мінус');

function tsili(r: Vypadok, max: number): TrenZavdannia {
  for (;;) {
    const [a, b] = [r.krim(-max, max, [0, 1, -1]), r.krim(-max, max, [0, 1, -1])];
    if (a > 0 && b > 0) continue;
    const p = a * b;
    const odnakovi = p < 0 === b < 0;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${tz(p)} : ${vd(b)} =$`,
      vidpovid: ch(a),
      pidkazka: odnakovi ? 'Знаки однакові — частка додатна.' : 'Знаки різні — частка від’ємна.',
      rozviazok: `${Math.abs(p)} : ${Math.abs(b)} = ${Math.abs(a)}, ${znakSlovom(odnakovi)}: ${ch(a)}. Перевірка: ${ch(a)} · ${b < 0 ? `(${ch(b)})` : b} = ${ch(p)}`,
    };
  }
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  for (;;) {
    if (r.shans()) {
      // десятковий : ціле = десятковий
      const a = r.krim(-99, 99, [0, 10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60, 70, -70, 80, -80, 90, -90]); // десяті
      const b = r.krim(-9, 9, [0, 1, -1]);
      if (a > 0 && b > 0) continue;
      const p = a * b;
      const odnakovi = p < 0 === b < 0;
      return {
        pytannia: 'Обчисли.',
        vyraz: `$${tdes(p, 1)} : ${vd(b)} =$`,
        vidpovid: des(a, 1),
        pidkazka: odnakovi ? 'Знаки однакові — частка додатна.' : 'Знаки різні — частка від’ємна.',
        rozviazok: `${des(Math.abs(p), 1)} : ${Math.abs(b)} = ${des(Math.abs(a), 1)}, ${znakSlovom(odnakovi)}: ${des(a, 1)}`,
      };
    }
    // десятковий : десятковий = ціле
    const a = r.krim(-12, 12, [0, 1, -1]);
    const b = r.krim(-9, 9, [0]); // десяті
    if (a > 0 && b > 0) continue;
    const p = a * b; // десяті
    const odnakovi = p < 0 === b < 0;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${tdes(p, 1)} : ${b < 0 ? `(${tdes(b, 1)})` : tdes(b, 1)} =$`,
      vidpovid: ch(a),
      pidkazka: `Перенеси кому в обох числах на один знак: ${des(Math.abs(p) * 10, 1)} : ${Math.abs(b)}.`,
      rozviazok: `${des(Math.abs(p), 1)} : ${des(Math.abs(b), 1)} = ${Math.abs(p)} : ${Math.abs(b)} = ${Math.abs(a)}, ${znakSlovom(odnakovi)}: ${ch(a)}`,
    };
  }
}

/** 0 : a, a : a, a : (−1), a : 0. */
function osoblyvi(r: Vypadok): TrenZavdannia {
  const a = r.krim(-60, 60, [0, 1, -1]);
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    return {
      pytannia: 'Обчисли.',
      vyraz: `$0 : ${vd(a)} =$`,
      vidpovid: 0,
      pidkazka: 'Яке число помножити на дільник, щоб вийшов 0?',
      rozviazok: `0 : ${a < 0 ? `(${ch(a)})` : a} = 0, бо 0 · ${a < 0 ? `(${ch(a)})` : a} = 0.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${tz(a)} : ${vd(a)} =$`,
      vidpovid: 1,
      pidkazka: 'Число ділимо саме на себе.',
      rozviazok: 'Будь-яке число (крім нуля), поділене саме на себе, дає 1.',
    };
  }
  if (typ === 2) {
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${tz(a)} : (-1) =$`,
      vidpovid: ch(-a),
      pidkazka: 'Ділення на −1 змінює знак числа.',
      rozviazok: `Ділення на −1 дає протилежне число: ${ch(-a)}. Перевірка: ${ch(-a)} · (−1) = ${ch(a)}`,
    };
  }
  return {
    pytannia: `Чому дорівнює частка $${tz(a)} : 0$?`,
    vidpovid: 'на нуль ділити не можна',
    varianty: ['0', ch(a), 'на нуль ділити не можна'],
    pidkazka: `Яке число помножити на 0, щоб вийшло ${ch(a)}?`,
    rozviazok: `Будь-яке число, помножене на 0, дає 0, а не ${ch(a)}. Тому на нуль ділити не можна.`,
  };
}

function droby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [q1, q2] = [r.chyslo(2, 9), r.chyslo(2, 9)];
    const [p1, p2] = [neskorotnyiChyselnyk(r, q1) * (r.shans(0.3) ? 2 : 1), neskorotnyiChyselnyk(r, q2)];
    if (skorotyty(p1, q1)[1] !== q1) continue;
    const [z1, z2] = [r.shans() ? -1 : 1, r.shans() ? -1 : 1];
    if (z1 > 0 && z2 > 0) continue;
    const [n, d] = [p1 * q2, q1 * p2]; // ділимо = множимо на обернений
    const [sp, sq] = skorotyty(n, d);
    const z = z1 * z2;
    const persha = `${z1 < 0 ? '-' : ''}${tdrib(p1, q1)}`;
    const druhyi = z2 < 0 ? `\\left(-${tdrib(p2, q2)}\\right)` : tdrib(p2, q2);
    const vidpovid = vidpovidDrib(z * n, d);
    const obernene = p2 === 1 ? `${q2}` : `${q2}/${p2}`;
    return {
      pytannia: `Обчисли. Дріб запиши через риску, наприклад ${zrazok(['−2/3', '−4/5', '−1/6', '−7/9'], vidpovid)}.`,
      vyraz: `$${persha} : ${druhyi} =$`,
      vidpovid,
      pokaz: `$${tvidpovidDrib(z * n, d)}$`,
      pidkazka: `Помнож на число, обернене до дільника: ${p1}/${q1} · ${obernene}. ${z > 0 ? 'Знаки однакові.' : 'Знаки різні.'}`,
      rozviazok: `${p1}/${q1} · ${obernene} = ${n}/${d}${sq !== d ? ` = ${sq === 1 ? sp : `${sp}/${sq}`}` : ''}, ${znakSlovom(z > 0)}: ${z < 0 ? '−' : ''}${sq === 1 ? sp : `${sp}/${sq}`}`,
    };
  }
}

/** k·x = b → x = b : k. */
function rivniannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const k = r.krim(-12, 12, [0, 1, -1]);
    const x = r.krim(-12, 12, [0]);
    if (k > 0 && x > 0) continue;
    const b = k * x;
    const bukva = r.vybir(['x', 'y', 'm']);
    return {
      pytannia: 'Розв’яжи рівняння.',
      vyraz: `$${tz(k)}${bukva} = ${tz(b)}$`,
      vidpovid: ch(x),
      pidkazka: `Невідомий множник: поділи ${ch(b)} на ${ch(k)}.`,
      rozviazok: `${bukva} = ${ch(b)} : ${k < 0 ? `(${ch(k)})` : k} = ${ch(x)}. Перевірка: ${ch(k)} · ${x < 0 ? `(${ch(x)})` : x} = ${ch(b)}`,
    };
  }
}

export default {
  rivni: ['цілі числа', 'десяткові дроби, нуль і −1', 'звичайні дроби, рівняння'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.85) ? tsili(r, 10) : osoblyvi(r);
    if (riven === 2) return r.vybir([desiatkovi, desiatkovi, osoblyvi, (rr: Vypadok) => tsili(rr, 15)])(r);
    return r.vybir([droby, droby, rivniannia, desiatkovi])(r);
  },
} satisfies Henerator;
