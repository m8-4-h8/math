// Множення і ділення круглих чисел (3 клас): укрупнення розрядних одиниць (20 · 4 = 2 д. · 4 = 8 д. = 80,
// 240 : 6 = 24 д. : 6 = 4 д. = 40, 560 : 70 = 56 д. : 7 д. = 8) і множення / ділення на кругле число частинами.
import { mnozh, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const desiatkiv = (n: number) => skilky(n, 'десяток', 'десятки', 'десятків');
const soten = (n: number) => skilky(n, 'сотня', 'сотні', 'сотень');

function mnozhennia(r: Vypadok): TrenZavdannia {
  if (r.shans(0.25)) {
    for (;;) {
      const s = r.chyslo(2, 5);
      const b = r.chyslo(2, 5);
      if (s * b > 10) continue;
      return {
        pytannia: 'Обчисли.',
        vyraz: `${s * 100} · ${b} =`,
        vidpovid: s * b * 100,
        pidkazka: `${s * 100} — це ${soten(s)}.`,
        rozviazok: `${s} с. · ${b} = ${s * b} с. = ${s * b * 100}`,
      };
    }
  }
  const d = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  const navpaky = r.shans(0.3);
  return {
    pytannia: 'Обчисли.',
    vyraz: navpaky ? `${b} · ${d * 10} =` : `${d * 10} · ${b} =`,
    vidpovid: d * b * 10,
    pidkazka: `${d * 10} — це ${desiatkiv(d)}.`,
    rozviazok: `${d} д. · ${b} = ${d * b} д. = ${d * b * 10}`,
  };
}

function dilennia(r: Vypadok): TrenZavdannia {
  if (r.shans(0.25)) {
    for (;;) {
      const s = r.chyslo(1, 4);
      const b = r.chyslo(2, 9);
      if (s * b > 9) continue;
      return {
        pytannia: 'Обчисли.',
        vyraz: `${s * b * 100} : ${b} =`,
        vidpovid: s * 100,
        pidkazka: `${s * b * 100} — це ${soten(s * b)}.`,
        rozviazok: `${s * b} с. : ${b} = ${s} с. = ${s * 100}`,
      };
    }
  }
  const d = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${d * b * 10} : ${b} =`,
    vidpovid: d * 10,
    pidkazka: `${d * b * 10} — це ${desiatkiv(d * b)}.`,
    rozviazok: `${d * b} д. : ${b} = ${d} д. = ${d * 10}. Перевірка: ${d * 10} · ${b} = ${d * b * 10}`,
  };
}

// Кругле на кругле: десятки на десятки (або сотні на сотні), частка — просто число.
function kruhleNaKruhle(r: Vypadok): TrenZavdannia {
  if (r.shans(0.2)) {
    for (;;) {
      const s = r.chyslo(2, 4);
      const q = r.chyslo(2, 9);
      if (s * q > 9) continue;
      const D = s * q * 100;
      return {
        pytannia: 'Обчисли.',
        vyraz: `${D} : ${s * 100} =`,
        vidpovid: q,
        pidkazka: `Сотні на сотні: ${s * q} с. : ${s} с.`,
        rozviazok: `${s * q} с. : ${s} с. = ${q}. Перевірка: ${q} · ${s * 100} = ${D}`,
      };
    }
  }
  const d = r.chyslo(2, 9);
  const q = r.chyslo(2, 9);
  const D = d * q * 10;
  const chastynamy = r.shans(0.4);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${D} : ${d * 10} =`,
    vidpovid: q,
    pidkazka: chastynamy ? `Поділи спершу на 10, а потім на ${d}.` : `Десятки на десятки: ${d * q} д. : ${d} д.`,
    rozviazok: chastynamy
      ? `${D} : 10 : ${d} = ${d * q} : ${d} = ${q}. Перевірка: ${q} · ${d * 10} = ${D}`
      : `${d * q} д. : ${d} д. = ${q}. Частка — просто число, без нуля. Перевірка: ${q} · ${d * 10} = ${D}`,
  };
}

