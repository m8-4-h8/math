// Вирази і порядок дій: спершу дужки, потім множення і ділення зліва направо, потім додавання і віднімання.
// Значення буквеного виразу, формули, вираз до задачі.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const kroky = (spysok: string[]) => spysok.map((k, i) => `${i + 1}) ${k}`).join('; ');

function dviDii(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  const b = r.chyslo(2, 9);
  const c = r.chyslo(2, 9);
  if (typ === 0) {
    const a = r.chyslo(5, 60);
    return {
      pytannia: 'Обчисли. Пам’ятай про порядок дій.',
      vyraz: `${a} + ${b} · ${c} =`,
      vidpovid: a + b * c,
      pidkazka: 'Спершу множення, потім додавання.',
      rozviazok: kroky([`${b} · ${c} = ${b * c}`, `${a} + ${b * c} = ${a + b * c}`]),
    };
  }
  if (typ === 1) {
    const a = r.chyslo(b * c + 1, b * c + 60);
    return {
      pytannia: 'Обчисли. Пам’ятай про порядок дій.',
      vyraz: `${a} − ${b * c} : ${c} =`,
      vidpovid: a - b,
      pidkazka: 'Спершу ділення, потім віднімання.',
      rozviazok: kroky([`${b * c} : ${c} = ${b}`, `${a} − ${b} = ${a - b}`]),
    };
  }
  if (typ === 2) return zlivaNapravo(r); // 24 : 4 · 2 = 12, а не 3
  const a = r.chyslo(2, 9);
  const d = r.chyslo(2, 30);
  return {
    pytannia: 'Обчисли. Пам’ятай про порядок дій.',
    vyraz: `${a} · ${b} − ${d} =`,
    vidpovid: a * b - d,
    pidkazka: 'Спершу множення.',
    rozviazok: kroky([`${a} · ${b} = ${a * b}`, `${a * b} − ${d} = ${a * b - d}`]),
  };
}

function zlivaNapravo(r: Vypadok): TrenZavdannia {
  const c = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  const d = r.chyslo(2, 5);
  return {
    pytannia: 'Обчисли. Множення і ділення — по черзі зліва направо.',
    vyraz: `${b * c} : ${c} · ${d} =`,
    vidpovid: b * d,
    pidkazka: 'Ділення стоїть першим — його й виконуй першим.',
    rozviazok: kroky([`${b * c} : ${c} = ${b}`, `${b} · ${d} = ${b * d}`]),
  };
}

function zDuzhkamy(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const b = r.chyslo(2, 15);
  const c = r.chyslo(2, 15);
  const d = r.chyslo(2, 5);
  if (typ === 0) {
    const a = r.chyslo((b + c) * d + 1, (b + c) * d + 80);
    return {
      pytannia: 'Обчисли.',
      vyraz: `${a} − (${b} + ${c}) · ${d} =`,
      vidpovid: a - (b + c) * d,
      pidkazka: 'Дужки, потім множення, потім віднімання.',
      rozviazok: kroky([`${b} + ${c} = ${b + c}`, `${b + c} · ${d} = ${(b + c) * d}`, `${a} − ${(b + c) * d} = ${a - (b + c) * d}`]),
    };
  }
  if (typ === 1) {
    const s = r.chyslo(2, 9) * d;
    const a = r.chyslo(1, s - 1);
    const e = r.chyslo(2, 6);
    return {
      pytannia: 'Обчисли.',
      vyraz: `(${a} + ${s - a}) : ${d} · ${e} =`,
      vidpovid: (s / d) * e,
      pidkazka: 'Дужки, потім ділення і множення зліва направо.',
      rozviazok: kroky([`${a} + ${s - a} = ${s}`, `${s} : ${d} = ${s / d}`, `${s / d} · ${e} = ${(s / d) * e}`]),
    };
  }
  const a = r.chyslo(10, 60);
  const e = r.chyslo(2, 9);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${a} + ${e} · (${b + c} − ${c}) =`,
    vidpovid: a + e * b,
    pidkazka: 'Дужки, потім множення, потім додавання.',
    rozviazok: kroky([`${b + c} − ${c} = ${b}`, `${e} · ${b} = ${e * b}`, `${a} + ${e * b} = ${a + e * b}`]),
  };
}

function bukvenyi(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const k = r.chyslo(2, 9);
  const m = r.chyslo(1, 30);
  const a = r.chyslo(2, 15);
  if (typ === 0) {
    return {
      pytannia: `Знайди значення виразу ${k}a + ${m}, якщо a = ${a}.`,
      vidpovid: k * a + m,
      pidkazka: `${k}a — це ${k} · a. Підстав ${a} замість a.`,
      rozviazok: `${k} · ${a} + ${m} = ${k * a} + ${m} = ${k * a + m}`,
    };
  }
  if (typ === 1) {
    const b = r.chyslo(2, 20);
    return {
      pytannia: `Прямокутник має сторони a = ${a} см і b = ${b} см. Знайди периметр за формулою P = 2 · (a + b).`,
      vidpovid: 2 * (a + b),
      odynytsi: 'см',
      pidkazka: 'Підстав числа у формулу. Спершу дужки.',
      rozviazok: `P = 2 · (${a} + ${b}) = 2 · ${a + b} = ${2 * (a + b)} (см)`,
    };
  }
  const v = r.chyslo(4, 80);
  const t = r.chyslo(2, 6);
  return {
    pytannia: `За формулою s = v · t знайди відстань, якщо v = ${v} км/год, t = ${t} год.`,
    vidpovid: v * t,
    odynytsi: 'км',
    pidkazka: 'Відстань = швидкість · час.',
    rozviazok: `s = ${v} · ${t} = ${v * t} (км)`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(8, 30);
  const b = r.chyslo(5, 20);
  const n = r.chyslo(2, 6);
  return {
    pytannia: `Ручка коштує ${a} грн, зошит — ${b} грн. Скільки гривень коштують ручка і ${n} ${mnozh(n, 'зошит', 'зошити', 'зошитів')}?`,
    vidpovid: a + b * n,
    odynytsi: 'грн',
    pidkazka: `Вираз: ${a} + ${b} · ${n}. Спершу множення.`,
    rozviazok: `${a} + ${b} · ${n} = ${a} + ${b * n} = ${a + b * n} (грн)`,
  };
}

export default {
  rivni: ['дві дії без дужок', 'з дужками і зліва направо', 'буквені вирази, формули, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.8) ? dviDii(r) : zlivaNapravo(r);
    if (riven === 2) return r.vybir([zDuzhkamy, zDuzhkamy, zlivaNapravo])(r);
    return r.vybir([bukvenyi, bukvenyi, zadacha, zDuzhkamy])(r);
  },
} satisfies Henerator;
