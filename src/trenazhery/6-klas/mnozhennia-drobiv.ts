// Множення дробів: чисельник на чисельник, знаменник на знаменник; скорочення навхрест до множення;
// дріб від числа і від дробу — множення; мішані числа — спершу в неправильні дроби.
import {
  neskorotnyiChyselnyk,
  neskorotnyiDrib,
  nsd,
  skorotyty,
  tdrib,
  tvidpovidDrib,
  vidpovidDrib,
  type Henerator,
  type Vypadok,
  type TrenZavdannia,
} from '../dopomoha.ts';

const vidpovid = (n: number, d: number) => ({
  vidpovid: vidpovidDrib(n, d),
  pokaz: `$${tvidpovidDrib(n, d)}$`,
  perevirka: neskorotnyiDrib(n, d),
});

function naNaturalne(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(3, 12);
  const a = neskorotnyiChyselnyk(r, b);
  const n = r.chyslo(2, 9);
  return {
    pytannia: 'Обчисли. Відповідь скороти.',
    vyraz: `$${tdrib(a, b)} \\cdot ${n} =$`,
    ...vidpovid(a * n, b),
    pidkazka: 'Множимо лише чисельник, знаменник лишається.',
    rozviazok: `$${tdrib(a, b)} \\cdot ${n} = \\frac{${a} \\cdot ${n}}{${b}} = ${tdrib(a * n, b)}$${
      skorotyty(a * n, b)[1] !== b || a * n > b ? ` $= ${tvidpovidDrib(a * n, b)}$` : ''
    }`,
  };
}

/** Два дроби; navkhrest — підібрати так, щоб можна було скоротити навхрест. */
function dvaDroby(r: Vypadok, navkhrest: boolean): TrenZavdannia {
  let [b, d] = [r.chyslo(2, 9), r.chyslo(2, 9)];
  let [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  // Навхрест: чисельник одного й знаменник іншого мають спільний дільник.
  while (navkhrest && nsd(a, d) === 1 && nsd(c, b) === 1) {
    [b, d] = [r.chyslo(2, 12), r.chyslo(2, 12)];
    [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  }
  const [n, z] = [a * c, b * d];
  return {
    pytannia: 'Обчисли. Відповідь скороти.',
    vyraz: `$${tdrib(a, b)} \\cdot ${tdrib(c, d)} =$`,
    ...vidpovid(n, z),
    pidkazka: navkhrest ? 'Перш ніж множити, скороти навхрест: чисельник одного дробу зі знаменником іншого.' : 'Чисельник на чисельник, знаменник на знаменник.',
    rozviazok: `$${tdrib(a, b)} \\cdot ${tdrib(c, d)} = \\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = ${tdrib(n, z)}$${
      skorotyty(n, z)[1] !== z || n > z ? ` $= ${tvidpovidDrib(n, z)}$` : ''
    }`,
  };
}

function dribVidDrobu(r: Vypadok): TrenZavdannia {
  const [b, d] = [r.chyslo(2, 9), r.chyslo(2, 9)];
  const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  const s = r.vybir([
    { p: `Знайди $${tdrib(a, b)}$ від $${tdrib(c, d)}$.`, od: undefined },
    { p: `Ділянка має площу $${tdrib(c, d)}$ га. На $${tdrib(a, b)}$ ділянки посадили картоплю. Яка площа під картоплею?`, od: 'га' },
    { p: `У пляшці $${tdrib(c, d)}$ л соку. Оля випила $${tdrib(a, b)}$ соку. Скільки літрів вона випила?`, od: 'л' },
  ]);
  return {
    pytannia: `${s.p} Відповідь скороти.`,
    ...vidpovid(a * c, b * d),
    odynytsi: s.od,
    pidkazka: `«$${tdrib(a, b)}$ від $${tdrib(c, d)}$» — це $${tdrib(a, b)} \\cdot ${tdrib(c, d)}$.`,
    rozviazok: `$${tdrib(a, b)} \\cdot ${tdrib(c, d)} = ${tdrib(a * c, b * d)}$${skorotyty(a * c, b * d)[1] !== b * d ? ` $= ${tvidpovidDrib(a * c, b * d)}$` : ''}`,
  };
}

const mishane = (t: number, o: number, d: number) => `${t}${tdrib(o, d)}`;

function mishani(r: Vypadok): TrenZavdannia {
  const [b, d] = [r.chyslo(2, 6), r.chyslo(2, 6)];
  const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  const [t1, t2] = [r.chyslo(1, 3), r.chyslo(1, 3)];
  const [x, y] = [t1 * b + a, t2 * d + c];
  if (r.shans(0.3)) {
    const n = r.chyslo(2, 6);
    return {
      pytannia: 'Обчисли. Відповідь запиши мішаним або цілим числом.',
      vyraz: `$${mishane(t1, a, b)} \\cdot ${n} =$`,
      ...vidpovid(x * n, b),
      pidkazka: `Спершу перетвори мішане число на неправильний дріб: $${mishane(t1, a, b)} = ${tdrib(x, b)}$.`,
      rozviazok: `$${mishane(t1, a, b)} \\cdot ${n} = ${tdrib(x, b)} \\cdot ${n} = ${tdrib(x * n, b)} = ${tvidpovidDrib(x * n, b)}$`,
    };
  }
  return {
    pytannia: 'Обчисли. Відповідь запиши мішаним або цілим числом.',
    vyraz: `$${mishane(t1, a, b)} \\cdot ${mishane(t2, c, d)} =$`,
    ...vidpovid(x * y, b * d),
    pidkazka: 'Спершу перетвори обидва мішані числа на неправильні дроби.',
    rozviazok: `$${mishane(t1, a, b)} \\cdot ${mishane(t2, c, d)} = ${tdrib(x, b)} \\cdot ${tdrib(y, d)} = ${tdrib(x * y, b * d)} = ${tvidpovidDrib(x * y, b * d)}$`,
  };
}

export default {
  rivni: ['дріб на число і дріб на дріб', 'скорочуємо навхрест, дріб від дробу', 'мішані числа'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? naNaturalne(r) : dvaDroby(r, false);
    if (riven === 2) return r.vybir([(rr: Vypadok) => dvaDroby(rr, true), (rr: Vypadok) => dvaDroby(rr, true), dribVidDrobu])(r);
    return r.vybir([mishani, mishani, dribVidDrobu, (rr: Vypadok) => dvaDroby(rr, true)])(r);
  },
} satisfies Henerator;
