// Додавання і віднімання порозрядно (2 клас): десятки з десятками, одиниці з одиницями.
// З переходом через десяток: одиниць набирається 10 і більше (60 + 11) або не вистачає —
// тоді зменшуване замінюємо сумою зручних доданків (65 = 50 + 15).
import { osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Para {
  d1: number; // десятки першого числа
  o1: number; // одиниці першого числа
  d2: number;
  o2: number;
}

const chyslo = (d: number, o: number) => 10 * d + o;

// Пара без переходу: одиниць разом не більше 9.
function bezPerekhodu(r: Vypadok): Para {
  const d1 = r.chyslo(1, 7);
  const o1 = r.chyslo(1, 7);
  return { d1, o1, d2: r.chyslo(1, 8 - d1), o2: r.chyslo(1, 9 - o1) };
}

// Пара з переходом: одиниць разом 10 і більше. Другий доданок може бути одноцифровим (76 + 7).
function zPerekhodom(r: Vypadok, odnotsyfrove = false): Para {
  const d1 = r.chyslo(1, 7);
  const o1 = r.chyslo(2, 9);
  return { d1, o1, d2: odnotsyfrove ? 0 : r.chyslo(1, 8 - d1), o2: r.chyslo(10 - o1, 9) };
}

function dodaty({ d1, o1, d2, o2 }: Para): TrenZavdannia {
  const [a, b] = [chyslo(d1, o1), chyslo(d2, o2)];
  const des = 10 * (d1 + d2);
  const od = o1 + o2;
  if (!d2) {
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: `Розклади ${a} на ${10 * d1} і ${o1}. Одиниці: ${o1} + ${o2} — додай їх до десятків.`,
      rozviazok: `${a} = ${10 * d1} + ${o1}; ${o1} + ${o2} = ${od}, ${10 * d1} + ${od} = ${a + b}.`,
    };
  }
  return {
    vyraz: `${a} + ${b} =`,
    vidpovid: a + b,
    pidkazka:
      od > 9
        ? `Десятки: ${10 * d1} + ${10 * d2}. Одиниці: ${o1} + ${o2} — вийде ${od === 10 ? 'рівно 10' : 'більше ніж 10'}, просто додай їх до десятків.`
        : `Десятки: ${10 * d1} + ${10 * d2}. Одиниці: ${o1} + ${o2}.`,
    rozviazok: `${10 * d1} + ${10 * d2} = ${des}, ${o1} + ${o2} = ${od}, ${des} + ${od} = ${a + b}.`,
  };
}

// Віднімання, обернене до додавання пари: (a + b) − b = a.
function vidniaty({ d1, o1, d2, o2 }: Para): TrenZavdannia {
  const [a, b] = [chyslo(d1, o1), chyslo(d2, o2)];
  const s = a + b;
  const sd = Math.floor(s / 10) * 10;
  const so = s % 10;
  const perevirka = `Перевірка: ${a} + ${b} = ${s} ✓`;
  if (so >= o2) {
    return {
      vyraz: `${s} − ${b} =`,
      vidpovid: a,
      pidkazka: `Десятки: ${sd} − ${10 * d2}. Одиниці: ${so} − ${o2}.`,
      rozviazok: `${sd} − ${10 * d2} = ${10 * d1}, ${so} − ${o2} = ${o1}, ${10 * d1} + ${o1} = ${a}. ${perevirka}`,
    };
  }
  const zruchni = `${s} = ${sd - 10} + ${so + 10}`;
  return {
    vyraz: `${s} − ${b} =`,
    vidpovid: a,
    pidkazka: `Одиниць не вистачає: ${so} менше за ${o2}. Заміни ${s} сумою зручних доданків: ${sd - 10} + ${so + 10}.`,
    rozviazok: d2
      ? `${zruchni}; ${sd - 10} − ${10 * d2} = ${10 * d1}, ${so + 10} − ${o2} = ${o1}, ${10 * d1} + ${o1} = ${a}. ${perevirka}`
      : `${zruchni}; ${so + 10} − ${o2} = ${o1}, ${sd - 10} + ${o1} = ${a}. ${perevirka}`,
  };
}

