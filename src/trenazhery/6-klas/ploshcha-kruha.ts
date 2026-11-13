// Круг. Площа круга. Круговий сектор (Істер § 24): S = πr² (π ≈ 3,14); за діаметром — спершу радіус; півкруг;
// радіус за площею; площа пропорційна квадрату радіуса; кут сектора (повний кут 360°), яку частину круга
// становить сектор і яка його площа.
import { des, skorotyty, tvidpovidDrib, vidpovidDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Числа в сотих: 314 · n — це 3,14 · n. */
const pi = (n: number) => des(314 * n, 2);

function ploshcha(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 15);
  const od = r.vybir(['см', 'дм', 'м']);
  return {
    pytannia: `Знайди площу круга радіусом ${rr} ${od}. Візьми π ≈ 3,14.`,
    vidpovid: pi(rr * rr),
    odynytsi: `${od}²`,
    pidkazka: `S = 3,14 · r · r = 3,14 · ${rr} · ${rr}.`,
    rozviazok: `3,14 · ${rr} · ${rr} = 3,14 · ${rr * rr} = ${pi(rr * rr)} (${od}²)`,
  };
}

function zaDiametrom(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 12);
  const [shcho, kotra] = r.vybir([
    ['круга', 'його'],
    ['круглої клумби', 'її'],
    ['круглого килимка', 'його'],
  ] as const);
  const od = shcho === 'круга' ? 'см' : 'м';
  const malyi = shcho === 'круглого килимка' ? Math.min(rr, 3) : rr;
  return {
    pytannia: `Діаметр ${shcho} ${2 * malyi} ${od}. Знайди ${kotra} площу. Візьми π ≈ 3,14.`,
    vidpovid: pi(malyi * malyi),
    odynytsi: `${od}²`,
    pidkazka: `Спершу радіус: ${2 * malyi} : 2. Діаметр у формулу площі не підставляють!`,
    rozviazok: `r = ${2 * malyi} : 2 = ${malyi}; 3,14 · ${malyi} · ${malyi} = ${pi(malyi * malyi)} (${od}²)`,
  };
}

function pivkruh(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 12);
  const pol = 157 * rr * rr; // площа півкруга в сотих
  return {
    pytannia: `Знайди площу півкруга радіусом ${rr} см. Візьми π ≈ 3,14.`,
    vidpovid: des(pol, 2),
    odynytsi: 'см²',
    pidkazka: 'Півкруг — половина круга: знайди площу круга і поділи на 2.',
    rozviazok: `3,14 · ${rr} · ${rr} = ${pi(rr * rr)} (см²); ${pi(rr * rr)} : 2 = ${des(pol, 2)} (см²)`,
  };
}

function radiusZaPloshcheiu(r: Vypadok): TrenZavdannia {
  const rr = r.chyslo(1, 12);
  return {
    pytannia: `Площа круга ${pi(rr * rr)} см². Знайди його радіус. Візьми π ≈ 3,14.`,
    vidpovid: rr,
    odynytsi: 'см',
    pidkazka: `Спершу r · r = ${pi(rr * rr)} : 3,14. Потім добери число, яке на себе дає стільки.`,
    rozviazok: `${pi(rr * rr)} : 3,14 = ${rr * rr}; ${rr} · ${rr} = ${rr * rr}, тож r = ${rr} см.`,
  };
}

/** Площа пропорційна квадрату радіуса. */
function proportsiina(r: Vypadok): TrenZavdannia {
  const k = r.vybir([2, 3, 4, 5, 10]);
  const shcho = r.shans() ? 'Радіус' : 'Діаметр';
  return {
    pytannia: `${shcho} круга збільшили в ${k} ${k < 5 ? 'рази' : 'разів'}. У скільки разів збільшилась його площа?`,
    vidpovid: k * k,
    varianty: [...new Set([k, 2 * k, k * k])].sort((a, b) => a - b),
    pidkazka: `Площа — 3,14 · r · r: радіус множиться двічі.`,
    rozviazok: `3,14 · (${k}r) · (${k}r) = ${k * k} · 3,14 · r · r — площа більша в ${k} · ${k} = ${k * k} ${k * k < 5 ? 'рази' : 'разів'}.`,
  };
}

