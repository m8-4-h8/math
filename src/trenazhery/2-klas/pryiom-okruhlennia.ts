// Прийом округлення (2 клас): число, близьке до круглого, замінюємо круглим і виправляємо зайве.
// 45 + 9 = 45 + 10 − 1; 45 − 9 = 45 − 10 + 1; 73 + 19 = 73 + 20 − 1; 73 − 19 = 73 − 20 + 1.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Para {
  a: number; // перше число (у відніманні — різниця)
  kruhle: number; // кругле число, яким замінюємо друге
  zaive: number; // на скільки кругле більше за друге число: 1, 2 або 3
}

// Друге число одноцифрове: 7, 8 або 9. Одиниць разом більше ніж 10, сума не більша за 98.
function odnotsyfrove(r: Vypadok): Para {
  const zaive = r.vybir([1, 1, 2, 2, 3]);
  const k = 10 - zaive;
  const o1 = r.chyslo(11 - k, 9);
  // Третина завдань — у межах 20, як на початку теми в підручнику.
  const d1 = r.shans(0.3) ? r.chyslo(0, 1) : r.chyslo(2, 8);
  return { a: 10 * d1 + o1, kruhle: 10, zaive };
}

// Друге число двоцифрове, близьке до круглих десятків: 19, 28, 37… Після додавання круглого — не більше 100.
function dvotsyfrove(r: Vypadok): Para {
  const zaive = r.vybir([1, 1, 2, 2, 3]);
  const kruhle = 10 * r.chyslo(2, 6);
  const a = r.krim(12, 100 - kruhle, [20, 30, 40, 50, 60, 70, 80]);
  return { a, kruhle, zaive };
}

function dodaty({ a, kruhle, zaive }: Para): TrenZavdannia {
  const b = kruhle - zaive;
  return {
    vyraz: `${a} + ${b} =`,
    vidpovid: a + b,
    pidkazka: `${b} — це ${kruhle} без ${zaive}. Додай ${kruhle}, а зайві ${zaive} відніми.`,
    rozviazok: `${b} = ${kruhle} − ${zaive}; ${a} + ${kruhle} − ${zaive} = ${a + kruhle} − ${zaive} = ${a + b}.`,
  };
}

// Віднімання, обернене до додавання: (a + b) − b = a.
function vidniaty({ a, kruhle, zaive }: Para): TrenZavdannia {
  const b = kruhle - zaive;
  const s = a + b;
  return {
    vyraz: `${s} − ${b} =`,
    vidpovid: a,
    pidkazka: `${b} — це ${kruhle} без ${zaive}. Відніми ${kruhle}, а зайві ${zaive} поверни.`,
    rozviazok: `${b} = ${kruhle} − ${zaive}; ${s} − ${kruhle} + ${zaive} = ${s - kruhle} + ${zaive} = ${a}. Перевірка: ${a} + ${b} = ${s} ✓`,
  };
}

// «36 + 9 = 36 + 10 − □», «63 − 18 = 63 − 20 + □».
function propushchenaPopravka(r: Vypadok): TrenZavdannia {
  const { a, kruhle, zaive } = r.shans() ? odnotsyfrove(r) : dvotsyfrove(r);
  const b = kruhle - zaive;
  const s = a + b;
  if (r.shans()) {
    return {
      pytannia: 'Яке число пропущене?',
      vyraz: `${a} + ${b} = ${a} + ${kruhle} − □`,
      vidpovid: zaive,
      pidkazka: `Додали ${kruhle} замість ${b}. На скільки це більше?`,
      rozviazok: `${b} = ${kruhle} − ${zaive}, тому пропущене число — ${zaive}. ${a} + ${kruhle} − ${zaive} = ${s}.`,
    };
  }
  return {
    pytannia: 'Яке число пропущене?',
    vyraz: `${s} − ${b} = ${s} − ${kruhle} + □`,
    vidpovid: zaive,
    pidkazka: `Відняли ${kruhle} замість ${b}. На скільки це більше?`,
    rozviazok: `${b} = ${kruhle} − ${zaive}, тому пропущене число — ${zaive}. ${s} − ${kruhle} + ${zaive} = ${a}.`,
  };
}

