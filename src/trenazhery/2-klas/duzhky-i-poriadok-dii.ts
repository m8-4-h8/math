// Дужки і порядок дій (2 клас, Скворцова с. 23–24, 116): спершу дія в дужках; без дужок додавання й віднімання —
// зліва направо; зручні доданки беремо в дужки; множення й ділення (на 2–5) — раніше за додавання й віднімання.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const kroky = (spysok: string[]) => spysok.map((k, i) => `${i + 1}) ${k}`).join('; ');

// Вираз із дужками на дві дії, усі числа й проміжні результати — у межах 20.
function zDuzhkamy(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const b = r.chyslo(2, 9);
    const c = r.chyslo(2, 9);
    const a = r.chyslo(b + c, 20);
    return {
      pytannia: 'Обчисли. Спершу — дія в дужках.',
      vyraz: `${a} − (${b} + ${c}) =`,
      vidpovid: a - b - c,
      pidkazka: `Спершу сума в дужках: ${b} + ${c}.`,
      rozviazok: kroky([`${b} + ${c} = ${b + c}`, `${a} − ${b + c} = ${a - b - c}`]),
    };
  }
  if (typ === 1) {
    const b = r.chyslo(5, 16);
    const c = r.chyslo(2, b - 1);
    const a = r.chyslo(2, 20 - (b - c));
    return {
      pytannia: 'Обчисли. Спершу — дія в дужках.',
      vyraz: `${a} + (${b} − ${c}) =`,
      vidpovid: a + b - c,
      pidkazka: `Спершу різниця в дужках: ${b} − ${c}.`,
      rozviazok: kroky([`${b} − ${c} = ${b - c}`, `${a} + ${b - c} = ${a + b - c}`]),
    };
  }
  if (typ === 2) {
    const a = r.chyslo(3, 11);
    const b = r.chyslo(2, 20 - a);
    const c = r.chyslo(2, a + b - 1);
    return {
      pytannia: 'Обчисли. Спершу — дія в дужках.',
      vyraz: `(${a} + ${b}) − ${c} =`,
      vidpovid: a + b - c,
      pidkazka: `Спершу сума в дужках: ${a} + ${b}.`,
      rozviazok: kroky([`${a} + ${b} = ${a + b}`, `${a + b} − ${c} = ${a + b - c}`]),
    };
  }
  const b = r.chyslo(5, 15);
  const c = r.chyslo(2, b - 2);
  const a = r.chyslo(b - c + 1, 20);
  return {
    pytannia: 'Обчисли. Спершу — дія в дужках.',
    vyraz: `${a} − (${b} − ${c}) =`,
    vidpovid: a - (b - c),
    pidkazka: `Спершу різниця в дужках: ${b} − ${c}.`,
    rozviazok: kroky([`${b} − ${c} = ${b - c}`, `${a} − ${b - c} = ${a - (b - c)}`]),
  };
}

// Без дужок: додавання й віднімання по черзі, зліва направо.
function bezDuzhok(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(8, 20);
  const b = r.chyslo(2, a - 2);
  if (r.shans()) {
    const c = r.chyslo(2, 20 - (a - b));
    return {
      pytannia: 'Обчисли. Дужок немає — рахуй зліва направо.',
      vyraz: `${a} − ${b} + ${c} =`,
      vidpovid: a - b + c,
      pidkazka: `Перша дія — віднімання: ${a} − ${b}.`,
      rozviazok: kroky([`${a} − ${b} = ${a - b}`, `${a - b} + ${c} = ${a - b + c}`]),
    };
  }
  const c = r.chyslo(1, a - b - 1);
  return {
    pytannia: 'Обчисли. Дужок немає — рахуй зліва направо.',
    vyraz: `${a} − ${b} − ${c} =`,
    vidpovid: a - b - c,
    pidkazka: `Перша дія: ${a} − ${b}.`,
    rozviazok: kroky([`${a} − ${b} = ${a - b}`, `${a - b} − ${c} = ${a - b - c}`]),
  };
}

