// Ділення дробів: обернене число (міняємо місцями чисельник і знаменник); ділити на дріб — множити на
// обернений; ділення на натуральне число; мішані числа; число за його дробом — ділення на дріб.
import {
  neskorotnyiChyselnyk,
  neskorotnyiDrib,
  nsd,
  skilky,
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

function obernene(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const b = r.chyslo(2, 12);
    const a = neskorotnyiChyselnyk(r, b);
    return {
      pytannia: `Яке число обернене до $${tdrib(a, b)}$? Запиши дробом через риску.`,
      ...vidpovid(b, a),
      pidkazka: 'Поміняй місцями чисельник і знаменник.',
      rozviazok: `$${tdrib(a, b)} \\cdot ${tdrib(b, a)} = 1$, тож обернене — $${tvidpovidDrib(b, a)}$.`,
    };
  }
  if (typ === 1) {
    const n = r.chyslo(2, 15);
    return {
      pytannia: `Яке число обернене до $${n}$? Запиши дробом через риску.`,
      ...vidpovid(1, n),
      pidkazka: `${n} = ${n}/1.`,
      rozviazok: `$${n} = ${tdrib(n, 1)}$, обернене — $${tdrib(1, n)}$.`,
    };
  }
  const b = r.chyslo(2, 7);
  const a = neskorotnyiChyselnyk(r, b);
  const t = r.chyslo(1, 3);
  return {
    pytannia: `Яке число обернене до $${t}${tdrib(a, b)}$? Запиши дробом через риску.`,
    ...vidpovid(b, t * b + a),
    pidkazka: 'Спершу запиши мішане число неправильним дробом.',
    rozviazok: `$${t}${tdrib(a, b)} = ${tdrib(t * b + a, b)}$, обернене — $${tdrib(b, t * b + a)}$.`,
  };
}

function naNaturalne(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 9);
  const n = r.chyslo(2, 6);
  let a = r.shans() ? n * r.chyslo(1, 3) : neskorotnyiChyselnyk(r, b);
  while (nsd(a, b) !== 1) a = r.shans() ? n * r.chyslo(1, 3) : neskorotnyiChyselnyk(r, b);
  return {
    pytannia: 'Обчисли. Відповідь скороти.',
    vyraz: `$${tdrib(a, b)} : ${n} =$`,
    ...vidpovid(a, b * n),
    pidkazka: `Поділити на ${n} — те саме, що помножити на $${tdrib(1, n)}$.`,
    rozviazok: `$${tdrib(a, b)} : ${n} = ${tdrib(a, b)} \\cdot ${tdrib(1, n)} = ${tdrib(a, b * n)}$${
      vidpovidDrib(a, b * n)[0] !== `${a}/${b * n}` ? ` $= ${tvidpovidDrib(a, b * n)}$` : ''
    }`,
  };
}

function dribNaDrib(r: Vypadok): TrenZavdannia {
  if (r.shans(0.25)) {
    const d = r.chyslo(2, 9);
    const c = neskorotnyiChyselnyk(r, d);
    const n = c * r.chyslo(1, 4);
    return {
      pytannia: 'Обчисли. Відповідь скороти.',
      vyraz: `$${n} : ${tdrib(c, d)} =$`,
      ...vidpovid(n * d, c),
      pidkazka: `Ділити на $${tdrib(c, d)}$ — помножити на $${tdrib(d, c)}$.`,
      rozviazok: `$${n} : ${tdrib(c, d)} = ${n} \\cdot ${tdrib(d, c)} = ${tvidpovidDrib(n * d, c)}$`,
    };
  }
  const [b, d] = [r.chyslo(2, 10), r.chyslo(2, 10)];
  const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  return {
    pytannia: 'Обчисли. Відповідь скороти.',
    vyraz: `$${tdrib(a, b)} : ${tdrib(c, d)} =$`,
    ...vidpovid(a * d, b * c),
    pidkazka: `Переверни дільник: $${tdrib(c, d)} \\to ${tdrib(d, c)}$, і помнож.`,
    rozviazok: `$${tdrib(a, b)} : ${tdrib(c, d)} = ${tdrib(a, b)} \\cdot ${tdrib(d, c)} = ${tdrib(a * d, b * c)}$${
      vidpovidDrib(a * d, b * c)[0] !== `${a * d}/${b * c}` || a * d > b * c ? ` $= ${tvidpovidDrib(a * d, b * c)}$` : ''
    }`,
  };
}

function mishani(r: Vypadok): TrenZavdannia {
  const [b, d] = [r.chyslo(2, 6), r.chyslo(2, 6)];
  const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  const [t1, t2] = [r.chyslo(1, 4), r.chyslo(1, 3)];
  const [x, y] = [t1 * b + a, t2 * d + c];
  return {
    pytannia: 'Обчисли. Відповідь запиши мішаним, цілим числом або нескоротним дробом.',
    vyraz: `$${t1}${tdrib(a, b)} : ${t2}${tdrib(c, d)} =$`,
    ...vidpovid(x * d, b * y),
    pidkazka: 'Спершу перетвори мішані числа на неправильні дроби, потім переверни дільник.',
    rozviazok: `$${t1}${tdrib(a, b)} : ${t2}${tdrib(c, d)} = ${tdrib(x, b)} : ${tdrib(y, d)} = ${tdrib(x, b)} \\cdot ${tdrib(d, y)} = ${tdrib(x * d, b * y)}$${
      vidpovidDrib(x * d, b * y)[0] !== `${x * d}/${b * y}` || x * d > b * y ? ` $= ${tvidpovidDrib(x * d, b * y)}$` : ''
    }`,
  };
}

function chysloZaDrobom(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 9);
  const a = neskorotnyiChyselnyk(r, b);
  const chyslo = b * r.chyslo(2, 12);
  const chastyna = (chyslo / b) * a;
  const s = r.vybir([
    `$${tdrib(a, b)}$ числа дорівнюють ${chastyna}. Знайди це число.`,
    `Тарас прочитав ${skilky(chastyna, 'сторінку', 'сторінки', 'сторінок')}, це $${tdrib(a, b)}$ книжки. Скільки сторінок у книжці?`,
    `За день пройшли ${chastyna} км, це $${tdrib(a, b)}$ маршруту. Яка довжина маршруту (у км)?`,
  ]);
  return {
    pytannia: s,
    vidpovid: chyslo,
    pidkazka: `Число за його дробом — ділимо на дріб: ${chastyna} : $${tdrib(a, b)}$.`,
    rozviazok: `$${chastyna} : ${tdrib(a, b)} = ${chastyna} \\cdot ${tdrib(b, a)} = ${chyslo}$`,
  };
}

export default {
  rivni: ['обернене число, ділимо на число', 'дріб на дріб', 'мішані числа і число за дробом'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.45) ? obernene(r) : naNaturalne(r);
    if (riven === 2) return r.shans(0.8) ? dribNaDrib(r) : obernene(r);
    return r.vybir([mishani, mishani, chysloZaDrobom, dribNaDrib])(r);
  },
} satisfies Henerator;
