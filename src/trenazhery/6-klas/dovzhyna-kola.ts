// Коло. Довжина кола (Істер § 23): радіус — половина діаметра; C = πd = 2πr (π ≈ 3,14); діаметр і радіус
// за довжиною кола; колесо за оберт проходить довжину свого кола; π ≈ 22/7, коли діаметр ділиться на 7;
// довжина кола пропорційна радіусу.
import { ch, des, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Числа в сотих: 314 · n — це 3,14 · n. */
const pi = (n: number) => des(314 * n, 2);

function radius(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(2, 25);
  return r.shans()
    ? {
        pytannia: `Діаметр кола ${2 * rr} см. Який його радіус?`,
        vidpovid: rr,
        odynytsi: 'см',
        pidkazka: 'Радіус — половина діаметра.',
        rozviazok: `${2 * rr} : 2 = ${rr} (см)`,
      }
    : {
        pytannia: `Радіус кола ${rr} см. Який його діаметр?`,
        vidpovid: 2 * rr,
        odynytsi: 'см',
        pidkazka: 'Діаметр — два радіуси.',
        rozviazok: `${rr} · 2 = ${2 * rr} (см)`,
      };
}

function dovzhyna(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 20);
  const od = r.vybir(['см', 'дм', 'м']);
  if (r.shans()) {
    return {
      pytannia: `Знайди довжину кола радіусом ${rr} ${od}. Візьми π ≈ 3,14.`,
      vidpovid: pi(2 * rr),
      odynytsi: od,
      pidkazka: 'Дано радіус: C = 2 · 3,14 · r.',
      rozviazok: `2 · 3,14 · ${rr} = ${pi(2 * rr)} (${od})`,
    };
  }
  return {
    pytannia: `Діаметр кола ${2 * rr} ${od}. Знайди його довжину. Візьми π ≈ 3,14.`,
    vidpovid: pi(2 * rr),
    odynytsi: od,
    pidkazka: 'Дано діаметр: C = 3,14 · d.',
    rozviazok: `3,14 · ${2 * rr} = ${pi(2 * rr)} (${od})`,
  };
}

function zaDovzhynoiu(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 15);
  const od = r.vybir(['см', 'дм', 'м']);
  if (r.shans()) {
    return {
      pytannia: `Довжина кола ${pi(2 * rr)} ${od}. Знайди його діаметр. Візьми π ≈ 3,14.`,
      vidpovid: 2 * rr,
      odynytsi: od,
      pidkazka: 'C = 3,14 · d, тож d = C : 3,14.',
      rozviazok: `${pi(2 * rr)} : 3,14 = ${2 * rr} (${od}). Перевірка: 3,14 · ${2 * rr} = ${pi(2 * rr)} ✓`,
    };
  }
  return {
    pytannia: `Довжина кола ${pi(2 * rr)} ${od}. Знайди його радіус. Візьми π ≈ 3,14.`,
    vidpovid: rr,
    odynytsi: od,
    pidkazka: 'C = 2 · 3,14 · r = 6,28 · r, тож r = C : 6,28.',
    rozviazok: `${pi(2 * rr)} : 6,28 = ${rr} (${od})`,
  };
}

/** π ≈ 22/7, коли діаметр (чи радіус) ділиться на 7. */
function dvadtsiatDvaSomykh(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(1, 10);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const d = 7 * k;
    return {
      pytannia: `Діаметр кола ${d} см. Знайди його довжину, якщо π ≈ 22/7.`,
      vidpovid: 22 * k,
      odynytsi: 'см',
      pidkazka: `C = 22/7 · ${d} = 22 · (${d} : 7).`,
      rozviazok: `${d} : 7 = ${k}; 22 · ${k} = ${22 * k} (см)`,
    };
  }
  if (typ === 1) {
    const rr = 7 * k;
    return {
      pytannia: `Радіус кола ${rr} дм. Знайди його довжину, якщо π ≈ 22/7.`,
      vidpovid: 44 * k,
      odynytsi: 'дм',
      pidkazka: `C = 2 · 22/7 · ${rr}. Спершу ${rr} : 7.`,
      rozviazok: `${rr} : 7 = ${k}; 2 · 22 · ${k} = ${44 * k} (дм)`,
    };
  }
  return {
    pytannia: `Довжина кола ${22 * k} см. Знайди його діаметр, якщо π ≈ 22/7.`,
    vidpovid: 7 * k,
    odynytsi: 'см',
    pidkazka: `d = C : 22/7 = C · 7/22.`,
    rozviazok: `${22 * k} : 22 = ${k}; ${k} · 7 = ${7 * k} (см)`,
  };
}

