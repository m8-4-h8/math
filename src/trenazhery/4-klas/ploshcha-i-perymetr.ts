// Площа і периметр прямокутника й квадрата; невідома сторона за площею чи периметром; складені фігури.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function priamyi(r: Vypadok, max: number): TrenZavdannia {
  const kvadrat = r.shans(0.3);
  const a = r.chyslo(2, max);
  const b = kvadrat ? a : r.krim(2, max, [a]);
  const fihura = kvadrat ? `Сторона квадрата ${a} см.` : `Довжина прямокутника ${a} см, ширина ${b} см.`;
  return r.shans()
    ? {
        pytannia: `${fihura} Знайди площу.`,
        vidpovid: a * b,
        odynytsi: 'см²',
        pidkazka: 'Площа — довжина помножити на ширину.',
        rozviazok: `S = ${a} · ${b} = ${a * b} (см²)`,
      }
    : {
        pytannia: `${fihura} Знайди периметр.`,
        vidpovid: 2 * (a + b),
        odynytsi: 'см',
        pidkazka: kvadrat ? 'У квадрата 4 однакові сторони.' : 'Периметр — сума всіх чотирьох сторін.',
        rozviazok: kvadrat ? `P = ${a} · 4 = ${4 * a} (см)` : `P = (${a} + ${b}) · 2 = ${2 * (a + b)} (см)`,
      };
}

function obernena(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 12);
  const b = r.krim(2, 12, [a]);
  return r.vybir<TrenZavdannia>([
    {
      pytannia: `Площа прямокутника ${a * b} см², довжина ${a} см. Знайди ширину.`,
      vidpovid: b,
      odynytsi: 'см',
      pidkazka: 'Невідома сторона = площа : відома сторона.',
      rozviazok: `${a * b} : ${a} = ${b} (см)`,
    },
    {
      pytannia: `Периметр прямокутника ${2 * (a + b)} см, довжина ${a} см. Знайди ширину.`,
      vidpovid: b,
      odynytsi: 'см',
      pidkazka: 'Половина периметра — це довжина + ширина.',
      rozviazok: `${2 * (a + b)} : 2 = ${a + b} (см); ${a + b} − ${a} = ${b} (см)`,
    },
    {
      pytannia: `Площа квадрата ${a * a} см². Яка його сторона?`,
      vidpovid: a,
      odynytsi: 'см',
      pidkazka: 'Яке число, помножене саме на себе, дає площу?',
      rozviazok: `${a} · ${a} = ${a * a}, тож сторона ${a} см.`,
    },
    {
      pytannia: `Периметр квадрата ${4 * a} см. Знайди його площу.`,
      vidpovid: a * a,
      odynytsi: 'см²',
      pidkazka: 'Спершу сторона: периметр : 4.',
      rozviazok: `${4 * a} : 4 = ${a} (см); ${a} · ${a} = ${a * a} (см²)`,
    },
  ]);
}

function skladena(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const a = r.chyslo(6, 15);
    const b = r.chyslo(4, 10);
    const c = r.chyslo(2, a - 2);
    const d = r.chyslo(2, b - 1);
    return {
      pytannia: `Із прямокутника ${a} см на ${b} см вирізали прямокутник ${c} см на ${d} см. Яка площа фігури, що лишилась?`,
      vidpovid: a * b - c * d,
      odynytsi: 'см²',
      pidkazka: 'Від площі великого прямокутника відніми площу вирізаного.',
      rozviazok: `${a} · ${b} − ${c} · ${d} = ${a * b} − ${c * d} = ${a * b - c * d} (см²)`,
    };
  }
  const a = r.chyslo(10, 40);
  const b = r.chyslo(5, 25);
  const tsina = r.chyslo(2, 9);
  return {
    pytannia: `Підлога має форму прямокутника ${a} дм на ${b} дм. Фарба для 1 дм² коштує ${tsina} коп. Скільки копійок коштує фарба для всієї підлоги?`,
    vidpovid: a * b * tsina,
    odynytsi: 'коп.',
    pidkazka: 'Спершу знайди площу підлоги.',
    rozviazok: `${a} · ${b} = ${a * b} (дм²); ${a * b} · ${tsina} = ${a * b * tsina} (коп.)`,
  };
}

export default {
  rivni: ['площа і периметр', 'невідома сторона', 'складені фігури й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return priamyi(r, 9);
    if (riven === 2) return r.shans() ? obernena(r) : priamyi(r, 20);
    return r.vybir([skladena, skladena, obernena])(r);
  },
} satisfies Henerator;
