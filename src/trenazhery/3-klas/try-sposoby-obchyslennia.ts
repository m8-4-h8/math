// Усне додавання і віднімання круглих трицифрових чисел трьома способами (3 клас):
// порозрядно (сотні з сотнями, десятки з десятками; зручні доданки 540 = 400 + 140),
// частинами (350 + 400 + 80) і прийомом округлення (350 + 500 − 20).
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Para {
  s1: number; // сотні першого числа (цифра)
  d1: number; // десятки першого числа (цифра)
  s2: number;
  d2: number;
}

const chyslo = (s: number, d: number) => 100 * s + 10 * d;

// Сума до 990. perekhid: чи десятків разом більше ніж 9.
function para(r: Vypadok, perekhid: boolean): Para {
  const s1 = r.chyslo(1, 7);
  const s2 = r.chyslo(1, (perekhid ? 8 : 9) - s1);
  if (perekhid) {
    const d1 = r.chyslo(2, 9);
    return { s1, d1, s2, d2: r.chyslo(11 - d1, 9) };
  }
  const d1 = r.chyslo(1, 7);
  return { s1, d1, s2, d2: r.chyslo(1, 9 - d1) };
}

function dodaty(r: Vypadok, { s1, d1, s2, d2 }: Para): TrenZavdannia {
  const [a, b] = [chyslo(s1, d1), chyslo(s2, d2)];
  const sotni = 100 * (s1 + s2);
  const des = 10 * (d1 + d2);
  if (r.shans()) {
    return {
      vyraz: `${a} + ${b} =`,
      vidpovid: a + b,
      pidkazka: `Порозрядно: сотні ${100 * s1} + ${100 * s2}, десятки ${10 * d1} + ${10 * d2}.`,
      rozviazok: `Порозрядно: ${100 * s1} + ${100 * s2} = ${sotni}, ${10 * d1} + ${10 * d2} = ${des}, ${sotni} + ${des} = ${a + b}.`,
    };
  }
  return {
    vyraz: `${a} + ${b} =`,
    vidpovid: a + b,
    pidkazka: `Частинами: ${b} = ${100 * s2} + ${10 * d2}. Спершу ${a} + ${100 * s2}.`,
    rozviazok: `Частинами: ${a} + ${100 * s2} = ${a + 100 * s2}; ${a + 100 * s2} + ${10 * d2} = ${a + b}.`,
  };
}

// Віднімання, обернене до додавання пари: (a + b) − b = a.
function vidniaty(r: Vypadok, { s1, d1, s2, d2 }: Para): TrenZavdannia {
  const [a, b] = [chyslo(s1, d1), chyslo(s2, d2)];
  const s = a + b;
  const sSotni = Math.floor(s / 100) * 100;
  const sDes = s - sSotni;
  const perevirka = `Перевірка: ${a} + ${b} = ${s} ✓`;
  if (r.shans()) {
    return {
      vyraz: `${s} − ${b} =`,
      vidpovid: a,
      pidkazka: `Частинами: ${b} = ${100 * s2} + ${10 * d2}. Спершу ${s} − ${100 * s2}.`,
      rozviazok: `Частинами: ${s} − ${100 * s2} = ${s - 100 * s2}; ${s - 100 * s2} − ${10 * d2} = ${a}. ${perevirka}`,
    };
  }
  if (sDes >= 10 * d2) {
    return {
      vyraz: `${s} − ${b} =`,
      vidpovid: a,
      pidkazka: `Порозрядно: сотні ${sSotni} − ${100 * s2}, десятки ${sDes} − ${10 * d2}.`,
      rozviazok: `Порозрядно: ${sSotni} − ${100 * s2} = ${100 * s1}, ${sDes} − ${10 * d2} = ${10 * d1}, ${100 * s1} + ${10 * d1} = ${a}. ${perevirka}`,
    };
  }
  return {
    vyraz: `${s} − ${b} =`,
    vidpovid: a,
    pidkazka: `Десятків не вистачає: ${sDes} менше за ${10 * d2}. Заміни ${s} сумою зручних доданків: ${sSotni - 100} + ${sDes + 100}.`,
    rozviazok: `Порозрядно: ${s} = ${sSotni - 100} + ${sDes + 100}; ${sSotni - 100} − ${100 * s2} = ${100 * s1}, ${sDes + 100} − ${10 * d2} = ${10 * d1}, ${100 * s1} + ${10 * d1} = ${a}. ${perevirka}`,
  };
}

// Прийом округлення: друге число закінчується на 70, 80 або 90.
interface Okruhlennia {
  a: number;
  kruhle: number; // круглі сотні
  zaive: number; // 10, 20 або 30
}

function okruhlennia(r: Vypadok): Okruhlennia {
  const zaive = r.vybir([10, 10, 20, 20, 30]);
  const kruhle = 100 * r.chyslo(2, 6);
  const a = 10 * r.krim(12, (1000 - kruhle) / 10, [20, 30, 40, 50, 60, 70, 80]);
  return { a, kruhle, zaive };
}

