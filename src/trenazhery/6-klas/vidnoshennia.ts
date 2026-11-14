// Відношення (Істер § 15): частка двох чисел (у скільки разів одне більше за інше); скорочення відношення;
// величини — в однакових одиницях; дробові й десяткові члени замінюємо натуральними.
import { des, neskorotnyiChyselnyk, nsd, nsk, tdrib, ZRAZKY, zrazok, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function chastka(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 12);
  const k = r.chyslo(2, 9);
  return {
    pytannia: 'Знайди відношення.',
    vyraz: `$${b * k} : ${b} =$`,
    vidpovid: k,
    pidkazka: 'Відношення — це частка: у скільки разів перше число більше за друге.',
    rozviazok: `${b * k} : ${b} = ${k}`,
  };
}

function skorotyty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q] = r.rizni(2, 1, 9);
    if (nsd(p, q) !== 1) continue;
    const k = r.chyslo(2, 9);
    return {
      pytannia: `Скороти відношення. Запиши через двокрапку, наприклад «${zrazok(ZRAZKY.vidnoshennia, `${p}:${q}`)}».`,
      vyraz: `$${p * k} : ${q * k}$`,
      vidpovid: `${p}:${q}`,
      pidkazka: `Поділи обидва числа на НСД(${p * k}; ${q * k}).`,
      rozviazok: `НСД = ${k}; ${p * k} : ${k} = ${p}, ${q * k} : ${k} = ${q}. Відповідь: ${p}:${q}.`,
    };
  }
}

const ODYNYTSI = [
  { velyka: 'м', mala: 'см', k: 100 },
  { velyka: 'кг', mala: 'г', k: 1000 },
  { velyka: 'год', mala: 'хв', k: 60 },
  { velyka: 'дм', mala: 'см', k: 10 },
];

function odynytsi(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  const dilnyky = [2, 4, 5, 10, 20, 25, 50].filter((d) => o.k % d === 0 && o.k / d >= 2);
  const d = r.vybir(dilnyky.length ? dilnyky : [2]);
  const mala = o.k / d;
  const n = r.chyslo(1, 5);
  return {
    pytannia: `Знайди відношення ${n} ${o.velyka} до ${mala} ${o.mala}.`,
    vidpovid: n * d,
    perevirka: (v) => v.replace(/\s/g, '') === `${n * d}:1`,
    pidkazka: `Спершу переведи в однакові одиниці: 1 ${o.velyka} = ${o.k} ${o.mala}.`,
    rozviazok: `${n} ${o.velyka} — це ${n * o.k} ${o.mala}; ${n * o.k} : ${mala} = ${n * d}.`,
  };
}

function desiatkove(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 9);
  const k = r.chyslo(2, 6);
  return {
    pytannia: 'Знайди відношення.',
    vyraz: `$${des(b * k, 1).replace(',', '{,}')} : ${des(b, 1).replace(',', '{,}')} =$`,
    vidpovid: k,
    pidkazka: 'Помнож обидва члени на 10 — відношення не зміниться.',
    rozviazok: `${des(b * k, 1)} : ${des(b, 1)} = ${b * k} : ${b} = ${k}`,
  };
}

/** Відношення дробових чисел → відношення натуральних: a/b : c/d, множимо на спільний знаменник. */
function dribni(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 2, 10);
    const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
    const n = nsk(b, d);
    if (n > 30) continue;
    const [x, y] = [(a * n) / b, (c * n) / d];
    const g = nsd(x, y);
    const [p, q] = [x / g, y / g];
    if (p === q) continue;
    return {
      pytannia: `Заміни відношення дробових чисел відношенням натуральних чисел. Запиши через двокрапку, наприклад «${zrazok(ZRAZKY.vidnoshennia, `${p}:${q}`)}».`,
      vyraz: `$${tdrib(a, b)} : ${tdrib(c, d)}$`,
      vidpovid: `${p}:${q}`,
      pidkazka: `Помнож обидва члени на спільний знаменник ${n}.`,
      rozviazok: `${a}/${b} · ${n} = ${x}, ${c}/${d} · ${n} = ${y}${g > 1 ? `; ${x} : ${g} = ${p}, ${y} : ${g} = ${q}` : ''}. Відповідь: ${p}:${q}.`,
    };
  }
}

export default {
  rivni: ['відношення як частка', 'скорочуємо, різні одиниці', 'дробові й десяткові члени'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? chastka(r) : skorotyty(r);
    if (riven === 2) return r.vybir([skorotyty, odynytsi, desiatkove])(r);
    return r.vybir([dribni, dribni, desiatkove, odynytsi])(r);
  },
} satisfies Henerator;
