// Відрізок, промінь і пряма: чим відрізняються; довжина відрізка з частин; скільки відрізків дають точки на прямій.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const VYDY = ['відрізок', 'промінь', 'пряма'];

const OZNAKY = [
  { pytannia: 'Що з цього має рівно один кінець?', vidpovid: 'промінь', chomu: 'Промінь починається в точці й іде безмежно в один бік.' },
  { pytannia: 'Що з цього має два кінці?', vidpovid: 'відрізок', chomu: 'Відрізок обмежений двома точками — кінцями.' },
  { pytannia: 'Що з цього не має жодного кінця?', vidpovid: 'пряма', chomu: 'Пряма продовжується безмежно в обидва боки.' },
  { pytannia: 'Що з цього можна виміряти лінійкою?', vidpovid: 'відрізок', chomu: 'Лише відрізок має довжину: промінь і пряма безмежні.' },
  { pytannia: 'Сонячний промінчик іде від Сонця. Яку фігуру він нагадує?', vidpovid: 'промінь', chomu: 'Є початок (Сонце), а кінця немає.' },
  { pytannia: 'Натягнута нитка між двома цвяхами — це модель…', vidpovid: 'відрізок', chomu: 'Нитка має два кінці — цвяхи.' },
];

function oznaky(r: Vypadok): TrenZavdannia {
  const o = r.vybir(OZNAKY);
  return { pytannia: o.pytannia, vidpovid: o.vidpovid, varianty: VYDY, pidkazka: 'Згадай, скільки кінців у кожної фігури.', rozviazok: o.chomu };
}

function skilkyPriamykh(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 1);
  return typ === 0
    ? {
        pytannia: 'Скільки прямих можна провести через дві точки?',
        vidpovid: 'одну',
        varianty: ['одну', 'дві', 'скільки завгодно'],
        pidkazka: 'Прикладай лінійку до двох точок — чи можна по-іншому?',
        rozviazok: 'Через дві точки проходить лише одна пряма.',
      }
    : {
        pytannia: 'Скільки прямих можна провести через одну точку?',
        vidpovid: 'скільки завгодно',
        varianty: ['одну', 'дві', 'скільки завгодно'],
        pidkazka: 'Поверти лінійку навколо точки.',
        rozviazok: 'Через одну точку — безліч прямих, у будь-якому напрямку.',
      };
}

const BUKVY = ['A', 'B', 'C', 'D', 'K', 'M', 'N', 'P'];

function chastyny(r: Vypadok, odynytsi: string, max: number): TrenZavdannia {
  const [p, q, s] = r.rizni(3, 0, BUKVY.length - 1).map((i) => BUKVY[i]);
  const a = r.chyslo(2, max);
  const b = r.chyslo(2, max);
  if (r.shans()) {
    return {
      pytannia: `Точка ${s} лежить на відрізку ${p}${q}. ${p}${s} = ${a} ${odynytsi}, ${s}${q} = ${b} ${odynytsi}. Знайди ${p}${q}.`,
      vidpovid: a + b,
      odynytsi,
      pidkazka: 'Довжина всього відрізка — сума частин.',
      rozviazok: `${p}${q} = ${a} + ${b} = ${a + b} (${odynytsi})`,
    };
  }
  return {
    pytannia: `Точка ${s} лежить на відрізку ${p}${q}. ${p}${q} = ${a + b} ${odynytsi}, ${p}${s} = ${a} ${odynytsi}. Знайди ${s}${q}.`,
    vidpovid: b,
    odynytsi,
    pidkazka: 'Від усього відрізка відніми відому частину.',
    rozviazok: `${s}${q} = ${a + b} − ${a} = ${b} (${odynytsi})`,
  };
}

function rizniOdynytsi(r: Vypadok): TrenZavdannia {
  const [p, q, s] = r.rizni(3, 0, BUKVY.length - 1).map((i) => BUKVY[i]);
  const a = r.chyslo(2, 9);
  const b = r.chyslo(11, 89);
  return {
    pytannia: `Точка ${s} лежить на відрізку ${p}${q}. ${p}${s} = ${a} см, ${s}${q} = ${b} мм. Знайди ${p}${q} у міліметрах.`,
    vidpovid: 10 * a + b,
    odynytsi: 'мм',
    pidkazka: 'Спершу переведи сантиметри в міліметри: 1 см = 10 мм.',
    rozviazok: `${a} см = ${10 * a} мм; ${10 * a} + ${b} = ${10 * a + b} (мм)`,
  };
}

function vidrizkyNaPriamii(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 6);
  const v = (n * (n - 1)) / 2;
  return {
    pytannia: `На прямій позначили ${n} ${mnozh(n, 'точку', 'точки', 'точок')}. Скільки відрізків з кінцями в цих точках утворилося?`,
    vidpovid: v,
    pidkazka: 'Від першої точки — до кожної наступної, від другої — до кожної наступної, і так далі.',
    rozviazok: `${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(' + ')} = ${v}`,
  };
}

export default {
  rivni: ['відрізок, промінь, пряма; прості довжини', 'довжина відрізка з частин', 'різні одиниці і скільки відрізків'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([() => oznaky(r), () => oznaky(r), () => skilkyPriamykh(r), () => chastyny(r, 'см', 10)])();
    if (riven === 2) return r.shans(0.75) ? chastyny(r, r.vybir(['см', 'дм', 'мм']), 30) : oznaky(r);
    return r.vybir([rizniOdynytsi, vidrizkyNaPriamii, (rr: Vypadok) => chastyny(rr, 'см', 99), skilkyPriamykh])(r);
  },
} satisfies Henerator;