function yakaPersha(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 8);
  const c = r.chyslo(2, 8);
  const a = r.chyslo(b + c + 1, 20);
  const [vyraz, persha, chomu] = r.vybir([
    [`${a} − (${b} + ${c})`, 'додавання', 'воно в дужках'],
    [`${a} − ${b} + ${c}`, 'віднімання', 'дужок немає, а віднімання стоїть лівіше'],
    [`(${a} − ${b}) + ${c}`, 'віднімання', 'воно в дужках'],
    [`${c} + (${a} − ${b})`, 'віднімання', 'воно в дужках'],
    [`${a} + ${b} − ${c}`, 'додавання', 'дужок немає, а додавання стоїть лівіше'],
  ] as [string, string, string][]);
  return {
    pytannia: `Яку дію виконуємо першою у виразі ${vyraz}?`,
    vidpovid: persha,
    varianty: ['додавання', 'віднімання'],
    pidkazka: 'Є дужки? Тоді перша дія — в них. Немає — та, що лівіше.',
    rozviazok: `Перша дія — ${persha}: ${chomu}.`,
  };
}

// Три доданки, два з яких дають 10 або 20: їх зручно взяти в дужки.
function zruchniDuzhky(r: Vypadok): TrenZavdannia {
  const kruhle = r.shans(0.75) ? 10 : 20;
  const b = kruhle === 10 ? r.chyslo(2, 8) : r.chyslo(11, 18);
  const c = kruhle - b;
  const a = r.krim(3, 9, [b, c]);
  const [x, y, z, duzhky] = r.vybir([
    [a, b, c, `${a} + (${b} + ${c})`],
    [b, c, a, `(${b} + ${c}) + ${a}`],
    [b, a, c, `(${b} + ${c}) + ${a}`],
  ] as [number, number, number, string][]);
  return {
    pytannia: 'Обчисли зручним способом.',
    vyraz: `${x} + ${y} + ${z} =`,
    vidpovid: a + kruhle,
    pidkazka: `Які два доданки разом дають ${kruhle}? Додай їх першими.`,
    rozviazok: `${duzhky} = ${kruhle} + ${a} = ${a + kruhle}`,
  };
}

function tryDii(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 7);
  const c = r.chyslo(2, 7);
  const a = r.chyslo(b + c + 1, 20);
  const m = a - b - c;
  if (r.shans()) {
    const d = r.chyslo(2, 20 - m);
    return {
      pytannia: 'Обчисли. Визнач порядок дій.',
      vyraz: `${a} − (${b} + ${c}) + ${d} =`,
      vidpovid: m + d,
      pidkazka: 'Спершу дужки, далі — зліва направо.',
      rozviazok: kroky([`${b} + ${c} = ${b + c}`, `${a} − ${b + c} = ${m}`, `${m} + ${d} = ${m + d}`]),
    };
  }
  const d = r.chyslo(2, Math.max(2, 20 - a));
  return {
    pytannia: 'Обчисли. Визнач порядок дій.',
    vyraz: `${d} + ${a} − (${b} + ${c}) =`,
    vidpovid: d + m,
    pidkazka: 'Спершу дужки, далі — зліва направо.',
    rozviazok: kroky([`${b} + ${c} = ${b + c}`, `${d} + ${a} = ${d + a}`, `${d + a} − ${b + c} = ${d + m}`]),
  };
}

function deDuzhky(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 7);
  const c = r.chyslo(1, 6);
  const a = r.chyslo(b + c + 1, 19);
  const zDuzh = r.shans();
  const meta = zDuzh ? a - b - c : a - b + c;
  const varianty = r.peremishaty([`(${a} − ${b}) + ${c}`, `${a} − (${b} + ${c})`]);
  const pravylnyi = zDuzh ? `${a} − (${b} + ${c})` : `(${a} − ${b}) + ${c}`;
  const bukvy = ['А', 'Б'];
  const bukva = bukvy[varianty.indexOf(pravylnyi)];
  return {
    pytannia: `Який вираз дорівнює ${meta}? ${varianty.map((v, i) => `${bukvy[i]}) ${v}`).join('; ')}.`,
    vidpovid: bukva,
    varianty: bukvy,
    pidkazka: 'Обчисли обидва вирази. Починай з дужок.',
    rozviazok: `${bukva}. ${pravylnyi} = ${meta}, а інший вираз дорівнює ${zDuzh ? a - b + c : a - b - c}.`,
  };
}

function chyOdnakovi(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(3, 8);
  const c = r.chyslo(1, b - 2);
  if (r.shans()) {
    const a = r.chyslo(2, 20 - b - c);
    return {
      pytannia: `Чи однакові значення мають вирази (${a} + ${b}) + ${c} і ${a} + (${b} + ${c})?`,
      vidpovid: 'так',
      varianty: ['так', 'ні'],
      pidkazka: 'У виразах лише додавання. Чи залежить сума від порядку?',
      rozviazok: `Так: доданки можна додавати в будь-якому порядку. ${a + b} + ${c} = ${a + b + c} і ${a} + ${b + c} = ${a + b + c}.`,
    };
  }
  const a = r.chyslo(b + 2, 20);
  return {
    pytannia: `Чи однакові значення мають вирази (${a} − ${b}) − ${c} і ${a} − (${b} − ${c})?`,
    vidpovid: 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Порахуй кожен вираз, починаючи з дужок.',
    rozviazok: `Ні: ${a - b} − ${c} = ${a - b - c}, а ${a} − ${b - c} = ${a - (b - c)}. З відніманням дужки переставляти не можна.`,
  };
}

