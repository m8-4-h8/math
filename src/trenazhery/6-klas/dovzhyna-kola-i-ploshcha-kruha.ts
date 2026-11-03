// Довжина кола і площа круга (π ≈ 3,14): радіус — половина діаметра; C = 2πr = πd; S = πr²;
// колесо за оберт проходить довжину свого кола; радіус за довжиною кола.
import { des, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

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
      pidkazka: `C = 2 · 3,14 · r.`,
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

function ploshcha(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 12);
  if (r.shans()) {
    return {
      pytannia: `Знайди площу круга радіусом ${rr} см. Візьми π ≈ 3,14.`,
      vidpovid: pi(rr * rr),
      odynytsi: 'см²',
      pidkazka: `S = 3,14 · r · r.`,
      rozviazok: `3,14 · ${rr} · ${rr} = 3,14 · ${rr * rr} = ${pi(rr * rr)} (см²)`,
    };
  }
  return {
    pytannia: `Діаметр круга ${2 * rr} см. Знайди його площу. Візьми π ≈ 3,14.`,
    vidpovid: pi(rr * rr),
    odynytsi: 'см²',
    pidkazka: `Спершу радіус: ${2 * rr} : 2. Не підставляй діаметр у формулу площі!`,
    rozviazok: `r = ${2 * rr} : 2 = ${rr}; 3,14 · ${rr} · ${rr} = ${pi(rr * rr)} (см²)`,
  };
}

function koleso(r: Vypadok): TrenZavdannia {
  const d = r.vybir([40, 50, 60, 70]);
  const n = r.vybir([10, 20, 50, 100, 200]);
  const sm = 314 * d * n; // у сотих сантиметра
  return {
    pytannia: `Діаметр колеса велосипеда ${d} см. Скільки метрів проїде велосипед, коли колесо зробить ${n} обертів? Візьми π ≈ 3,14.`,
    vidpovid: des(sm, 4),
    odynytsi: 'м',
    pidkazka: `За один оберт колесо проходить довжину свого кола: 3,14 · ${d} см.`,
    rozviazok: `3,14 · ${d} = ${des(314 * d, 2)} (см) — один оберт; ${des(314 * d, 2)} · ${n} = ${des(sm, 2)} (см), тобто ${des(sm, 4)} м.`,
  };
}

function radiusZaDovzhynoiu(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 15);
  return {
    pytannia: `Довжина кола ${pi(2 * rr)} см. Знайди його радіус. Візьми π ≈ 3,14.`,
    vidpovid: rr,
    odynytsi: 'см',
    pidkazka: 'C = 2 · 3,14 · r, тож r = C : 6,28.',
    rozviazok: `${pi(2 * rr)} : 6,28 = ${rr} (см)`,
  };
}

export default {
  rivni: ['радіус, діаметр, довжина кола', 'площа круга', 'колесо і радіус за довжиною'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.35) ? radius(r) : dovzhyna(r);
    if (riven === 2) return r.shans(0.7) ? ploshcha(r) : dovzhyna(r);
    return r.vybir([koleso, radiusZaDovzhynoiu, ploshcha])(r);
  },
} satisfies Henerator;
