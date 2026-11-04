// Скорочення дробів: основна властивість дробу (множимо чи ділимо чисельник і знаменник на те саме число);
// скорочення на спільний дільник і одразу на НСД; пропущений член рівних дробів; нескоротний дріб.
import { nsd, tdrib, ZRAZKY, rivnyiDrib, zrazok, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Нескоротний дріб a/b з b від 2 до maxB. */
function neskorotnyi(r: Vypadok, maxB: number) {
  for (;;) {
    const b = r.chyslo(2, maxB);
    const a = r.chyslo(1, b - 1);
    if (nsd(a, b) === 1) return [a, b];
  }
}

function skorotyty(r: Vypadok, mnozhnyky: number[], maxB: number): TrenZavdannia {
  const [a, b] = neskorotnyi(r, maxB);
  const k = r.vybir(mnozhnyky);
  return {
    pytannia: `Скороти дріб до нескоротного. Запиши через риску, наприклад ${zrazok(ZRAZKY.drib, `${a}/${b}`, rivnyiDrib(a, b))}.`,
    vyraz: `$${tdrib(a * k, b * k)} =$`,
    vidpovid: `${a}/${b}`,
    pidkazka: k <= 5 ? `На яке число діляться і ${a * k}, і ${b * k}?` : `Знайди НСД(${a * k}; ${b * k}) і поділи на нього обидва числа.`,
    rozviazok: `НСД(${a * k}; ${b * k}) = ${k}; $${tdrib(a * k, b * k)} = \\frac{${a * k} : ${k}}{${b * k} : ${k}} = ${tdrib(a, b)}$`,
  };
}

function propushchene(r: Vypadok): TrenZavdannia {
  const [a, b] = neskorotnyi(r, 10);
  const k = r.chyslo(2, 9);
  const chyselnyk = r.shans(0.6);
  return {
    pytannia: 'Знайди пропущене число.',
    vyraz: chyselnyk ? `$${tdrib(a, b)} = \\frac{\\square}{${b * k}}$` : `$${tdrib(a, b)} = \\frac{${a * k}}{\\square}$`,
    vidpovid: chyselnyk ? a * k : b * k,
    pidkazka: chyselnyk ? `${b * k} — це ${b}, помножене на скільки?` : `${a * k} — це ${a}, помножене на скільки?`,
    rozviazok: chyselnyk
      ? `${b * k} : ${b} = ${k}; ${a} · ${k} = ${a * k}`
      : `${a * k} : ${a} = ${k}; ${b} · ${k} = ${b * k}`,
  };
}

function yakyiNeskorotnyi(r: Vypadok): TrenZavdannia {
  const [a, b] = neskorotnyi(r, 20);
  const skorotni = new Set<string>();
  while (skorotni.size < 2) {
    const [c, d] = neskorotnyi(r, 9);
    const k = r.chyslo(2, 5);
    skorotni.add(`${c * k}/${d * k}`);
  }
  const pravylnyi = `${a}/${b}`;
  const varianty = r.peremishaty([pravylnyi, ...skorotni]);
  return {
    pytannia: 'Який із дробів нескоротний?',
    vidpovid: pravylnyi,
    varianty,
    pidkazka: 'У нескоротного дробу в чисельника і знаменника немає спільних дільників, крім 1.',
    rozviazok: `НСД(${a}; ${b}) = 1, тож ${pravylnyi} не скорочується. ${[...skorotni].map((s) => {
      const [c, d] = s.split('/').map(Number);
      return `${s}: НСД = ${nsd(c, d)}`;
    }).join('; ')}.`,
  };
}

export default {
  rivni: ['скорочуємо на 2, 3, 5', 'скорочуємо на НСД, пропущене число', 'великі числа і нескоротні дроби'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.75) ? skorotyty(r, [2, 3, 5], 9) : propushchene(r);
    if (riven === 2) return r.vybir([(rr: Vypadok) => skorotyty(rr, [4, 6, 7, 8, 9, 10, 12], 12), propushchene])(r);
    return r.vybir([(rr: Vypadok) => skorotyty(rr, [12, 14, 15, 16, 18, 21, 24, 25], 15), yakyiNeskorotnyi])(r);
  },
} satisfies Henerator;