function dodatyOkruhlenniam({ a, kruhle, zaive }: Okruhlennia): TrenZavdannia {
  const b = kruhle - zaive;
  return {
    vyraz: `${a} + ${b} =`,
    vidpovid: a + b,
    pidkazka: `${b} — це ${kruhle} без ${zaive}. Додай ${kruhle}, а зайві ${zaive} відніми.`,
    rozviazok: `${b} = ${kruhle} − ${zaive}; ${a} + ${kruhle} − ${zaive} = ${a + kruhle} − ${zaive} = ${a + b}.`,
  };
}

function vidniatyOkruhlenniam({ a, kruhle, zaive }: Okruhlennia): TrenZavdannia {
  const b = kruhle - zaive;
  const s = a + b;
  return {
    vyraz: `${s} − ${b} =`,
    vidpovid: a,
    pidkazka: `${b} — це ${kruhle} без ${zaive}. Відніми ${kruhle}, а зайві ${zaive} поверни.`,
    rozviazok: `${b} = ${kruhle} − ${zaive}; ${s} − ${kruhle} + ${zaive} = ${s - kruhle} + ${zaive} = ${a}. Перевірка: ${a} + ${b} = ${s} ✓`,
  };
}

// Пропущене число в записі одного зі способів.
function propushchenyiKrok(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const s = r.chyslo(2, 9);
    const d = r.chyslo(1, 8);
    const n = chyslo(s, d);
    return {
      pytannia: 'Заміни число сумою зручних доданків.',
      vyraz: `${n} = ${100 * (s - 1)} + □`,
      vidpovid: 10 * d + 100,
      pidkazka: 'Одну сотню розміняй на 10 десятків: сотень стане на одну менше, а десятків — на 10 більше.',
      rozviazok: `${n} = ${100 * s} + ${10 * d} = ${100 * (s - 1)} + ${10 * d + 100}.`,
    };
  }
  if (typ === 1) {
    const { s1, d1, s2, d2 } = para(r, r.shans());
    const [a, b] = [chyslo(s1, d1), chyslo(s2, d2)];
    const s = a + b;
    return r.shans()
      ? {
          pytannia: 'Яке число пропущене?',
          vyraz: `${a} + ${b} = ${a} + ${100 * s2} + □`,
          vidpovid: 10 * d2,
          pidkazka: `Розклади ${b} на сотні й десятки. Сотні вже додали.`,
          rozviazok: `${b} = ${100 * s2} + ${10 * d2}, тому пропущене число — ${10 * d2}. ${a} + ${100 * s2} + ${10 * d2} = ${s}.`,
        }
      : {
          pytannia: 'Яке число пропущене?',
          vyraz: `${s} − ${b} = ${s} − ${100 * s2} − □`,
          vidpovid: 10 * d2,
          pidkazka: `Розклади ${b} на сотні й десятки. Сотні вже відняли.`,
          rozviazok: `${b} = ${100 * s2} + ${10 * d2}, тому пропущене число — ${10 * d2}. ${s} − ${100 * s2} − ${10 * d2} = ${a}.`,
        };
  }
  const { a, kruhle, zaive } = okruhlennia(r);
  const b = kruhle - zaive;
  const s = a + b;
  return typ === 2
    ? {
        pytannia: 'Яке число пропущене?',
        vyraz: `${a} + ${b} = ${a} + ${kruhle} − □`,
        vidpovid: zaive,
        pidkazka: `Додали ${kruhle} замість ${b}. На скільки це більше?`,
        rozviazok: `${b} = ${kruhle} − ${zaive}, тому пропущене число — ${zaive}. ${a} + ${kruhle} − ${zaive} = ${s}.`,
      }
    : {
        pytannia: 'Яке число пропущене?',
        vyraz: `${s} − ${b} = ${s} − ${kruhle} + □`,
        vidpovid: zaive,
        pidkazka: `Відняли ${kruhle} замість ${b}. На скільки це більше?`,
        rozviazok: `${b} = ${kruhle} − ${zaive}, тому пропущене число — ${zaive}. ${s} − ${kruhle} + ${zaive} = ${a}.`,
      };
}