// «Що зробити далі?» — пастка: поправка не в той бік.
function shchoDali(r: Vypadok): TrenZavdannia {
  const { a, kruhle, zaive } = r.shans(0.4) ? odnotsyfrove(r) : dvotsyfrove(r);
  const b = kruhle - zaive;
  const s = a + b;
  const o = osoba(r);
  const znaishov = rid(o, 'знайшов', 'знайшла');
  if (r.shans()) {
    return {
      pytannia: `${o.imia} рахує ${a} + ${b} прийомом округлення і вже ${znaishov}: ${a} + ${kruhle} = ${a + kruhle}. Що зробити далі?`,
      vidpovid: `відняти ${zaive}`,
      varianty: r.peremishaty([`відняти ${zaive}`, `додати ${zaive}`, `відняти ${b % 10}`]),
      pidkazka: `Додали ${kruhle} замість ${b}. Додали більше чи менше, ніж треба?`,
      rozviazok: `Додали ${kruhle} замість ${b} — на ${zaive} більше, ніж треба. Зайве віднімаємо: ${a + kruhle} − ${zaive} = ${s}.`,
    };
  }
  return {
    pytannia: `${o.imia} рахує ${s} − ${b} прийомом округлення і вже ${znaishov}: ${s} − ${kruhle} = ${s - kruhle}. Що зробити далі?`,
    vidpovid: `додати ${zaive}`,
    varianty: r.peremishaty([`додати ${zaive}`, `відняти ${zaive}`, `додати ${b % 10}`]),
    pidkazka: `Відняли ${kruhle} замість ${b}. Забрали більше чи менше, ніж треба?`,
    rozviazok: `Відняли ${kruhle} замість ${b} — на ${zaive} більше, ніж треба. Зайве повертаємо: ${s - kruhle} + ${zaive} = ${a}.`,
  };
}

// Покупка: заплатили круглою сумою й одержали решту.
function zadacha(r: Vypadok): TrenZavdannia {
  const { a, kruhle, zaive } = dvotsyfrove(r);
  const b = kruhle - zaive;
  const s = a + b;
  const o = osoba(r);
  const rich = r.vybir(['книжку', 'іграшку', 'набір олівців', 'альбом', 'конструктор']);
  return {
    pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${s} ${mnozh(s, 'гривню', 'гривні', 'гривень')} і ${rid(o, 'купив', 'купила')} ${rich} за ${b} ${mnozh(b, 'гривню', 'гривні', 'гривень')}. Скільки гривень залишилось?`,
    vidpovid: a,
    odynytsi: 'грн',
    pidkazka: `Залишилось — це різниця: ${s} − ${b}. ${b} — це ${kruhle} без ${zaive}.`,
    rozviazok: `${s} − ${b} = ${s} − ${kruhle} + ${zaive} = ${s - kruhle} + ${zaive} = ${a}. Перевірка: ${a} + ${b} = ${s} ✓`,
  };
}

export default {
  rivni: ['додаємо і віднімаємо 7, 8, 9', 'двоцифрове число, близьке до круглого', 'пропущена поправка, «що далі?», задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? dodaty(odnotsyfrove(r)) : vidniaty(odnotsyfrove(r));
    if (riven === 2) return r.shans() ? dodaty(dvotsyfrove(r)) : vidniaty(dvotsyfrove(r));
    const typ = r.chyslo(0, 9);
    if (typ < 3) return propushchenaPopravka(r);
    if (typ < 6) return shchoDali(r);
    if (typ < 8) return zadacha(r);
    const p = r.shans() ? odnotsyfrove(r) : dvotsyfrove(r);
    return r.shans() ? dodaty(p) : vidniaty(p);
  },
} satisfies Henerator;