// ——— Круговий сектор ———

function kutSektora(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const a = 5 * r.chyslo(4, 66);
    return {
      pytannia: `Два радіуси поділили круг на два сектори. Кут одного з них ${a}°. Знайди кут другого.`,
      vidpovid: 360 - a,
      odynytsi: '°',
      pidkazka: 'Кути двох секторів разом — повний кут, 360°.',
      rozviazok: `360 − ${a} = ${360 - a} (°)`,
    };
  }
  const n = r.vybir([2, 3, 4, 5, 6, 8, 9, 10, 12]);
  if (typ === 1) {
    const shcho = r.vybir(['Піцу', 'Торт', 'Круглий пиріг']);
    return {
      pytannia: `${shcho} розрізали від центра на ${n} рівних шматків. Який кут кожного шматка?`,
      vidpovid: 360 / n,
      odynytsi: '°',
      pidkazka: `Повний кут 360° поділили на ${n} рівних частин.`,
      rozviazok: `360 : ${n} = ${360 / n} (°)`,
    };
  }
  return {
    pytannia: `Круговий сектор становить $${tvidpovidDrib(1, n)}$ круга. Який кут цього сектора?`,
    vidpovid: 360 / n,
    odynytsi: '°',
    pidkazka: `Знайди 1/${n} від повного кута 360°.`,
    rozviazok: `360 : ${n} = ${360 / n} (°)`,
  };
}

function chastynaKruha(r: Vypadok): TrenZavdannia {
  const a = r.vybir([30, 40, 45, 60, 72, 90, 120, 135, 150, 180, 210, 240, 270, 300]);
  const [p, q] = skorotyty(a, 360);
  return {
    pytannia: `Яку частину круга становить круговий сектор із кутом ${a}°? Запиши дробом.`,
    vidpovid: vidpovidDrib(a, 360),
    pokaz: `$${tvidpovidDrib(a, 360)}$`,
    pidkazka: `Повний кут — 360°. Склади дріб ${a}/360 і скороти.`,
    rozviazok: `${a}/360 = ${p}/${q}`,
  };
}

function ploshchaSektora(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.vybir([30, 45, 60, 90, 120, 180, 270]);
    const rr = r.chyslo(2, 12);
    const sotykh = 314 * rr * rr * a; // площа сектора · 360, у сотих
    if (sotykh % 360 !== 0) continue;
    const s = sotykh / 360;
    const [p, q] = skorotyty(a, 360);
    return {
      pytannia: `Радіус круга ${rr} см. Знайди площу кругового сектора з кутом ${a}°. Візьми π ≈ 3,14.`,
      vidpovid: des(s, 2),
      odynytsi: 'см²',
      pidkazka: `Сектор ${a}° — це ${p}/${q} круга. Спершу знайди площу всього круга.`,
      rozviazok: `3,14 · ${rr} · ${rr} = ${pi(rr * rr)} (см²); ${a} : 360 = ${p}/${q}; ${pi(rr * rr)} : ${q}${p > 1 ? ` · ${p}` : ''} = ${des(s, 2)} (см²)`,
    };
  }
}

export default {
  rivni: ['площа круга за радіусом', 'за діаметром, півкруг, радіус за площею', 'круговий сектор'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([ploshcha, ploshcha, zaDiametrom])(r);
    if (riven === 2) return r.vybir([zaDiametrom, pivkruh, radiusZaPloshcheiu, proportsiina])(r);
    return r.vybir([kutSektora, chastynaKruha, ploshchaSektora, ploshchaSektora])(r);
  },
} satisfies Henerator;