// Множення і ділення на 2–5 разом з додаванням і відніманням.
function zMnozhenniam(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 5);
  const n = r.chyslo(2, 9);
  const typ = r.chyslo(0, 5);
  if (typ === 0) {
    const a = r.chyslo(2, 40);
    return {
      pytannia: 'Обчисли. Пам’ятай про порядок дій.',
      vyraz: `${a} + ${k} · ${n} =`,
      vidpovid: a + k * n,
      pidkazka: 'Спершу множення, потім додавання.',
      rozviazok: kroky([`${k} · ${n} = ${k * n}`, `${a} + ${k * n} = ${a + k * n}`]),
    };
  }
  if (typ === 1) {
    const a = r.chyslo(k * n + 1, k * n + 40);
    return {
      pytannia: 'Обчисли. Пам’ятай про порядок дій.',
      vyraz: `${a} − ${k} · ${n} =`,
      vidpovid: a - k * n,
      pidkazka: 'Спершу множення, потім віднімання.',
      rozviazok: kroky([`${k} · ${n} = ${k * n}`, `${a} − ${k * n} = ${a - k * n}`]),
    };
  }
  if (typ === 2) {
    const a = r.chyslo(n + 1, 40);
    const plus = r.shans();
    return {
      pytannia: 'Обчисли. Пам’ятай про порядок дій.',
      vyraz: `${a} ${plus ? '+' : '−'} ${k * n} : ${k} =`,
      vidpovid: plus ? a + n : a - n,
      pidkazka: `Спершу ділення: ${k * n} : ${k}.`,
      rozviazok: kroky([`${k * n} : ${k} = ${n}`, `${a} ${plus ? '+' : '−'} ${n} = ${plus ? a + n : a - n}`]),
    };
  }
  if (typ === 3) {
    // (a + b) · k: сума в дужках до 9
    const a = r.chyslo(1, n - 1);
    return {
      pytannia: 'Обчисли. Пам’ятай про порядок дій.',
      vyraz: `(${a} + ${n - a}) · ${k} =`,
      vidpovid: n * k,
      pidkazka: 'Спершу дужки, потім множення.',
      rozviazok: kroky([`${a} + ${n - a} = ${n}`, `${n} · ${k} = ${n * k}`]),
    };
  }
  if (typ === 4) {
    // (a − b) : k
    const b = r.chyslo(2, 30);
    return {
      pytannia: 'Обчисли. Пам’ятай про порядок дій.',
      vyraz: `(${k * n + b} − ${b}) : ${k} =`,
      vidpovid: n,
      pidkazka: 'Спершу дужки, потім ділення.',
      rozviazok: kroky([`${k * n + b} − ${b} = ${k * n}`, `${k * n} : ${k} = ${n}`]),
    };
  }
  const a = r.chyslo(2, 9);
  const persha = r.shans();
  return {
    pytannia: `Яку дію виконуємо першою у виразі ${persha ? `${a} + ${k} · ${n}` : `(${a} + ${k}) · ${n}`}?`,
    vidpovid: persha ? 'множення' : 'додавання',
    varianty: ['додавання', 'множення'],
    pidkazka: 'Є дужки? Тоді спершу вони. Немає — спершу множення.',
    rozviazok: persha ? `Множення: воно виконується раніше за додавання. ${k} · ${n} = ${k * n}.` : `Додавання: воно в дужках. ${a} + ${k} = ${a + k}.`,
  };
}

export default {
  rivni: ['дужки і «зліва направо», до 20', 'яка дія перша, зручні дужки, три дії', 'з множенням і діленням'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.65) ? zDuzhkamy(r) : bezDuzhok(r);
    if (riven === 2) return r.vybir([yakaPersha, zruchniDuzhky, zruchniDuzhky, tryDii, tryDii, deDuzhky, chyOdnakovi])(r);
    return r.vybir([zMnozhenniam, zMnozhenniam, zMnozhenniam, tryDii, zDuzhkamy])(r);
  },
} satisfies Henerator;
