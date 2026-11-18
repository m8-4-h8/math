// Нерівність трикутника. Побудова трикутника (Скворцова, 5 клас, с. 135–138): чи існує трикутник із такими
// сторонами (сума двох менших більша за найбільшу; «дорівнює» — не можна), периметр і невідома сторона,
// рівнобедрений і рівносторонній трикутник, найбільша й найменша ціла третя сторона, діагоналі многокутника.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const OD = ['см', 'мм', 'дм'];

/** Три сторони в перемішаному порядку; tak — чи має існувати трикутник; rivno — випадок a + b = c. */
function storony(r: Vypadok, tak: boolean, rivno = false): number[] {
  for (;;) {
    const a = r.chyslo(2, 12);
    const b = r.chyslo(2, 12);
    const c = tak ? r.chyslo(Math.max(a, b), a + b - 1) : rivno ? a + b : a + b + r.chyslo(1, 6);
    const s = r.peremishaty([a, b, c]);
    if (tak && s[0] === s[1] && s[1] === s[2]) continue; // рівносторонній — занадто просто
    return s;
  }
}

function chyIsnuie(r: Vypadok, pidstup: boolean): TrenZavdannia {
  const tak = r.shans();
  const s = storony(r, tak, !tak && pidstup && r.shans(0.6));
  const o = r.vybir(OD);
  const [m1, m2, max] = [...s].sort((x, y) => x - y);
  const suma = m1 + m2;
  return {
    pytannia: `Чи можна побудувати трикутник зі сторонами ${s[0]} ${o}, ${s[1]} ${o} і ${s[2]} ${o}?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: `Знайди найбільшу сторону (${max} ${o}) і порівняй її із сумою двох інших.`,
    rozviazok: tak
      ? `Так: ${m1} + ${m2} = ${suma}, а це більше за ${max}.`
      : suma === max
        ? `Ні: ${m1} + ${m2} = ${suma} — лише дорівнює ${max}, сторони ляжуть в одну лінію.`
        : `Ні: ${m1} + ${m2} = ${suma}, а це менше за ${max}.`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const s = storony(r, true);
  const o = r.vybir(OD);
  if (r.shans(0.3)) {
    const a = r.chyslo(4, 40);
    return {
      pytannia: `Периметр рівностороннього трикутника — ${3 * a} ${o}. Знайди довжину його сторони.`,
      vidpovid: a,
      odynytsi: o,
      pidkazka: 'У рівностороннього трикутника три однакові сторони.',
      rozviazok: `${3 * a} : 3 = ${a} (${o})`,
    };
  }
  return {
    pytannia: `Знайди периметр трикутника зі сторонами ${s[0]} ${o}, ${s[1]} ${o} і ${s[2]} ${o}.`,
    vidpovid: s[0] + s[1] + s[2],
    odynytsi: o,
    pidkazka: 'Периметр — сума довжин усіх сторін.',
    rozviazok: `${s[0]} + ${s[1]} + ${s[2]} = ${s[0] + s[1] + s[2]} (${o})`,
  };
}

function tretiaStorona(r: Vypadok): TrenZavdannia {
  const [a, b, c] = storony(r, true).map((x) => x * r.vybir([1, 2, 3]));
  if ((a >= b + c) || (b >= a + c) || (c >= a + b)) return tretiaStorona(r);
  const o = r.vybir(OD);
  const P = a + b + c;
  return {
    pytannia: `Периметр трикутника — ${P} ${o}. Дві його сторони — ${a} ${o} і ${b} ${o}. Знайди третю сторону.`,
    vidpovid: c,
    odynytsi: o,
    pidkazka: 'Від периметра відніми дві відомі сторони.',
    rozviazok: `${P} − ${a} − ${b} = ${c} (${o}). Перевірка: ${a} + ${b} + ${c} = ${P}`,
  };
}

function rivnobedrenyi(r: Vypadok): TrenZavdannia {
  const o = r.vybir(OD);
  const bichna = r.chyslo(5, 40);
  const osnova = r.chyslo(2, 2 * bichna - 1);
  if (osnova === bichna) return rivnobedrenyi(r);
  const P = 2 * bichna + osnova;
  return r.shans()
    ? {
        pytannia: `Основа рівнобедреного трикутника — ${osnova} ${o}, периметр — ${P} ${o}. Знайди бічну сторону.`,
        vidpovid: bichna,
        odynytsi: o,
        pidkazka: `Дві однакові бічні сторони разом: ${P} − ${osnova}.`,
        rozviazok: `(${P} − ${osnova}) : 2 = ${P - osnova} : 2 = ${bichna} (${o})`,
      }
    : {
        pytannia: `Бічна сторона рівнобедреного трикутника — ${bichna} ${o}, периметр — ${P} ${o}. Знайди основу.`,
        vidpovid: osnova,
        odynytsi: o,
        pidkazka: 'Бічних сторін дві, і вони однакові.',
        rozviazok: `${P} − ${bichna} · 2 = ${P} − ${2 * bichna} = ${osnova} (${o})`,
      };
}

function kratnaStorona(r: Vypadok): TrenZavdannia {
  // «Одна сторона — a, друга у k разів коротша (довша), периметр P. Знайди третю».
  for (;;) {
    const o = r.vybir(['мм', 'см']);
    const k = r.chyslo(2, 7);
    const koroche = r.shans();
    const mala = r.chyslo(3, 15);
    const [a, b] = koroche ? [mala * k, mala] : [mala, mala * k];
    const c = r.chyslo(Math.abs(a - b) + 1, a + b - 1);
    const P = a + b + c;
    return {
      pytannia: `Периметр трикутника — ${P} ${o}. Одна сторона — ${a} ${o}, друга — у ${k} ${k < 5 ? 'рази' : 'разів'} ${koroche ? 'коротша' : 'довша'}. Знайди третю сторону.`,
      vidpovid: c,
      odynytsi: o,
      pidkazka: `Спершу друга сторона: ${a} ${koroche ? ':' : '·'} ${k}.`,
      rozviazok: `Друга: ${a} ${koroche ? ':' : '·'} ${k} = ${b}; третя: ${P} − ${a} − ${b} = ${c} (${o})`,
    };
  }
}

function tsilaStorona(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 15);
  const b = r.krim(2, 15, [a]);
  const o = r.vybir(OD);
  if (r.shans()) {
    return {
      pytannia: `Дві сторони трикутника — ${a} ${o} і ${b} ${o}. Яка найбільша ціла довжина може бути в третьої сторони?`,
      vidpovid: a + b - 1,
      odynytsi: o,
      pidkazka: `Третя сторона має бути менша за ${a} + ${b}.`,
      rozviazok: `${a} + ${b} = ${a + b}; третя сторона менша, тож найбільша ціла — ${a + b - 1} ${o}.`,
    };
  }
  const [mensha, bilsha] = [Math.min(a, b), Math.max(a, b)];
  return {
    pytannia: `Дві сторони трикутника — ${a} ${o} і ${b} ${o}. Яка найменша ціла довжина може бути в третьої сторони?`,
    vidpovid: bilsha - mensha + 1,
    odynytsi: o,
    pidkazka: `Третя сторона разом із ${mensha} ${o} має бути довша за ${bilsha} ${o}.`,
    rozviazok: `${bilsha} − ${mensha} = ${bilsha - mensha}; третя сторона має бути більша, тож найменша ціла — ${bilsha - mensha + 1} ${o}. Перевірка: ${mensha} + ${bilsha - mensha + 1} = ${bilsha + 1}, а це більше за ${bilsha}.`,
  };
}

const MNOHOKUTNYKY: [number, string][] = [
  [4, 'чотирикутнику'], [5, "п'ятикутнику"], [6, 'шестикутнику'], [7, 'семикутнику'], [8, 'восьмикутнику'],
  [9, "дев'ятикутнику"], [10, 'десятикутнику'],
];

function diahonali(r: Vypadok): TrenZavdannia {
  const [n, nazva] = r.vybir(MNOHOKUTNYKY);
  return {
    pytannia: `Скільки діагоналей у ${nazva}?`,
    vidpovid: (n * (n - 3)) / 2,
    pidkazka: `З кожної вершини виходить ${n} − 3 = ${n - 3} ${n - 3 === 1 ? 'діагональ' : n - 3 < 5 ? 'діагоналі' : 'діагоналей'}, і кожну діагональ так рахують двічі.`,
    rozviazok: `${n} · ${n - 3} : 2 = ${(n * (n - 3)) / 2}`,
  };
}

function trySumy(r: Vypadok): TrenZavdannia {
  const [a, b, c] = storony(r, true).map((x) => x * r.vybir([2, 3, 4, 5]));
  if ((a >= b + c) || (b >= a + c) || (c >= a + b)) return trySumy(r);
  const o = r.vybir(['мм', 'см']);
  return {
    pytannia: `Для сторін трикутника відомо: a + b = ${a + b} ${o}, b + c = ${b + c} ${o}, a + c = ${a + c} ${o}. Знайди периметр.`,
    vidpovid: a + b + c,
    odynytsi: o,
    pidkazka: 'Додай усі три суми: кожна сторона потрапить туди двічі.',
    rozviazok: `(${a + b} + ${b + c} + ${a + c}) : 2 = ${2 * (a + b + c)} : 2 = ${a + b + c} (${o})`,
  };
}

export default {
  rivni: ['чи існує трикутник, периметр', 'з підступом: «дорівнює», невідома сторона', 'ціла третя сторона, діагоналі, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(x: Vypadok) => chyIsnuie(x, false), (x: Vypadok) => chyIsnuie(x, false), perymetr])(r);
    if (riven === 2) return r.vybir([(x: Vypadok) => chyIsnuie(x, true), tretiaStorona, rivnobedrenyi, kratnaStorona])(r);
    return r.vybir([tsilaStorona, tsilaStorona, diahonali, trySumy, kratnaStorona, (x: Vypadok) => chyIsnuie(x, true)])(r);
  },
} satisfies Henerator;
