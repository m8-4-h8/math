// Гроші. Гривня і копійка (1 клас, Скворцова с. 139): полічити гроші на малюнку (від найбільших), 1 грн = 100 к.,
// вартість кількох товарів, порівняння сум, решта і «скільки було» без переходу через десяток.
import { osoba, rid, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { hroshi } from '../vymiriuvannia.ts';

const suma = (n: number[]) => n.reduce((a, b) => a + b, 0);
const znakPor = (a: number, b: number) => (a > b ? '>' : a < b ? '<' : '=');
/** Без переходу через десяток: a + b ≤ 99 і одиниці разом менше 10. */
const bezPerekhodu = (a: number, b: number) => a + b <= 99 && (a % 10) + (b % 10) < 10;

// Полічи гривні: купюри 20 і 50 грн, монети 1, 2, 5, 10 грн, разом до 100.
function lichyHryvni(r: Vypadok): TrenZavdannia {
  const hrn: number[] = [];
  const skilky = r.chyslo(2, 5);
  while (hrn.length < skilky) {
    const h = r.vybir([50, 20, 20, 10, 10, 5, 5, 2, 2, 1]);
    if (suma(hrn) + h <= 100) hrn.push(h);
    else if (suma(hrn) >= 95) break;
  }
  if (hrn.length < 2) return lichyHryvni(r);
  const vid = [...hrn].sort((a, b) => b - a);
  return {
    pytannia: 'Скільки тут грошей?',
    malunok: hroshi({ hrn: r.shans() ? hrn : vid }),
    vidpovid: suma(hrn),
    odynytsi: 'грн',
    pidkazka: 'Лічи від найбільших грошей: спершу купюри, потім монети. Дивись на число, а не на кількість.',
    rozviazok: `${vid.join(' + ')} = ${suma(hrn)} (грн)`,
  };
}

// Полічи копійки: монети 10 і 50 к., разом до 100 к.
function lichyKopiiky(r: Vypadok): TrenZavdannia {
  const kop: number[] = [];
  const skilky = r.chyslo(2, 6);
  while (kop.length < skilky) {
    const k = r.vybir([50, 10, 10]);
    if (suma(kop) + k <= 100) kop.push(k);
    else break;
  }
  if (kop.length < 2) return lichyKopiiky(r);
  const vid = [...kop].sort((a, b) => b - a);
  const s = suma(kop);
  return {
    pytannia: 'Скільки тут копійок?',
    malunok: hroshi({ kop }),
    vidpovid: s,
    odynytsi: 'к.',
    pidkazka: 'Спершу полічи монети по 50 к., потім додай по 10 к.',
    rozviazok: `${vid.join(' + ')} = ${s} (к.)${s === 100 ? '. А 100 к. = 1 грн.' : ''}`,
  };
}

// 1 грн = □ к. і подібне.
const ZAMINA: [string, number, string, string][] = [
  ['1 грн = □ к.', 100, 'к.', '1 грн = 100 к.'],
  ['100 к. = □ грн', 1, 'грн', '100 к. = 1 грн'],
  ['50 к. + 50 к. = □ к.', 100, 'к.', '50 + 50 = 100 (к.)'],
  ['50 к. + 50 к. = □ грн', 1, 'грн', '50 + 50 = 100 (к.), а 100 к. = 1 грн'],
];

function zamina(r: Vypadok): TrenZavdannia {
  const [vyraz, vidpovid, odynytsi, rozviazok] = r.vybir(ZAMINA);
  return {
    pytannia: 'Гривні й копійки.',
    vyraz,
    vidpovid,
    odynytsi,
    pidkazka: 'В одній гривні сто копійок.',
    rozviazok,
  };
}

// Порівняння: 1 грн □ 90 к., a грн □ b грн.
function porivniannia(r: Vypadok): TrenZavdannia {
  if (r.shans(0.6)) {
    const k = r.chyslo(1, 10) * 10;
    const hrnZliva = r.shans();
    const znak = hrnZliva ? znakPor(100, k) : znakPor(k, 100);
    return {
      pytannia: 'Порівняй.',
      vyraz: hrnZliva ? `1 грн □ ${k} к.` : `${k} к. □ 1 грн`,
      vidpovid: znak,
      varianty: ['>', '<', '='],
      pidkazka: 'Одиниці різні. Заміни 1 грн копійками.',
      rozviazok: hrnZliva ? `1 грн = 100 к.; 100 ${znak} ${k}, тому 1 грн ${znak} ${k} к.` : `1 грн = 100 к.; ${k} ${znak} 100, тому ${k} к. ${znak} 1 грн.`,
    };
  }
  const a = r.chyslo(10, 99);
  const b = r.shans(0.2) ? a : r.krim(Math.max(10, a - 15), Math.min(99, a + 15), [a]);
  const znak = znakPor(a, b);
  return {
    pytannia: 'Порівняй.',
    vyraz: `${a} грн □ ${b} грн`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Одиниці однакові — порівняй числа: спершу десятки, потім одиниці.',
    rozviazok: `${a} ${znak} ${b}, тому ${a} грн ${znak} ${b} грн.`,
  };
}

// Товари з правдоподібними цінами (грн): [називний, знахідний, від, до, рід].
type Rid = 'ч' | 'ж' | 'с' | 'мн';
const TOVARY: [string, string, number, number, Rid][] = [
  ['зошит', 'зошит', 10, 20, 'ч'],
  ['ручка', 'ручку', 12, 30, 'ж'],
  ['олівець', 'олівець', 8, 15, 'ч'],
  ['гумка', 'гумку', 5, 15, 'ж'],
  ['лінійка', 'лінійку', 12, 25, 'ж'],
  ['альбом', 'альбом', 40, 70, 'ч'],
  ['фарби', 'фарби', 50, 80, 'мн'],
  ['булочка', 'булочку', 12, 25, 'ж'],
  ['сік', 'сік', 25, 40, 'ч'],
  ['морозиво', 'морозиво', 20, 45, 'с'],
];

function dvaTovary(r: Vypadok): [(typeof TOVARY)[number], number, (typeof TOVARY)[number], number] {
  for (;;) {
    const [i, j] = r.rizni(2, 0, TOVARY.length - 1);
    const [t1, t2] = [TOVARY[i], TOVARY[j]];
    const a = r.chyslo(t1[2], t1[3]);
    const b = r.chyslo(t2[2], t2[3]);
    if (bezPerekhodu(a, b)) return [t1, a, t2, b];
  }
}

const kosht = (t: (typeof TOVARY)[number]) => (t[4] === 'мн' ? 'коштують' : 'коштує');
const DOROZHCHYI: Record<Rid, string> = { ч: 'дорожчий', ж: 'дорожча', с: 'дорожче', мн: 'дорожчі' };

// Вартість двох товарів.
function vartist(r: Vypadok): TrenZavdannia {
  const [t1, a, t2, b] = dvaTovary(r);
  return {
    pytannia: `${zVelykoi(t1[0])} ${kosht(t1)} ${a} грн, а ${t2[0]} — ${b} грн. Скільки гривень коштують ${t1[0]} і ${t2[0]} разом?`,
    vidpovid: a + b,
    odynytsi: 'грн',
    pidkazka: 'Вартість покупки — це ціни всіх товарів разом. Додавай.',
    rozviazok: `${a} + ${b} = ${a + b} (грн)`,
  };
}

// Решта: було a грн, купив за b грн.
function reshta(r: Vypadok): TrenZavdannia {
  const o = osoba(r);
  const [t] = [r.vybir(TOVARY)];
  let a = 0;
  let b = 0;
  do {
    a = r.shans() ? r.chyslo(3, 10) * 10 : r.chyslo(30, 99);
    b = r.chyslo(t[2], t[3]);
  } while (!(b < a && a % 10 >= b % 10));
  return {
    pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${a} грн і ${rid(o, 'купив', 'купила')} ${t[1]} за ${b} грн. Скільки гривень у ${rid(o, 'нього', 'неї')} залишилося?`,
    vidpovid: a - b,
    odynytsi: 'грн',
    pidkazka: 'Гроші витратили — залишилося менше. Віднімай.',
    rozviazok: `${a} − ${b} = ${a - b} (грн). Перевірка: ${a - b} + ${b} = ${a}`,
  };
}

// Скільки було: витратив b, залишилося c.
function bulo(r: Vypadok): TrenZavdannia {
  const o = osoba(r);
  let b = 0;
  let c = 0;
  do {
    b = r.chyslo(10, 70);
    c = r.chyslo(5, 60);
  } while (!bezPerekhodu(b, c));
  return {
    pytannia: `Після того як ${o.imia} ${rid(o, 'витратив', 'витратила')} ${b} грн, у ${rid(o, 'нього', 'неї')} залишилося ${c} грн. Скільки гривень у ${rid(o, 'нього', 'неї')} було?`,
    vidpovid: b + c,
    odynytsi: 'грн',
    pidkazka: 'Скільки було — це ціле: витрачені гроші і ті, що залишилися. Невідоме зменшуване шукаємо додаванням.',
    rozviazok: `${c} + ${b} = ${b + c} (грн). Перевірка: ${b + c} − ${b} = ${c}`,
  };
}

// На скільки дорожче.
function dorozhche(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [i, j] = r.rizni(2, 0, TOVARY.length - 1);
    const [t1, t2] = [TOVARY[i], TOVARY[j]];
    const a = r.chyslo(t1[2], t1[3]);
    const b = r.chyslo(t2[2], t2[3]);
    if (!(a > b && a % 10 >= b % 10)) continue;
    return {
      pytannia: `${zVelykoi(t1[0])} ${kosht(t1)} ${a} грн, а ${t2[0]} — ${b} грн. На скільки гривень ${t1[0]} ${DOROZHCHYI[t1[4]]} за ${t2[1]}?`,
      vidpovid: a - b,
      odynytsi: 'грн',
      pidkazka: 'На скільки дорожче — від більшої ціни відніми меншу.',
      rozviazok: `${a} − ${b} = ${a - b} (грн)`,
    };
  }
}

// Чи вистачить грошей на дві покупки.
function vystachyt(r: Vypadok): TrenZavdannia {
  const o = osoba(r);
  const [t1, a, t2, b] = dvaTovary(r);
  const v = a + b;
  const maie = r.shans(0.2) ? v : r.krim(Math.max(10, v - 9), Math.min(99, v + 9), [v]);
  const tak = maie >= v;
  return {
    pytannia: `${o.imia} має ${maie} грн. Чи вистачить ${rid(o, 'йому', 'їй')} грошей, щоб купити ${t1[1]} за ${a} грн і ${t2[1]} за ${b} грн?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Спершу знайди вартість покупки, потім порівняй її з грошима, що є.',
    rozviazok: `${a} + ${b} = ${v} (грн); ${maie} ${znakPor(maie, v)} ${v}. ${tak ? 'Грошей вистачить.' : 'Грошей не вистачить.'}`,
  };
}

export default {
  rivni: ['полічи гроші', 'вартість і копійки', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([lichyHryvni, lichyHryvni, lichyHryvni, lichyKopiiky, zamina])(r);
    if (riven === 2) return r.vybir([vartist, vartist, porivniannia, porivniannia, zamina, lichyHryvni])(r);
    return r.vybir([reshta, bulo, dorozhche, vystachyt, vartist])(r);
  },
} satisfies Henerator;