function koleso(r: Vypadok): TrenZavdannia {
  const [shcho, d] = r.vybir([
    ['велосипеда', r.vybir([40, 50, 60, 70])],
    ['самоката', r.vybir([10, 15, 20, 25])],
    ['дитячої коляски', r.vybir([20, 25, 30])],
  ] as const);
  const n = r.vybir([10, 20, 50, 100, 200]);
  const sm = 314 * d * n; // у сотих сантиметра
  return {
    pytannia: `Діаметр колеса ${shcho} ${d} см. Скільки метрів проїде ${shcho === 'велосипеда' ? 'велосипед' : shcho === 'самоката' ? 'самокат' : 'коляска'}, коли колесо зробить ${n} обертів? Візьми π ≈ 3,14.`,
    vidpovid: des(sm, 4),
    odynytsi: 'м',
    pidkazka: `За один оберт колесо проходить довжину свого кола: 3,14 · ${d} см.`,
    rozviazok: `3,14 · ${d} = ${des(314 * d, 2)} (см) — один оберт; ${des(314 * d, 2)} · ${n} = ${des(sm, 2)} (см), тобто ${des(sm, 4)} м.`,
  };
}

/** Скільки обертів зробить колесо на даній відстані. */
function oberty(r: Vypadok): TrenZavdannia {
  const d = r.vybir([50, 100, 25, 20]); // см: тоді довжина кола 157, 314, 78,5, 62,8 см
  const n = r.vybir([100, 200, 500, 1000]);
  const vidstan = 314 * d * n; // у сотих сантиметра
  return {
    pytannia: `Діаметр колеса ${d} см. Скільки обертів зробить колесо на шляху ${des(vidstan, 4)} м? Візьми π ≈ 3,14.`,
    vidpovid: n,
    pidkazka: `Знайди довжину кола в сантиметрах і переведи шлях у сантиметри.`,
    rozviazok: `3,14 · ${d} = ${des(314 * d, 2)} (см) — один оберт; шлях — ${des(vidstan, 2)} см; ${des(vidstan, 2)} : ${des(314 * d, 2)} = ${ch(n)} (обертів)`,
  };
}

/** Довжина кола пропорційна радіусу. */
function proportsiina(r: Vypadok): TrenZavdannia {
  const k = r.vybir([2, 3, 4, 5, 10]);
  const zbilshyly = r.shans();
  const shcho = r.shans() ? 'Радіус' : 'Діаметр';
  return {
    pytannia: `${shcho} кола ${zbilshyly ? 'збільшили' : 'зменшили'} в ${k} ${k < 5 ? 'рази' : 'разів'}. У скільки разів ${zbilshyly ? 'збільшилась' : 'зменшилась'} довжина кола?`,
    vidpovid: k,
    varianty: [...new Set([k, 2 * k, k * k])].sort((a, b) => a - b),
    pidkazka: 'C = 3,14 · d: довжина кола прямо пропорційна діаметру.',
    rozviazok: `Довжина кола прямо пропорційна ${shcho === 'Радіус' ? 'радіусу' : 'діаметру'}: у скільки разів змінився ${shcho.toLowerCase()}, у стільки ж змінилась і довжина — у ${k}.`,
  };
}

export default {
  rivni: ['радіус, діаметр, довжина кола', 'діаметр і радіус за довжиною кола', 'колеса, π ≈ 22/7'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([radius, dovzhyna, dovzhyna])(r);
    if (riven === 2) return r.vybir([zaDovzhynoiu, zaDovzhynoiu, dovzhyna, proportsiina])(r);
    return r.vybir([koleso, oberty, dvadtsiatDvaSomykh, dvadtsiatDvaSomykh, zaDovzhynoiu])(r);
  },
} satisfies Henerator;