// «Чи правильно?» — загублена сотня, «від більшої цифри меншу», поправка не в той бік.
function chyPravylno(r: Vypadok): TrenZavdannia {
  const o = osoba(r);
  const porakhuvav = rid(o, 'порахував', 'порахувала');
  const tak = r.shans(0.35);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const { s1, d1, s2, d2 } = para(r, true);
    const [a, b] = [chyslo(s1, d1), chyslo(s2, d2)];
    const s = a + b;
    const sotni = 100 * (s1 + s2);
    const des = 10 * (d1 + d2);
    return {
      pytannia: `${o.imia} ${porakhuvav}: ${a} + ${b} = ${tak ? s : s - 100}. Чи правильно?`,
      vidpovid: tak ? 'Так' : 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: `Порахуй порозрядно: ${100 * s1} + ${100 * s2} і ${10 * d1} + ${10 * d2}. Чи не загубилася сотня?`,
      rozviazok: `${tak ? 'Так' : 'Ні'}. ${100 * s1} + ${100 * s2} = ${sotni}, ${10 * d1} + ${10 * d2} = ${des}, ${sotni} + ${des} = ${s}.${tak ? '' : ' З десятків узяли лише частину, а сотню загубили.'}`,
    };
  }
  if (typ === 1) {
    const { s1, d1, s2, d2 } = para(r, true);
    const [a, b] = [chyslo(s1, d1), chyslo(s2, d2)];
    const s = a + b;
    const sDes = (s % 100) / 10;
    const khybna = 100 * (Math.floor(s / 100) - s2) + 10 * (d2 - sDes);
    const nazvana = tak ? a : khybna;
    return {
      pytannia: `${o.imia} ${porakhuvav}: ${s} − ${b} = ${nazvana}. Чи правильно?`,
      vidpovid: tak ? 'Так' : 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: `Перевір додаванням: ${nazvana} + ${b}. Чи вийде ${s}?`,
      rozviazok: tak
        ? `Так. Перевірка: ${a} + ${b} = ${s} ✓`
        : `Ні: відняли «від більшої цифри меншу». Перевірка: ${khybna} + ${b} = ${khybna + b}, а має бути ${s}. Правильно частинами: ${s} − ${100 * s2} = ${s - 100 * s2}; ${s - 100 * s2} − ${10 * d2} = ${a}.`,
    };
  }
  const { a, kruhle, zaive } = okruhlennia(r);
  const b = kruhle - zaive;
  const s = a + b;
  const khybna = a - 2 * zaive;
  const nazvana = tak ? a : khybna;
  return {
    pytannia: `${o.imia} ${porakhuvav}: ${s} − ${b} = ${nazvana}. Чи правильно?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: `${b} — це ${kruhle} без ${zaive}. Відніми ${kruhle}. Зайві ${zaive} треба повернути чи ще раз забрати?`,
    rozviazok: tak
      ? `Так. ${s} − ${kruhle} + ${zaive} = ${s - kruhle} + ${zaive} = ${a}.`
      : `Ні: поправку зробили не в той бік. Відняли ${kruhle} замість ${b}, тому зайві ${zaive} повертаємо: ${s} − ${kruhle} + ${zaive} = ${s - kruhle} + ${zaive} = ${a}.`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  let a: number;
  let b: number;
  let plius: string; // хід додавання a + b
  let minus: string; // хід віднімання (a + b) − b
  if (r.shans()) {
    const p = okruhlennia(r);
    a = p.a;
    b = p.kruhle - p.zaive;
    plius = `${a} + ${p.kruhle} − ${p.zaive} = ${a + p.kruhle} − ${p.zaive} = ${a + b}`;
    minus = `${a + b} − ${p.kruhle} + ${p.zaive} = ${a + b - p.kruhle} + ${p.zaive} = ${a}`;
  } else {
    const p = para(r, true);
    a = chyslo(p.s1, p.d1);
    b = chyslo(p.s2, p.d2);
    plius = `${a} + ${100 * p.s2} + ${10 * p.d2} = ${a + 100 * p.s2} + ${10 * p.d2} = ${a + b}`;
    minus = `${a + b} − ${100 * p.s2} − ${10 * p.d2} = ${a + b - 100 * p.s2} − ${10 * p.d2} = ${a}`;
  }
  const s = a + b;
  if (r.shans()) {
    const o = osoba(r);
    return {
      pytannia: `${o.imia} ${rid(o, 'збирав', 'збирала')} на самокат і ${rid(o, 'мав', 'мала')} ${s} ${mnozh(s, 'гривню', 'гривні', 'гривень')}. На подарунок другові ${rid(o, 'він витратив', 'вона витратила')} ${b} ${mnozh(b, 'гривню', 'гривні', 'гривень')}. Скільки гривень залишилось?`,
      vidpovid: a,
      odynytsi: 'грн',
      pidkazka: `Залишилось — це різниця: ${s} − ${b}. Обери зручний спосіб.`,
      rozviazok: `${minus}. Перевірка: ${a} + ${b} = ${s} ✓`,
    };
  }
  return {
    pytannia: `Першого дня туристи проїхали ${a} км, а другого — ${b} км. Скільки кілометрів вони проїхали за два дні?`,
    vidpovid: s,
    odynytsi: 'км',
    pidkazka: `Разом — це сума: ${a} + ${b}. Обери зручний спосіб.`,
    rozviazok: `${plius}. Перевірка: ${s} − ${b} = ${a} ✓`,
  };
}

export default {
  rivni: ['порозрядно і частинами', 'прийом округлення', 'пропущений крок, пошук помилки, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) {
      const p = para(r, r.shans(0.6));
      return r.shans() ? dodaty(r, p) : vidniaty(r, p);
    }
    if (riven === 2) return r.shans() ? dodatyOkruhlenniam(okruhlennia(r)) : vidniatyOkruhlenniam(okruhlennia(r));
    const typ = r.chyslo(0, 9);
    if (typ < 3) return propushchenyiKrok(r);
    if (typ < 6) return chyPravylno(r);
    if (typ < 8) return zadacha(r);
    return r.shans() ? vidniaty(r, para(r, true)) : vidniatyOkruhlenniam(okruhlennia(r));
  },
} satisfies Henerator;
