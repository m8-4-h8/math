// Додавання і віднімання частинами (2 клас): перше число не чіпаємо, друге додаємо або віднімаємо
// по частинах — спершу десятки, потім одиниці; через десяток — із зупинкою на круглому числі.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Para {
  a: number; // перше число (до нього додаємо; воно ж — різниця в оберненому відніманні)
  d2: number; // десятки другого числа (0 — друге число одноцифрове)
  o2: number; // одиниці другого числа
}

// Без переходу: одиниць разом не більше 9.
function bezPerekhodu(r: Vypadok): Para {
  const d1 = r.chyslo(1, 7);
  const o1 = r.chyslo(1, 7);
  return { a: 10 * d1 + o1, d2: r.chyslo(1, 8 - d1), o2: r.chyslo(1, 9 - o1) };
}

// З переходом: одиниць разом більше ніж 10, тож після круглого числа ще щось залишається.
function zPerekhodom(r: Vypadok, odnotsyfrove: boolean): Para {
  const d1 = r.chyslo(1, 7);
  const o1 = r.chyslo(2, 9);
  return { a: 10 * d1 + o1, d2: odnotsyfrove ? 0 : r.chyslo(1, 8 - d1), o2: r.chyslo(11 - o1, 9) };
}

// Як додати одиниці o до числа n: одразу або через кругле число. Повертає ланцюжок «76 + 4 + 3 = 83».
function plusOdynytsi(n: number, o: number) {
  const doKruhloho = 10 - (n % 10);
  if (n % 10 === 0 || o <= doKruhloho) return `${n} + ${o} = ${n + o}`;
  return `${n} + ${o} = ${n} + ${doKruhloho} + ${o - doKruhloho} = ${n + o}`;
}

function minusOdynytsi(n: number, o: number) {
  const od = n % 10;
  if (od === 0 || o <= od) return `${n} − ${o} = ${n - o}`;
  return `${n} − ${o} = ${n} − ${od} − ${o - od} = ${n - o}`;
}

function dodaty({ a, d2, o2 }: Para): TrenZavdannia {
  const b = 10 * d2 + o2;
  const perekhid = (a % 10) + o2 > 10;
  const kruhle = a + 10 * d2 - ((a + 10 * d2) % 10) + 10;
  if (!d2) {
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: `До круглого числа ${kruhle} бракує ${kruhle - a}. Розклади ${o2} на ${kruhle - a} і ${o2 - (kruhle - a)}.`,
      rozviazok: `${plusOdynytsi(a, o2)}.`,
    };
  }
  return {
    vyraz: `${a} + ${b} =`,
    vidpovid: a + b,
    pidkazka: perekhid
      ? `${b} = ${10 * d2} + ${o2}. Спершу ${a} + ${10 * d2}, а потім додай ${o2} через кругле число ${kruhle}.`
      : `${b} = ${10 * d2} + ${o2}. Спершу ${a} + ${10 * d2}, а потім додай ${o2}.`,
    rozviazok: `${a} + ${10 * d2} = ${a + 10 * d2}; ${plusOdynytsi(a + 10 * d2, o2)}.`,
  };
}

// Віднімання, обернене до додавання пари: (a + b) − b = a.
function vidniaty({ a, d2, o2 }: Para): TrenZavdannia {
  const b = 10 * d2 + o2;
  const s = a + b;
  const pislia = s - 10 * d2; // після віднімання десятків
  const perekhid = pislia % 10 !== 0 && pislia % 10 < o2;
  const perevirka = `Перевірка: ${a} + ${b} = ${s} ✓`;
  if (!d2) {
    return {
      vyraz: `${s} − ${b} =`,
      vidpovid: a,
      pidkazka: `Одиниць у числі ${s} лише ${s % 10}. Спершу відніми ${s % 10}, щоб вийшло кругле число. Скільки ще залишилось відняти?`,
      rozviazok: `${minusOdynytsi(s, o2)}. ${perevirka}`,
    };
  }
  return {
    vyraz: `${s} − ${b} =`,
    vidpovid: a,
    pidkazka: perekhid
      ? `${b} = ${10 * d2} + ${o2}. Спершу ${s} − ${10 * d2}, а потім відніми ${o2} через кругле число ${pislia - (pislia % 10)}.`
      : `${b} = ${10 * d2} + ${o2}. Спершу ${s} − ${10 * d2}, а потім відніми ${o2}.`,
    rozviazok: `${s} − ${10 * d2} = ${pislia}; ${minusOdynytsi(pislia, o2)}. ${perevirka}`,
  };
}