// Множення на кругле число частинами: 7 · 30 = 7 · 3 · 10.
function naKruhleChastynamy(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const k = r.chyslo(2, 9);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${a} · ${k * 10} =`,
    vidpovid: a * k * 10,
    pidkazka: `${k * 10} = ${k} · 10. Помнож спершу на ${k}.`,
    rozviazok: `${a} · ${k * 10} = ${a} · ${k} · 10 = ${a * k} · 10 = ${a * k * 10}`,
  };
}

// Скільки нулів: 50 · 4 = 200, 240 : 60 = 4.
function nuli(r: Vypadok): TrenZavdannia {
  if (r.shans(0.5)) {
    for (;;) {
      const d = r.chyslo(2, 9);
      const b = r.chyslo(2, 9);
      if ((d * b) % 10 !== 0 && r.shans(0.7)) continue; // частіше — випадки з двома нулями
      const v = d * b * 10;
      return {
        pytannia: 'Обери правильну відповідь.',
        vyraz: `${d * 10} · ${b} =`,
        vidpovid: v,
        varianty: [v / 10, v, v * 10],
        pidkazka: `${desiatkiv(d)} взяти ${b} ${mnozh(b, 'раз', 'рази', 'разів')}. Скільки це десятків?`,
        rozviazok: `${d} д. · ${b} = ${d * b} д. = ${v}`,
      };
    }
  }
  const d = r.chyslo(2, 9);
  const q = r.chyslo(2, 9);
  const D = d * q * 10;
  return {
    pytannia: 'Обери правильну відповідь.',
    vyraz: `${D} : ${d * 10} =`,
    vidpovid: q,
    varianty: [q, q * 10, q * 100],
    pidkazka: `Перевір кожну відповідь множенням на ${d * 10}.`,
    rozviazok: `${d * q} д. : ${d} д. = ${q}. Перевірка: ${q} · ${d * 10} = ${D}`,
  };
}

// Віконце: невідомий множник, ділене або дільник.
function vikno(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  const a = d * 10;
  const P = a * b;
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    return {
      pytannia: 'Яке число у віконці?',
      vyraz: `□ · ${b} = ${P}`,
      vidpovid: a,
      pidkazka: `Невідомий множник: ${P} : ${b}.`,
      rozviazok: `${P} : ${b} = ${a}, бо ${d * b} д. : ${b} = ${d} д.`,
    };
  }
  if (vyd === 1) {
    return {
      pytannia: 'Яке число у віконці?',
      vyraz: `□ : ${a} = ${b}`,
      vidpovid: P,
      pidkazka: `Невідоме ділене: ${b} · ${a}.`,
      rozviazok: `${b} · ${a} = ${P}`,
    };
  }
  return {
    pytannia: 'Яке число у віконці?',
    vyraz: `${P} : □ = ${b}`,
    vidpovid: a,
    pidkazka: `Невідомий дільник: ${P} : ${b}.`,
    rozviazok: `${P} : ${b} = ${a}. Перевірка: ${P} : ${a} = ${b}`,
  };
}

// ——— Текстові задачі ———

function zadachaMnozhennia(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 9);
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    const a = r.vybir([10, 20, 30]);
    return {
      pytannia: `Один ящик яблук важить ${a} кг. Скільки кілограмів важать ${b} таких ${mnozh(b, 'ящик', 'ящики', 'ящиків')}?`,
      vidpovid: a * b,
      odynytsi: 'кг',
      pidkazka: `${a} — це ${desiatkiv(a / 10)}.`,
      rozviazok: `${a / 10} д. · ${b} = ${(a / 10) * b} д. = ${a * b} (кг)`,
    };
  }
  if (vyd === 1) {
    const a = r.vybir([40, 50, 60, 70, 80, 90]);
    return {
      pytannia: `Квиток у ляльковий театр коштує ${a} грн. Скільки коштують ${b} ${mnozh(b, 'квиток', 'квитки', 'квитків')}?`,
      vidpovid: a * b,
      odynytsi: 'грн',
      pidkazka: `${a} — це ${desiatkiv(a / 10)}.`,
      rozviazok: `${a / 10} д. · ${b} = ${(a / 10) * b} д. = ${a * b} (грн)`,
    };
  }
  const a = r.vybir([10, 20, 30]);
  return {
    pytannia: `Олівці продають у коробках по ${a} штук. Скільки олівців у ${b} таких коробках?`,
    vidpovid: a * b,
    pidkazka: `${a} — це ${desiatkiv(a / 10)}.`,
    rozviazok: `${a / 10} д. · ${b} = ${(a / 10) * b} д. = ${a * b} (олівців)`,
  };
}

function zadachaPorivnu(r: Vypadok): TrenZavdannia {
  for (;;) {
    const d = r.chyslo(2, 9);
    const b = r.chyslo(2, 9);
    const D = d * b * 10;
    if (r.shans()) {
      if (D > 600) continue;
      return {
        pytannia: `За ${b} ${mnozh(b, 'однакову книжку', 'однакові книжки', 'однакових книжок')} заплатили ${D} грн. Скільки коштує одна книжка?`,
        vidpovid: d * 10,
        odynytsi: 'грн',
        pidkazka: `${D} — це ${desiatkiv(d * b)}. Поділи їх на ${b}.`,
        rozviazok: `${d * b} д. : ${b} = ${d} д. = ${d * 10} (грн)`,
      };
    }
    return {
      pytannia: `${D} г корму розділили порівну на ${b} ${mnozh(b, 'день', 'дні', 'днів')}. Скільки грамів корму на один день?`,
      vidpovid: d * 10,
      odynytsi: 'г',
      pidkazka: `${D} — це ${desiatkiv(d * b)}. Поділи їх на ${b}.`,
      rozviazok: `${d * b} д. : ${b} = ${d} д. = ${d * 10} (г)`,
    };
  }
}

function zadachaVmistyty(r: Vypadok): TrenZavdannia {
  const q = r.chyslo(2, 9);
  if (r.shans()) {
    const D = 30 * q;
    return {
      pytannia: `${D} яєць розклали в лотки по 30 штук. Скільки лотків знадобилося?`,
      vidpovid: q,
      pidkazka: `Скільки разів 3 десятки вміщуються в ${3 * q} десятках?`,
      rozviazok: `${3 * q} д. : 3 д. = ${q} (${mnozh(q, 'лоток', 'лотки', 'лотків')})`,
    };
  }
  const a = r.vybir([10, 20, 30, 40, 50]);
  const D = a * q;
  return {
    pytannia: `${D} кг картоплі розсипали в мішки по ${a} кг. Скільки вийшло мішків?`,
    vidpovid: q,
    pidkazka: `Скільки разів ${a} вміщується в ${D}? Перевір множенням.`,
    rozviazok: `${D} : ${a} = ${q}. Перевірка: ${q} · ${a} = ${D}`,
  };
}

// Дві дії: денна норма, потім на кілька днів.
function zadachaNorma(r: Vypadok): TrenZavdannia {
  for (;;) {
    const per = r.chyslo(2, 9) * 10;
    const b = r.chyslo(2, 5);
    const c = r.krim(2, 9, [b]);
    const D = per * b;
    if (per * c > 1000) continue;
    const tyzhden = c === 7;
    const dni = (n: number) => `${n} ${mnozh(n, 'день', 'дні', 'днів')}`;
    return {
      pytannia: `Песику за ${dni(b)} дали ${D} г сухого корму, щодня однаково. Скільки грамів корму потрібно песику ${tyzhden ? 'на тиждень' : `на ${dni(c)}`}?`,
      vidpovid: per * c,
      odynytsi: 'г',
      pidkazka: `Спершу знайди, скільки корму на один день: ${D} : ${b}.`,
      rozviazok: `${D} : ${b} = ${per} (г) — на день; ${per} · ${c} = ${per * c} (г).`,
    };
  }
}

export default {
  rivni: ['кругле на одноцифрове', 'кругле на кругле, скільки нулів', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([mnozhennia, mnozhennia, dilennia, dilennia, vikno])(r);
    if (riven === 2) return r.vybir([kruhleNaKruhle, kruhleNaKruhle, naKruhleChastynamy, nuli, nuli])(r);
    return r.vybir([zadachaMnozhennia, zadachaPorivnu, zadachaVmistyty, zadachaNorma, kruhleNaKruhle])(r);
  },
} satisfies Henerator;