// «56 = 50 + □» — сума розрядних доданків; «64 = 50 + □» — сума зручних доданків.
function rozklad(r: Vypadok, zruchni: boolean): TrenZavdannia {
  const d = r.chyslo(zruchni ? 2 : 1, 9);
  const o = r.chyslo(1, 9);
  const n = chyslo(d, o);
  const pershyi = r.shans(0.7);
  if (!zruchni) {
    return {
      pytannia: 'Заміни число сумою розрядних доданків.',
      vyraz: pershyi ? `${n} = ${10 * d} + □` : `${n} = □ + ${o}`,
      vidpovid: pershyi ? o : 10 * d,
      pidkazka: `Скільки в числі ${n} десятків і скільки одиниць?`,
      rozviazok: `У числі ${n} десятків ${d}, одиниць ${o}: ${n} = ${10 * d} + ${o}.`,
    };
  }
  return {
    pytannia: 'Заміни число сумою зручних доданків.',
    vyraz: pershyi ? `${n} = ${10 * (d - 1)} + □` : `${n} = □ + ${o + 10}`,
    vidpovid: pershyi ? o + 10 : 10 * (d - 1),
    pidkazka: 'Один десяток розміняй на 10 одиниць: десятків стане на один менше, а одиниць — на 10 більше.',
    rozviazok: `${n} = ${10 * d} + ${o} = ${10 * (d - 1)} + ${o + 10}.`,
  };
}

// «Чи правильно?» — у хибних відповідях типові помилки: «від більшої цифри меншу», загублений
// десяток, забутий розмін.
function chyPravylno(r: Vypadok): TrenZavdannia {
  const p = zPerekhodom(r);
  const [a, b] = [chyslo(p.d1, p.o1), chyslo(p.d2, p.o2)];
  const s = a + b;
  const o = osoba(r);
  const tak = r.shans(0.35);
  if (r.shans()) {
    const khybna = s - 10; // загубили десяток
    const nazvana = tak ? s : khybna;
    return {
      pytannia: `${o.imia} ${rid(o, 'порахував', 'порахувала')}: ${a} + ${b} = ${nazvana}. Чи правильно?`,
      vidpovid: tak ? 'Так' : 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: `Порахуй порозрядно: ${10 * p.d1} + ${10 * p.d2} і ${p.o1} + ${p.o2}. Чи не загубився десяток?`,
      rozviazok: `${tak ? 'Так' : 'Ні'}. ${10 * p.d1} + ${10 * p.d2} = ${10 * (p.d1 + p.d2)}, ${p.o1} + ${p.o2} = ${p.o1 + p.o2}, ${10 * (p.d1 + p.d2)} + ${p.o1 + p.o2} = ${s}.${tak ? '' : ' З одиниць узяли лише останню цифру, а десяток загубили.'}`,
    };
  }
  const so = s % 10;
  // Від більшої цифри меншу: десятки s − десятки b, одиниці — навпаки. Або забули про розмін.
  const vidBilshoi = 10 * (Math.floor(s / 10) - p.d2) + (p.o2 - so);
  const khybna = r.shans(0.7) ? vidBilshoi : a + 10;
  const nazvana = tak ? a : khybna;
  return {
    pytannia: `${o.imia} ${rid(o, 'порахував', 'порахувала')}: ${s} − ${b} = ${nazvana}. Чи правильно?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: `Перевір додаванням: ${nazvana} + ${b}. Чи вийде ${s}?`,
    rozviazok: tak
      ? `Так. Перевірка: ${a} + ${b} = ${s} ✓`
      : `Ні. Перевірка: ${khybna} + ${b} = ${khybna + b}, а має бути ${s}. Правильно: ${s} = ${s - so - 10} + ${so + 10}, тому ${s} − ${b} = ${a}.`,
  };
}

export default {
  rivni: ['без переходу через десяток', 'з переходом через десяток', 'усі випадки, зручні доданки, пошук помилки'],
  zavdannia(r, riven) {
    if (riven === 1) {
      const typ = r.chyslo(0, 9);
      if (typ < 2) return rozklad(r, false);
      return typ < 6 ? dodaty(bezPerekhodu(r)) : vidniaty(bezPerekhodu(r));
    }
    if (riven === 2) {
      const typ = r.chyslo(0, 9);
      if (typ < 2) return rozklad(r, true);
      const p = zPerekhodom(r, r.shans(0.25));
      return typ < 5 ? dodaty(p) : vidniaty(p);
    }
    const typ = r.chyslo(0, 9);
    if (typ < 3) return chyPravylno(r);
    if (typ < 4) return rozklad(r, true);
    if (typ < 6) return r.shans() ? dodaty(bezPerekhodu(r)) : vidniaty(bezPerekhodu(r));
    const p = zPerekhodom(r, r.shans(0.2));
    return r.shans(0.4) ? dodaty(p) : vidniaty(p);
  },
} satisfies Henerator;