// Ланцюжок на дві дії з підручника: «42 + 30 + 6 =», «78 − 50 − 6 =».
function lantsiuzhok(r: Vypadok): TrenZavdannia {
  const { a, d2, o2 } = bezPerekhodu(r);
  const s = a + 10 * d2 + o2;
  return r.shans()
    ? {
        vyraz: `${a} + ${10 * d2} + ${o2} =`,
        vidpovid: s,
        pidkazka: `Спершу ${a} + ${10 * d2}: змінюються тільки десятки.`,
        rozviazok: `${a} + ${10 * d2} = ${a + 10 * d2}, ${a + 10 * d2} + ${o2} = ${s}.`,
      }
    : {
        vyraz: `${s} − ${10 * d2} − ${o2} =`,
        vidpovid: a,
        pidkazka: `Спершу ${s} − ${10 * d2}: змінюються тільки десятки.`,
        rozviazok: `${s} − ${10 * d2} = ${s - 10 * d2}, ${s - 10 * d2} − ${o2} = ${a}.`,
      };
}

// «78 − 56 = 78 − 50 − □» — яку частину ще треба додати чи відняти.
function propushchenyiKrok(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ < 2) {
    const { a, d2, o2 } = r.shans() ? bezPerekhodu(r) : zPerekhodom(r, false);
    const b = 10 * d2 + o2;
    const s = a + b;
    return typ === 0
      ? {
          pytannia: 'Яке число пропущене?',
          vyraz: `${a} + ${b} = ${a} + ${10 * d2} + □`,
          vidpovid: o2,
          pidkazka: `Розклади ${b} на десятки й одиниці. Десятки вже додали.`,
          rozviazok: `${b} = ${10 * d2} + ${o2}, тому пропущене число — ${o2}. ${a} + ${10 * d2} + ${o2} = ${s}.`,
        }
      : {
          pytannia: 'Яке число пропущене?',
          vyraz: `${s} − ${b} = ${s} − ${10 * d2} − □`,
          vidpovid: o2,
          pidkazka: `Розклади ${b} на десятки й одиниці. Десятки вже відняли.`,
          rozviazok: `${b} = ${10 * d2} + ${o2}, тому пропущене число — ${o2}. ${s} − ${10 * d2} − ${o2} = ${a}.`,
        };
  }
  const { a, o2 } = zPerekhodom(r, true);
  const s = a + o2;
  if (typ === 2) {
    const doKruhloho = 10 - (a % 10);
    return {
      pytannia: 'Яке число пропущене?',
      vyraz: `${a} + ${o2} = ${a} + ${doKruhloho} + □`,
      vidpovid: o2 - doKruhloho,
      pidkazka: `Спершу дійшли до круглого числа: ${a} + ${doKruhloho} = ${a + doKruhloho}. Скільки ще залишилось додати з ${o2}?`,
      rozviazok: `${o2} = ${doKruhloho} + ${o2 - doKruhloho}, тому пропущене число — ${o2 - doKruhloho}. ${a} + ${doKruhloho} + ${o2 - doKruhloho} = ${s}.`,
    };
  }
  const od = s % 10;
  return {
    pytannia: 'Яке число пропущене?',
    vyraz: `${s} − ${o2} = ${s} − ${od} − □`,
    vidpovid: o2 - od,
    pidkazka: `Спершу дійшли до круглого числа: ${s} − ${od} = ${s - od}. Скільки ще залишилось відняти з ${o2}?`,
    rozviazok: `${o2} = ${od} + ${o2 - od}, тому пропущене число — ${o2 - od}. ${s} − ${od} − ${o2 - od} = ${a}.`,
  };
}

// «Як відняти частинами?» — пастка: десятки відняли, а одиниці додали.
function yakRozklasty(r: Vypadok): TrenZavdannia {
  const { a, d2, o2 } = bezPerekhodu(r);
  const b = 10 * d2 + o2;
  const s = a + b;
  const pravylnyi = `${s} − ${10 * d2} − ${o2}`;
  const bukvy = ['А', 'Б', 'В'];
  const varianty = r.peremishaty([pravylnyi, `${s} − ${10 * d2} + ${o2}`, `${s} + ${10 * d2} − ${o2}`]);
  return {
    pytannia: `Як відняти частинами ${s} − ${b}? ${varianty.map((v, i) => `${bukvy[i]}) ${v}`).join('; ')}.`,
    vidpovid: bukvy[varianty.indexOf(pravylnyi)],
    varianty: bukvy,
    pidkazka: `Відняти ${b} — це забрати ${10 * d2} і ще забрати ${o2}.`,
    rozviazok: `${bukvy[varianty.indexOf(pravylnyi)]}. Віднімаємо обидві частини: ${pravylnyi} = ${a}.`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const { a, d2, o2 } = zPerekhodom(r, false);
  const b = 10 * d2 + o2;
  const s = a + b;
  const o = osoba(r);
  const siuzhet = r.vybir([
    { odyn: 'наліпку', dva: 'наліпки', piat: 'наліпок', diia: rid(o, 'подарував', 'подарувала') },
    { odyn: 'марку', dva: 'марки', piat: 'марок', diia: rid(o, 'віддав', 'віддала') },
    { odyn: 'листівку', dva: 'листівки', piat: 'листівок', diia: rid(o, 'надіслав', 'надіслала') },
  ]);
  if (r.shans()) {
    const rich = (n: number) => mnozh(n, siuzhet.odyn, siuzhet.dva, siuzhet.piat);
    return {
      pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${s} ${rich(s)}. ${b} ${rich(b)} ${rid(o, 'він', 'вона')} ${siuzhet.diia}. Скільки ${siuzhet.piat} залишилось?`,
      vidpovid: a,
      pidkazka: `Залишилось — це різниця: ${s} − ${b}. Спершу відніми ${10 * d2}, потім ${o2}.`,
      rozviazok: `${s} − ${10 * d2} = ${s - 10 * d2}; ${minusOdynytsi(s - 10 * d2, o2)}. Перевірка: ${a} + ${b} = ${s} ✓`,
    };
  }
  const [k1, k2] = [a, b];
  return {
    pytannia: `На першій полиці ${k1} ${mnozh(k1, 'книжка', 'книжки', 'книжок')}, а на другій — ${k2}. Скільки книжок на двох полицях разом?`,
    vidpovid: s,
    pidkazka: `Разом — це сума: ${k1} + ${k2}. Спершу додай ${10 * d2}, потім ${o2}.`,
    rozviazok: `${k1} + ${10 * d2} = ${k1 + 10 * d2}; ${plusOdynytsi(k1 + 10 * d2, o2)}.`,
  };
}

export default {
  rivni: ['без переходу через десяток', 'з переходом через десяток', 'пропущений крок, вибір запису, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) {
      const typ = r.chyslo(0, 9);
      if (typ < 2) return lantsiuzhok(r);
      return typ < 6 ? dodaty(bezPerekhodu(r)) : vidniaty(bezPerekhodu(r));
    }
    if (riven === 2) {
      const p = zPerekhodom(r, r.shans(0.35));
      return r.shans() ? dodaty(p) : vidniaty(p);
    }
    const typ = r.chyslo(0, 9);
    if (typ < 4) return propushchenyiKrok(r);
    if (typ < 6) return yakRozklasty(r);
    if (typ < 8) return zadacha(r);
    const p = zPerekhodom(r, false);
    return r.shans() ? dodaty(p) : vidniaty(p);
  },
} satisfies Henerator;
